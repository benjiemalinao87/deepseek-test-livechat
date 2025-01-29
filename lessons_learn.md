# Lessons Learned

## Weekly Performance Tracking (January 30, 2025)

### Technical Insights
1. **Local Storage Usage**
   - Using localStorage for tracking last shown date prevents duplicate displays
   - Key format: 'lastWeeklyWrapShown' with ISO date string

2. **Component Lifecycle**
   - useEffect with empty dependency array ensures check runs only on mount
   - Date.getDay() returns 0-6 (Sunday-Saturday), making Monday check simple

3. **Modal Management**
   - Chakra UI's useDisclosure hook simplifies modal state management
   - backdropFilter adds depth to modal overlay

### Best Practices
1. **Performance Metrics**
   - Week-over-week comparisons provide better context than absolute numbers
   - Visual hierarchy emphasizes improvements/declines
   - Color coding helps quick understanding of performance changes

2. **UI/UX Considerations**
   - Animations staggered for better visual flow
   - Modal appears only when needed (Mondays + new stats)
   - Clear, concise metric descriptions
   - Consistent styling with macOS design philosophy
