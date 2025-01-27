import React, { useState, useEffect } from "react";
import { Box, Flex, Input, IconButton, VStack, HStack, Avatar, Text, Button, 
  InputGroup, InputLeftElement, Menu, MenuButton, MenuList, MenuItem, 
  useColorMode, useToast } from "@chakra-ui/react";
import { Search, ChevronDown, UserPlus, GripVertical } from "lucide-react";
import { socketService } from "../../../services/socket";
import { api } from "../../../services/api";
import { Message, ChatUser, Agent } from "../../../types";
import { UserList } from "./UserList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ContactForm } from "./ContactForm";

interface LiveChatProps {
  onClose: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  const { colorMode } = useColorMode();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [assignedAgent, setAssignedAgent] = useState<Agent | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isDark = colorMode === "dark";
  const toast = useToast();

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setConnected(true);
      toast({
        title: "Connected",
        status: "success",
        duration: 3000,
      });
    });

    socket.on('disconnect', () => {
      setConnected(false);
      toast({
        title: "Disconnected",
        status: "warning",
        duration: null,
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Handle incoming messages
  useEffect(() => {
    socketService.onNewMessage((newMsg) => {
      console.log('New message received:', newMsg);
      
      setMessages(prev => [...prev, newMsg]);
      
      if (newMsg.direction === 'inbound') {
        setUsers(prev => {
          const existingUser = prev.find(user => user.phoneNumber === newMsg.from);
          if (!existingUser) {
            const newUser: ChatUser = {
              id: newMsg.from,
              name: `User (${newMsg.from})`,
              avatar: "https://via.placeholder.com/150",
              lastMessage: newMsg.message,
              time: new Date().toLocaleTimeString(),
              phoneNumber: newMsg.from,
              isNew: true,
              newCount: 1
            };
            return [...prev, newUser];
          } else {
            return prev.map(user => 
              user.id === existingUser.id 
                ? {
                    ...user,
                    lastMessage: newMsg.message,
                    time: new Date().toLocaleTimeString(),
                    isNew: true,
                    newCount: (user.newCount || 0) + 1
                  }
                : user
            );
          }
        });
      }
    });
  }, []);

  const handleSendMessage = async () => {
    if (!message || !selectedUser) return;

    try {
      const user = users.find(u => u.id === selectedUser);
      if (!user?.phoneNumber) {
        throw new Error('No phone number for selected user');
      }

      await api.sendMessage(user.phoneNumber, message);
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleAddContact = (newContact: ChatUser) => {
    setUsers(prev => {
      // Check if contact already exists
      const existingContact = prev.find(user => user.phoneNumber === newContact.phoneNumber);
      if (existingContact) {
        toast({
          title: "Contact already exists",
          description: `${newContact.name} is already in your contacts`,
          status: "warning",
          duration: 3000,
        });
        return prev;
      }
      return [...prev, newContact];
    });
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    // Clear new message indicators
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isNew: false, newCount: 0 }
          : user
      )
    );
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.toLowerCase().includes(searchLower) ||
      user.lastMessage.toLowerCase().includes(searchLower)
    );
  });

  const currentUser = selectedUser ? users.find(u => u.id === selectedUser) : null;
  const filteredMessages = messages.filter(msg => 
    currentUser?.phoneNumber && (msg.from === currentUser.phoneNumber || msg.to === currentUser.phoneNumber)
  );

  return (
    <Flex h="100%" bg={isDark ? "gray.800" : "white"}>
      {/* Left Sidebar - User List */}
      <Box w="280px" minW="280px" borderRight="1px" borderColor={isDark ? "gray.700" : "gray.200"}>
        <VStack h="100%" spacing={0}>
          {/* Search and Add Contact */}
          <Box p={4} borderBottom="1px" borderColor={isDark ? "gray.700" : "gray.200"}>
            <Flex justify="space-between" mb={4}>
              <InputGroup>
                <InputLeftElement>
                  <Search size={18} />
                </InputLeftElement>
                <Input 
                  placeholder="Search conversations" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <IconButton
                aria-label="Add Contact"
                icon={<UserPlus size={18} />}
                variant="ghost"
                size="sm"
                ml={2}
                onClick={() => setShowAddContact(true)}
              />
            </Flex>
            
            {/* Agent Selection */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDown />}
                size="sm"
                variant="outline"
                w="100%"
              >
                {assignedAgent ? assignedAgent.name : "All Conversations"}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setAssignedAgent(null)}>
                  All Conversations
                </MenuItem>
                {/* Add agent menu items here */}
              </MenuList>
            </Menu>
          </Box>

          {/* User List */}
          <UserList
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={handleUserSelect}
            isDark={isDark}
          />
        </VStack>
      </Box>

      {/* Right Side - Chat Area */}
      <Flex flex={1} direction="column">
        {/* Header */}
        <Box p={4} borderBottom="1px" borderColor={isDark ? "gray.700" : "gray.200"}>
          {currentUser && (
            <HStack>
              <Avatar size="sm" src={currentUser.avatar} name={currentUser.name} />
              <Box>
                <Text fontWeight="medium">{currentUser.name}</Text>
                <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
                  {currentUser.phoneNumber}
                </Text>
              </Box>
            </HStack>
          )}
        </Box>

        {/* Message List */}
        <MessageList
          messages={filteredMessages}
          currentUser={currentUser}
          isDark={isDark}
        />

        {/* Message Input */}
        <MessageInput
          message={message}
          onChange={setMessage}
          onSend={handleSendMessage}
          isDark={isDark}
          disabled={!selectedUser || !connected}
        />
      </Flex>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onAddContact={handleAddContact}
        isDark={isDark}
      />
    </Flex>
  );
};
