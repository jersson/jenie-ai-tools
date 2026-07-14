#!/usr/bin/env node

import { installOpenCode, uninstallOpenCode } from './lib/install.mjs';
import { installClaude, uninstallClaude } from './lib/install-claude.mjs';
import { printBanner, printFooter } from './lib/banner.mjs';
import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const command = args[0];
const globalFlag = args.includes('--global');

function hasCodebaseMemoryMcp() {
  const result = spawnSync('which', ['codebase-memory-mcp'], { encoding: 'utf-8' });
  return result.status === 0;
}

function printMcpHint() {
  if (!hasCodebaseMemoryMcp()) {
    console.log('\nTip: install codebase-memory-mcp for ~120x fewer tokens in technical analysis:');
    console.log('  curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash\n');
  }
}

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

printBanner();

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
  if (!process.exitCode) printMcpHint();
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

printFooter();
