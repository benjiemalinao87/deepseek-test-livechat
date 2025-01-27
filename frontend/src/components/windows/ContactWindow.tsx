import React, { useCallback, useState, useEffect } from 'react';
import { DockWindow } from '../dock/DockWindow';
import { Box, Button, VStack, useDisclosure, useToast, Text, Input } from '@chakra-ui/react';
import { ContactForm } from '../chat/ContactForm';

export function ContactWindow() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [testPhone, setTestPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const handleAddContact = useCallback(async (formData) => {
    try {
      const newContact = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };

      // Add to state and localStorage
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));

      toast({
        title: "Contact added successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to your contacts`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error adding contact",
        description: "Failed to save contact",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [contacts, toast, onClose]);

  const handleTestSMS = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://cc1.automate8.com/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testPhone,
          message: 'Test SMS from LiveChat App'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      toast({
        title: "SMS sent",
        description: `Test message sent to ${testPhone}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error sending SMS",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DockWindow title="Contacts">
      <VStack spacing={4} align="stretch" p={4}>
        <Button colorScheme="blue" onClick={onOpen}>
          Add Contact
        </Button>

        {/* SMS Test Section */}
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text mb={2} fontWeight="bold">Test SMS</Text>
          <Input
            placeholder="Enter phone number"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            mb={2}
          />
          <Button
            colorScheme="green"
            onClick={handleTestSMS}
            isLoading={isLoading}
            width="100%"
          >
            Send Test SMS
          </Button>
        </Box>

        {/* Contact List */}
        {contacts.map(contact => (
          <Box key={contact.id} p={3} borderWidth={1} borderRadius="md">
            <Text>{contact.firstName} {contact.lastName}</Text>
            <Text color="gray.600">{contact.phoneNumber}</Text>
          </Box>
        ))}

        <ContactForm
          isOpen={isOpen}
          onClose={onClose}
          onAddContact={handleAddContact}
        />
      </VStack>
    </DockWindow>
  );
}
