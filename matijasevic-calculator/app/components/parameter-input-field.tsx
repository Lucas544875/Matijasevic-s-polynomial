'use client';

import {
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Text,
} from '@chakra-ui/react';
import { Controller, type Control } from 'react-hook-form';
import { type ParameterKey } from '../../lib/polynomial';
import { type ParameterFormValues } from '../../lib/parameters';
import { ConditionBadge } from './condition-badge';
import { BigIntInput } from './bigint-input';

type ParameterInputFieldProps = {
  name: ParameterKey;
  control: Control<ParameterFormValues>;
  conditionCount: number;
  totalConditionCount: number;
  error?: string;
};

export function ParameterInputField({
  name,
  control,
  conditionCount,
  totalConditionCount,
  error,
}: ParameterInputFieldProps) {
  const isInvalid = Boolean(error);
  const errorId = error ? `${name}-error` : undefined;

  return (
    <FieldRoot invalid={isInvalid}>
      <FieldLabel fontSize="sm" fontWeight="semibold">
        {name}
      </FieldLabel>
      <Controller
        name={name}
        control={control}
        defaultValue="1"
        render={({ field }) => (
          <BigIntInput
            id={name}
            name={name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={isInvalid}
            aria-describedby={errorId}
          />
        )}
      />
      <Text mt={1} fontSize="xs" color="gray.500">
        条件達成:{' '}
        <ConditionBadge
          count={conditionCount}
          total={totalConditionCount}
        />
      </Text>
      {error ? (
        <FieldErrorText id={errorId} fontSize="xs" mt={1}>
          {error}
        </FieldErrorText>
      ) : null}
    </FieldRoot>
  );
}
