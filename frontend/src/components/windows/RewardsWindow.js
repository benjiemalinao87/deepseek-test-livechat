import React from 'react';
import { DraggableWindow } from '../window/DraggableWindow';
import { Box } from '@chakra-ui/react';
import { RewardsContent } from '../rewards/RewardsContent';

export function RewardsWindow({ onClose }) {
  return (
    <DraggableWindow
      title="Rewards"
      onClose={onClose}
      defaultSize={{ width: 1000, height: 700 }}
      minSize={{ width: 800, height: 500 }}
    >
      <Box h="100%" overflowY="auto">
        <RewardsContent />
      </Box>
    </DraggableWindow>
  );
}
