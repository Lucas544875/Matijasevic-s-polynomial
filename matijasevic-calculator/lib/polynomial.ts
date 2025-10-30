export const PARAMETER_KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

export type ParameterKey = (typeof PARAMETER_KEYS)[number];
export type ParameterValues = Record<ParameterKey, bigint>;

export type ValueStatus = "positive" | "zero" | "negative";

export interface PartialResult {
  id: string;
  label: string;
  value: bigint;
  status: ValueStatus;
  zeroRequired: boolean;
  parameters: ParameterKey[];
}

export interface CalculationResult {
  final: {
    value: bigint;
    status: ValueStatus;
  };
  partials: PartialResult[];
  parameterConditions: Record<ParameterKey, number>;
}

interface PartialDefinition {
  id: string;
  label: string;
  zeroRequired: boolean;
  parameters: ParameterKey[];
  compute: (params: ParameterValues) => bigint;
}

// TODO: 多項式の定義を実際のMatijasevicの式に置き換える
const PARTIAL_DEFINITIONS: PartialDefinition[] = [
  {
    id: "p1",
    label: "部分式1（仮）",
    zeroRequired: true,
    parameters: ["a", "b"],
    compute: (params) => params.a + params.b,
  },
  {
    id: "p2",
    label: "部分式2（仮）",
    zeroRequired: true,
    parameters: ["c", "d"],
    compute: (params) => params.c - params.d,
  },
  {
    id: "p3",
    label: "部分式3（仮）",
    zeroRequired: false,
    parameters: ["e", "f", "g"],
    compute: (params) => params.e * params.f - params.g,
  },
];

export const DEFAULT_RANDOM_RANGE = {
  min: -10,
  max: 10,
} as const;

export function generateRandomParameters(
  min = DEFAULT_RANDOM_RANGE.min,
  max = DEFAULT_RANDOM_RANGE.max,
): ParameterValues {
  return PARAMETER_KEYS.reduce<ParameterValues>((acc, key) => {
    const value = BigInt(
      Math.floor(Math.random() * (Number(max) - Number(min) + 1)) +
        Number(min),
    );
    acc[key] = value;
    return acc;
  }, Object.create(null));
}

export function evaluatePolynomial(params: ParameterValues): CalculationResult {
  const partials = PARTIAL_DEFINITIONS.map<PartialResult>((definition) => {
    const value = definition.compute(params);
    return {
      ...definition,
      value,
      status: statusFromValue(value),
    };
  });

  const finalValue = computeFinalValue(partials, params);

  return {
    final: {
      value: finalValue,
      status: statusFromValue(finalValue),
    },
    partials,
    parameterConditions: calculateParameterConditions(partials),
  };
}

function computeFinalValue(
  partials: PartialResult[],
  params: ParameterValues,
): bigint {
  // TODO: Matijasevicの多項式の最終式に差し替える
  const sumOfSquares = partials.reduce<bigint>(
    (acc, partial) => acc + partial.value * partial.value,
    0n,
  );
  return sumOfSquares - params.z;
}

function calculateParameterConditions(
  partials: PartialResult[],
): Record<ParameterKey, number> {
  const result: Record<ParameterKey, number> = Object.create(null);

  for (const key of PARAMETER_KEYS) {
    result[key] = 0;
  }

  for (const partial of partials) {
    if (!partial.zeroRequired || partial.status !== "zero") {
      continue;
    }

    for (const parameter of partial.parameters) {
      result[parameter] += 1;
    }
  }

  return result;
}

function statusFromValue(value: bigint): ValueStatus {
  if (value === 0n) return "zero";
  if (value > 0n) return "positive";
  return "negative";
}
