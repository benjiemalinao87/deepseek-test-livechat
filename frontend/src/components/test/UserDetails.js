import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Phone, Mail } from 'lucide-react';

export const UserDetails = ({ selectedContact }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tabBg = useColorModeValue('purple.50', 'whiteAlpha.50');

  if (!selectedContact) {
    return (
      <Box p={4} bg={bg} h="100%">
        <Text color={mutedTextColor} fontSize="sm">Select a contact to view details</Text>
      </Box>
    );
  }

  return (
    <Box bg={bg} h="100%" overflowY="auto">
      {/* Profile Section */}
      <VStack spacing={3} p={4} align="center">
        <Avatar
          size="lg"
          name={selectedContact.name}
          bg="purple.500"
          color="white"
        />
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            {selectedContact.name}
          </Text>
          <HStack spacing={2} mt={1} justify="center">
            <Badge colorScheme="green" fontSize="sm">CUSTOMER</Badge>
            <Badge colorScheme="blue" fontSize="sm">OPEN</Badge>
          </HStack>
        </Box>
      </VStack>

      {/* Tabs */}
      <Tabs isFitted variant="soft-rounded" colorScheme="purple">
        <TabList px={2} bg={tabBg}>
          <Tab fontSize="sm" py={2}>Details</Tab>
          <Tab fontSize="sm" py={2}>Activity</Tab>
          <Tab fontSize="sm" py={2}>Notes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={4}>
            {/* Contact Information */}
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>
                  Contact Information
                </Text>
                <VStack spacing={2} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={Phone} size={16} color={mutedTextColor} />
                    <Text fontSize="sm" color={textColor}>
                      {selectedContact.phone}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={Mail} size={16} color={mutedTextColor} />
                    <Text fontSize="sm" color={mutedTextColor}>
                      No email provided
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Chat Statistics */}
              <Box>
                <Text fontSize="sm" fontWeight="medium" color={mutedTextColor} mb={2}>
                  Chat Statistics
                </Text>
                <HStack spacing={6} justify="space-between">
                  <VStack spacing={0}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      23
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor}>
                      Messages
                    </Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      5m
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor}>
                      Response
                    </Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      2h
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor}>
                      Active
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <Text fontSize="sm" color={mutedTextColor}>Activity history will be shown here</Text>
          </TabPanel>

          <TabPanel>
            <Text fontSize="sm" color={mutedTextColor}>Notes will be shown here</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
