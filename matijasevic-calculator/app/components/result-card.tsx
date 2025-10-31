'use client';

import { Badge, Stack, Text, VStack, chakra } from '@chakra-ui/react';
import { type ValueStatus } from '../../lib/polynomial';

type ResultCardProps = {
  label: string;
  value: bigint;
  status: ValueStatus;
};

export function ResultCard({ label, value, status }: ResultCardProps) {
  return (
    <VStack align="stretch" gap={4}>
      <Text fontWeight="semibold">{label}</Text>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        gap={4}
        flexWrap="wrap"
        w="full"
      >
        <chakra.span fontFamily="mono" fontSize="lg" wordBreak="break-all">
          {value.toString()}
        </chakra.span>
        <Badge colorPalette={status == 'positive' ? 'green' : 'red'}>
          {status === 'positive' 
            ? '素数！'
            : '非素数'}
        </Badge>
      </Stack>
    </VStack>
  );
}
