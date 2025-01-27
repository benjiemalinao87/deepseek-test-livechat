import React, { useState, useCallback } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
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
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    console.log('Submit button clicked');

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      setIsSubmitting(true);
      
      if (typeof onAddContact === 'function') {
        await onAddContact(formData);
        console.log('Contact added successfully');
        
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
        });
      } else {
        console.error('onAddContact is not a function');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onAddContact]);

  const handleInputChange = useCallback((e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={isDark ? "gray.800" : "white"}>
        <form onSubmit={handleSubmit}>
          <ModalHeader color={isDark ? "white" : "gray.800"}>Add New Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel color={isDark ? "white" : "gray.800"}>First Name</FormLabel>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange(e, 'firstName')}
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
                  onChange={(e) => handleInputChange(e, 'lastName')}
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
                  onChange={(e) => handleInputChange(e, 'phoneNumber')}
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
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onClose} 
              isDisabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Adding..."
            >
              Add Contact
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
