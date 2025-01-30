import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { X, Minus, Square } from 'react-feather';
import Draggable from 'react-draggable';

const ResizableWindow = ({ 
  title, 
  onClose, 
  isDark, 
  children,
  defaultSize = { width: 800, height: 600 },
  minSize = { width: 400, height: 300 }
}) => {
  const [windowSize, setWindowSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);
  const containerRef = useRef(null);

  // Colors
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const container = containerRef.current;
      if (!container) return;

      const newWidth = Math.max(
        minSize.width,
        e.clientX - container.getBoundingClientRect().left
      );
      const newHeight = Math.max(
        minSize.height,
        e.clientY - container.getBoundingClientRect().top
      );

      setWindowSize({
        width: newWidth,
        height: newHeight
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minSize.width, minSize.height]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <Draggable handle=".window-handle" bounds="parent">
      <Box
        ref={containerRef}
        position="absolute"
        width={`${windowSize.width}px`}
        height={`${windowSize.height}px`}
        bg={bg}
        borderRadius="lg"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        {/* Window Header */}
        <HStack
          className="window-handle"
          px={4}
          h="45px"
          justify="space-between"
          borderBottom="1px"
          borderColor={borderColor}
          cursor="grab"
          userSelect="none"
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
        <Box height="calc(100% - 45px)">
          {children}
        </Box>

        {/* Resize Handle */}
        <Box
          position="absolute"
          bottom={2}
          right={2}
          w="20px"
          h="20px"
          cursor="nwse-resize"
          onMouseDown={handleMouseDown}
          borderRadius="full"
          bg="blue.500"
          opacity="0.8"
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
          zIndex={1000}
          _before={{
            content: '""',
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            width: '8px',
            height: '2px',
            bg: 'white',
            transform: 'rotate(-45deg)'
          }}
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '9px',
            right: '9px',
            width: '8px',
            height: '2px',
            bg: 'white',
            transform: 'rotate(-45deg)'
          }}
        />
      </Box>
    </Draggable>
  );
};

export default ResizableWindow;
