import React, { useState } from 'react';
import { ChakraProvider, Box, useColorMode, IconButton, Center, Text } from '@chakra-ui/react';
import { Moon, Sun } from 'lucide-react';
import { TestChat } from './components/test/TestChat';
import { Dock } from './components/dock/Dock';
import { DraggableWindow } from './components/window/DraggableWindow';

// Placeholder components for other sections
const PlaceholderView = ({ title }) => (
  <Center h="100%">
    <Text fontSize="2xl">{title} View - Coming Soon</Text>
  </Center>
);

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeWindows, setActiveWindows] = useState(['livechat']);
  const isDark = colorMode === 'dark';

  const handleWindowClose = (windowId) => {
    setActiveWindows(activeWindows.filter(id => id !== windowId));
  };

  const handleDockItemClick = (itemId) => {
    if (!activeWindows.includes(itemId)) {
      setActiveWindows([...activeWindows, itemId]);
    }
  };

  const renderWindowContent = (windowId) => {
    switch (windowId) {
      case 'livechat':
        return <TestChat />;
      case 'contacts':
        return <PlaceholderView title="Contacts" />;
      case 'pipelines':
        return <PlaceholderView title="Pipelines" />;
      case 'calendar':
        return <PlaceholderView title="Calendar" />;
      case 'dialer':
        return <PlaceholderView title="Dialer" />;
      case 'tools':
        return <PlaceholderView title="Tools" />;
      case 'settings':
        return <PlaceholderView title="Settings" />;
      default:
        return <TestChat />;
    }
  };

  const getWindowTitle = (windowId) => {
    const titles = {
      livechat: 'Live Chat',
      contacts: 'Contacts',
      pipelines: 'Pipelines',
      calendar: 'Calendar',
      dialer: 'Dialer',
      tools: 'Tools',
      settings: 'Settings'
    };
    return titles[windowId] || 'Window';
  };

  // Calculate default positions for windows to be staggered
  const getDefaultPosition = (index) => ({
    x: 50 + (index * 30),
    y: 50 + (index * 30)
  });

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        position="relative"
        overflow="hidden"
        bgImage="url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        {/* Semi-transparent overlay for better readability */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={isDark ? 'blackAlpha.400' : 'whiteAlpha.200'}
          backdropFilter="blur(2px)"
        />
        
        {/* Content */}
        <Box position="relative" zIndex="1">
          <Box position="absolute" top={4} right={4}>
            <IconButton
              icon={isDark ? <Sun /> : <Moon />}
              onClick={toggleColorMode}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.300' }}
            />
          </Box>
          
          {/* Windows */}
          {activeWindows.map((windowId, index) => (
            <DraggableWindow
              key={windowId}
              title={getWindowTitle(windowId)}
              onClose={() => handleWindowClose(windowId)}
              defaultPosition={getDefaultPosition(index)}
            >
              {renderWindowContent(windowId)}
            </DraggableWindow>
          ))}

          {/* Dock */}
          <Dock onItemClick={handleDockItemClick} activeItem={activeWindows[activeWindows.length - 1]} />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
