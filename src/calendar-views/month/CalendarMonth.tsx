/**
 * Calendar Month View Component
 * Renders the monthly calendar view with days and events
 * Optimized with React.memo, useCallback and useMemo for performance
 */

import React, { memo, useCallback, useMemo } from 'react'
import { cn } from '../../utils'
import { MonthHeader, MonthGrid } from './components'
import { useCalendar } from '../../hooks/useCalendar'
import { useCalendarTranslations } from '../../hooks/useCalendarTranslations'
import type { CalendarEvent } from '../../types/appointment.types'

interface CalendarMonthProps {
  /** Current date to display */
  currentDate: Date
  /** Selected date */
  selectedDate?: Date
  /** Events to display */
  events: CalendarEvent[]
  /** Current locale */
  locale?: 'en' | 'es'
  /** Loading state */
  loading?: boolean
  /** Callback when a date is clicked */
  onDateClick?: (date: Date) => void
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEvent) => void
  /** Additional CSS classes */
  className?: string
}

export const CalendarMonth = memo<CalendarMonthProps>(({
  currentDate,
  selectedDate: _selectedDate, // eslint-disable-line no-unused-vars
  events,
  locale = 'en',
  loading = false,
  onDateClick,
  onEventClick,
  className
}) => {

  // Hooks for calendar logic
  const calendar = useCalendar({
    initialView: 'month',
    initialDate: currentDate,
    locale
  })

  const t = useCalendarTranslations({ locale })

  // Memoized event handlers to prevent unnecessary re-renders
  const handleDateClick = useCallback((date: Date) => {
    console.log('CalendarMonth - handleDateClick:', date)
    onDateClick?.(date)
  }, [onDateClick])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('CalendarMonth - handleEventClick:', event)
    onEventClick?.(event)
  }, [onEventClick])

  // Memoized function to get events for a specific day
  const getEventsForDay = useCallback((date: Date) => {
    return events.filter(event => {
      if (!event.start) return false
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }, [events])

  // Memoized weekdays to prevent recreation
  const weekDays = useMemo(() => calendar.getWeekDays(), [calendar])

  // Memoized container className
  const containerClassName = useMemo(() => cn('p-4', className), [className])

  // Memoized grid className for loading state
  const gridClassName = useMemo(() => cn(
    "transition-opacity duration-200",
    loading && "opacity-50 pointer-events-none"
  ), [loading])

  return (
    <div className={containerClassName}>
      {/* Month header with weekdays */}
      <MonthHeader 
        weekDays={weekDays}
        locale={locale}
      />

      {/* Month grid with loading state */}
      <div className={gridClassName}>
        <MonthGrid
          calendarDays={calendar.calendarDays}
          locale={locale}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          isSameMonth={calendar.isSameMonth}
          isSelected={calendar.isSelected}
          isToday={calendar.isToday}
          getEventsForDay={getEventsForDay}
        />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-gray-600">
                {t.t('loading.calendar')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

CalendarMonth.displayName = 'CalendarMonth'
