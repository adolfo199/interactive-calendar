// Exportar componentes principales
export { CalendarMain } from './CalendarMain';
export { CalendarDay } from './CalendarDay';
export { CalendarWeek } from './CalendarWeek';
export { CalendarLegend } from './CalendarLegend';

// Exportar hooks
export { useCalendar } from './hooks/useCalendar';
export { useCalendarEvents } from './hooks/useCalendarEvents';
export { useCitaModal } from './hooks/useCitaModal';

// Exportar tipos
export type * from './types/cita.types';

// Exportar datos de prueba (opcional)
export { citasEjemplo, eventosEjemplo, getEventosEjemplo, simulateDataLoad } from './mockData';

// Exportar plugin de Tailwind
export { default as tailwindPlugin } from './plugin.js';
