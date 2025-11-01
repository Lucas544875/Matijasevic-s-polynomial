'use client';

import { Badge } from '@chakra-ui/react';

type ConditionBadgeProps = {
  count: number;
  total: number;
};

export function ConditionBadge({ count, total }: ConditionBadgeProps) {
  const colorPalette =
    total > 0 && count === total
      ? 'green'
      : count > 0
        ? 'yellow'
        : 'gray';
  return (
    <Badge colorPalette={colorPalette} variant="subtle">
      {count}/{total}
    </Badge>
  );
}
