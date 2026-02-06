import type { PackageInfo } from './types.js';
import { formatSize, getSizeColor, RESET, BOLD, DIM } from './utils.js';

/**
 * Calculate download time in seconds
 */
function calculateDownloadTime(sizeBytes: number, speedBytesPerSec: number): string {
  const seconds = sizeBytes / speedBytesPerSec;
  
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  } else if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
}

/**
 * Print packages in table format
 */
export function printTable(packages: PackageInfo[], options?: { mobile?: boolean }): void {
  if (packages.length === 0) return;

  const showMobile = options?.mobile ?? false;

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
  const downloadWidth = 12;

  // Network speeds (bytes per second)
  const SPEED_3G = 125 * 1024; // 1 Mbps = 125 KB/s
  const SPEED_4G = 1.25 * 1024 * 1024; // 10 Mbps = 1.25 MB/s

  // Header
  console.log();
  if (showMobile) {
    console.log(
      `${BOLD}${'Package'.padEnd(nameWidth)}` +
      `${'Version'.padEnd(versionWidth)}` +
      `${'Tarball'.padEnd(sizeWidth)}` +
      `${'3G'.padEnd(downloadWidth)}` +
      `${'4G'.padEnd(downloadWidth)}${RESET}`
    );
    console.log('─'.repeat(nameWidth + versionWidth + sizeWidth + downloadWidth * 2));
  } else {
    console.log(
      `${BOLD}${'Package'.padEnd(nameWidth)}` +
      `${'Version'.padEnd(versionWidth)}` +
      `${'Unpacked'.padEnd(sizeWidth)}` +
      `${'Tarball'.padEnd(sizeWidth)}` +
      `${'Deps'}${RESET}`
    );
    console.log('─'.repeat(nameWidth + versionWidth + sizeWidth * 2 + 6));
  }

  // Rows
  validPackages.forEach(pkg => {
    const unpackedColor = getSizeColor(pkg.unpackedSize);
    const tarballColor = getSizeColor(pkg.tarballSize);

    if (showMobile) {
      const time3G = calculateDownloadTime(pkg.tarballSize, SPEED_3G);
      const time4G = calculateDownloadTime(pkg.tarballSize, SPEED_4G);

      console.log(
        `${pkg.name.padEnd(nameWidth)}` +
        `${DIM}${pkg.version.padEnd(versionWidth)}${RESET}` +
        `${tarballColor}${formatSize(pkg.tarballSize).padEnd(sizeWidth)}${RESET}` +
        `${DIM}${time3G.padEnd(downloadWidth)}${RESET}` +
        `${time4G.padEnd(downloadWidth)}`
      );
    } else {
      console.log(
        `${pkg.name.padEnd(nameWidth)}` +
        `${DIM}${pkg.version.padEnd(versionWidth)}${RESET}` +
        `${unpackedColor}${formatSize(pkg.unpackedSize).padEnd(sizeWidth)}${RESET}` +
        `${tarballColor}${formatSize(pkg.tarballSize).padEnd(sizeWidth)}${RESET}` +
        `${pkg.dependencyCount}`
      );
    }
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
