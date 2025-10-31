'use client';

import {
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Input,
  Text,
} from '@chakra-ui/react';
import type { UseFormRegister } from 'react-hook-form';
import { type ParameterKey } from '../../lib/polynomial';
import { type ParameterFormValues } from '../../lib/parameters';
import { ConditionBadge } from './condition-badge';

type ParameterInputFieldProps = {
  name: ParameterKey;
  register: UseFormRegister<ParameterFormValues>;
  conditionCount: number;
  error?: string;
};

export function ParameterInputField({
  name,
  register,
  conditionCount,
  error,
}: ParameterInputFieldProps) {
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
