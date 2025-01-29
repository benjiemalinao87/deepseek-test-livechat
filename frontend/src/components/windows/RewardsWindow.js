import React from 'react';
import { Box } from '@chakra-ui/react';
import { RewardsContent } from '../rewards/RewardsContent';

export const RewardsWindow = () => {
  return (
    <Box p={4} h="full" overflowY="auto">
      <RewardsContent />
    </Box>
  );
};