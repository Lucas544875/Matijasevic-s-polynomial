'use client';

import { Badge } from '@chakra-ui/react';
import { type ValueStatus } from '../../lib/polynomial';

const STATUS_COLOR_MAP: Record<ValueStatus, string> = {
  positive: 'red',
  zero: 'green',
  negative: 'red',
};

type StatusBadgeProps = {
  status: ValueStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge colorPalette={STATUS_COLOR_MAP[status]} >
      {status === 'positive' || status === 'negative'
        ? 'nonzero'
        : 'zero'}
    </Badge>
  );
}
