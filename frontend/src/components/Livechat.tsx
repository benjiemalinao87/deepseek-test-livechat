import React, { useState, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { UserList } from './chat/UserList';
import { MessageList } from './chat/MessageList';
import { MessageInput } from './chat/MessageInput';
import { socket } from '../socket';

export function Livechat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('new_message', (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
      
      // Update users list with new message
      setUsers(prev => {
        const userPhoneNumber = newMsg.direction === 'inbound' ? newMsg.from : newMsg.to;
        const existingUser = prev.find(user => user.phoneNumber === userPhoneNumber);
        
        if (!existingUser) {
          // Create new user if doesn't exist
          const newUser = {
            id: userPhoneNumber,
            name: `User (${userPhoneNumber})`,
            avatar: `https://ui-avatars.com/api/?name=${userPhoneNumber}&background=random`,
            phoneNumber: userPhoneNumber,
            lastMessage: newMsg.message,
            time: new Date().toLocaleTimeString(),
            isNew: newMsg.direction === 'inbound',
            newCount: 1
          };
          return [...prev, newUser];
        } else {
          // Update existing user
          return prev.map(user => 
            user.id === existingUser.id 
              ? {
                  ...user,
                  lastMessage: newMsg.message,
                  time: new Date().toLocaleTimeString(),
                  isNew: newMsg.direction === 'inbound' && user.id !== selectedUser,
                  newCount: user.id !== selectedUser ? (user.newCount || 0) + 1 : 0
                }
              : user
          );
        }
      });
    });

    return () => {
      socket.off('new_message');
    };
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    try {
      const user = users.find(u => u.id === selectedUser);
      if (!user?.phoneNumber) {
        throw new Error('No phone number for selected user');
      }

      const response = await socket.emit('send_message', {
        to: user.phoneNumber,
        message: message.trim()
      });

      setMessage('');
      // Add message to local state immediately for better UX
      const newMessage = {
        id: Date.now().toString(),
        from: 'me',
        to: user.phoneNumber,
        message: message.trim(),
        timestamp: new Date(),
        direction: 'outbound',
        status: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isNew: false, newCount: 0 }
          : user
      )
    );
  };

  const filteredMessages = messages.filter(msg => {
    const currentUser = selectedUser ? users.find(u => u.id === selectedUser) : null;
    return currentUser?.phoneNumber && (msg.from === currentUser.phoneNumber || msg.to === currentUser.phoneNumber);
  });

  return (
    <Box h="100%" display="flex">
      {/* Left Panel */}
      <Box w="300px" borderRight="1px solid" borderColor="gray.200">
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={handleUserSelect}
          messages={messages}
        />
      </Box>

      {/* Right Panel */}
      <Box flex="1" display="flex" flexDirection="column">
        <MessageList messages={filteredMessages} />
        <MessageInput
          message={message}
          onChange={setMessage}
          onSend={handleSendMessage}
        />
      </Box>
    </Box>
  );
}