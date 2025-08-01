/**
 * Month Grid Component
 * Renders the calendar grid for monthly view with days and events
 * Optimized with React.memo and useCallback for performance
 */

import React, { memo, useMemo, useCallback } from 'react'
import { cn } from '../../../utils'
import { MonthDay } from './MonthDay'
import type { CalendarEvent } from '../../../types/appointment.types'

interface MonthGridProps {
  /** Calendar days array */
  calendarDays: Date[]
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

const MonthGrid = memo<MonthGridProps>(({
  calendarDays,
  locale,
  onDateClick,
  onEventClick,
  className,
  isSameMonth,
  isSelected,
  isToday,
  getEventsForDay
}) => {

  // Memoize click handlers to prevent child re-renders
  const handleDateClick = useCallback((date: Date) => {
    console.log('MonthGrid - handleDateClick:', date)
    onDateClick?.(date)
  }, [onDateClick])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('MonthGrid - handleEventClick:', event)
    onEventClick?.(event)
  }, [onEventClick])

  // Memoize container className
  const containerClassName = useMemo(() => cn('', className), [className])

  // Memoize the calendar days with their computed properties
  const calendarDaysData = useMemo(() => {
    return calendarDays.map((date, index) => ({
      index,
      date,
      events: getEventsForDay(date),
      isCurrentMonth: isSameMonth(date),
      isSelectedDay: isSelected(date),
      isTodayDay: isToday(date)
    }))
  }, [calendarDays, getEventsForDay, isSameMonth, isSelected, isToday])

  // Memoize the rendered days
  const renderedDays = useMemo(() => {
    return calendarDaysData.map(({ index, date, events, isCurrentMonth, isSelectedDay, isTodayDay }) => (
      <MonthDay
        key={index}
        date={date}
        events={events}
        isCurrentMonth={isCurrentMonth}
        isSelected={isSelectedDay}
        isToday={isTodayDay}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        locale={locale}
      />
    ))
  }, [calendarDaysData, handleDateClick, handleEventClick, locale])

  return (
    <div className={containerClassName}>
      {/* Grid of calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {renderedDays}
      </div>
    </div>
  )
})

MonthGrid.displayName = 'MonthGrid'

export { MonthGrid }
