import type { PackageInfo, RegistryResponse } from './types.js';

const REGISTRY_URL = 'https://registry.npmjs.org';

/**
 * Fetch package info from npm registry
 */
export async function fetchPackageInfo(packageName: string): Promise<PackageInfo> {
  try {
    const response = await fetch(`${REGISTRY_URL}/${packageName}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          name: packageName,
          version: '',
          unpackedSize: 0,
          tarballSize: 0,
          dependencyCount: 0,
          error: 'Package not found',
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as RegistryResponse;
    const latestVersion = data['dist-tags'].latest;
    const versionData = data.versions[latestVersion];

    if (!versionData) {
      throw new Error('No version data available');
    }

    // Get tarball size by fetching HEAD request
    let tarballSize = 0;
    try {
      const tarballResponse = await fetch(versionData.dist.tarball, { method: 'HEAD' });
      const contentLength = tarballResponse.headers.get('content-length');
      if (contentLength) {
        tarballSize = parseInt(contentLength, 10);
      } else {
        // Content-length not available, estimate from unpacked size (typical compression ratio ~3:1)
        tarballSize = Math.round((versionData.dist.unpackedSize || 0) / 3);
      }
    } catch (err) {
      // Tarball size fetch failed, estimate from unpacked size
      tarballSize = Math.round((versionData.dist.unpackedSize || 0) / 3);
    }

    return {
      name: packageName,
      version: latestVersion,
      unpackedSize: versionData.dist.unpackedSize || 0,
      tarballSize,
      dependencyCount: Object.keys(versionData.dependencies || {}).length,
    };
  } catch (error) {
    return {
      name: packageName,
      version: '',
      unpackedSize: 0,
      tarballSize: 0,
      dependencyCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch multiple packages in parallel
 */
export async function fetchPackages(packageNames: string[]): Promise<PackageInfo[]> {
  return Promise.all(packageNames.map(fetchPackageInfo));
}
