import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApiUrl } from './api.js';

test('uses a relative path in dev when no explicit API base is configured', () => {
  assert.equal(buildApiUrl('/api/admission/register', { isDev: true }), '/api/admission/register');
});

test('ignores a localhost fallback in dev so the Vite proxy is used', () => {
  assert.equal(buildApiUrl('/api/admission/register', { apiBase: 'http://localhost:5000', isDev: true }), '/api/admission/register');
});
