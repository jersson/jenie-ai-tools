#!/usr/bin/env node

import { installOpenCode, uninstallOpenCode } from './lib/install.mjs';
import { installClaude, uninstallClaude } from './lib/install-claude.mjs';

const args = process.argv.slice(2);
const command = args[0];
const globalFlag = args.includes('--global');

function showHelp() {
  console.log('Usage:');
  console.log('  jenie install --opencode                 # repository level (current directory)');
  console.log('  jenie install --claude-code [--global]   # repository level; --global installs for all projects');
  console.log('  jenie uninstall --opencode');
  console.log('  jenie uninstall --claude-code [--global]');
}

function rejectOpenCodeGlobal() {
  console.error('--global is not supported with --opencode: OpenCode installs at repository level.');
  process.exitCode = 1;
}

if (command === 'install') {
  if (args.includes('--opencode')) {
    if (globalFlag) {
      rejectOpenCodeGlobal();
    } else {
      installOpenCode(process.cwd());
    }
  } else if (args.includes('--claude-code')) {
    installClaude(globalFlag ? null : process.cwd());
  } else {
    showHelp();
  }
} else if (command === 'uninstall') {
  if (args.includes('--opencode')) {
    if (globalFlag) {
      rejectOpenCodeGlobal();
    } else {
      uninstallOpenCode(process.cwd());
    }
  } else if (args.includes('--claude-code')) {
    uninstallClaude(globalFlag ? null : process.cwd());
  } else {
    showHelp();
  }
} else {
  showHelp();
}
