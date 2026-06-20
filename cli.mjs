#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function pluginPath() {
  return resolve(__dirname, 'plugin.mjs');
}

function findConfigDir(start) {
  let dir = resolve(start);
  while (true) {
    if (existsSync(resolve(dir, 'opencode.json')) || existsSync(resolve(dir, 'opencode.jsonc'))) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) return null;
    dir = parent;
  }
}

function stripJsonc(raw) {
  let out = '';
  let inString = false;
  let stringChar = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (ch === '\\') { out += ch + raw[++i]; continue; }
      out += ch;
      if (ch === stringChar) inString = false;
    } else {
      if (ch === '"' || ch === "'") { inString = true; stringChar = ch; out += ch; continue; }
      if (ch === '/' && raw[i + 1] === '/') { while (i < raw.length && raw[i] !== '\n') i++; continue; }
      if (ch === '/' && raw[i + 1] === '*') { i += 2; while (i < raw.length && !(raw[i] === '*' && raw[i + 1] === '/')) i++; i += 2; continue; }
      out += ch;
    }
  }
  return out;
}

function readConfig(configDir) {
  for (const name of ['opencode.jsonc', 'opencode.json']) {
    const filePath = resolve(configDir, name);
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8');
      const json = stripJsonc(raw);
      return { filePath, raw, data: JSON.parse(json) };
    }
  }
  return null;
}

function pluginAlreadyInstalled(plugin, data) {
  const entries = data.plugin || [];
  for (const entry of entries) {
    if (entry === plugin) return true;
    if (entry.includes('@jenie/ai-tools') || entry.includes('jenie-ai-tools')) return true;
  }
  return false;
}

function installOpenCode(configDir) {
  const existing = readConfig(configDir);
  const plugin = pluginPath();

  if (existing) {
    if (pluginAlreadyInstalled(plugin, existing.data)) {
      console.log(`Jenie already installed in ${existing.filePath}`);
      return;
    }

    existing.data.plugin = existing.data.plugin || [];
    existing.data.plugin.push(plugin);

    const isJsonC = existing.filePath.endsWith('.jsonc');
    const outPath = isJsonC ? existing.filePath.replace(/\.jsonc$/, '.json') : existing.filePath;

    writeFileSync(outPath, JSON.stringify(existing.data, null, 2) + '\n');

    if (isJsonC) {
      console.log(`Jenie plugin added — converted ${existing.filePath} -> ${outPath}`);
    } else {
      console.log(`Jenie plugin added to ${existing.filePath}`);
    }
  } else {
    const filePath = resolve(configDir, 'opencode.json');
    const data = { plugin: [plugin] };
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Created ${filePath} with Jenie plugin`);
  }
}

const args = process.argv.slice(2);
const command = args[0];

if (command === 'install' && args.includes('--opencode')) {
  const projectIndex = args.indexOf('--project');
  const startDir = projectIndex !== -1 ? resolve(process.cwd(), args[projectIndex + 1]) : process.cwd();
  const configDir = findConfigDir(startDir) || startDir;
  installOpenCode(configDir);
} else if (command === '--help' || command === 'help' || args.includes('--help')) {
  console.log('Usage: jenie install --opencode [--project <path>]');
} else {
  console.log('Usage: jenie install --opencode [--project <path>]');
}
