import React from 'react';
import { Box, VStack, Text, Switch, FormControl, FormLabel, useColorMode } from '@chakra-ui/react';
import { DockWindow } from '../dock/DockWindow';

export const SettingsWindow = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <DockWindow title="Settings">
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="dark-mode" mb="0">
              Dark Mode
            </FormLabel>
            <Switch
              id="dark-mode"
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="notifications" mb="0">
              Notifications
            </FormLabel>
            <Switch id="notifications" defaultChecked />
          </FormControl>
          
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="sound" mb="0">
              Sound
            </FormLabel>
            <Switch id="sound" defaultChecked />
          </FormControl>
        </VStack>
      </Box>
    </DockWindow>
  );
};
