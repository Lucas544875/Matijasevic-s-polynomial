import { describe, expect, it } from 'vitest';

import {
  convertInputsToParameters,
  createDefaultParameterValues,
  parameterSchema,
} from './parameters';

describe('parameterSchema', () => {
  it('accepts zero and positive integers', () => {
    const validValues = createDefaultParameterValues();
    validValues.a = '0';
    validValues.b = '123';
    validValues.c = '+5';

    expect(parameterSchema.safeParse(validValues).success).toBe(true);
  });

  it('rejects negative integers', () => {
    const invalidValues = createDefaultParameterValues();
    invalidValues.a = '-1';

    const result = parameterSchema.safeParse(invalidValues);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0].message).toBe('0以上の整数を入力してください');
  });

  it('accepts extremely large integers', () => {
    const bigInteger =
      '901690358098896161685556879749949186326380713409290912';
    const values = createDefaultParameterValues();
    values.a = bigInteger;

    const result = parameterSchema.safeParse(values);
    expect(result.success).toBe(true);
    const params = convertInputsToParameters(values);
    expect(params.a.toString()).toBe(bigInteger);
  });
});

describe('convertInputsToParameters', () => {
  it('clamps negative values to zero', () => {
    const values = createDefaultParameterValues();
    values.a = '-10';

    const params = convertInputsToParameters(values);
    expect(params.a).toBe(0n);
  });
});
