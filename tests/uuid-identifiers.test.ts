import { describe, expect, it } from 'vitest';
import { DomainError, isUuid, newUuid, requireUuid } from '@gta6-rp/core';

const SAMPLE = '6f9619ff-8b86-d011-b42d-00c04fc964ff' as const;

describe('unified UUID identifiers', () => {
  it('generates distinct canonical lowercase UUIDs', () => {
    const first = newUuid();
    const second = newUuid();

    expect(isUuid(first)).toBe(true);
    expect(isUuid(second)).toBe(true);
    expect(first).not.toBe(second);
  });

  it('accepts the canonical UUID form used by the database columns', () => {
    expect(isUuid(SAMPLE)).toBe(true);
    expect(requireUuid(SAMPLE, 'character ID')).toBe(SAMPLE);
  });

  it('folds case and trims input before validating, so one identifier form survives', () => {
    const upper = SAMPLE.toUpperCase();

    expect(isUuid(upper)).toBe(false);
    expect(requireUuid(upper, 'character ID')).toBe(SAMPLE);
    expect(requireUuid(`  ${SAMPLE}  `, 'character ID')).toBe(SAMPLE);
  });

  it('rejects everything that is not a 36-character lowercase UUID', () => {
    const invalid = [
      '',
      '00000000000000000000000000000000', // no hyphens
      SAMPLE.replace(/-/g, ''),
      SAMPLE.slice(0, 35), // truncated
      `${SAMPLE}0`, // too long
      SAMPLE.replace('f', 'g'), // non-hex
      '../etc/passwd',
      'account-a',
      `${SAMPLE}\n`,
      `${SAMPLE.toUpperCase()}`,
    ];

    for (const value of invalid) {
      expect(isUuid(value), `isUuid(${JSON.stringify(value)})`).toBe(false);
    }
  });

  it('throws a domain error with the field label when parsing fails', () => {
    expect(() => requireUuid('not-a-uuid', 'account ID')).toThrowError(DomainError);
    try {
      requireUuid('not-a-uuid', 'account ID');
    } catch (error) {
      expect((error as DomainError).code).toBe('INVALID_IDENTIFIER');
      expect((error as DomainError).message).toContain('account ID');
    }
  });
});
