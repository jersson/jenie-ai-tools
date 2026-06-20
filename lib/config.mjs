import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseJsonc } from './jsonc.mjs';

const CONFIG_NAMES = ['opencode.json', 'opencode.jsonc'];

export function findConfigDir(start) {
  let dir = resolve(start);
  while (true) {
    if (CONFIG_NAMES.some(name => existsSync(resolve(dir, name)))) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) return null;
    dir = parent;
  }
}

export function readConfig(configDir) {
  for (const name of CONFIG_NAMES) {
    const filePath = resolve(configDir, name);
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8');
      return { filePath, raw, data: parseJsonc(raw) };
    }
  }
  return null;
}

export function writeConfig(configDir, data) {
  const existing = readConfig(configDir);
  if (existing && existing.filePath.endsWith('.jsonc')) {
    const outPath = resolve(configDir, 'opencode.json');
    writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n');
    return { filePath: outPath, converted: true };
  }
  const filePath = existing ? existing.filePath : resolve(configDir, 'opencode.json');
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  return { filePath, converted: false };
}
