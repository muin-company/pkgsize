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
