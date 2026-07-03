import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { findConfigDir, readConfig, writeConfig } from './config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function pluginPath() {
  return resolve(__dirname, '..', 'plugin.mjs');
}

function alreadyInstalled(plugin, data) {
  const entries = data.plugin || [];
  for (const entry of entries) {
    if (entry === plugin) return true;
    if (entry.includes('@jenie/ai-tools') || entry.includes('jenie-ai-tools')) return true;
  }
  return false;
}

export function installOpenCode(projectDir) {
  const configDir = findConfigDir(projectDir) || projectDir;
  const plugin = pluginPath();
  const existing = readConfig(configDir);

  if (existing) {
    if (alreadyInstalled(plugin, existing.data)) {
      console.log(`Jenie already installed in ${existing.filePath}`);
      return;
    }

    existing.data.plugin = existing.data.plugin || [];
    existing.data.plugin.push(plugin);

    const result = writeConfig(configDir, existing.data);
    if (result.converted) {
      console.log(`Jenie plugin added — converted ${existing.filePath} -> ${result.filePath}`);
    } else {
      console.log(`Jenie plugin added to ${result.filePath}`);
    }
  } else {
    writeConfig(configDir, { plugin: [plugin] });
    console.log(`Created ${resolve(configDir, 'opencode.json')} with Jenie plugin`);
  }
}

export function uninstallOpenCode(projectDir) {
  const configDir = findConfigDir(projectDir) || projectDir;
  const plugin = pluginPath();
  const existing = readConfig(configDir);

  if (!existing) {
    console.log('No opencode config found.');
    return;
  }

  const entries = existing.data.plugin || [];
  const idx = entries.indexOf(plugin);
  if (idx === -1) {
    console.log('Jenie plugin not found in config.');
    return;
  }

  entries.splice(idx, 1);
  existing.data.plugin = entries.length ? entries : undefined;

  writeConfig(configDir, existing.data);
  console.log(`Jenie plugin removed from ${existing.filePath}`);
}
