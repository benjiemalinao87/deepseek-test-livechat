import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';

const statusColors = {
  Open: 'blue',
  Done: 'green',
  Pending: 'yellow',
  Invalid: 'red',
  Spam: 'gray'
};

const getDefaultAction = (currentStatus) => {
  switch (currentStatus) {
    case 'Open':
      return 'Move to Done';
    case 'Done':
      return 'Reopen';
    case 'Pending':
      return 'Move to Done';
    default:
      return 'Change Status';
  }
};

const getStatusOptions = (currentStatus) => {
  switch (currentStatus) {
    case 'Open':
      return ['Pending', 'Done', 'Invalid', 'Spam'];
    case 'Done':
      return ['Open', 'Pending', 'Invalid', 'Spam'];
    case 'Pending':
      return ['Done', 'Open', 'Invalid', 'Spam'];
    default:
      return ['Open', 'Pending', 'Done', 'Invalid', 'Spam'];
  }
};

export const StatusMenu = ({ currentStatus, onStatusChange }) => {
  const defaultAction = getDefaultAction(currentStatus);
  const statusOptions = getStatusOptions(currentStatus);
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');

  const handleDefaultAction = () => {
    switch (currentStatus) {
      case 'Open':
        onStatusChange('Done');
        break;
      case 'Done':
        onStatusChange('Open');
        break;
      case 'Pending':
        onStatusChange('Done');
        break;
      default:
        break;
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDown size={16} />}
        size="sm"
        variant="ghost"
        bg={buttonBg}
        _hover={{ bg: buttonHoverBg }}
        onClick={(e) => {
          if (!e.target.closest('.chakra-menu__menu-list')) {
            handleDefaultAction();
          }
        }}
      >
        {defaultAction}
      </MenuButton>
      <MenuList>
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            onClick={() => onStatusChange(status)}
            color={`${statusColors[status]}.500`}
          >
            {status}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
