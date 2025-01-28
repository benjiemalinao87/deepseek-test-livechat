import React, { useState } from 'react';
import { Box, HStack, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { X, Minus, Square } from 'lucide-react';
import Draggable from 'react-draggable';

export const DraggableWindow = ({ title, onClose, children, defaultPosition = { x: 50, y: 50 } }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Color mode hooks
  const bgColor = useColorModeValue('whiteAlpha.800', 'blackAlpha.700');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100');
  const headerBg = useColorModeValue('whiteAlpha.500', 'blackAlpha.400');
  const scrollbarThumbColor = useColorModeValue('gray.400', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  if (isMinimized) return null;

  return (
    <Draggable
      handle=".window-handle"
      defaultPosition={defaultPosition}
      bounds={{
        left: 0,
        top: 0,
        right: window.innerWidth - 800,
        bottom: window.innerHeight - 700
      }}
    >
      <Box
        position="absolute"
        width="800px"
        height="600px"
        bg={bgColor}
        borderRadius="lg"
        boxShadow="xl"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: scrollbarThumbColor,
            borderRadius: '24px',
          },
        }}
      >
        {/* Window Title Bar */}
        <HStack
          className="window-handle"
          px={3}
          py={2}
          bg={headerBg}
          cursor="grab"
          justify="space-between"
          userSelect="none"
          borderBottom="1px solid"
          borderColor={borderColor}
          _active={{ cursor: "grabbing" }}
        >
          <HStack spacing={2}>
            <IconButton
              size="xs"
              icon={<X size={12} />}
              isRound
              aria-label="Close"
              bg="red.400"
              _hover={{ bg: 'red.500' }}
              onClick={onClose}
            />
            <IconButton
              size="xs"
              icon={<Minus size={12} />}
              isRound
              aria-label="Minimize"
              bg="yellow.400"
              _hover={{ bg: 'yellow.500' }}
              onClick={() => setIsMinimized(true)}
            />
            <IconButton
              size="xs"
              icon={<Square size={12} />}
              isRound
              aria-label="Maximize"
              bg="green.400"
              _hover={{ bg: 'green.500' }}
            />
          </HStack>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {title}
          </Text>
          <Box w={70} /> {/* Spacer to center the title */}
        </HStack>

        {/* Window Content */}
        <Box p={4} height="calc(100% - 45px)" overflowY="auto">
          {children}
        </Box>
      </Box>
    </Draggable>
  );
};
