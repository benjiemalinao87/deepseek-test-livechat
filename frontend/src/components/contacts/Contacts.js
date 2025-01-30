import React, { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  IconButton,
  Select,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import { Search, Filter, Users, Calendar, List } from 'lucide-react';
import { ContactCard } from './ContactCard';
import { AddContactModal } from './AddContactModal';
import useContactStore from '../../services/contactState';

/**
 * Contacts Component
 * 
 * Main contacts management interface with:
 * - Contact list display
 * - Search and filtering
 * - Quick message functionality
 * - LiveChat integration
 * 
 * @param {Object} props
 * @param {Function} props.onOpenLiveChat - Callback to open LiveChat window
 */
export const Contacts = ({ onOpenLiveChat }) => {
  // Use shared contact state
  const { 
    contacts,
    currentFilter,
    setFilter,
    addContact,
    getFilteredContacts,
  } = useContactStore();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    leadSource: '',
    market: '',
    product: ''
  });

  // Color modes
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  /**
   * Filter contacts based on search query, tags, and conversation status
   */
  const filteredContacts = getFilteredContacts().filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery);
    const matchesTag = selectedTag === 'All Tags' || 
                      (contact.labels && contact.labels.includes(selectedTag));
    
    return matchesSearch && matchesTag;
  });

  /**
   * Handle opening LiveChat for a contact
   */
  const handleOpenLiveChat = (contact) => {
    if (onOpenLiveChat) {
      onOpenLiveChat(contact);
    }
  };

  /**
   * Handle adding a new contact
   */
  const handleAddContact = (contactData) => {
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
      status: 'Active',
      conversationStatus: 'Open'
    };
    addContact(contact);
    setIsAddContactModalOpen(false);
    setNewContact({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      leadSource: '',
      market: '',
      product: ''
    });
  };

  /**
   * Handle closing the add contact modal
   */
  const handleCloseModal = () => {
    setIsAddContactModalOpen(false);
    setNewContact({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      leadSource: '',
      market: '',
      product: ''
    });
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        {/* Search and Filter Bar */}
        <HStack spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search size={18} />
            </InputLeftElement>
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={inputBg}
              borderColor={borderColor}
            />
          </InputGroup>

          <Select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            w="200px"
          >
            <option>All Tags</option>
            <option>VIP</option>
            <option>Enterprise</option>
            <option>Technical</option>
          </Select>

          <Select
            value={currentFilter}
            onChange={(e) => setFilter(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            w="200px"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
            <option value="Spam">Spam</option>
            <option value="Unsubscribe">Unsubscribe</option>
          </Select>

          <IconButton
            icon={<Filter size={18} />}
            aria-label="More filters"
            variant="ghost"
          />
        </HStack>

        {/* View Options and Add Contact */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <IconButton
              icon={<Users size={18} />}
              aria-label="Grid view"
              variant="ghost"
              colorScheme="blue"
            />
            <IconButton
              icon={<Calendar size={18} />}
              aria-label="Calendar view"
              variant="ghost"
            />
            <IconButton
              icon={<List size={18} />}
              aria-label="List view"
              variant="ghost"
            />
          </HStack>

          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => setIsAddContactModalOpen(true)}
          >
            Add Contact
          </Button>
        </HStack>

        {/* Contact List */}
        <VStack spacing={3} align="stretch">
          {filteredContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onOpenLiveChat={handleOpenLiveChat}
            />
          ))}
        </VStack>
      </VStack>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={handleCloseModal}
        newContact={newContact}
        onNewContactChange={setNewContact}
        onAddContact={handleAddContact}
      />
    </Box>
  );
};
