'use client';

import { Input, type InputProps } from '@chakra-ui/react';
import { useCallback, type ChangeEventHandler } from 'react';

type BigIntInputProps = Omit<InputProps, 'value' | 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
};

const BIGINT_PATTERN = /^\+?\d*$/;

function sanitizeValue(value: string): string {
  const trimmed = value.replace(/\s+/g, '').replace(/,/g, '');

  if (trimmed === '') return '';

  if (trimmed.startsWith('+')) {
    const digits = trimmed
      .slice(1)
      .replace(/\D/g, '');
    return digits === '' ? '+' : `+${digits}`;
  }

  return trimmed.replace(/\D/g, '');
}

export function BigIntInput({
  value = '',
  onChange,
  ...rest
}: BigIntInputProps) {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextValue = event.target.value;
      if (nextValue === '' || BIGINT_PATTERN.test(nextValue)) {
        onChange?.(nextValue);
        return;
      }

      const sanitized = sanitizeValue(nextValue);
      onChange?.(sanitized);
    },
    [onChange],
  );

  return (
    <Input
      {...rest}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      spellCheck="false"
      autoComplete="off"
      value={value}
      onChange={handleChange}
    />
  );
}
