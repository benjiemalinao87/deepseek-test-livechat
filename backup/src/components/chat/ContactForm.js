import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

export const ContactForm = ({
  isOpen,
  onClose,
  onAddContact,
  isDark,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format. Use E.164 format (e.g., +1234567890)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newContact = {
      id: formData.phoneNumber,
      name: `${formData.firstName} ${formData.lastName}`,
      phoneNumber: formData.phoneNumber,
      avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
      lastMessage: "",
      time: new Date().toLocaleTimeString(),
    };

    onAddContact(newContact);
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your contacts`,
      status: "success",
      duration: 3000,
    });
    
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={isDark ? "gray.800" : "white"}>
        <ModalHeader color={isDark ? "white" : "gray.800"}>Add New Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel color={isDark ? "white" : "gray.800"}>First Name</FormLabel>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                bg={isDark ? "gray.700" : "white"}
                color={isDark ? "white" : "gray.800"}
                borderColor={isDark ? "gray.600" : "gray.200"}
              />
              <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel color={isDark ? "white" : "gray.800"}>Last Name</FormLabel>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                bg={isDark ? "gray.700" : "white"}
                color={isDark ? "white" : "gray.800"}
                borderColor={isDark ? "gray.600" : "gray.200"}
              />
              <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel color={isDark ? "white" : "gray.800"}>Phone Number</FormLabel>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number (E.164 format)"
                bg={isDark ? "gray.700" : "white"}
                color={isDark ? "white" : "gray.800"}
                borderColor={isDark ? "gray.600" : "gray.200"}
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add Contact
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
