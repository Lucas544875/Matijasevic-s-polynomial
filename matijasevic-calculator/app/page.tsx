'use client';

import { useMemo } from 'react';
import {
  Accordion,
  Button,
  Card,
  Container,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Span,
  Text,
  chakra,
} from '@chakra-ui/react';
import { BlockMath, InlineMath } from 'react-katex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import {
  PARAMETER_KEYS,
  JSWW_POLY_TEX,
  evaluatePolynomial,
  generateRandomParameters,
  PARAMETER_CONDITION_TOTALS,
} from '../lib/polynomial';
import {
  ParameterInputField,
  ResultCard,
  SectionContainer,
  SectionHeader,
  StatusBadge,
} from './components';
import {
  convertInputsToParameters,
  convertParametersToInputs,
  createDefaultParameterValues,
  parameterSchema,
  type ParameterFormValues,
} from '../lib/parameters';

const SECTION_TITLES = {
  result: '計算結果',
  partials: '部分式計算結果',
  parameters: 'パラメータ指定',
} as const;

const descriptionText = {
  result:
    'ユーザーが指定したパラメータを代入したMatijasevičの多項式の結果です。正の値であれば素数であることが保証されます。',
  partials:
    '正の結果を得るためにゼロである必要がある部分式を個別に計算し、ステータスと共に一覧表示します。',
  parameters:
    '26個のパラメータを指定し、関連する部分式の条件がいくつ満たされているかを確認できます。',
};

export default function HomePage() {
  const {
    reset,
    control,
    formState: { errors },
  } = useForm<ParameterFormValues>({
    mode: 'onChange',
    resolver: zodResolver(parameterSchema),
    defaultValues: createDefaultParameterValues(),
  });

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
        <Stack gap={4}>
          <Heading as="h1" size="lg">
            Matijasevič 多項式計算機
          </Heading>
          <Text color="gray.600" fontSize="md">
            26個のパラメータを多項式に代入した結果と、素数を返すために必要な条件の達成度をインタラクティブに確認できます。
          </Text>
          <Accordion.Root collapsible>
            <Accordion.Item value="">
              <Accordion.ItemTrigger>
                <Span flex="1" fontWeight="semibold">Matijasevič 多項式とは</Span>
                <Accordion.ItemIndicator/>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Text fontSize="sm" color="gray.600">
                    Matijasevič 多項式とは、値域の正の部分が素数全体の集合と一致するという性質を持つ、自然数上で定義された以下の26変数の多項式のことです。
                    <InlineMath>
                      P(a,b, ... , z) = (k+2)\left(1-\sum (多項式)^2 \right)
                    </InlineMath>
                    という形をしており、出力が正であるためには、各多項式がすべて0であるという条件が満たされる必要があります。
                  </Text>
                  <BlockMath math={JSWW_POLY_TEX} />
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
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
                label="P(a,b, ... , z)="
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
              {calculation.partials.map((partial) => (
                <Card.Root size="sm" margin={"2"} key={partial.label}>
                  <Card.Header paddingTop={"2"} fontWeight="semibold">
                    {partial.label} =
                  </Card.Header>
                  <Card.Body paddingY={"2"}>
                    <Stack  direction={{ base: 'column', md: 'row' }}
                    justify="space-between"
                    align={{ base: 'flex-start', md: 'center' }}
                    gap={4}
                    flexWrap="wrap"
                    w="full">
                      <Span fontFamily="mono" fontSize="lg" wordBreak="break-all">
                        {partial.value.toString()}
                      </Span>
                      <StatusBadge status={partial.status} />
                    </Stack>
                  </Card.Body>
                </Card.Root>
              ))}
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
                  <Button colorScheme="teal" onClick={handleRandomize}>
                    ランダムに設定
                  </Button>
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                    {PARAMETER_KEYS.map((key) => (
                      <ParameterInputField
                        key={key}
                        name={key}
                        control={control}
                        conditionCount={calculation.parameterConditions[key]}
                        totalConditionCount={PARAMETER_CONDITION_TOTALS[key]}
                        error={errors[key]?.message}
                      />
                    ))}
                  </SimpleGrid>
                </Stack>
              </chakra.form>
            </SectionContainer>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}
