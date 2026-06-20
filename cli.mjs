#!/usr/bin/env node

import { resolve } from 'path';
import { installOpenCode } from './lib/install.mjs';

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log('Usage: jenie install --opencode [--project <path>]');
}

if (command === 'install' && args.includes('--opencode')) {
  const projectIndex = args.indexOf('--project');
  const startDir = projectIndex !== -1 ? resolve(process.cwd(), args[projectIndex + 1]) : process.cwd();
  installOpenCode(startDir);
} else if (command === '--help' || command === 'help' || args.includes('--help')) {
  showHelp();
} else {
  showHelp();
}
