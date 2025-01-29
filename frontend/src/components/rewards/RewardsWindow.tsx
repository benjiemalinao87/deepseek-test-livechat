import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import { Trophy, Target, Zap, Star } from 'lucide-react';
import { DailyChallenges } from './challenges/DailyChallenges';
import { SpinAndWin } from './spin/SpinAndWin';
import { PowerUps } from './powerups/PowerUps';

export const RewardsWindow = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      w="full"
      maxW="1200px"
      mx="auto"
      boxShadow="lg"
    >
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList mb={4}>
          <Tab gap={2}>
            <Trophy size={16} />
            Overview
          </Tab>
          <Tab gap={2}>
            <Target size={16} />
            Daily Challenges
          </Tab>
          <Tab gap={2}>
            <Star size={16} />
            Spin & Win
          </Tab>
          <Tab gap={2}>
            <Zap size={16} />
            Power-ups
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Overview content */}
          </TabPanel>
          <TabPanel>
            <DailyChallenges />
          </TabPanel>
          <TabPanel>
            <SpinAndWin />
          </TabPanel>
          <TabPanel>
            <PowerUps />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}; 