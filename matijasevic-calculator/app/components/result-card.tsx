'use client';

import { Stack, Text, VStack, chakra } from '@chakra-ui/react';
import { type ValueStatus } from '../../lib/polynomial';
import { StatusBadge } from './status-badge';

type ResultCardProps = {
  label: string;
  value: bigint;
  status: ValueStatus;
};

export function ResultCard({ label, value, status }: ResultCardProps) {
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
