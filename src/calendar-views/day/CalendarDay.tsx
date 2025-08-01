/**
 * Calendar Day View - Orchestrator Component
 * 
 * Daily calendar view that coordinates all day-specific subcomponents
 */

import { DayHeader, DayEventsSummary, DayTimeGrid } from './components'
import type { CalendarEvent } from '../../types/appointment.types'
import { useCalendarTranslations } from '../../hooks/useCalendarTranslations'

interface CalendarDayProps {
  events: CalendarEvent[]
  currentDate: Date
  selectedDate: Date | null
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  loading?: boolean
  locale?: string
}

export function CalendarDay({
  events,
  currentDate,
  onDateClick,
  onEventClick,
  loading = false,
  locale = 'es'
}: CalendarDayProps) {
  
  const { t } = useCalendarTranslations({ locale: locale as 'en' | 'es' })
  
  // Filter events for current day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    return eventDate.toDateString() === currentDate.toDateString()
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            {t('loading.dailyView')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Day header with date information */}
      <DayHeader 
        currentDate={currentDate}
        locale={locale}
        onDateClick={onDateClick}
      />

      {/* Events summary section */}
      <DayEventsSummary
        events={dayEvents}
        locale={locale}
        onEventClick={onEventClick}
      />

      {/* Time grid with events */}
      <DayTimeGrid
        events={events}
        currentDate={currentDate}
        locale={locale}
        onDateClick={onDateClick}
        onEventClick={onEventClick}
      />
    </div>
  )
}
