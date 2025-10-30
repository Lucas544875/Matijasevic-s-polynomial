import { describe, expect, it } from 'vitest';
import {
  PARAMETER_KEYS,
  evaluatePolynomial,
  generateRandomParameters,
  type ParameterKey,
  type ParameterValues,
} from './polynomial';

describe('evaluatePolynomial', () => {
  it('returns zero status when all parameters are zero', () => {
    const params = createParameters();
    const result = evaluatePolynomial(params);

    expect(result.final.value).toBe(0n);
    expect(result.final.status).toBe('zero');

    const zeroRequiredPartials = result.partials.filter(
      (partial) => partial.zeroRequired,
    );
    expect(zeroRequiredPartials).toHaveLength(2);
    zeroRequiredPartials.forEach((partial) =>
      expect(partial.status).toBe('zero'),
    );

    expect(result.parameterConditions.a).toBe(1);
    expect(result.parameterConditions.b).toBe(1);
    expect(result.parameterConditions.c).toBe(1);
    expect(result.parameterConditions.d).toBe(1);
    expect(
      PARAMETER_KEYS.filter(
        (key) => !['a', 'b', 'c', 'd'].includes(key),
      ).every((key) => result.parameterConditions[key] === 0),
    ).toBe(true);
  });

  it('computes partial statuses and final value', () => {
    const params = createParameters({
      a: 2n,
      b: 3n,
      c: 1n,
      d: 4n,
      e: 3n,
      f: 1n,
      g: 3n,
      z: 0n,
    });

    const result = evaluatePolynomial(params);

    const partial1 = result.partials.find((partial) => partial.id === 'p1');
    const partial2 = result.partials.find((partial) => partial.id === 'p2');
    const partial3 = result.partials.find((partial) => partial.id === 'p3');

    expect(partial1?.value).toBe(5n);
    expect(partial1?.status).toBe('positive');
    expect(partial2?.value).toBe(-3n);
    expect(partial2?.status).toBe('negative');
    expect(partial3?.value).toBe(0n);
    expect(partial3?.status).toBe('zero');

    expect(result.final.value).toBe(34n);
    expect(result.final.status).toBe('positive');
    expect(
      PARAMETER_KEYS.every((key) => result.parameterConditions[key] === 0),
    ).toBe(true);
  });
});

describe('generateRandomParameters', () => {
  it('generates values for every parameter within the default range', () => {
    const params = generateRandomParameters();

    PARAMETER_KEYS.forEach((key) => {
      const value = params[key];
      expect(typeof value).toBe('bigint');
      expect(value).toBeGreaterThanOrEqual(-10n);
      expect(value).toBeLessThanOrEqual(10n);
    });
  });
});

function createParameters(
  overrides: Partial<Record<ParameterKey, bigint>> = {},
): ParameterValues {
  const entries = PARAMETER_KEYS.map<[ParameterKey, bigint]>((key) => [
    key,
    overrides[key] ?? 0n,
  ]);
  return Object.fromEntries(entries) as ParameterValues;
}
