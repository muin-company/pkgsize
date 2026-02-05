export interface PackageInfo {
  name: string;
  version: string;
  unpackedSize: number;
  tarballSize: number;
  dependencyCount: number;
  error?: string;
}

export interface RegistryResponse {
  'dist-tags': {
    latest: string;
  };
  versions: {
    [version: string]: {
      dist: {
        unpackedSize?: number;
        tarball: string;
      };
      dependencies?: Record<string, string>;
    };
  };
}

export interface Options {
  json?: boolean;
}
