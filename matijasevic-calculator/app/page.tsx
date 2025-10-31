'use client';

import { useMemo } from 'react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react';
import { BlockMath } from 'react-katex';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import {
  PARAMETER_KEYS,
  JSWW_POLY_TEX,
  evaluatePolynomial,
  generateRandomParameters,
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
    'ユーザーが指定したパラメータを代入したMatijasevicの多項式の結果です。正の値であれば素数であることが保証されます。',
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
            Matijasevic 多項式インタラクティブ計算
          </Heading>
          <Text color="gray.600" fontSize="md">
            26個のパラメータを指定して多項式を代入し、結果と必要な部分式の達成度をリアルタイムに確認できます。
          </Text>
          <BlockMath math={JSWW_POLY_TEX} />
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
                  <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
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
