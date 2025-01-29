import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  HStack,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, Target, Award, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        p={6}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        border="1px solid"
        borderColor={color}
      >
        <VStack spacing={3} align="start">
          <HStack spacing={2}>
            <Icon color={color} size={24} />
            <Text fontSize="lg" fontWeight="semibold">{title}</Text>
          </HStack>
          <Text fontSize="3xl" fontWeight="bold" color={color}>
            {value}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {subtitle}
          </Text>
        </VStack>
      </Box>
    </motion.div>
  );
};

export const WeeklyWrap = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stats, setStats] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    // Check if it's Monday and if the wrap hasn't been shown this week
    const today = new Date();
    const lastShown = localStorage.getItem('lastWeeklyWrapShown');
    const isMonday = today.getDay() === 1;
    
    if (isMonday && (!lastShown || new Date(lastShown).getDate() !== today.getDate())) {
      // Fetch last week's stats
      fetchWeeklyStats();
      onOpen();
      localStorage.setItem('lastWeeklyWrapShown', today.toISOString());
    }
  }, []);

  const fetchWeeklyStats = () => {
    // This would be replaced with actual API call
    // Simulating data for now
    setStats({
      messagesHandled: {
        value: '324',
        change: '+15%',
        subtitle: 'from last week'
      },
      avgResponseTime: {
        value: '1.5m',
        change: '-30s',
        subtitle: 'faster than last week'
      },
      resolutionRate: {
        value: '92%',
        change: '+5%',
        subtitle: 'improvement'
      },
      customerSatisfaction: {
        value: '4.8',
        change: '+0.3',
        subtitle: 'stars average'
      }
    });
  };

  if (!stats) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} p={6}>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Your Weekly Wrap
              </Text>
              <Text color="gray.500">
                Here's how you performed last week
              </Text>
            </VStack>

            <VStack spacing={4}>
              <StatCard
                icon={MessageCircle}
                title="Messages Handled"
                value={stats.messagesHandled.value}
                subtitle={`${stats.messagesHandled.change} ${stats.messagesHandled.subtitle}`}
                color="#4299E1"
              />
              
              <StatCard
                icon={Clock}
                title="Average Response Time"
                value={stats.avgResponseTime.value}
                subtitle={`${stats.avgResponseTime.change} ${stats.avgResponseTime.subtitle}`}
                color="#48BB78"
              />
              
              <StatCard
                icon={Target}
                title="Resolution Rate"
                value={stats.resolutionRate.value}
                subtitle={`${stats.resolutionRate.change} ${stats.resolutionRate.subtitle}`}
                color="#9F7AEA"
              />
              
              <StatCard
                icon={Award}
                title="Customer Satisfaction"
                value={stats.customerSatisfaction.value}
                subtitle={`${stats.customerSatisfaction.change} ${stats.customerSatisfaction.subtitle}`}
                color="#ED8936"
              />
            </VStack>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={onClose}
              rightIcon={<TrendingUp />}
            >
              Keep up the great work!
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
