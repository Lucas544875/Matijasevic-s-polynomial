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

// Each partial corresponds to one squared term from Matijasevič's polynomial.
const PARTIAL_DEFINITIONS: PartialDefinition[] = [
  {
    id: "p1",
    label: "w*z + h + j - q",
    zeroRequired: true,
    parameters: ["w", "z", "h", "j", "q"],
    compute: (params) => params.w * params.z + params.h + params.j - params.q,
  },
  {
    id: "p2",
    label: "(g*k + 2*g + k + 1)*(h + j) + h - z",
    zeroRequired: true,
    parameters: ["g", "k", "h", "j", "z"],
    compute: (params) => {
      const left = params.g * params.k + 2n * params.g + params.k + 1n;
      const right = params.h + params.j;
      return left * right + params.h - params.z;
    },
  },
  {
    id: "p3",
    label: "2*n + p + q + z - e",
    zeroRequired: true,
    parameters: ["n", "p", "q", "z", "e"],
    compute: (params) =>
      2n * params.n + params.p + params.q + params.z - params.e,
  },
  {
    id: "p4",
    label: "16 * (k+1)^3 * (k+2) * (n+1)^2 + 1 - f^2",
    zeroRequired: true,
    parameters: ["k", "n", "f"],
    compute: (params) => {
      const kPlus1 = params.k + 1n;
      const nPlus1 = params.n + 1n;
      return (
        16n * (kPlus1 ** 3n) * (params.k + 2n) * (nPlus1 ** 2n) +
        1n - params.f ** 2n
      );
    },
  },
  {
    id: "p5",
    label: "e^3 * (e+2) * (a+1)^2 + 1 - o^2",
    zeroRequired: true,
    parameters: ["e", "a", "o"],
    compute: (params) => {
      const eCubed = params.e ** 3n;
      return (
        eCubed * (params.e + 2n) * ((params.a + 1n) ** 2n) + 1n - params.o ** 2n
      );
    },
  },
  {
    id: "p6",
    label: "(a^2 - 1) * y^2 + 1 - x^2",
    zeroRequired: true,
    parameters: ["a", "y", "x"],
    compute: (params) =>
      (params.a ** 2n - 1n) * (params.y ** 2n) + 1n - params.x ** 2n,
  },
  {
    id: "p7",
    label: "16 * r^2 * y^4 * (a^2 - 1) + 1 - u^2",
    zeroRequired: true,
    parameters: ["r", "y", "a", "u"],
    compute: (params) =>
      16n *
        (params.r ** 2n) *
        (params.y ** 4n) *
        (params.a ** 2n - 1n) +
      1n -
      params.u ** 2n,
  },
  {
    id: "p8",
    label:
      "((a + u^2 * (u^2 - a))^2 - 1) * (n + 4*d*y)^2 + 1 - (x + c*u)^2",
    zeroRequired: true,
    parameters: ["a", "u", "n", "d", "y", "x", "c"],
    compute: (params) => {
      const uSquared = params.u ** 2n;
      const first =
        (params.a + uSquared * (uSquared - params.a)) ** 2n - 1n;
      const second = params.n + 4n * params.d * params.y;
      const third = params.x + params.c * params.u;
      return first * (second ** 2n) + 1n - third ** 2n;
    },
  },
  {
    id: "p9",
    label: "n + l + v - y",
    zeroRequired: true,
    parameters: ["n", "l", "v", "y"],
    compute: (params) => params.n + params.l + params.v - params.y,
  },
  {
    id: "p10",
    label: "(a^2 - 1) * l^2 + 1 - m^2",
    zeroRequired: true,
    parameters: ["a", "l", "m"],
    compute: (params) =>
      (params.a ** 2n - 1n) * (params.l ** 2n) + 1n - params.m ** 2n,
  },
  {
    id: "p11",
    label: "a*i + k + 1 - l - i",
    zeroRequired: true,
    parameters: ["a", "i", "k", "l"],
    compute: (params) =>
      params.a * params.i + params.k + 1n - params.l - params.i,
  },
  {
    id: "p12",
    label:
      "p + l*(a - n - 1) + b*(2*a*n + 2*a - n^2 - 2*n - 2) - m",
    zeroRequired: true,
    parameters: ["p", "l", "a", "n", "b", "m"],
    compute: (params) => {
      const first = params.a - params.n - 1n;
      const second =
        2n * params.a * params.n +
        2n * params.a -
        params.n ** 2n -
        2n * params.n -
        2n;
      return (
        params.p + params.l * first + params.b * second - params.m
      );
    },
  },
  {
    id: "p13",
    label:
      "q + y*(a - p - 1) + s*(2*a*p + 2*a - p^2 - 2*p - 2) - x",
    zeroRequired: true,
    parameters: ["q", "y", "a", "p", "s", "x"],
    compute: (params) => {
      const first = params.a - params.p - 1n;
      const second =
        2n * params.a * params.p +
        2n * params.a -
        params.p ** 2n -
        2n * params.p -
        2n;
      return (
        params.q + params.y * first + params.s * second - params.x
      );
    },
  },
  {
    id: "p14",
    label: "z + p*l*(a - p) + t*(2*a*p - p^2 - 1) - p*m",
    zeroRequired: true,
    parameters: ["z", "p", "l", "a", "t", "m"],
    compute: (params) => {
      const first = params.a - params.p;
      const second = 2n * params.a * params.p - params.p ** 2n - 1n;
      return (
        params.z +
        params.p * params.l * first +
        params.t * second -
        params.p * params.m
      );
    },
  },
];

export const PARAMETER_CONDITION_TOTALS: Record<ParameterKey, number> = (() => {
  const totals = Object.fromEntries(
    PARAMETER_KEYS.map((key) => [key, 0]),
  ) as Record<ParameterKey, number>;

  for (const definition of PARTIAL_DEFINITIONS) {
    if (!definition.zeroRequired) continue;

    for (const parameter of definition.parameters) {
      totals[parameter] += 1;
    }
  }

  return totals;
})();

export const DEFAULT_RANDOM_RANGE = {
  min: 0,
  max: 10,
} as const;

export function generateRandomParameters(
  min = DEFAULT_RANDOM_RANGE.min,
  max = DEFAULT_RANDOM_RANGE.max,
): ParameterValues {
  const safeMin = Math.max(0, Math.floor(min));
  const safeMax = Math.max(safeMin, Math.floor(max));

  return PARAMETER_KEYS.reduce<ParameterValues>((acc, key) => {
    const value = BigInt(
      Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin,
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

// Jones–Sato–Wada–Wiens (1976): a 26-variable polynomial whose positive values are exactly the primes.
// Source: American Mathematical Monthly 83(6), 1976, pp.449–464; also reproduced on MathOverflow. 
// See citations in the message body.

// Variables are a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z.
export const JSWW_POLY_ASCII = `P(a,b,...,z) = (k+2)*(1
  - (w*z + h + j - q)^2
  - ((g*k + 2*g + k + 1)*(h + j) + h - z)^2
  - (2*n + p + q + z - e)^2
  - (16*(k+1)^3*(k+2)*(n+1)^2 + 1 - f^2)^2
  - (e^3*(e+2)*(a+1)^2 + 1 - o^2)^2
  - ((a^2 - 1)*y^2 + 1 - x^2)^2
  - (16*r^2*y^4*(a^2 - 1) + 1 - u^2)^2
  - (((a + u^2*(u^2 - a))^2 - 1)*(n + 4*d*y)^2 + 1 - (x + c*u)^2)^2
  - (n + l + v - y)^2
  - ((a^2 - 1)*l^2 + 1 - m^2)^2
  - (a*i + k + 1 - l - i)^2
  - (p + l*(a - n - 1) + b*(2*a*n + 2*a - n^2 - 2*n - 2) - m)^2
  - (q + y*(a - p - 1) + s*(2*a*p + 2*a - p^2 - 2*p - 2) - x)^2
  - (z + p*l*(a - p) + t*(2*a*p - p^2 - 1) - p*m)^2
)`;

export const JSWW_POLY_TEX = String.raw`\begin{aligned}
P(a,b,\ldots,z) ={}
& (k+2)\Biggl(1 - (w z + h + j - q)^2 \\
&\quad - ((g k + 2 g + k + 1)(h + j) + h - z)^2 \\
&\quad - (2 n + p + q + z - e)^2 \\
&\quad - \bigl(16 (k+1)^{3} (k+2) (n+1)^{2} + 1 - f^{2}\bigr)^{2} \\
&\quad - \bigl(e^{3} (e+2) (a+1)^{2} + 1 - o^{2}\bigr)^{2} \\
&\quad - \bigl((a^{2} - 1) y^{2} + 1 - x^{2}\bigr)^{2} \\
&\quad - \bigl(16 r^{2} y^{4} (a^{2} - 1) + 1 - u^{2}\bigr)^{2} \\
&\quad - \bigl(((a + u^{2}(u^{2} - a))^{2} - 1)(n + 4 d y)^{2} + 1 - (x + c u)^{2}\bigr)^{2} \\
&\quad - (n + l + v - y)^{2} \\
&\quad - \bigl((a^{2} - 1) l^{2} + 1 - m^{2}\bigr)^{2} \\
&\quad - (a i + k + 1 - l - i)^{2} \\
&\quad - \bigl(p + l(a - n - 1) + b(2 a n + 2 a - n^{2} - 2 n - 2) - m\bigr)^{2} \\
&\quad - \bigl(q + y(a - p - 1) + s(2 a p + 2 a - p^{2} - 2 p - 2) - x\bigr)^{2} \\
&\quad - \bigl(z + p l(a - p) + t(2 a p - p^{2} - 1) - p m\bigr)^{2} \Biggr)
\end{aligned}`;


function computeFinalValue(
  partials: PartialResult[],
  params: ParameterValues,
): bigint {
  const sumOfSquares = partials.reduce<bigint>(
    (acc, partial) => acc + partial.value ** 2n,
    0n,
  );
  return (params.k + 2n) * (1n - sumOfSquares);
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
