# Lessons Learned

## Contact Selection Bug Fix - 2025-01-30

### Issue
Contact selection in the LiveChat component wasn't working due to inconsistent data passing between components.

### Root Cause
1. Data Inconsistency:
   - Components were passing around phone numbers instead of complete contact objects
   - This created a mismatch between the selection state and the actual contact data
   - Required extra lookups to find contact details from phone numbers

### Solution
1. Unified Data Model:
   - Changed to passing full contact objects between components
   - Eliminated need for phone number lookups
   - Made state management more straightforward

### Key Lessons
1. State Management:
   - Keep data models consistent across component boundaries
   - Avoid using partial data (like IDs or phone numbers) when you need the full object
   - Minimize data transformations between components

2. Component Design:
   - Props should reflect the actual data needs of components
   - If a component needs multiple properties from an object, pass the whole object
   - Avoid splitting related data across multiple props

3. Debugging Approach:
   - Start by tracing the data flow between components
   - Look for inconsistencies in data types or structures
   - Check where data transformations happen and if they're necessary

### Best Practices
1. Data Flow:
   ```javascript
   // ❌ Bad: Passing partial data
   onSelectContact={(contact) => setSelectedPhone(contact.phone)}
   
   // ✅ Good: Passing complete data
   onSelectContact={setSelectedContact}
   ```

2. State Management:
   ```javascript
   // ❌ Bad: Multiple states for related data
   const [selectedPhone, setSelectedPhone] = useState(null);
   const selectedContact = contacts.find(c => c.phone === selectedPhone);
   
   // ✅ Good: Single source of truth
   const [selectedContact, setSelectedContact] = useState(null);
   ```

### Prevention Tips
1. Code Review Checklist:
   - Check for consistent data models across components
   - Look for unnecessary data transformations
   - Verify prop types match component needs
   - Ensure state management follows single responsibility principle

2. Development Guidelines:
   - Define clear interfaces between components
   - Document expected data structures
   - Use TypeScript or PropTypes to catch type mismatches early
   - Keep data transformations at the edges of your application

## Window Resize Bug Fix - 2025-01-30

### Issue
Window resizing in LiveChat component was sticking/continuing even after releasing the mouse button.

### Root Cause
1. Event Handler Scope:
   - Mouse event handlers were attached to the component's Box element
   - Events could be lost when mouse moved outside the component
   - No proper cleanup of event listeners

### Solution
1. Window-Level Event Handling:
   - Moved mousemove and mouseup handlers to window level
   - Added proper event listener cleanup
   - Prevented text selection during resize

### Key Lessons
1. Event Handler Management:
   - Use window-level event listeners for drag operations
   - Always clean up event listeners to prevent memory leaks
   - Prevent default behaviors that might interfere (like text selection)

2. Component Design:
   - Consider edge cases where user interactions extend beyond component boundaries
   - Implement proper event cleanup in component lifecycle
   - Use refs to store intermediate state during drag operations

### Best Practices
1. Event Handler Setup:
   ```javascript
   // ❌ Bad: Component-level event handling
   <Box
     onMouseMove={handleMouseMove}
     onMouseUp={handleMouseUp}
   >
   
   // ✅ Good: Window-level event handling
   const handleMouseDown = (e) => {
     window.addEventListener('mousemove', handleMouseMove);
     window.addEventListener('mouseup', handleMouseUp);
   };
   ```

2. Event Cleanup:
   ```javascript
   // ❌ Bad: No cleanup
   const handleMouseUp = () => {
     setIsResizing(false);
   };
   
   // ✅ Good: Proper cleanup
   const handleMouseUp = () => {
     setIsResizing(false);
     window.removeEventListener('mousemove', handleMouseMove);
     window.removeEventListener('mouseup', handleMouseUp);
   };
   ```

### Prevention Tips
1. Event Handling Checklist:
   - Identify where event listeners should be attached (component vs window)
   - Implement proper event cleanup
   - Handle edge cases (mouse leaving window, rapid events)
   - Prevent unwanted browser behaviors

2. Testing Guidelines:
   - Test drag operations beyond component boundaries
   - Verify event cleanup on component unmount
   - Check for smooth interaction and performance
   - Test edge cases like rapid mouse movements

## Inbound Message Display Bug Fix - 2025-01-30

### Issue
Inbound messages were not displaying in the LiveChat UI even though they were being received by the socket connection.

### Root Cause
1. Phone Number Format Mismatch:
   - Inbound and outbound messages had phone numbers in different formats
   - Direct string comparison failed due to variations in country code (+1 vs 1) and special characters
   - Message filtering logic was too strict, requiring exact matches

### Solution
1. Phone Number Normalization:
   - Added a normalization function to standardize phone number formats
   - Removed non-digit characters and ensured consistent country code
   - Applied normalization before comparing phone numbers in message filtering

### Key Lessons
1. Data Normalization:
   - Always normalize data before comparison, especially with external services
   - Consider different formats and representations of the same data
   - Handle edge cases like missing country codes or special characters

2. Message Handling:
   - Test with both inbound and outbound messages
   - Verify message filtering logic with different phone number formats
   - Log and debug message flow through the application

### Best Practices
1. Phone Number Handling:
   ```javascript
   // ❌ Bad: Direct string comparison
   msg.from === contact.phone
   
   // ✅ Good: Normalized comparison
   normalizePhone(msg.from) === normalizePhone(contact.phone)
   ```

2. Data Validation:
   ```javascript
   // ❌ Bad: Assuming consistent format
   phone.startsWith('+1')
   
   // ✅ Good: Handle multiple formats
   const normalizePhone = (phone) => {
     const digits = phone.replace(/\D/g, '');
     return digits.startsWith('1') ? digits : '1' + digits;
   }
   ```

### Prevention Tips
1. Integration Testing:
   - Test with real devices and phone numbers
   - Verify both inbound and outbound message flows
   - Check message display in different UI states

2. Development Guidelines:
   - Document expected data formats
   - Implement data normalization early
   - Add logging for debugging message flow
   - Consider international phone number formats for future expansion
