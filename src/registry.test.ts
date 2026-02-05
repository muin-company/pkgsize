import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { fetchPackageInfo } from './registry.js';

describe('fetchPackageInfo', () => {
  test('handles package not found', async () => {
    // Mock fetch to return 404
    const originalFetch = global.fetch;
    global.fetch = mock.fn(async () => ({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })) as any;

    const result = await fetchPackageInfo('nonexistent-package-12345');
    
    assert.strictEqual(result.name, 'nonexistent-package-12345');
    assert.strictEqual(result.error, 'Package not found');
    
    global.fetch = originalFetch;
  });

  test('handles network errors', async () => {
    const originalFetch = global.fetch;
    global.fetch = mock.fn(async () => {
      throw new Error('Network error');
    }) as any;

    const result = await fetchPackageInfo('some-package');
    
    assert.strictEqual(result.name, 'some-package');
    assert.ok(result.error);
    
    global.fetch = originalFetch;
  });

  test('parses valid package response', async () => {
    const originalFetch = global.fetch;
    
    // Mock registry response
    const mockRegistryData = {
      'dist-tags': { latest: '1.0.0' },
      versions: {
        '1.0.0': {
          dist: {
            unpackedSize: 10240,
            tarball: 'https://example.com/package.tgz',
          },
          dependencies: {
            'dep1': '^1.0.0',
            'dep2': '^2.0.0',
          },
        },
      },
    };

    let callCount = 0;
    global.fetch = mock.fn(async (url: string, options?: any) => {
      callCount++;
      if (callCount === 1) {
        // First call: registry data
        return {
          ok: true,
          status: 200,
          json: async () => mockRegistryData,
        };
      } else {
        // Second call: tarball HEAD request
        return {
          ok: true,
          status: 200,
          headers: {
            get: (name: string) => name === 'content-length' ? '5120' : null,
          },
        };
      }
    }) as any;

    const result = await fetchPackageInfo('test-package');
    
    assert.strictEqual(result.name, 'test-package');
    assert.strictEqual(result.version, '1.0.0');
    assert.strictEqual(result.unpackedSize, 10240);
    assert.strictEqual(result.tarballSize, 5120);
    assert.strictEqual(result.dependencyCount, 2);
    assert.strictEqual(result.error, undefined);
    
    global.fetch = originalFetch;
  });

  test('handles missing unpackedSize gracefully', async () => {
    const originalFetch = global.fetch;
    
    const mockRegistryData = {
      'dist-tags': { latest: '1.0.0' },
      versions: {
        '1.0.0': {
          dist: {
            tarball: 'https://example.com/package.tgz',
          },
        },
      },
    };

    let callCount = 0;
    global.fetch = mock.fn(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ok: true,
          json: async () => mockRegistryData,
        };
      } else {
        return {
          ok: true,
          headers: { get: () => null },
        };
      }
    }) as any;

    const result = await fetchPackageInfo('test-package');
    
    assert.strictEqual(result.unpackedSize, 0);
    assert.strictEqual(result.dependencyCount, 0);
    
    global.fetch = originalFetch;
  });
});
