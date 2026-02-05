#!/usr/bin/env node

import { fetchPackages } from './registry.js';
import { printTable, printJson } from './formatter.js';

const args = process.argv.slice(2);

// Parse flags
const jsonOutput = args.includes('--json');
const packages = args.filter(arg => !arg.startsWith('--'));

// Show help
if (packages.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
pkgsize - Check npm package sizes before you install

Usage:
  pkgsize <package> [<package2> ...]    Check one or more packages
  pkgsize <package> --json              Output as JSON

Examples:
  pkgsize lodash                        Check lodash size
  pkgsize lodash ramda underscore       Compare alternatives
  pkgsize express --json                Get JSON output

Options:
  --json    Output as JSON
  --help    Show this help message
`);
  process.exit(0);
}

// Fetch and display
(async () => {
  try {
    const results = await fetchPackages(packages);
    
    if (jsonOutput) {
      printJson(results);
    } else {
      printTable(results);
    }

    // Exit with error if any package failed
    const hasErrors = results.some(r => r.error);
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
})();
