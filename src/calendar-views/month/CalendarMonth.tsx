/**
 * Calendar Month View Component
 * Renders the monthly calendar view with days and events
 */

import React from 'react'
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

export function CalendarMonth({
  currentDate,
  selectedDate,
  events,
  locale = 'en',
  loading = false,
  onDateClick,
  onEventClick,
  className
}: CalendarMonthProps) {

  // Hooks for calendar logic
  const calendar = useCalendar({
    initialView: 'month',
    initialDate: currentDate,
    locale
  })

  const t = useCalendarTranslations({ locale })

  // Event handlers
  const handleDateClick = (date: Date) => {
    console.log('CalendarMonth - handleDateClick:', date)
    onDateClick?.(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('CalendarMonth - handleEventClick:', event)
    onEventClick?.(event)
  }

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      if (!event.start) return false
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  return (
    <div className={cn('p-4', className)}>
      {/* Month header with weekdays */}
      <MonthHeader 
        weekDays={calendar.getWeekDays()}
        locale={locale}
      />

      {/* Month grid with loading state */}
      <div className={cn(
        "transition-opacity duration-200",
        loading && "opacity-50 pointer-events-none"
      )}>
        <MonthGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          calendarDays={calendar.calendarDays}
          events={events}
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
            <div className="flex items-center space-x-3">
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
}
