import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import { spawnSync } from 'child_process';
import { parseJsonc } from './jsonc.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');
const PLUGIN_NAME = 'jenie';
const PLUGIN_DESCRIPTION = 'Task-driven development workflows';

function packageVersion() {
  try {
    return JSON.parse(readFileSync(resolve(PACKAGE_ROOT, 'package.json'), 'utf-8')).version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

// Creates .claude-plugin/plugin.json and marketplace.json in the package root,
// or merges the jenie entry into an existing marketplace.json. Returns the
// marketplace name to install from (existing files may use a custom one).
export function ensurePluginManifests() {
  const dir = resolve(PACKAGE_ROOT, '.claude-plugin');
  mkdirSync(dir, { recursive: true });

  const pluginPath = resolve(dir, 'plugin.json');
  if (!existsSync(pluginPath)) {
    writeFileSync(pluginPath, JSON.stringify({
      name: PLUGIN_NAME,
      description: PLUGIN_DESCRIPTION,
      version: packageVersion(),
      skills: ['./skills'],
    }, null, 2) + '\n');
    console.log(`Created ${pluginPath}`);
  }

  const marketplacePath = resolve(dir, 'marketplace.json');
  let marketplace = null;
  if (existsSync(marketplacePath)) {
    try {
      marketplace = parseJsonc(readFileSync(marketplacePath, 'utf-8'));
    } catch {
      console.warn(`Warning: ${marketplacePath} is not valid JSON — rewriting it.`);
    }
  }
  if (!marketplace || typeof marketplace !== 'object' || Array.isArray(marketplace)) {
    marketplace = {};
  }

  let changed = false;
  if (!marketplace.name) {
    marketplace.name = PLUGIN_NAME;
    changed = true;
  }
  if (!marketplace.owner) {
    marketplace.owner = { name: PLUGIN_NAME };
    changed = true;
  }
  if (!Array.isArray(marketplace.plugins)) {
    marketplace.plugins = [];
    changed = true;
  }
  if (!marketplace.plugins.some(p => p && p.name === PLUGIN_NAME)) {
    marketplace.plugins.push({
      name: PLUGIN_NAME,
      source: './',
      description: PLUGIN_DESCRIPTION,
    });
    changed = true;
  }

  if (changed) {
    writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n');
    console.log(`Updated ${marketplacePath}`);
  }

  return marketplace.name;
}

function runClaude(args, cwd) {
  const result = spawnSync('claude', args, { cwd, encoding: 'utf-8' });
  if (result.error && result.error.code === 'ENOENT') {
    return { ok: false, missing: true, output: '' };
  }
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  return { ok: result.status === 0, missing: false, output };
}

function legacySkillsParent(projectDir) {
  if (projectDir) return resolve(projectDir, '.claude', 'skills');
  return resolve(homedir(), '.claude', 'skills');
}

// Removes the pre-marketplace install layout (symlinked skills under
// .claude/skills/jenie) so skills are not registered twice.
function removeLegacyInstall(projectDir) {
  const parent = legacySkillsParent(projectDir);
  if (!existsSync(parent)) return;
  for (const entry of readdirSync(parent)) {
    if (entry === PLUGIN_NAME || entry.startsWith(`${PLUGIN_NAME}:`)) {
      const target = resolve(parent, entry);
      rmSync(target, { recursive: true });
      console.log(`Removed legacy install: ${target}`);
    }
  }
}

export function installClaude(projectDir) {
  const marketplaceName = ensurePluginManifests();
  const scopeArgs = projectDir ? ['--scope', 'project'] : [];
  const cwd = projectDir || process.cwd();

  const added = runClaude(['plugin', 'marketplace', 'add', PACKAGE_ROOT, ...scopeArgs], cwd);
  if (added.missing) {
    console.error('claude CLI not found. Install Claude Code first: https://claude.com/claude-code');
    process.exitCode = 1;
    return;
  }
  if (!added.ok && !/already/i.test(added.output)) {
    console.error(`Failed to register the jenie marketplace:\n${added.output}`);
    process.exitCode = 1;
    return;
  }
  if (!added.ok) {
    // Already registered — refresh in case the package moved or was updated.
    runClaude(['plugin', 'marketplace', 'update', marketplaceName], cwd);
  }

  const installed = runClaude(['plugin', 'install', `${PLUGIN_NAME}@${marketplaceName}`, ...scopeArgs], cwd);
  if (!installed.ok) {
    console.error(`Failed to install the jenie plugin:\n${installed.output}`);
    process.exitCode = 1;
    return;
  }
  if (installed.output) console.log(installed.output);

  removeLegacyInstall(projectDir);

  console.log('Restart Claude Code, then use commands like: /jenie:prepare-for-wishes');
}

export function uninstallClaude(projectDir) {
  const scopeArgs = projectDir ? ['--scope', 'project'] : [];
  const cwd = projectDir || process.cwd();
  let removed = false;

  const uninstalled = runClaude(['plugin', 'uninstall', PLUGIN_NAME, ...scopeArgs], cwd);
  if (uninstalled.missing) {
    console.error('claude CLI not found — skipping plugin removal.');
  } else if (uninstalled.ok) {
    if (uninstalled.output) console.log(uninstalled.output);
    removed = true;
  }

  if (!uninstalled.missing) {
    const marketplaceName = existsSync(resolve(PACKAGE_ROOT, '.claude-plugin', 'marketplace.json'))
      ? ensurePluginManifests()
      : PLUGIN_NAME;
    const marketRemoved = runClaude(['plugin', 'marketplace', 'remove', marketplaceName, ...scopeArgs], cwd);
    if (marketRemoved.ok) {
      if (marketRemoved.output) console.log(marketRemoved.output);
      removed = true;
    }
  }

  const parent = legacySkillsParent(projectDir);
  if (existsSync(parent)) {
    for (const entry of readdirSync(parent)) {
      if (entry === PLUGIN_NAME || entry.startsWith(`${PLUGIN_NAME}:`)) {
        const target = resolve(parent, entry);
        rmSync(target, { recursive: true });
        console.log(`Removed ${target}`);
        removed = true;
      }
    }
  }

  if (!removed) {
    console.log('Jenie not found.');
  }
}
