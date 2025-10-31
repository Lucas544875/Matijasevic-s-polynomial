'use client';

import { Badge } from '@chakra-ui/react';

type ConditionBadgeProps = {
  count: number;
};

export function ConditionBadge({ count }: ConditionBadgeProps) {
  const colorScheme = count > 0 ? 'green' : 'gray';
  return (
    <Badge colorScheme={colorScheme} variant="subtle">
      {count}
    </Badge>
  );
}
