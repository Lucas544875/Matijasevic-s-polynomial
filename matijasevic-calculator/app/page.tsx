'use client';

import { useMemo } from 'react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Container,
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  chakra,
  useBreakpointValue,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type UseFormRegister } from 'react-hook-form';
import { z } from 'zod';
import {
  PARAMETER_KEYS,
  type ParameterKey,
  type ParameterValues,
  evaluatePolynomial,
  generateRandomParameters,
  type ValueStatus,
} from '../lib/polynomial';

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
  );

const parameterSchema = z.object(
  Object.fromEntries(
    PARAMETER_KEYS.map((key) => [key, integerStringSchema]),
  ) as Record<ParameterKey, typeof integerStringSchema>,
);

type ParameterFormValues = z.infer<typeof parameterSchema>;

const STATUS_COLOR_MAP: Record<ValueStatus, string> = {
  positive: 'green',
  zero: 'blue',
  negative: 'red',
};

const SECTION_TITLES = {
  result: '計算結果',
  partials: '部分計算結果',
  parameters: 'パラメータ指定',
} as const;

const descriptionText = {
  result:
    'ユーザーが指定したパラメータを代入したMatijasevicの多項式の結果です。値の正負によってステータスが切り替わります。',
  partials:
    '正の結果を得るためにゼロである必要がある部分式を個別に計算し、ステータスと共に一覧表示します。',
  parameters:
    '26個のパラメータを指定し、関連する部分計算のゼロ条件がいくつ満たされているかを確認できます。',
};

export default function HomePage() {
  const {
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<ParameterFormValues>({
    mode: 'onChange',
    resolver: zodResolver(parameterSchema),
    defaultValues: createDefaultParameterValues(),
  });

  const parameterDisplayColumns = useBreakpointValue({ base: 1, md: 2, xl: 3 });

  const watchedValues = useWatch<ParameterFormValues>({ control });

  const calculation = useMemo(() => {
    return evaluatePolynomial(convertInputsToParameters(watchedValues));
  }, [watchedValues]);

  const handleRandomize = () => {
    const randomValues = generateRandomParameters();
    reset(convertParametersToInputs(randomValues));
  };

  return (
    <Container maxW="7xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
      <Stack gap={{ base: 8, md: 12 }}>
        <Stack gap={2}>
          <Heading as="h1" size="lg">
            Matijasevic 多項式インタラクティブ計算
          </Heading>
          <Text color="gray.600" fontSize="md">
            26個のパラメータを指定して多項式を代入し、結果と必要な部分式の達成度をリアルタイムに確認できます。
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: '1fr',
            lg: 'minmax(0, 2fr) minmax(0, 3fr) minmax(0, 3fr)',
          }}
          gap={{ base: 6, lg: 8 }}
        >
          <GridItem>
            <SectionContainer>
              <SectionHeader
                title={SECTION_TITLES.result}
                description={descriptionText.result}
              />
              <ResultCard
                label="最終値"
                value={calculation.final.value}
                status={calculation.final.status}
              />
            </SectionContainer>
          </GridItem>

          <GridItem>
            <SectionContainer>
              <SectionHeader
                title={SECTION_TITLES.partials}
                description={descriptionText.partials}
              />
              <Accordion.Root multiple>
                {calculation.partials.map((partial) => (
                  <Accordion.Item key={partial.id} value={partial.id}>
                    <Accordion.ItemTrigger>
                      <HStack justify="space-between" align="center" w="full">
                        <Box textAlign="left">
                          <Text fontWeight="semibold">{partial.label}</Text>
                          <HStack gap={3} mt={2}>
                            <StatusBadge status={partial.status} />
                            {partial.zeroRequired ? (
                              <Badge colorScheme="purple">ゼロ条件</Badge>
                            ) : null}
                          </HStack>
                        </Box>
                        <Accordion.ItemIndicator />
                      </HStack>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody>
                        <Text fontFamily="mono" fontSize="sm">
                          {partial.value.toString()}
                        </Text>
                      </Accordion.ItemBody>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </SectionContainer>
          </GridItem>

          <GridItem>
            <SectionContainer>
              <SectionHeader
                title={SECTION_TITLES.parameters}
                description={descriptionText.parameters}
              />
              <chakra.form
                noValidate
                onSubmit={(event) => event.preventDefault()}
              >
                <Stack gap={6}>
                  <SimpleGrid columns={parameterDisplayColumns ?? 1} gap={4}>
                    {PARAMETER_KEYS.map((key) => (
                      <ParameterInputField
                        key={key}
                        name={key}
                        register={register}
                        conditionCount={calculation.parameterConditions[key]}
                        error={errors[key]?.message}
                      />
                    ))}
                  </SimpleGrid>
                  <Button colorScheme="teal" onClick={handleRandomize}>
                    ランダムに設定
                  </Button>
                </Stack>
              </chakra.form>
            </SectionContainer>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}

function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      padding={{ base: 4, md: 6 }}
      boxShadow="xs"
      bg="white"
    >
      {children}
    </Box>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Stack gap={3} mb={5}>
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.600">
        {description}
      </Text>
    </Stack>
  );
}

function ResultCard({
  label,
  value,
  status,
}: {
  label: string;
  value: bigint;
  status: ValueStatus;
}) {
  return (
    <VStack align="stretch" gap={4}>
      <Text fontWeight="semibold">{label}</Text>
      <Stack direction="row" justify="space-between" align="center">
        <chakra.span fontFamily="mono" fontSize="lg">
          {value.toString()}
        </chakra.span>
        <StatusBadge status={status} />
      </Stack>
    </VStack>
  );
}

function StatusBadge({ status }: { status: ValueStatus }) {
  return (
    <Badge colorScheme={STATUS_COLOR_MAP[status]} variant="solid">
      {status === 'positive'
        ? '正'
        : status === 'negative'
          ? '負'
          : 'ゼロ'}
    </Badge>
  );
}

function ParameterInputField({
  name,
  register,
  conditionCount,
  error,
}: {
  name: ParameterKey;
  register: UseFormRegister<ParameterFormValues>;
  conditionCount: number;
  error?: string;
}) {
  const registration = register(name);
  const isInvalid = Boolean(error);
  return (
    <FieldRoot invalid={isInvalid}>
      <FieldLabel fontSize="sm" fontWeight="semibold">
        {name.toUpperCase()}
      </FieldLabel>
      <Input
        {...registration}
        aria-invalid={isInvalid}
        inputMode="numeric"
        placeholder="0"
        />
      <Text mt={1} fontSize="xs" color="gray.500">
        条件達成: <ConditionBadge count={conditionCount} />
      </Text>
      {error ? (
        <FieldErrorText fontSize="xs" mt={1}>
          {error}
        </FieldErrorText>
      ) : null}
    </FieldRoot>
  );
}

function ConditionBadge({ count }: { count: number }) {
  const colorScheme = count > 0 ? 'green' : 'gray';
  return (
    <Badge colorScheme={colorScheme} variant="subtle">
      {count}
    </Badge>
  );
}

function createDefaultParameterValues(): ParameterFormValues {
  return Object.fromEntries(
    PARAMETER_KEYS.map((key) => [key, '0']),
  ) as ParameterFormValues;
}

function convertInputsToParameters(
  inputs: Partial<ParameterFormValues>,
): ParameterValues {
  const entries = PARAMETER_KEYS.map<[ParameterKey, bigint]>((key) => {
    const source = inputs[key] ?? '0';
    const rawValue = source.trim();
    return [key, parseBigIntSafely(rawValue)];
  });
  return Object.fromEntries(entries) as ParameterValues;
}

function convertParametersToInputs(params: ParameterValues): ParameterFormValues {
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
    return BigInt(value);
  } catch {
    return 0n;
  }
}
