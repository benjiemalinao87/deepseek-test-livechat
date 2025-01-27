import React, { useCallback } from 'react';
import { DockWindow } from '../dock/DockWindow';
import { Box, Button, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { ContactForm } from '../chat/ContactForm';
import axios from 'axios';

export function ContactWindow() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleAddContact = useCallback(async (formData) => {
    try {
      console.log('Adding contact:', formData); // Debug log
      
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };

      const apiUrl = 'https://cc1.automate8.com';
      console.log('API URL:', apiUrl); // Debug log

      const response = await axios.post(`${apiUrl}/api/contacts`, contactData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('API Response:', response.data); // Debug log

      toast({
        title: "Contact added successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to your contacts`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      return response.data;
    } catch (error) {
      console.error('Error details:', error.response || error); // Debug log
      
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      console.error('Error adding contact:', errorMessage); // Debug log
      
      toast({
        title: "Error adding contact",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  }, [toast, onClose]);

  return (
    <DockWindow title="Contacts">
      <VStack spacing={4} align="stretch" p={4}>
        <Button colorScheme="blue" onClick={onOpen}>
          Add Contact
        </Button>
        <ContactForm
          isOpen={isOpen}
          onClose={onClose}
          onAddContact={handleAddContact}
        />
      </VStack>
    </DockWindow>
  );
}
