import { describe, test } from 'node:test';
import assert from 'node:assert';
import { formatSize, getSizeColor, RESET } from './utils.js';

describe('formatSize', () => {
  test('formats bytes correctly', () => {
    assert.strictEqual(formatSize(500), '500 B');
    assert.strictEqual(formatSize(1024), '1.0 KB');
    assert.strictEqual(formatSize(1536), '1.5 KB');
    assert.strictEqual(formatSize(1048576), '1.0 MB');
    assert.strictEqual(formatSize(2621440), '2.5 MB');
  });

  test('handles edge cases', () => {
    assert.strictEqual(formatSize(0), '0 B');
    assert.strictEqual(formatSize(1023), '1023 B');
  });
});

describe('getSizeColor', () => {
  test('returns green for small sizes', () => {
    assert.strictEqual(getSizeColor(1024), '\x1b[32m'); // 1KB
    assert.strictEqual(getSizeColor(50 * 1024), '\x1b[32m'); // 50KB
  });

  test('returns yellow for medium sizes', () => {
    assert.strictEqual(getSizeColor(100 * 1024), '\x1b[33m'); // 100KB
    assert.strictEqual(getSizeColor(500 * 1024), '\x1b[33m'); // 500KB
  });

  test('returns red for large sizes', () => {
    assert.strictEqual(getSizeColor(1024 * 1024), '\x1b[31m'); // 1MB
    assert.strictEqual(getSizeColor(5 * 1024 * 1024), '\x1b[31m'); // 5MB
  });
});
