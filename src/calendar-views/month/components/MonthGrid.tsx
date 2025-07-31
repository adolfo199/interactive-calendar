/**
 * Month Grid Component
 * Renders the calendar grid for monthly view with days and events
 */

import React from 'react'
import { cn } from '../../../utils'
import { MonthDay } from './MonthDay'
import type { CalendarEvent } from '../../../types/appointment.types'

interface MonthGridProps {
  /** Current month date */
  currentDate: Date
  /** Selected date */
  selectedDate?: Date
  /** Calendar days array */
  calendarDays: Date[]
  /** All events for the month */
  events: CalendarEvent[]
  /** Current locale */
  locale: 'en' | 'es'
  /** Callback when a date is clicked */
  onDateClick?: (date: Date) => void
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEvent) => void
  /** Additional CSS classes */
  className?: string
  /** Function to check if date is in current month */
  isSameMonth: (date: Date) => boolean
  /** Function to check if date is selected */
  isSelected: (date: Date) => boolean
  /** Function to check if date is today */
  isToday: (date: Date) => boolean
  /** Function to get events for a specific day */
  getEventsForDay: (date: Date) => CalendarEvent[]
}

export function MonthGrid({
  currentDate: _currentDate,
  selectedDate: _selectedDate,
  calendarDays,
  events: _events,
  locale,
  onDateClick,
  onEventClick,
  className,
  isSameMonth,
  isSelected,
  isToday,
  getEventsForDay
}: MonthGridProps) {

  const handleDateClick = (date: Date) => {
    console.log('MonthGrid - handleDateClick:', date)
    onDateClick?.(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('MonthGrid - handleEventClick:', event)
    onEventClick?.(event)
  }

  return (
    <div className={cn('', className)}>
      {/* Grid of calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDay(date)
          const isCurrentMonth = isSameMonth(date)
          
          return (
            <MonthDay
              key={index}
              date={date}
              events={dayEvents}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected(date)}
              isToday={isToday(date)}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              locale={locale}
            />
          )
        })}
      </div>
    </div>
  )
}
