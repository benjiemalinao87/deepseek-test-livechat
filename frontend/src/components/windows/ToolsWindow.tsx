import React from 'react';
import { DockWindow } from '../dock/DockWindow';
import { Box, Text } from '@chakra-ui/react';

export function ToolsWindow() {
  return (
    <DockWindow title="Tools">
      <Box p={4}>
        <Text>Tools and Utilities Coming Soon</Text>
      </Box>
    </DockWindow>
  );
}
