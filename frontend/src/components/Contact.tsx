import React, { useState } from "react";
import { VStack, Text, Button, useDisclosure, useToast } from "@chakra-ui/react";
import { ContactForm } from "./chat/ContactForm";
import axios from "axios";

export function Contact() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleAddContact = async (contactData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contacts`, contactData);
      
      toast({
        title: "Contact added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      return response.data;
    } catch (error) {
      toast({
        title: "Error adding contact",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontSize="xl" fontWeight="bold">
        Contact Management
      </Text>
      
      <Button colorScheme="blue" onClick={onOpen}>
        Add New Contact
      </Button>

      <ContactForm
        isOpen={isOpen}
        onClose={onClose}
        onAddContact={handleAddContact}
      />
    </VStack>
  );
}