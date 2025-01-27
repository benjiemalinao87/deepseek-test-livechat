import React from 'react';
import { Box, VStack, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { DockWindow } from '../dock/DockWindow';

export const AboutWindow = () => {
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <DockWindow title="About">
      <Box p={6}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="bold">
            LiveChat App
          </Text>
          
          <Text color={textColor}>
            A modern chat application that enables real-time communication through SMS integration.
            Built with React, Socket.IO, and Twilio.
          </Text>

          <Text color={textColor}>
            Features:
          </Text>
          <VStack spacing={2} align="stretch" pl={4}>
            <Text>• Real-time messaging</Text>
            <Text>• SMS integration</Text>
            <Text>• Dark/Light mode</Text>
            <Text>• Draggable windows</Text>
          </VStack>

          <Text color={textColor} pt={4}>
            Version: 1.0.0
          </Text>
        </VStack>
      </Box>
    </DockWindow>
  );
};
