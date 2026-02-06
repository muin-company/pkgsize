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
