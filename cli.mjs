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

function readConfig(configDir) {
  for (const name of ['opencode.jsonc', 'opencode.json']) {
    const filePath = resolve(configDir, name);
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8');
      const json = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      return { filePath, data: JSON.parse(json) };
    }
  }
  return null;
}

function installOpenCode(configDir) {
  const existing = readConfig(configDir);
  const plugin = pluginPath();

  if (existing) {
    const data = existing.data;
    if (data.plugin && data.plugin.includes(plugin)) {
      console.log(`Jenie already installed in ${existing.filePath}`);
      return;
    }
    data.plugin = data.plugin || [];
    data.plugin.push(plugin);
    writeFileSync(existing.filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Jenie plugin added to ${existing.filePath}`);
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
} else if (command === 'install' && args.includes('--help')) {
  console.log('Usage: jenie install --opencode [--project <path>]');
} else if (command === '--help' || command === 'help') {
  console.log('Usage: jenie install --opencode [--project <path>]');
} else {
  console.log('Usage: jenie install --opencode [--project <path>]');
}
