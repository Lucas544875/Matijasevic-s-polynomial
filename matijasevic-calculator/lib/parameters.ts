import { z } from 'zod';
import {
  PARAMETER_KEYS,
  type ParameterKey,
  type ParameterValues,
} from './polynomial';

const integerStringSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === '') return false;
      try {
        BigInt(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: '整数を入力してください' },
  )
  .refine(
    (value) => {
      try {
        return BigInt(value) >= 0n;
      } catch {
        return false;
      }
    },
    { message: '0以上の整数を入力してください' },
  );

export const parameterSchema = z.object(
  Object.fromEntries(
    PARAMETER_KEYS.map((key) => [key, integerStringSchema]),
  ) as Record<ParameterKey, typeof integerStringSchema>,
);

export type ParameterFormValues = z.infer<typeof parameterSchema>;

export function createDefaultParameterValues(): ParameterFormValues {
  return Object.fromEntries(
    PARAMETER_KEYS.map((key) => [key, '0']),
  ) as ParameterFormValues;
}

export function convertInputsToParameters(
  inputs: Partial<ParameterFormValues>,
): ParameterValues {
  const entries = PARAMETER_KEYS.map<[ParameterKey, bigint]>((key) => {
    const source = inputs[key] ?? '0';
    const rawValue = source.trim();
    return [key, parseBigIntSafely(rawValue)];
  });
  return Object.fromEntries(entries) as ParameterValues;
}

export function convertParametersToInputs(
  params: ParameterValues,
): ParameterFormValues {
  const entries = PARAMETER_KEYS.map<[ParameterKey, string]>((key) => [
    key,
    params[key].toString(),
  ]);
  return Object.fromEntries(entries) as ParameterFormValues;
}

function parseBigIntSafely(value: string): bigint {
  if (value === '' || value === '-' || value === '+') {
    return 0n;
  }

  try {
    const parsed = BigInt(value);
    return parsed < 0n ? 0n : parsed;
  } catch {
    return 0n;
  }
}
