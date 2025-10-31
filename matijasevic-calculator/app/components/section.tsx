'use client';

import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type SectionContainerProps = {
  children: ReactNode;
};

export function SectionContainer({ children }: SectionContainerProps) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      padding={{ base: 4, md: 6 }}
      boxShadow="xs"
      bg="white"
    >
      {children}
    </Box>
  );
}

type SectionHeaderProps = {
  title: string;
  description: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <Stack gap={3} mb={5}>
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.600">
        {description}
      </Text>
    </Stack>
  );
}
