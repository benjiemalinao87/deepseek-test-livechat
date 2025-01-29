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
  Tooltip
} from '@chakra-ui/react';
import { CirclePicker } from 'react-color';
import { Tag, CalendarDays, Briefcase, Gift, Clock, Users, Plus } from 'lucide-react';
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
    if (!formData.phone) {
      alert('Phone number is required');
      return;
    }
    console.log('Form data:', formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="2xl" shadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} py={4}>
          <Text fontSize="lg" fontWeight="medium">New Contact</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Tabs onChange={setActiveTab} variant="soft-rounded" colorScheme="gray">
            <TabList mb={4}>
              <Tab>Basic Info</Tab>
              <Tab>Additional</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <HStack w="100%" spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm">First Name</FormLabel>
                      <Input 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        size="md"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Last Name</FormLabel>
                      <Input 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        size="md"
                      />
                    </FormControl>
                  </HStack>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Phone</FormLabel>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      size="md"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Email</FormLabel>
                    <Input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      size="md"
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Lead Source</FormLabel>
                    <Select 
                      name="leadSource"
                      value={formData.leadSource}
                      onChange={handleInputChange}
                      placeholder="Select lead source"
                      size="md"
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social">Social Media</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Market</FormLabel>
                    <Select 
                      name="market"
                      value={formData.market}
                      onChange={handleInputChange}
                      placeholder="Select market"
                      size="md"
                    >
                      <option value="enterprise">Enterprise</option>
                      <option value="smb">SMB</option>
                      <option value="consumer">Consumer</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Product</FormLabel>
                    <Select 
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      placeholder="Select product"
                      size="md"
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
            <HStack spacing={2}>
              <Tooltip label="Add Label" hasArrow>
                <IconButton
                  icon={<Tag size={16} />}
                  variant="ghost"
                  size="sm"
                  onClick={labelPopover.onOpen}
                />
              </Tooltip>

              <Tooltip label="Add Opportunity" hasArrow>
                <IconButton
                  icon={<Briefcase size={16} />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(2)}
                />
              </Tooltip>

              <Tooltip label="Schedule Appointment" hasArrow>
                <IconButton
                  icon={<CalendarDays size={16} />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(3)}
                />
              </Tooltip>
            </HStack>

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

            <Popover
              isOpen={labelPopover.isOpen}
              onClose={labelPopover.onClose}
              placement="bottom-start"
            >
              <PopoverContent p={4} w="250px">
                <PopoverBody>
                  <VStack spacing={3}>
                    <Input
                      placeholder="Label name"
                      value={labelName}
                      onChange={(e) => setLabelName(e.target.value)}
                      size="sm"
                    />
                    <CirclePicker
                      color={selectedColor}
                      onChangeComplete={(color) => setSelectedColor(color.hex)}
                      width="100%"
                    />
                    <Button size="sm" width="100%" onClick={handleAddLabel}>
                      Add Label
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>

          <Button
            mt={6}
            colorScheme="blue"
            w="100%"
            onClick={handleSubmit}
            size="md"
            fontWeight="medium"
          >
            Add Contact
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddContactModal;
