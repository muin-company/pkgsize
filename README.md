# pkgsize

> Check npm package sizes before you install. Compare alternatives, stay lean. 📦

[![npm version](https://img.shields.io/npm/v/pkgsize.svg)](https://www.npmjs.com/package/pkgsize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why?

Installing dependencies without checking their size is like buying a car without checking the gas mileage. **pkgsize** helps you make informed decisions by showing you exactly how much bloat you're adding to your project.

## Features

✅ **Fast** — Uses npm registry API, no installation required  
✅ **Compare** — Check multiple packages side-by-side  
✅ **Zero dependencies** — Uses Node.js built-in `fetch`  
✅ **Color-coded** — Green for small, yellow for medium, red for large  
✅ **JSON output** — Easy to integrate with other tools  

## Installation

```bash
npm install -g pkgsize
```

Or use with `npx` (no installation):

```bash
npx pkgsize lodash
```

## Usage

### Check a single package

```bash
pkgsize lodash
```

```
Package     Version   Unpacked       Tarball        Deps
──────────────────────────────────────────────────────────
lodash      4.17.23   1.3 MB         541.1 KB       0
```

### Compare multiple packages

```bash
pkgsize lodash ramda underscore
```

```
Package     Version   Unpacked       Tarball        Deps
──────────────────────────────────────────────────────────
lodash      4.17.23   1.3 MB         541.1 KB       0
ramda       0.32.0    1.1 MB         426.3 KB       0
underscore  1.13.7    885.1 KB       351.2 KB       0

💡 Smallest: underscore (885.1 KB)
```

### JSON output

```bash
pkgsize express --json
```

```json
[
  {
    "name": "express",
    "version": "4.19.2",
    "unpackedSize": 220352,
    "tarballSize": 91234,
    "dependencyCount": 31
  }
]
```

## Size Color Coding

- 🟢 **Green**: < 100 KB (lightweight)
- 🟡 **Yellow**: 100 KB - 1 MB (moderate)
- 🔴 **Red**: > 1 MB (heavy)

## Comparison Examples

### Utility Libraries

| Package | Unpacked Size | Dependencies |
|---------|---------------|--------------|
| lodash | 1.3 MB | 0 |
| ramda | 1.1 MB | 0 |
| underscore | 885 KB | 0 |

### Date Libraries

| Package | Unpacked Size | Dependencies |
|---------|---------------|--------------|
| moment | 2.9 MB | 0 |
| dayjs | 178 KB | 0 |
| date-fns | 2.4 MB | 0 |

### HTTP Clients

| Package | Unpacked Size | Dependencies |
|---------|---------------|--------------|
| axios | 1.1 MB | 3 |
| node-fetch | 124 KB | 0 |
| got | 1.4 MB | 14 |

## API

You can also use pkgsize programmatically:

```javascript
import { fetchPackageInfo, formatSize } from 'pkgsize';

const info = await fetchPackageInfo('lodash');
console.log(`${info.name}: ${formatSize(info.unpackedSize)}`);
```

## How It Works

1. Queries npm registry API (`https://registry.npmjs.org/{package}`)
2. Fetches metadata for the latest version
3. Extracts `unpackedSize`, `tarball` info, and dependency count
4. Displays in a clean, color-coded table

## Limitations

- Shows only the **latest version** (not all versions)
- Tarball size requires an additional HEAD request (may fail for some packages)
- Dependency tree size is **not** calculated (only direct dependencies)

## Real-World Examples

### 1. Before You Install

Always check package size before adding a dependency:

```bash
# Considering adding moment.js?
pkgsize moment dayjs date-fns

# Output shows dayjs is 16x smaller!
# Package     Version   Unpacked       Tarball
# ─────────────────────────────────────────────
# moment      2.30.1    2.9 MB         941.2 KB
# dayjs       1.11.13   178.3 KB       74.1 KB
# date-fns    3.6.0     2.4 MB         671.3 KB

# Decision: Use dayjs 🎉
npm install dayjs
```

### 2. CI/CD Size Budget

Prevent bloat with automated checks:

```yaml
# .github/workflows/size-check.yml
name: Package Size Gate

on: [pull_request]

jobs:
  check-new-deps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.base_ref }}
          path: base
      
      - name: Check for new dependencies
        run: |
          # Get new packages
          new_deps=$(diff base/package.json package.json | grep "+" | grep -v "+++" | cut -d'"' -f2)
          
          for pkg in $new_deps; do
            echo "Checking $pkg..."
            size=$(npx pkgsize "$pkg" --json | jq -r '.[0].unpackedSize')
            
            if [ "$size" -gt 1000000 ]; then
              echo "❌ $pkg is too large: $(echo $size | numfmt --to=iec)B"
              echo "Consider alternatives or split the feature."
              exit 1
            fi
          done
          
          echo "✅ All new dependencies are reasonably sized"
```

### 3. Dependency Decision Script

Automate package comparison:

```bash
#!/bin/bash
# scripts/compare-alternatives.sh

echo "🔍 Comparing alternatives for: $1"
echo ""

# Read alternatives from arguments
shift
alternatives="$@"

pkgsize $alternatives

echo ""
echo "💡 Recommendation:"
smallest=$(pkgsize $alternatives --json | jq -s 'min_by(.unpackedSize) | .name' -r)
echo "Use $smallest for minimal bundle impact"
```

Usage:

```bash
# Compare HTTP clients
./scripts/compare-alternatives.sh "HTTP client" axios node-fetch got

# Compare state management
./scripts/compare-alternatives.sh "state" redux zustand jotai
```

### 4. Bundle Optimization Report

Generate size analysis before optimization:

```javascript
// scripts/analyze-dependencies.js
const { execSync } = require('child_process');
const { dependencies } = require('../package.json');

console.log('📦 Dependency Size Analysis\n');

const packages = Object.keys(dependencies);
const results = JSON.parse(
  execSync(`npx pkgsize ${packages.join(' ')} --json`).toString()
);

// Sort by size
results.sort((a, b) => b.unpackedSize - a.unpackedSize);

console.log('🔴 Largest Dependencies:');
results.slice(0, 5).forEach((pkg, i) => {
  const sizeMB = (pkg.unpackedSize / 1024 / 1024).toFixed(2);
  console.log(`${i + 1}. ${pkg.name}: ${sizeMB} MB`);
});

console.log('\n💡 Optimization Ideas:');
const large = results.filter(p => p.unpackedSize > 1000000);
if (large.length > 0) {
  console.log(`- Consider alternatives for: ${large.map(p => p.name).join(', ')}`);
  console.log('- Use code splitting for large libraries');
  console.log('- Import only what you need (tree-shaking)');
}
```

```json
{
  "scripts": {
    "analyze:size": "node scripts/analyze-dependencies.js"
  }
}
```

### 5. Pre-Install Advisory

Hook into npm install to warn about large packages:

```javascript
// scripts/preinstall-check.js
const { execSync } = require('child_process');
const args = process.argv.slice(2);

if (args.length === 0) process.exit(0);

const packages = args.filter(arg => !arg.startsWith('-'));
if (packages.length === 0) process.exit(0);

try {
  const results = JSON.parse(
    execSync(`npx pkgsize ${packages.join(' ')} --json`).toString()
  );
  
  for (const pkg of results) {
    const sizeMB = pkg.unpackedSize / 1024 / 1024;
    
    if (sizeMB > 5) {
      console.warn(`\n⚠️  WARNING: ${pkg.name} is very large (${sizeMB.toFixed(2)} MB)`);
      console.warn('Consider alternatives or lazy-load this dependency.\n');
    } else if (sizeMB > 1) {
      console.log(`ℹ️  ${pkg.name} is ${sizeMB.toFixed(2)} MB`);
    }
  }
} catch (err) {
  // Ignore errors (package might be local or private)
}
```

Add to `.npmrc`:

```
preinstall=node scripts/preinstall-check.js
```

### 6. Find Lightweight Alternatives

Compare popular alternatives in each category:

```bash
# Utils
pkgsize lodash ramda underscore lodash-es

# Date
pkgsize moment dayjs date-fns luxon

# HTTP
pkgsize axios got node-fetch ky

# State management
pkgsize redux zustand jotai recoil

# Form validation
pkgsize yup zod joi ajv

# UUID
pkgsize uuid nanoid short-uuid cuid
```

Create a cheatsheet:

```markdown
# Lightweight Alternatives Cheatsheet

| Category | Heavy | Light | Size Reduction |
|----------|-------|-------|----------------|
| Date | moment (2.9MB) | dayjs (178KB) | 94% smaller |
| Utils | lodash (1.3MB) | underscore (885KB) | 32% smaller |
| UUID | uuid (284KB) | nanoid (45KB) | 84% smaller |
| Validation | joi (1.1MB) | zod (548KB) | 50% smaller |
```

### 7. Monorepo Shared Dependency Audit

Ensure consistency across packages:

```bash
# scripts/audit-monorepo-sizes.sh
#!/bin/bash

echo "📦 Monorepo Dependency Size Audit"
echo "=================================="
echo ""

for pkg in packages/*/package.json; do
  dir=$(dirname "$pkg")
  name=$(jq -r '.name' "$pkg")
  
  echo "🔍 $name ($dir)"
  
  deps=$(jq -r '.dependencies | keys | .[]' "$pkg" 2>/dev/null)
  if [ -n "$deps" ]; then
    total=0
    while read dep; do
      size=$(npx pkgsize "$dep" --json 2>/dev/null | jq '.[0].unpackedSize' 2>/dev/null || echo 0)
      total=$((total + size))
    done <<< "$deps"
    
    total_mb=$(echo "scale=2; $total / 1024 / 1024" | bc)
    echo "   Total: ${total_mb}MB"
  fi
  echo ""
done
```

### 8. Interactive Package Explorer

Build an interactive CLI tool:

```javascript
// scripts/explore-package.js
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  console.log('🔍 Package Size Explorer\n');
  
  while (true) {
    const pkg = await ask('Package name (or "quit"): ');
    
    if (pkg.toLowerCase() === 'quit') {
      console.log('👋 Goodbye!');
      break;
    }
    
    try {
      console.log('');
      execSync(`npx pkgsize ${pkg}`, { stdio: 'inherit' });
      console.log('');
      
      const compare = await ask('Compare with alternatives? (y/n): ');
      
      if (compare.toLowerCase() === 'y') {
        const alts = await ask('Alternatives (space-separated): ');
        console.log('');
        execSync(`npx pkgsize ${pkg} ${alts}`, { stdio: 'inherit' });
        console.log('');
      }
    } catch (err) {
      console.error('❌ Package not found or error occurred\n');
    }
  }
  
  rl.close();
})();
```

### 9. Size-Based Dependency Grouping

Categorize your dependencies by size:

```javascript
// scripts/group-by-size.js
const { execSync } = require('child_process');
const { dependencies } = require('../package.json');

const packages = Object.keys(dependencies);
const results = JSON.parse(
  execSync(`npx pkgsize ${packages.join(' ')} --json`).toString()
);

const groups = {
  tiny: [],      // < 100 KB
  small: [],     // 100 KB - 500 KB
  medium: [],    // 500 KB - 1 MB
  large: [],     // 1 MB - 5 MB
  huge: []       // > 5 MB
};

for (const pkg of results) {
  const sizeKB = pkg.unpackedSize / 1024;
  
  if (sizeKB < 100) groups.tiny.push(pkg);
  else if (sizeKB < 500) groups.small.push(pkg);
  else if (sizeKB < 1024) groups.medium.push(pkg);
  else if (sizeKB < 5120) groups.large.push(pkg);
  else groups.huge.push(pkg);
}

console.log('📊 Dependencies by Size\n');
for (const [group, pkgs] of Object.entries(groups)) {
  if (pkgs.length === 0) continue;
  console.log(`${group.toUpperCase()} (${pkgs.length})`);
  pkgs.forEach(p => {
    const size = (p.unpackedSize / 1024).toFixed(1);
    console.log(`  - ${p.name}: ${size} KB`);
  });
  console.log('');
}

// Recommendations
if (groups.huge.length > 0) {
  console.log('⚠️  Consider lazy-loading or replacing:');
  groups.huge.forEach(p => console.log(`   - ${p.name}`));
}
```

### 10. Weekly Size Report

Track dependency bloat over time:

```bash
# .github/workflows/weekly-size-report.yml
name: Weekly Dependency Size Report

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate size report
        run: |
          echo "# Dependency Size Report - $(date +%Y-%m-%d)" > report.md
          echo "" >> report.md
          
          deps=$(jq -r '.dependencies | keys | .[]' package.json)
          total=0
          
          for dep in $deps; do
            size=$(npx pkgsize "$dep" --json | jq '.[0].unpackedSize')
            total=$((total + size))
            size_mb=$(echo "scale=2; $size / 1024 / 1024" | bc)
            echo "- $dep: ${size_mb}MB" >> report.md
          done
          
          total_mb=$(echo "scale=2; $total / 1024 / 1024" | bc)
          echo "" >> report.md
          echo "**Total: ${total_mb}MB**" >> report.md
      
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: size-report-$(date +%Y%m%d)
          path: report.md
      
      - name: Compare with last week
        run: |
          # Download last week's report and compare
          # Alert if size increased by >10%
          echo "📊 Size trend tracking..."
```

---

## Contributing

PRs welcome! To develop locally:

```bash
git clone https://github.com/muin-company/pkgsize.git
cd pkgsize
npm install
npm run build
npm test
```

## License

MIT © [muin-company](https://github.com/muin-company)

---

**Made with ❤️ by [muin-company](https://github.com/muin-company)**  
*Because smaller is better.*
