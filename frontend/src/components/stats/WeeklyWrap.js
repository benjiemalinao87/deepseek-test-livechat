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
        _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
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

export const WeeklyWrap = ({ demo = true }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stats, setStats] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    // For demo, show immediately
    if (demo) {
      fetchWeeklyStats();
      onOpen();
      return;
    }

    // Normal Monday check for production
    const today = new Date();
    const lastShown = localStorage.getItem('lastWeeklyWrapShown');
    const isMonday = today.getDay() === 1;
    
    if (isMonday && (!lastShown || new Date(lastShown).getDate() !== today.getDate())) {
      fetchWeeklyStats();
      onOpen();
      localStorage.setItem('lastWeeklyWrapShown', today.toISOString());
    }
  }, [demo, onOpen]);

  const fetchWeeklyStats = () => {
    // Simulated data for demo
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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} p={6}>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8} align="stretch">
            <VStack spacing={2} textAlign="center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Text fontSize="3xl" fontWeight="bold">
                  Your Weekly Wrap
                </Text>
                <Text color="gray.500">
                  Here's how you performed last week
                </Text>
              </motion.div>
            </VStack>

            <VStack spacing={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <StatCard
                  icon={MessageCircle}
                  title="Messages Handled"
                  value={stats.messagesHandled.value}
                  subtitle={`${stats.messagesHandled.change} ${stats.messagesHandled.subtitle}`}
                  color="#4299E1"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <StatCard
                  icon={Clock}
                  title="Average Response Time"
                  value={stats.avgResponseTime.value}
                  subtitle={`${stats.avgResponseTime.change} ${stats.avgResponseTime.subtitle}`}
                  color="#48BB78"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <StatCard
                  icon={Target}
                  title="Resolution Rate"
                  value={stats.resolutionRate.value}
                  subtitle={`${stats.resolutionRate.change} ${stats.resolutionRate.subtitle}`}
                  color="#9F7AEA"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <StatCard
                  icon={Award}
                  title="Customer Satisfaction"
                  value={stats.customerSatisfaction.value}
                  subtitle={`${stats.customerSatisfaction.change} ${stats.customerSatisfaction.subtitle}`}
                  color="#ED8936"
                />
              </motion.div>
            </VStack>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={onClose}
                rightIcon={<TrendingUp />}
              >
                Keep up the great work!
              </Button>
            </motion.div>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
