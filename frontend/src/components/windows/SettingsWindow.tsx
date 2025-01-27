import React from 'react';
import { DockWindow } from '../dock/DockWindow';
import { Box, Text } from '@chakra-ui/react';

export function SettingsWindow() {
  return (
    <DockWindow title="Settings">
      <Box p={4}>
        <Text>Settings Panel Coming Soon</Text>
      </Box>
    </DockWindow>
  );
}
