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
      bg={bgColor}
      backgroundImage="url('/images/wallpaper.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
    >
      {/* Active Window */}
      {renderWindow()}

      {/* Dock */}
      <Dock activeWindow={activeWindow} onWindowChange={setActiveWindow} />
    </Box>
  );
}
