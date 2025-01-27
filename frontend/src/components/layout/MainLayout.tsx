import React, { useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Dock } from '../Dock';
import { LiveChatWindow } from '../windows/LiveChatWindow';
import { ContactWindow } from '../windows/ContactWindow';
import { AutomationWindow } from '../windows/AutomationWindow';
import { ToolsWindow } from '../windows/ToolsWindow';
import { SettingsWindow } from '../windows/SettingsWindow';

export function MainLayout() {
  const [activeWindow, setActiveWindow] = useState<string | null>('livechat');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const renderWindow = () => {
    switch (activeWindow) {
      case 'livechat':
        return <LiveChatWindow />;
      case 'contact':
        return <ContactWindow />;
      case 'automation':
        return <AutomationWindow />;
      case 'tools':
        return <ToolsWindow />;
      case 'settings':
        return <SettingsWindow />;
      default:
        return null;
    }
  };

  return (
    <Box
      minH="100vh"
      backgroundImage="url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.5)'),
        backdropFilter: 'blur(1px)',
        zIndex: 0
      }}
    >
      {/* Active Window */}
      <Box position="relative" zIndex={1}>
        {renderWindow()}
      </Box>

      {/* Dock */}
      <Box position="relative" zIndex={1}>
        <Dock activeWindow={activeWindow} onWindowChange={setActiveWindow} />
      </Box>
    </Box>
  );
}
