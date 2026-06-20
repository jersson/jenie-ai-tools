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
