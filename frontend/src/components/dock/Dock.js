import React, { useState } from 'react';
import { HStack, Box, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { MessageCircle, Users, GitBranch, Calendar, Phone, Wrench, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const DockIcon = ({ icon: Icon, label, onClick, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = useColorModeValue('whiteAlpha.900', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Tooltip label={label} placement="top" hasArrow>
      <Box>
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'inline-block' }}
        >
          <IconButton
            icon={<Icon size={24} />}
            aria-label={label}
            variant="ghost"
            size="lg"
            rounded="xl"
            bg={isActive ? bgColor : 'transparent'}
            border={isActive ? '1px solid' : 'none'}
            borderColor={borderColor}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            _hover={{
              bg: bgColor,
              transform: 'translateY(-5px)',
              transition: 'all 0.2s',
            }}
            sx={{
              '&:hover + .dock-icon': {
                transform: 'scale(1.1)',
              },
            }}
          />
        </motion.div>
      </Box>
    </Tooltip>
  );
};

export const Dock = ({ onItemClick, activeItem }) => {
  const bgColor = useColorModeValue('whiteAlpha.800', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const dockItems = [
    { id: 'livechat', icon: MessageCircle, label: 'Livechat' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'pipelines', icon: GitBranch, label: 'Pipelines' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'dialer', icon: Phone, label: 'Dialer' },
    { id: 'tools', icon: Wrench, label: 'Tools' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <HStack
          spacing={2}
          p={3}
          bg={bgColor}
          borderRadius="2xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="xl"
          _hover={{
            boxShadow: "2xl",
          }}
        >
          {dockItems.map((item) => (
            <DockIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.id}
              onClick={() => onItemClick(item.id)}
            />
          ))}
        </HStack>
      </motion.div>
    </Box>
  );
};
