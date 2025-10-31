'use client';

import { Badge } from '@chakra-ui/react';
import { type ValueStatus } from '../../lib/polynomial';

const STATUS_COLOR_MAP: Record<ValueStatus, string> = {
  positive: 'green',
  zero: 'blue',
  negative: 'red',
};

type StatusBadgeProps = {
  status: ValueStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
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
