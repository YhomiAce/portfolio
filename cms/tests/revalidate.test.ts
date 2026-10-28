import { describe, expect, it } from 'vitest';
import { buildRevalidateUrl, readRevalidateConfig, shouldRevalidate } from '../src/lib/revalidate';

describe('readRevalidateConfig', () => {
  it('is off unless both variables are set to valid values', () => {
    expect(readRevalidateConfig({})).toBeNull();
    expect(readRevalidateConfig({ WEB_REVALIDATE_URL: 'https://site.dev/api/revalidate' })).toBeNull();
    expect(readRevalidateConfig({ WEB_REVALIDATE_URL: 'not a url', REVALIDATE_SECRET: 'x' })).toBeNull();
    expect(
      readRevalidateConfig({ WEB_REVALIDATE_URL: 'https://site.dev/api/revalidate', REVALIDATE_SECRET: 's3cret' }),
    ).toEqual({ url: 'https://site.dev/api/revalidate', secret: 's3cret' });
  });
});

describe('buildRevalidateUrl', () => {
  it('adds the secret as a query parameter, URL-encoded', () => {
    expect(buildRevalidateUrl({ url: 'https://site.dev/api/revalidate', secret: 'a b&c' })).toBe(
      'https://site.dev/api/revalidate?secret=a+b%26c',
    );
  });
});

describe('shouldRevalidate', () => {
  it('fires for content writes but not for messages or reads', () => {
    expect(shouldRevalidate('api::project.project', 'update')).toBe(true);
    expect(shouldRevalidate('api::post.post', 'publish')).toBe(true);
    expect(shouldRevalidate('api::project.project', 'findMany')).toBe(false);
    expect(shouldRevalidate('api::message.message', 'create')).toBe(false);
  });
});
