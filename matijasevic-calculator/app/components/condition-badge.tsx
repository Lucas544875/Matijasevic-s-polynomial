'use client';

import { Badge } from '@chakra-ui/react';

type ConditionBadgeProps = {
  count: number;
  total: number;
};

export function ConditionBadge({ count, total }: ConditionBadgeProps) {
  const colorScheme = count > 0 ? 'green' : 'gray';
  return (
    <Badge colorScheme={colorScheme} variant="subtle">
      {count}/{total}
    </Badge>
  );
}
