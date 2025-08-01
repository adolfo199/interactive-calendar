// Exportar componentes principales
// Initialize i18n before exporting components
import './i18n';

// Main calendar component export
export { CalendarMain } from './CalendarMain'
export { CalendarDay } from './calendar-views/day';
export { CalendarWeek } from './CalendarWeek';
export { CalendarLegend } from './CalendarLegend';

// Exportar hooks
export { useCalendar } from './hooks/useCalendar';
export { useCalendarEvents } from './hooks/useCalendarEvents';
export { useAppointmentModal } from './hooks/useAppointmentModal';

// Export types from appointment types
export type * from './types/appointment.types';

// Export mock data
export { exampleAppointments, exampleEvents, getExampleEvents, simulateDataLoad } from './mockData';

// Exportar plugin de Tailwind
export { default as tailwindPlugin } from './plugin.js';
