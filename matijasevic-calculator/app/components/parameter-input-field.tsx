'use client';

import {
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  NumberInput,
  InputGroup,
  Text,
} from '@chakra-ui/react';
import { LuArrowRightLeft } from 'react-icons/lu';
import { Controller, type Control } from 'react-hook-form';
import { type ParameterKey } from '../../lib/polynomial';
import { type ParameterFormValues } from '../../lib/parameters';
import { ConditionBadge } from './condition-badge';

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
          <NumberInput.Root
            value={field.value ?? '1'}
            min={0}
            onValueChange={
              ({ value }) => field.onChange(value)
            }
            onBlur={field.onBlur}
          >
            <NumberInput.Control />
            <InputGroup
              startElementProps={{ pointerEvents: 'auto' }}
              startElement={
                <NumberInput.Scrubber>
                  <LuArrowRightLeft />
                </NumberInput.Scrubber>
              }
            >
              <NumberInput.Input
                inputMode="numeric"
              />
            </InputGroup>
          </NumberInput.Root>
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
        <FieldErrorText fontSize="xs" mt={1}>
          {error}
        </FieldErrorText>
      ) : null}
    </FieldRoot>
  );
}
