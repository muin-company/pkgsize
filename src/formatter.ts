import type { PackageInfo } from './types.js';
import { formatSize, getSizeColor, RESET, BOLD, DIM } from './utils.js';

/**
 * Print packages in table format
 */
export function printTable(packages: PackageInfo[]): void {
  if (packages.length === 0) return;

  // Filter out errored packages for display
  const validPackages = packages.filter(p => !p.error);
  const errorPackages = packages.filter(p => p.error);

  if (validPackages.length === 0) {
    errorPackages.forEach(pkg => {
      console.error(`❌ ${BOLD}${pkg.name}${RESET}: ${pkg.error}`);
    });
    return;
  }

  // Calculate column widths
  const nameWidth = Math.max(12, ...validPackages.map(p => p.name.length + 2));
  const versionWidth = 10;
  const sizeWidth = 15;

  // Header
  console.log();
  console.log(
    `${BOLD}${'Package'.padEnd(nameWidth)}` +
    `${'Version'.padEnd(versionWidth)}` +
    `${'Unpacked'.padEnd(sizeWidth)}` +
    `${'Tarball'.padEnd(sizeWidth)}` +
    `${'Deps'}${RESET}`
  );
  console.log('─'.repeat(nameWidth + versionWidth + sizeWidth * 2 + 6));

  // Rows
  validPackages.forEach(pkg => {
    const unpackedColor = getSizeColor(pkg.unpackedSize);
    const tarballColor = getSizeColor(pkg.tarballSize);

    console.log(
      `${pkg.name.padEnd(nameWidth)}` +
      `${DIM}${pkg.version.padEnd(versionWidth)}${RESET}` +
      `${unpackedColor}${formatSize(pkg.unpackedSize).padEnd(sizeWidth)}${RESET}` +
      `${tarballColor}${formatSize(pkg.tarballSize).padEnd(sizeWidth)}${RESET}` +
      `${pkg.dependencyCount}`
    );
  });

  console.log();

  // Show errors at the end
  if (errorPackages.length > 0) {
    console.log();
    errorPackages.forEach(pkg => {
      console.error(`❌ ${BOLD}${pkg.name}${RESET}: ${pkg.error}`);
    });
  }

  // Show summary if comparing multiple packages
  if (validPackages.length > 1) {
    const smallest = validPackages.reduce((min, p) => 
      p.unpackedSize < min.unpackedSize ? p : min
    );
    console.log(`${BOLD}💡 Smallest:${RESET} ${smallest.name} (${formatSize(smallest.unpackedSize)})`);
  }
}

/**
 * Print packages in JSON format
 */
export function printJson(packages: PackageInfo[]): void {
  console.log(JSON.stringify(packages, null, 2));
}
