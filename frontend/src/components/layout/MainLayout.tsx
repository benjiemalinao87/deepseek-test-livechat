import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Dock } from '../Dock';
import { LiveChatWindow } from '../windows/LiveChatWindow';
import { ContactWindow } from '../windows/ContactWindow';
import { AutomationWindow } from '../windows/AutomationWindow';
import { ToolsWindow } from '../windows/ToolsWindow';
import { SettingsWindow } from '../windows/SettingsWindow';

export function MainLayout() {
  const [activeWindow, setActiveWindow] = useState<string | null>('livechat');

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
      width="100%"
      position="relative"
      zIndex={1}
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
