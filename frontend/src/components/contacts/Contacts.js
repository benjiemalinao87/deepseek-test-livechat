import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  useColorModeValue,
  IconButton,
  Tooltip,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { Search, Plus, Filter, Grid, List, UserPlus } from 'lucide-react';
import { ContactCard } from './ContactCard';
import { demoContacts } from './ContactData';
import AddContactModal from './AddContactModal';
import { useDisclosure } from '@chakra-ui/react';

export const Contacts = () => {
  const [contacts] = useState(demoContacts);
  const [viewMode, setViewMode] = useState('grid');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box h="100%" bg={bgColor}>
      {/* Search and Filter Bar */}
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={4} mb={4}>
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <Search size={16} color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Search contacts..." />
          </InputGroup>

          <Select size="sm" placeholder="All Tags" maxW="150px">
            <option value="vip">VIP</option>
            <option value="enterprise">Enterprise</option>
            <option value="technical">Technical</option>
          </Select>

          <Select size="sm" placeholder="All Status" maxW="150px">
            <option value="active">Active</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
          </Select>

          <IconButton
            icon={<Filter size={16} />}
            aria-label="More filters"
            variant="ghost"
            size="sm"
          />

          <Spacer />

          <Tooltip label="Add New Contact">
            <IconButton
              icon={<UserPlus size={16} />}
              aria-label="Add Contact"
              colorScheme="blue"
              size="sm"
              onClick={onOpen}
            />
          </Tooltip>

          {/* View Mode Toggle */}
          <HStack spacing={1}>
            <IconButton
              size="sm"
              icon={<Grid size={16} />}
              aria-label="Grid view"
              variant={viewMode === 'grid' ? 'solid' : 'ghost'}
              colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
              onClick={() => setViewMode('grid')}
            />
            <IconButton
              size="sm"
              icon={<List size={16} />}
              aria-label="List view"
              variant={viewMode === 'list' ? 'solid' : 'ghost'}
              colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
              onClick={() => setViewMode('list')}
            />
          </HStack>
        </HStack>
      </Box>

      {/* Contact List */}
      <Box 
        p={4} 
        overflowY="auto" 
        h="calc(100% - 85px)"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.2)',
          },
        }}
      >
        <VStack spacing={3} align="stretch">
          {contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </VStack>
      </Box>

      <AddContactModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
