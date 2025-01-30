import { create } from 'zustand';

/**
 * Global contact state management
 * Ensures consistency between Contact and LiveChat views
 */
const useContactStore = create((set) => ({
  contacts: [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      status: 'Active',
      conversationStatus: 'Open',
      labels: ['VIP', 'Enterprise'],
      lastMessage: null,
      lastMessageTime: null,
    },
    {
      id: 2,
      name: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      status: 'Busy',
      conversationStatus: 'Pending',
      labels: ['Technical'],
      lastMessage: null,
      lastMessageTime: null,
    },
  ],

  currentFilter: 'All',
  
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
        lastMessageTime: timestamp
      } : contact
    )
  })),
  
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
}));

export default useContactStore;
