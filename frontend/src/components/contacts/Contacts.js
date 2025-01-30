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
  useToast,
} from '@chakra-ui/react';
import { Search, Plus, Filter, Grid, List, UserPlus } from 'lucide-react';
import { ContactCard } from './ContactCard';
import { demoContacts } from './ContactData';
import { AddContactModal } from './AddContactModal';
import { useDisclosure } from '@chakra-ui/react';

export const Contacts = () => {
  const [contacts, setContacts] = useState(demoContacts);
  const [viewMode, setViewMode] = useState('grid');
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    leadSource: '',
    market: '',
    product: ''
  });
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleAddContact = (contactData) => {
    try {
      const contact = {
        id: contacts.length + 1,
        name: `${contactData.firstName} ${contactData.lastName}`.trim(),
        phone: contactData.phone,
        email: contactData.email,
        leadSource: contactData.leadSource,
        market: contactData.market,
        product: contactData.product,
        labels: contactData.labels || [],
        time: 'Just now',
        status: 'Open'
      };
      
      setContacts(prev => [...prev, contact]);
      onClose();
      setNewContact({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        leadSource: '',
        market: '',
        product: ''
      });

      toast({
        title: 'Contact Added',
        description: `${contact.name} has been added to your contacts`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to add contact. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCreateOpportunity = (opportunity) => {
    try {
      // Add opportunity label to contact
      setContacts(prev => prev.map(contact => 
        contact.phone === opportunity.contactPhone 
          ? { ...contact, labels: [...(contact.labels || []), 'opportunity'] }
          : contact
      ));

      toast({
        title: 'Opportunity Created',
        description: `New opportunity created for ${opportunity.contactName}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to create opportunity. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleScheduleAppointment = (appointment) => {
    try {
      // Add appointment label to contact
      setContacts(prev => prev.map(contact => 
        contact.phone === appointment.contactPhone 
          ? { ...contact, labels: [...(contact.labels || []), 'appointment'] }
          : contact
      ));

      toast({
        title: 'Appointment Scheduled',
        description: `Appointment scheduled with ${appointment.contactName}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

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

      <AddContactModal 
        isOpen={isOpen} 
        onClose={onClose}
        newContact={newContact}
        onNewContactChange={setNewContact}
        onAddContact={handleAddContact}
        onCreateOpportunity={handleCreateOpportunity}
        onScheduleAppointment={handleScheduleAppointment}
      />
    </Box>
  );
};
