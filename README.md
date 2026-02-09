# pkgsize

> Check npm package sizes before you install. Compare alternatives, stay lean. 📦

[![npm version](https://img.shields.io/npm/v/pkgsize.svg)](https://www.npmjs.com/package/pkgsize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why?

Installing dependencies without checking their size is like buying a car without checking the gas mileage. **pkgsize** helps you make informed decisions by showing you exactly how much bloat you're adding to your project.

## Features

✅ **Fast** — Uses npm registry API, no installation required  
✅ **Compare** — Check multiple packages side-by-side  
✅ **Mobile Impact** — See download time on 3G/4G networks  
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

## Usage & Examples

### Example 1: Quick Single Package Check

**Scenario:** You want to check how big `lodash` is before installing.

```bash
$ pkgsize lodash

🔍 Fetching package info...

Package     Version   Unpacked       Tarball        Deps
──────────────────────────────────────────────────────────
lodash      4.17.21   1.4 MB 🔴      547 KB         0

💡 Large package. Consider alternatives like lodash-es or tree-shakeable imports.
```

**Result:** 1.4 MB unpacked — pretty heavy for a utility library!

---

### Example 2: Comparing Date Libraries (Critical for Bundle Size)

**Scenario:** You need a date library. moment.js is popular, but is it bloated?

```bash
$ pkgsize moment dayjs date-fns

🔍 Fetching package info...

Package     Version   Unpacked       Tarball        Deps
──────────────────────────────────────────────────────────
moment      2.30.1    3.1 MB 🔴      1.0 MB         0
dayjs       1.11.10   178 KB 🟡      72 KB          0
date-fns    3.6.0     2.4 MB 🔴      932 KB         0

💡 Smallest: dayjs (178 KB unpacked)
   Savings vs moment: 94% smaller 🎉

Recommendation: Use dayjs for minimal bundle size
```

**Result:** dayjs is **94% smaller** than moment.js — huge win for frontend apps!

---

### Example 3: HTTP Client Showdown

**Scenario:** You need an HTTP client. axios? fetch wrapper? Which is lightest?

```bash
$ pkgsize axios got node-fetch ky

🔍 Fetching package info...

Package      Version   Unpacked       Tarball        Deps
───────────────────────────────────────────────────────────
axios        1.6.5     1.2 MB 🔴      447 KB         3
got          14.2.0    1.7 MB 🔴      521 KB         14
node-fetch   3.3.2     124 KB 🟢      48 KB          2
ky           1.2.0     87 KB 🟢       31 KB          0

💡 Smallest: ky (87 KB unpacked)
   Lightest: ky with 0 dependencies!

Recommendation: 
  - Modern projects: Use native fetch (built-in, 0 KB!)
  - Need polyfill: ky (minimal overhead)
  - Feature-rich: axios (but 14x larger than ky)
```

**Result:** ky is tiny with zero deps, or just use native `fetch()` for free!

---

### Example 4: Utility Library Alternatives

**Scenario:** Your bundle is too big. Should you replace lodash?

```bash
$ pkgsize lodash ramda underscore just-pick

🔍 Fetching package info...

Package      Version   Unpacked       Tarball        Deps
───────────────────────────────────────────────────────────
lodash       4.17.21   1.4 MB 🔴      547 KB         0
ramda        0.30.1    1.1 MB 🔴      438 KB         0
underscore   1.13.6    885 KB 🟡      351 KB         0
just-pick    2.3.0     14 KB 🟢       5.2 KB         0

💡 Smallest: just-pick (14 KB unpacked)
   Savings vs lodash: 99% smaller!

Recommendation:
  - Need one function: Install specific utility (just-pick, just-map, etc.)
  - Need many utilities: Use lodash-es with tree-shaking
  - Full lodash: 1.4 MB — only if you REALLY need everything
```

**Result:** Micro-libraries like `just-*` are 99% smaller when you only need one function!

---

### Example 5: Mobile Impact (3G/4G Download Time)

**Scenario:** You're building a mobile-first app and need to know real-world download times.

```bash
$ pkgsize react vue angular --mobile

Package     Version   Tarball        3G          4G          
─────────────────────────────────────────────────────────────
react       19.2.4    55.9 KB        447ms       44ms        
vue         3.5.27    796.8 KB       6.4s        622ms       
angular     1.8.3     680.3 KB       5.4s        531ms       

💡 Smallest: react (167.6 KB)
```

**Result:** React loads in under 50ms on 4G, while Vue takes 600ms — matters for first paint!

**Note:** Times are for tarball download only (not unpacking/parsing). 3G = 1 Mbps, 4G = 10 Mbps.

---

### Example 6: JSON Output for CI Integration

**Scenario:** You want to fail CI if dependencies exceed size limits.

```bash
$ pkgsize express --json

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

**CI Script Example:**

```bash
#!/bin/bash
# Fail if any package > 1 MB

size=$(pkgsize lodash --json | jq '.[0].unpackedSize')

if [ $size -gt 1048576 ]; then
  echo "❌ Package exceeds 1 MB limit: $(($size / 1024)) KB"
  exit 1
fi

echo "✅ Package size OK: $(($size / 1024)) KB"
```

**Result:** Automated size checks prevent bloat from sneaking into your project.

---

### Example 6: Finding Lightweight Icon Library

**Scenario:** You need icons. react-icons? heroicons? Which is smallest?

```bash
$ pkgsize react-icons heroicons lucide-react

🔍 Fetching package info...

Package        Version   Unpacked       Tarball        Deps
─────────────────────────────────────────────────────────────
react-icons    5.3.0     38.7 MB 🔴     5.1 MB         0
heroicons      2.1.5     2.1 MB 🔴      342 KB         0
lucide-react   0.454.0   5.8 MB 🔴      892 KB         0

⚠️  WARNING: react-icons is HUGE (38.7 MB unpacked)

💡 Alternative approach:
   - Use tree-shakeable icon libraries
   - Import only icons you need: import { HomeIcon } from 'heroicons/react/24/outline'
   - Or use SVG sprite sheets (0 KB runtime!)

Recommendation: heroicons with tree-shaking (imports only used icons)
```

**Result:** react-icons bundles EVERYTHING. Use selective imports instead!

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

---

## 🔧 Advanced Configuration

### Config File Support

Create a `.pkgsizerc` or `.pkgsizerc.json` in your project root:

```json
{
  "thresholds": {
    "small": 102400,
    "medium": 1048576,
    "large": 5242880
  },
  "defaultRegistry": "https://registry.npmjs.org",
  "timeout": 5000,
  "cache": true,
  "cacheDir": ".pkgsize-cache",
  "maxConcurrent": 5,
  "showDependencies": true,
  "showDownloadTime": true,
  "network": "4G",
  "colorize": true
}
```

Or add to `package.json`:

```json
{
  "name": "my-app",
  "pkgsize": {
    "thresholds": {
      "small": 50000,
      "large": 500000
    },
    "showDownloadTime": true
  }
}
```

**Config Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `thresholds.small` | `number` | `102400` (100KB) | Max size for green/small |
| `thresholds.medium` | `number` | `1048576` (1MB) | Max size for yellow/medium |
| `thresholds.large` | `number` | `5242880` (5MB) | Max size for red/large |
| `defaultRegistry` | `string` | npm registry | Custom registry URL |
| `timeout` | `number` | `5000` | Request timeout (ms) |
| `cache` | `boolean` | `true` | Enable response caching |
| `cacheDir` | `string` | `.pkgsize-cache` | Cache directory |
| `maxConcurrent` | `number` | `5` | Max parallel requests |
| `showDependencies` | `boolean` | `true` | Show dependency count |
| `showDownloadTime` | `boolean` | `false` | Show 3G/4G download estimates |
| `network` | `string` | `4G` | Network speed for estimates (`3G`, `4G`, `5G`) |
| `colorize` | `boolean` | `true` | Use colored output |

### Environment Variables

Override config with environment variables:

```bash
PKGSIZE_REGISTRY=https://registry.npmjs.org pkgsize lodash
PKGSIZE_TIMEOUT=10000 pkgsize react
PKGSIZE_CACHE=false pkgsize vue
PKGSIZE_NETWORK=3G pkgsize --mobile angular
```

### Per-Command Options

```bash
# Custom thresholds for this check
pkgsize lodash --threshold-small 50000 --threshold-large 500000

# Disable cache for fresh data
pkgsize react --no-cache

# Show all versions (not just latest)
pkgsize express --all-versions

# Check specific version
pkgsize lodash@4.17.20

# Use custom registry
pkgsize my-pkg --registry https://npm.pkg.github.com

# Output format
pkgsize vue --format json
pkgsize vue --format table
pkgsize vue --format compact
```

---

## 📊 Detailed CLI Options

```bash
pkgsize [packages...] [options]
```

### Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--json` | `-j` | Output as JSON |
| `--mobile` | `-m` | Show 3G/4G download times |
| `--no-cache` | | Disable caching |
| `--cache-dir <dir>` | | Custom cache directory |
| `--registry <url>` | `-r` | Custom npm registry |
| `--timeout <ms>` | `-t` | Request timeout |
| `--all-versions` | `-a` | Show all versions |
| `--version <ver>` | `-v` | Check specific version |
| `--threshold-small <bytes>` | | Custom small threshold |
| `--threshold-large <bytes>` | | Custom large threshold |
| `--format <type>` | `-f` | Output format (`table`, `json`, `compact`) |
| `--no-color` | | Disable colored output |
| `--show-deps` | | Show dependency tree size |
| `--sort-by <field>` | | Sort by `size`, `name`, `deps` |
| `--help` | `-h` | Show help message |
| `--version` | | Show version number |

### Examples

```bash
# Basic usage
pkgsize lodash

# Compare multiple packages
pkgsize lodash ramda underscore

# Show mobile impact
pkgsize react vue angular --mobile

# JSON output for scripting
pkgsize express --json > express-size.json

# Check specific version
pkgsize lodash@4.17.20

# All versions of a package
pkgsize typescript --all-versions

# Custom registry (private packages)
pkgsize @mycompany/toolkit --registry https://npm.pkg.github.com

# Sort by size
pkgsize react vue angular --sort-by size

# Compact output
pkgsize axios got node-fetch --format compact

# No caching (always fresh)
pkgsize next --no-cache

# Custom thresholds (stricter)
pkgsize lodash --threshold-small 10000 --threshold-large 100000
```

---

## 🚀 Performance & Optimization

### Caching

pkgsize caches npm registry responses to speed up repeated queries:

```bash
# Default cache location: .pkgsize-cache/
pkgsize lodash  # First run: fetches from registry
pkgsize lodash  # Second run: instant (from cache)

# Custom cache directory
pkgsize react --cache-dir ~/.cache/pkgsize

# Clear cache
rm -rf .pkgsize-cache

# Disable cache for fresh data
pkgsize vue --no-cache
```

**Cache Expiry:**
- Default: 24 hours
- Configure in `.pkgsizerc`:

```json
{
  "cache": true,
  "cacheTTL": 86400000
}
```

### Parallel Requests

Check multiple packages efficiently:

```bash
# Sequential (slow)
pkgsize react
pkgsize vue
pkgsize angular

# Parallel (fast)
pkgsize react vue angular

# Control concurrency
pkgsize $(cat packages.txt) --max-concurrent 10
```

### Batch Processing

Check all your dependencies:

```bash
# From package.json
jq -r '.dependencies | keys[]' package.json | xargs pkgsize

# Production dependencies only
jq -r '.dependencies | keys[]' package.json | xargs pkgsize --json > deps-size.json

# Dev dependencies
jq -r '.devDependencies | keys[]' package.json | xargs pkgsize
```

### CI/CD Optimization

Speed up CI checks:

```bash
# Use cache in CI
- uses: actions/cache@v4
  with:
    path: .pkgsize-cache
    key: pkgsize-${{ hashFiles('package.json') }}

- run: pkgsize $(jq -r '.dependencies | keys | join(" ")' package.json)
```

---

## 🆚 Comparison with Alternatives

| Feature | pkgsize | package-size | bundlephobia CLI | cost-of-modules |
|---------|---------|--------------|------------------|-----------------|
| **No installation needed** | ✅ npx | ❌ | ❌ | ❌ |
| **Compare multiple packages** | ✅ | ❌ | ❌ | ⚠️ Limited |
| **Mobile impact** | ✅ 3G/4G times | ❌ | ✅ | ❌ |
| **JSON output** | ✅ | ✅ | ✅ | ❌ |
| **Caching** | ✅ | ❌ | ❌ | ❌ |
| **Custom registry** | ✅ | ❌ | ❌ | ❌ |
| **Speed** | 🟢 Fast | 🟡 Moderate | 🔴 Slow | 🟡 Moderate |
| **Color-coded** | ✅ | ⚠️ Basic | ✅ | ❌ |
| **CI-friendly** | ✅ | ✅ | ⚠️ | ❌ |
| **Dependencies** | 0 | 5+ | 10+ | 20+ |

### Why Choose pkgsize?

**vs. Bundlephobia CLI:**
- Faster (no webpack analysis)
- Works offline with cache
- Simpler, focused on package size

**vs. package-size:**
- Compare multiple packages in one command
- Mobile download time estimates
- Better formatting and colors

**vs. cost-of-modules:**
- No installation needed (npx)
- Works for packages not in node_modules
- JSON output for automation

---

## ❓ Troubleshooting

### Q1: "Package not found" error

**Problem:** Package doesn't exist or is private.

**Solution:**

```bash
# Check spelling
pkgsize loadsh  # ❌ Typo
pkgsize lodash  # ✅ Correct

# Private packages: use custom registry
pkgsize @mycompany/pkg --registry https://npm.pkg.github.com

# Authenticate for private registries
npm login --registry=https://npm.pkg.github.com
pkgsize @mycompany/pkg --registry https://npm.pkg.github.com
```

---

### Q2: Slow response or timeout

**Problem:** Network issues or registry is slow.

**Solution:**

```bash
# Increase timeout
pkgsize lodash --timeout 10000

# Use cache
pkgsize lodash  # Uses cache after first fetch

# Check registry status
curl -I https://registry.npmjs.org/lodash

# Use mirror/proxy
pkgsize lodash --registry https://registry.npm.taobao.org
```

---

### Q3: Sizes don't match npm info

**Problem:** Different size metrics.

**Explanation:**

pkgsize shows:
- **Unpacked size**: Actual disk usage after install
- **Tarball size**: Download size (compressed)

npm info shows different fields:
- `dist.unpackedSize` → matches pkgsize "Unpacked"
- `dist.tarball` size → matches pkgsize "Tarball"

```bash
# Verify manually
npm info lodash dist.unpackedSize  # Should match pkgsize
```

---

### Q4: Want to check installed version, not latest

**Problem:** Your project uses an older version.

**Solution:**

```bash
# Check specific version
pkgsize lodash@4.17.20

# Check version from package.json
VERSION=$(jq -r '.dependencies.lodash' package.json)
pkgsize lodash@$VERSION

# Or create a script
# package.json
{
  "scripts": {
    "check:installed": "node scripts/check-installed-sizes.js"
  }
}
```

```javascript
// scripts/check-installed-sizes.js
const { dependencies } = require('../package.json');
const { execSync } = require('child_process');

const packages = Object.entries(dependencies).map(([name, version]) => {
  const cleanVersion = version.replace(/^[\^~]/, '');
  return `${name}@${cleanVersion}`;
});

execSync(`npx pkgsize ${packages.join(' ')}`, { stdio: 'inherit' });
```

---

### Q5: JSON output is hard to parse

**Problem:** Want specific fields only.

**Solution:**

Use `jq` to extract data:

```bash
# Get just the unpacked size
pkgsize lodash --json | jq '.[0].unpackedSize'

# Get name and size
pkgsize react vue --json | jq -r '.[] | "\(.name): \(.unpackedSize)"'

# Sort by size
pkgsize axios got node-fetch --json | jq 'sort_by(.unpackedSize)'

# Filter packages over 1MB
pkgsize react vue angular --json | jq '.[] | select(.unpackedSize > 1048576)'
```

---

### Q6: Color codes break in CI logs

**Problem:** ANSI colors cause issues in CI.

**Solution:**

```bash
# Disable colors
pkgsize lodash --no-color

# Or set environment variable
NO_COLOR=1 pkgsize lodash

# Use JSON output
pkgsize lodash --json

# Plain text output
pkgsize lodash --format compact --no-color
```

---

### Q7: Want to fail CI if package is too large

**Problem:** Need to enforce size budgets.

**Solution:**

```bash
#!/bin/bash
# scripts/check-size-budget.sh

MAX_SIZE=1048576  # 1 MB

size=$(npx pkgsize "$1" --json | jq '.[0].unpackedSize')

if [ "$size" -gt "$MAX_SIZE" ]; then
  echo "❌ $1 exceeds size budget: $(($size / 1024)) KB > $(($MAX_SIZE / 1024)) KB"
  exit 1
fi

echo "✅ $1 is within budget: $(($size / 1024)) KB"
```

Use in CI:

```yaml
- name: Check package size budget
  run: |
    ./scripts/check-size-budget.sh lodash
    ./scripts/check-size-budget.sh react
```

---

### Q8: Dependency count is 0 but package has dependencies

**Problem:** Package has peer dependencies or optional dependencies.

**Explanation:**

pkgsize counts `dependencies` only, not:
- `peerDependencies`
- `optionalDependencies`
- `devDependencies`

**Workaround:**

Check package.json manually:

```bash
npm info lodash peerDependencies
npm info lodash optionalDependencies
```

---

### Q9: Want to see breakdown of what's inside

**Problem:** Need more detailed analysis.

**Solution:**

pkgsize shows size only. For detailed analysis, use:

```bash
# Install and analyze
npm install lodash
du -sh node_modules/lodash/*

# Or use bundlephobia for bundle analysis
npx bundle-phobia lodash

# Or use package-build-stats
npx package-build-stats lodash
```

pkgsize is optimized for quick comparisons, not deep analysis.

---

### Q10: Cache is outdated

**Problem:** Package was updated but cache shows old data.

**Solution:**

```bash
# Clear cache
rm -rf .pkgsize-cache

# Or force fresh fetch
pkgsize lodash --no-cache

# Or update cache directory
pkgsize lodash --cache-dir /tmp/pkgsize-cache
```

Auto-clear cache older than 24h:

```bash
# Add to crontab
0 0 * * * find ~/.pkgsize-cache -mtime +1 -delete
```

---

## 🏆 Best Practices

### 1. **Check Before Installing**

Always verify size impact before adding dependencies:

```bash
# Before: npm install lodash
pkgsize lodash  # Check size first

# Compare alternatives
pkgsize lodash ramda underscore

# Then install the smallest
npm install underscore
```

### 2. **Enforce Size Budgets in CI**

Prevent bloat accumulation:

```yaml
# .github/workflows/size-budget.yml
name: Size Budget

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check new dependencies
        run: |
          # Get dependencies from PR
          new_deps=$(git diff origin/main package.json | grep '"+' | cut -d'"' -f2)
          
          for dep in $new_deps; do
            size=$(npx pkgsize "$dep" --json | jq '.[0].unpackedSize')
            if [ "$size" -gt 1048576 ]; then
              echo "❌ $dep is too large ($(($size / 1024))KB)"
              exit 1
            fi
          done
```

### 3. **Document Size Decisions**

Keep a log of why you chose packages:

```markdown
# DEPENDENCIES.md

## Why we chose these packages

### dayjs over moment
- Size: 178 KB vs 2.9 MB (94% smaller)
- Checked: 2024-02-10
- Command: `pkgsize moment dayjs`

### ky over axios
- Size: 87 KB vs 1.2 MB (93% smaller)
- Zero dependencies vs 3
- Checked: 2024-02-10
```

### 4. **Regular Dependency Audits**

Schedule size audits:

```bash
# Quarterly audit script
#!/bin/bash
echo "📦 Dependency Size Audit - $(date +%Y-%m-%d)" > audit.txt
echo "" >> audit.txt

deps=$(jq -r '.dependencies | keys[]' package.json)
pkgsize $deps >> audit.txt

# Flag large packages
echo "" >> audit.txt
echo "⚠️  Large Dependencies (>1MB):" >> audit.txt
pkgsize $deps --json | jq -r '.[] | select(.unpackedSize > 1048576) | "- \(.name): \(.unpackedSize / 1024 / 1024 | round)MB"' >> audit.txt
```

### 5. **Mobile-First Projects**

Always check mobile impact:

```bash
# Check with 3G/4G times
pkgsize react react-dom --mobile

# Set strict thresholds for mobile
pkgsize lodash --threshold-large 500000
```

In config:

```json
{
  "thresholds": {
    "small": 50000,
    "medium": 200000,
    "large": 500000
  },
  "showDownloadTime": true,
  "network": "3G"
}
```

### 6. **Tree-Shakeable Alternatives**

When possible, choose tree-shakeable packages:

```bash
# ❌ Full lodash
npm install lodash

# ✅ Modular lodash
npm install lodash-es

# ✅ Individual functions
npm install lodash.debounce lodash.throttle

# Check size difference
pkgsize lodash lodash-es lodash.debounce
```

### 7. **Automate Comparisons**

Create comparison shortcuts:

```json
{
  "scripts": {
    "compare:date": "pkgsize moment dayjs date-fns luxon",
    "compare:http": "pkgsize axios got node-fetch ky",
    "compare:state": "pkgsize redux zustand jotai recoil",
    "compare:utils": "pkgsize lodash ramda underscore",
    "compare:uuid": "pkgsize uuid nanoid short-uuid cuid"
  }
}
```

Run with:

```bash
npm run compare:date
npm run compare:http
```

### 8. **Monitor Size Growth**

Track dependency size over time:

```bash
# scripts/track-size.sh
#!/bin/bash

DATE=$(date +%Y-%m-%d)
deps=$(jq -r '.dependencies | keys[]' package.json)

pkgsize $deps --json > "size-reports/$DATE.json"

# Compare with last week
if [ -f "size-reports/$(date -d '7 days ago' +%Y-%m-%d).json" ]; then
  echo "📊 Size changes in last 7 days:"
  # ... diff logic
fi
```

### 9. **Bundle Size Correlation**

Remember: npm package size ≠ bundle size

```bash
# npm package size
pkgsize react  # 167 KB

# vs. bundled size (minified + gzipped)
# Actual bundle impact might be smaller due to:
# - Tree shaking
# - Minification
# - Gzip compression

# For bundle size, use:
npx bundle-phobia react
```

Use pkgsize for quick comparisons, Bundlephobia for production bundles.

### 10. **Create Size Budgets**

Define and track budgets:

```json
{
  "budgets": {
    "totalDependencies": 10485760,
    "singlePackage": 1048576,
    "criticalPackages": {
      "react": 200000,
      "react-dom": 500000
    }
  }
}
```

Enforce with:

```bash
# scripts/enforce-budgets.js
const budgets = require('../package.json').budgets;
// ... check logic
```

---

## 📚 Programmatic API

Use pkgsize as a library:

### Basic Usage

```javascript
import { getPackageSize, formatSize } from 'pkgsize';

const info = await getPackageSize('lodash');

console.log(info);
// {
//   name: 'lodash',
//   version: '4.17.21',
//   unpackedSize: 1409704,
//   tarballSize: 547480,
//   dependencyCount: 0
// }

console.log(formatSize(info.unpackedSize));
// "1.3 MB"
```

### Compare Packages

```javascript
import { comparePackages } from 'pkgsize';

const comparison = await comparePackages(['moment', 'dayjs', 'date-fns']);

console.log(comparison.smallest);
// { name: 'dayjs', unpackedSize: 178304 }

console.log(comparison.largest);
// { name: 'moment', unpackedSize: 2909696 }

console.log(comparison.recommendation);
// "Use dayjs (94% smaller than moment)"
```

### Custom Thresholds

```javascript
import { categorizeSize } from 'pkgsize';

const category = categorizeSize(500000, {
  small: 100000,
  medium: 1000000
});

console.log(category);
// "medium"
```

### Batch Processing

```javascript
import { getPackageSize } from 'pkgsize';

const packages = ['react', 'vue', 'angular'];
const results = await Promise.all(
  packages.map(pkg => getPackageSize(pkg))
);

const sorted = results.sort((a, b) => a.unpackedSize - b.unpackedSize);
console.log(`Smallest: ${sorted[0].name}`);
```

### With Caching

```javascript
import { getPackageSize, clearCache } from 'pkgsize';

// First call: fetches from registry
const info1 = await getPackageSize('lodash', { cache: true });

// Second call: instant (from cache)
const info2 = await getPackageSize('lodash', { cache: true });

// Clear cache
await clearCache();
```

---

## 🔗 Related Tools

- **[bundlephobia](https://bundlephobia.com/)** — Bundle size analysis (minified + gzipped)
- **[package-build-stats](https://github.com/pastelsky/package-build-stats)** — Detailed build statistics
- **[cost-of-modules](https://github.com/siddharthkp/cost-of-modules)** — Size of installed modules
- **[licensecheck](https://github.com/muin-company/licensecheck)** — Check dependency licenses
- **[depcheck](https://github.com/depcheck/depcheck)** — Find unused dependencies

---

## 📖 Real-World Case Studies

### Case Study 1: Frontend Bundle Optimization

**Problem:** React app bundle was 2.5 MB (too large for mobile).

**Solution:**

```bash
# Step 1: Identify large dependencies
pkgsize $(jq -r '.dependencies | keys[]' package.json) --json | \
  jq 'sort_by(.unpackedSize) | reverse | .[0:10]'

# Found: moment (2.9 MB), lodash (1.3 MB)

# Step 2: Compare alternatives
pkgsize moment dayjs
# dayjs is 94% smaller!

pkgsize lodash lodash-es
# lodash-es is tree-shakeable

# Step 3: Replace
npm uninstall moment lodash
npm install dayjs lodash-es

# Result: Bundle reduced to 1.1 MB (56% smaller)
```

### Case Study 2: Mobile App Performance

**Problem:** App took 8+ seconds to load on 3G.

**Solution:**

```bash
# Check mobile impact
pkgsize react-dom axios lodash --mobile

# Found:
# - react-dom: 2.1s on 3G
# - axios: 450ms on 3G
# - lodash: 640ms on 3G

# Replace with lighter alternatives
pkgsize ky underscore --mobile
# - ky: 30ms on 3G (15x faster!)
# - underscore: 350ms on 3G

# Result: Load time reduced to 3.5 seconds
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

### Development Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Test
npm test

# Test coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Adding New Features

1. Add tests in `src/__tests__/`
2. Implement in `src/`
3. Update README with examples
4. Run `npm run build && npm test`
5. Submit PR

## License

MIT © [muin-company](https://github.com/muin-company)

---

**Made with ❤️ by [muin-company](https://github.com/muin-company)**  
*Because smaller is better.*
