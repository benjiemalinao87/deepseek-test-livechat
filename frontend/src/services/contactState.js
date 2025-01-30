import { create } from 'zustand';

/**
 * Global contact state management
 * Ensures consistency between Contact and LiveChat views
 */
const useContactStore = create((set, get) => {
  // Initialize with default state
  const initialState = {
    contacts: [
      {
        id: 1,
        name: 'Benjie Malinao',
        phone: '+16267888830',
        email: 'benjie@gmail.com',
        leadSource: 'homebuddy',
        status: 'Active',
        conversationStatus: 'Open',
        labels: ['VIP', 'Enterprise'],
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0
      }
    ],
    currentFilter: 'All'
  };

  return {
    ...initialState,
    
    // Add new contact
    addContact: (contact) => set((state) => ({
      contacts: [...state.contacts, contact]
    })),
    
    // Update contact
    updateContact: (id, updates) => set((state) => ({
      contacts: state.contacts.map(contact =>
        contact.id === id ? { ...contact, ...updates } : contact
      )
    })),
    
    // Update last message
    updateLastMessage: (id, message, timestamp) => set((state) => ({
      contacts: state.contacts.map(contact =>
        contact.id === id ? {
          ...contact,
          lastMessage: message,
          lastMessageTime: timestamp,
          unreadCount: contact.unreadCount || 0
        } : contact
      )
    })),
    
    // Increment unread count
    incrementUnreadCount: (id) => {
      set((state) => ({
        contacts: state.contacts.map(contact =>
          contact.id === id && contact.conversationStatus === 'Open' ? {
            ...contact,
            unreadCount: (contact.unreadCount || 0) + 1
          } : contact
        )
      }));
    },

    // Clear unread count
    clearUnreadCount: (id) => {
      set((state) => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? {
            ...contact,
            unreadCount: 0
          } : contact
        )
      }));
    },

    // Update conversation status
    updateConversationStatus: (id, status) => {
      set((state) => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? {
            ...contact,
            conversationStatus: status,
            // Clear unread count when moving to Done or Pending
            unreadCount: (status === 'Done' || status === 'Pending') ? 0 : contact.unreadCount
          } : contact
        )
      }));
    },

    // Set filter
    setFilter: (filter) => set({ currentFilter: filter }),
    
    // Get filtered contacts
    getFilteredContacts: () => {
      const state = useContactStore.getState();
      if (state.currentFilter === 'All') return state.contacts;
      return state.contacts.filter(contact => 
        contact.conversationStatus === state.currentFilter
      );
    },

    // Set initial contacts
    setContacts: (contacts) => set({ contacts }),
  };
});

export default useContactStore;
