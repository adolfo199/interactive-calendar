# Calendar Component - AI Assistant Instructions

## Project Overview
This is a React TypeScript library for appointment/cita management calendar.

## Key Information
- **Package**: `@interactive/calendar`
- **Framework**: React 18+ with TypeScript
- **UI Library**: Custom components based on shadcn/ui
- **Styling**: TailwindCSS with custom utilities
- **Date Management**: date-fns library
- **Icons**: Lucide React
- **Build**: TypeScript compiler (tsc)

## Architecture

### Main Components
- `CalendarMain`: Primary orchestrator component with toolbar and navigation
- `CalendarDay`: Single day detailed view with hourly slots
- `CalendarWeek`: Week view with events distribution  
- `CalendarLegend`: Status and type legend for events
- UI Components: `Card`, `Button`, `Badge`, `Tooltip` (shadcn/ui based)

### Custom Hooks
- `useCalendar`: Navigation, view management, date selection
- `useCalendarEvents`: Event CRUD operations, filtering, statistics
- `useAppointmentModal`: Modal state management for create/edit/view

### Type System
- `Cita`: Complete appointment entity with relations
- `CitaCalendarEvent`: Calendar-specific event representation
- `EstadoCita`: Status types (pendiente, confirmada, en_progreso, completada, cancelada)
- `TipoCita`: Appointment types (reunion, consulta, mantenimiento, evento, etc.)
- `VistaCalendario`: View modes (month, week, day)

## Design Patterns & Conventions

### File Organization
```
src/
├── components/ui/          # Reusable UI components
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
├── Calendar*.tsx           # Main calendar components
├── mockData.ts            # Sample data for development
└── index.ts               # Public API exports
```

### Naming Conventions
- **Components**: PascalCase (e.g., `CalendarMain`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCalendar`)
- **Types**: PascalCase (e.g., `CitaCalendarEvent`)
- **Variables**: camelCase (e.g., `currentDate`)
- **Constants**: SCREAMING_SNAKE_CASE for global constants

### Code Style
- Use functional components with hooks
- Prefer `useCallback` and `useMemo` for optimization
- Extract complex logic into custom hooks
- Use TypeScript strict mode
- Document complex functions with JSDoc
- Use destructuring for props and state

### Color System (Based on Appointment Status)
- **Confirmada**: Green gradient (#10b981 → #059669)
- **Pendiente**: Yellow/Orange gradient (#f59e0b → #d97706)  
- **Cancelada**: Red gradient (#ef4444 → #dc2626)
- **Completada**: Blue gradient (#3b82f6 → #1d4ed8)
- **En Progreso**: Purple gradient (#8b5cf6 → #7c3aed)

## Component Behavior

### CalendarMain Props
```typescript
interface CalendarMainProps {
  initialView?: VistaCalendario      // Default: 'month'
  initialDate?: Date                 // Default: new Date()
  height?: string | number           // Default: 'auto'
  showToolbar?: boolean              // Default: true
  showCreateButton?: boolean         // Default: true
  showViewSelector?: boolean         // Default: true
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CitaCalendarEvent) => void
  onCreateEvent?: (date?: Date) => void
  onCitaCreate?: (data: CitaCalendarEvent) => Promise<void>
  onCitaUpdate?: (data: CitaCalendarEvent) => Promise<void>
  onCitaDelete?: (id: number) => Promise<void>
  loading?: boolean
  className?: string
}
```

### State Management
- Calendar state is managed internally via custom hooks
- Events/appointments are managed separately from UI state
- Modal state is isolated in `useAppointmentModal`
- External state can be synchronized via props callbacks

### Event Handling
- Click on date → Navigate to day view for that date
- Click on event → Open event details modal (if no custom handler)
- Create button → Open new appointment modal
- Navigation preserves current view type

## Development Guidelines

### Adding New Features
1. Define types first in `types/cita.types.ts`
2. Create or extend hooks for state management
3. Build UI components following existing patterns
4. Add proper TypeScript annotations
5. Include proper error handling
6. Test with mock data

### Performance Considerations
- Use `React.memo` for expensive renders
- Memoize callbacks and computed values
- Implement virtual scrolling for large datasets
- Lazy load heavy dependencies

### Testing Strategy
- Unit tests for utility functions
- Hook testing with React Testing Library
- Component integration tests
- Mock external dependencies

### Accessibility
- Proper ARIA labels for calendar navigation
- Keyboard navigation support
- Screen reader friendly date announcements
- High contrast mode support

## Common Patterns

### Date Handling
```typescript
// Always use Date objects internally
const eventDate = new Date(cita.fecha)
eventDate.setHours(horaInicioHoras, horaInicioMinutos, 0, 0)

// Format for display
const displayDate = date.toLocaleDateString('es-ES', options)
```

### Event Creation
```typescript
// Convert Cita to CalendarEvent
const event: CitaCalendarEvent = {
  id: cita.id,
  title: cita.titulo,
  start: new Date(startDateTime),
  end: new Date(endDateTime),
  allDay: false,
  extendedProps: {
    cita,
    estado: cita.estado,
    tipo: cita.tipo,
    local: cita.local?.nombre || 'Sin local',
    participantes: cita.participantes
  }
}
```

### Conditional Rendering
```typescript
// Use loading states and error boundaries
{loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} onRetry={retryFunction} />
) : (
  <CalendarContent />
)}
```

## Integration Notes

### External Dependencies
- This component expects the parent app to provide global styles
- TailwindCSS classes should be available globally
- Icons from lucide-react should be available

### API Integration
- Mock data is provided for development
- Replace mock functions with actual API calls
- Maintain the same data structure for seamless integration

### Customization
- Colors can be customized via CSS custom properties
- Components accept className props for styling overrides
- Behavior can be customized via callback props

## Troubleshooting

### Common Issues
1. **Date timezone issues**: Always work with local dates, convert at boundaries
2. **Performance with many events**: Implement filtering and virtualization
3. **CSS conflicts**: Use CSS-in-JS or ensure proper TailwindCSS setup
4. **Type errors**: Ensure all imported types are properly exported

### Debug Information
- Add console logs in development mode
- Use React DevTools for state inspection
- Monitor network requests for API issues
- Check browser console for JavaScript errors

Remember: This is a library component designed for reuse. Keep interfaces clean, maintain backward compatibility, and document any breaking changes.
