import React, { useState } from 'react';
import { DraggableWindow } from '../window/DraggableWindow';
import {
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  Select,
  FormControl,
  FormLabel,
  Divider,
  useColorMode,
  useColorModeValue,
  Grid,
  GridItem,
  Button,
} from '@chakra-ui/react';

export function SettingsWindow({ onClose }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  
  // Colors
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const categories = [
    'General',
    'Appearance',
    'Notifications',
    'Language',
    'Privacy',
    'Advanced'
  ];

  const [selectedCategory, setSelectedCategory] = useState('General');

  return (
    <DraggableWindow
      title="Settings"
      onClose={onClose}
      defaultSize={{ width: 900, height: 600 }}
      minSize={{ width: 600, height: 400 }}
    >
      <Grid
        templateColumns="200px 1fr"
        h="100%"
        bg={bg}
      >
        {/* Left Sidebar */}
        <GridItem borderRight="1px" borderColor={borderColor} p={4}>
          <VStack spacing={2} align="stretch">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'solid' : 'ghost'}
                colorScheme={selectedCategory === category ? 'purple' : 'gray'}
                justifyContent="flex-start"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </VStack>
        </GridItem>

        {/* Main Content */}
        <GridItem p={6} overflowY="auto">
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                {selectedCategory}
              </Text>
              
              {selectedCategory === 'General' && (
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel htmlFor="dark-mode" mb={0}>
                      Dark Mode
                    </FormLabel>
                    <Switch
                      id="dark-mode"
                      isChecked={colorMode === 'dark'}
                      onChange={toggleColorMode}
                    />
                  </FormControl>
                  <Divider />
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel htmlFor="notifications" mb={0}>
                      Enable Notifications
                    </FormLabel>
                    <Switch
                      id="notifications"
                      isChecked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                  </FormControl>
                  <Divider />
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel htmlFor="sound" mb={0}>
                      Sound Effects
                    </FormLabel>
                    <Switch
                      id="sound"
                      isChecked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                    />
                  </FormControl>
                  <Divider />
                  <FormControl>
                    <FormLabel htmlFor="language">Language</FormLabel>
                    <Select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </Select>
                  </FormControl>
                </VStack>
              )}

              {selectedCategory === 'Appearance' && (
                <Text color={mutedColor}>Appearance settings coming soon...</Text>
              )}

              {selectedCategory === 'Notifications' && (
                <Text color={mutedColor}>Notification settings coming soon...</Text>
              )}

              {selectedCategory === 'Language' && (
                <Text color={mutedColor}>Language settings coming soon...</Text>
              )}

              {selectedCategory === 'Privacy' && (
                <Text color={mutedColor}>Privacy settings coming soon...</Text>
              )}

              {selectedCategory === 'Advanced' && (
                <Text color={mutedColor}>Advanced settings coming soon...</Text>
              )}
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </DraggableWindow>
  );
}
