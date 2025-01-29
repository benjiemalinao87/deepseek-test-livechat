import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Select,
  Box,
  Text,
  useColorModeValue,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
} from '@chakra-ui/react';
import { CirclePicker } from 'react-color';
import { Plus, Tag, Calendar, Briefcase } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddContactModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#1a73e8');
  const [labelName, setLabelName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const labelPopover = useDisclosure();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    leadSource: '',
    market: '',
    product: '',
    labels: [],
    opportunity: {
      name: '',
      contact: ''
    },
    appointment: {
      name: '',
      date: null,
      time: ''
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddLabel = () => {
    if (labelName) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, { name: labelName, color: selectedColor }]
      }));
      setLabelName('');
      labelPopover.onClose();
    }
  };

  const handleSubmit = () => {
    // Validate required field
    if (!formData.phone) {
      alert('Phone number is required');
      return;
    }
    
    // TODO: Handle form submission
    console.log('Form data:', formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={bgColor} borderRadius="xl" shadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
          New Contact
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Tabs onChange={setActiveTab} variant="enclosed">
            <TabList mb={4}>
              <Tab>Basic Info</Tab>
              <Tab>Additional</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <HStack w="100%" spacing={4}>
                    <FormControl>
                      <FormLabel>First Name</FormLabel>
                      <Input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Last Name</FormLabel>
                      <Input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                      />
                    </FormControl>
                  </HStack>
                  <FormControl isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Lead Source</FormLabel>
                    <Select 
                      name="leadSource"
                      value={formData.leadSource}
                      onChange={handleInputChange}
                      placeholder="Select lead source"
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social">Social Media</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Market</FormLabel>
                    <Select 
                      name="market"
                      value={formData.market}
                      onChange={handleInputChange}
                      placeholder="Select market"
                    >
                      <option value="enterprise">Enterprise</option>
                      <option value="smb">SMB</option>
                      <option value="consumer">Consumer</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Product</FormLabel>
                    <Select 
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      placeholder="Select product"
                    >
                      <option value="product1">Product 1</option>
                      <option value="product2">Product 2</option>
                      <option value="product3">Product 3</option>
                    </Select>
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box mt={6} borderTopWidth="1px" borderColor={borderColor} pt={4}>
            <HStack spacing={4}>
              <Popover
                isOpen={labelPopover.isOpen}
                onClose={labelPopover.onClose}
              >
                <PopoverTrigger>
                  <IconButton
                    icon={<Tag size={18} />}
                    variant="ghost"
                    aria-label="Add label"
                    onClick={labelPopover.onOpen}
                  />
                </PopoverTrigger>
                <PopoverContent p={4}>
                  <PopoverBody>
                    <VStack spacing={3}>
                      <Input
                        placeholder="Label name"
                        value={labelName}
                        onChange={(e) => setLabelName(e.target.value)}
                      />
                      <CirclePicker
                        color={selectedColor}
                        onChangeComplete={(color) => setSelectedColor(color.hex)}
                      />
                      <Button size="sm" onClick={handleAddLabel}>
                        Add Label
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <IconButton
                icon={<Briefcase size={18} />}
                variant="ghost"
                aria-label="Add opportunity"
                onClick={() => setActiveTab(2)}
              />

              <IconButton
                icon={<Calendar size={18} />}
                variant="ghost"
                aria-label="Add appointment"
                onClick={() => setActiveTab(3)}
              />
            </HStack>

            {/* Display Labels */}
            <Flex wrap="wrap" gap={2} mt={4}>
              {formData.labels.map((label, index) => (
                <Badge
                  key={index}
                  px={2}
                  py={1}
                  borderRadius="full"
                  bg={label.color}
                  color="white"
                >
                  {label.name}
                </Badge>
              ))}
            </Flex>
          </Box>

          <Button
            mt={6}
            colorScheme="blue"
            w="100%"
            onClick={handleSubmit}
          >
            Add Contact
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddContactModal;
