import { describe, expect, it } from 'vitest';
import { paragraphsToBlocks } from '../src/lib/blocks';
import { PUBLIC_ACTIONS } from '../src/lib/permissions';
import { loadSeed } from '../src/lib/seed';

describe('seed content', () => {
  const seed = loadSeed();

  it('validates against the seed schema', () => {
    expect(seed.experiences).toHaveLength(6);
    expect(seed.skillGroups.length).toBeGreaterThanOrEqual(5);
    expect(seed.profile.location).toBe('Lagos, Nigeria');
  });

  it('has unique project slugs', () => {
    const slugs = seed.projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('turns JSON nulls into undefined for Strapi inputs', () => {
    const current = seed.experiences.find((experience) => experience.current);
    expect(current?.endDate).toBeUndefined();
  });

  it('contains no phone number or home address', () => {
    const text = JSON.stringify(seed);
    expect(text).not.toMatch(/\+?234\d{6,}/);
    expect(text).not.toMatch(/\b(street|close|crescent|avenue)\b/i);
  });
});

describe('paragraphsToBlocks', () => {
  it('builds paragraph blocks', () => {
    expect(paragraphsToBlocks(['a', 'b'])).toEqual([
      { type: 'paragraph', children: [{ type: 'text', text: 'a' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'b' }] },
    ]);
  });
});

describe('PUBLIC_ACTIONS', () => {
  it('only allows creating messages, never reading them', () => {
    const messageActions = PUBLIC_ACTIONS.filter((action) => action.startsWith('api::message.'));
    expect(messageActions).toEqual(['api::message.message.create']);
  });

  it('allows read-only access to the public content types', () => {
    for (const action of PUBLIC_ACTIONS.filter((a) => !a.startsWith('api::message.'))) {
      expect(action).toMatch(/\.(find|findOne)$/);
    }
  });
});
