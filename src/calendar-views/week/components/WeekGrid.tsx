/**
 * Week Grid Component
 * Main grid layout for the weekly calendar view
 * Optimized with React.memo and useCallback for performance
 */

import React, { memo, useMemo, useCallback } from 'react'
import { cn } from '../../../utils'
import { WeekTimeAxis } from './WeekTimeAxis'
import { WeekDayColumn } from './WeekDayColumn'
import type { CalendarEvent } from '../../../types/appointment.types'

interface WeekGridProps {
  /** Array of dates representing the week */
  weekDays: Date[]
  /** Array of time slots */
  timeSlots: string[]
  /** All events to display */
  events: CalendarEvent[]
  /** Currently selected date */
  selectedDate: Date | null
  /** Current date (today) */
  today: Date
  /** Callback when a time slot is clicked */
  onSlotClick?: (date: Date, timeSlot: string) => void
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEvent) => void
  /** Additional CSS classes */
  className?: string
}

const WeekGrid = memo<WeekGridProps>(({
  weekDays,
  timeSlots,
  events,
  selectedDate,
  today,
  onSlotClick,
  onEventClick,
  className
}) => {

  // Memoize today's date string to prevent recreation
  const todayString = useMemo(() => today.toDateString(), [today])
  const selectedDateString = useMemo(() => selectedDate?.toDateString(), [selectedDate])

  // Memoize events grouped by day to prevent recalculation
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>()
    
    weekDays.forEach(date => {
      const dateString = date.toDateString()
      grouped.set(dateString, [])
    })
    
    events.forEach(event => {
      const eventDate = new Date(event.start)
      const eventDateString = eventDate.toDateString()
      const dayEvents = grouped.get(eventDateString)
      if (dayEvents) {
        dayEvents.push(event)
      }
    })
    
    return grouped
  }, [weekDays, events])

  // Memoize click handlers
  const handleSlotClick = useCallback((date: Date, timeSlot: string) => {
    onSlotClick?.(date, timeSlot)
  }, [onSlotClick])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    onEventClick?.(event)
  }, [onEventClick])

  // Memoize container classes
  const containerClassName = useMemo(() => 
    cn('grid grid-cols-8 h-full overflow-auto', className)
  , [className])

  // Memoize day columns to prevent unnecessary re-renders
  const dayColumns = useMemo(() => {
    return weekDays.map((day) => {
      const dateString = day.toDateString()
      const dayEvents = eventsByDay.get(dateString) || []
      const isToday = dateString === todayString
      const isSelected = selectedDateString && dateString === selectedDateString
      
      return (
        <div key={day.toISOString()} className="relative">
          <WeekDayColumn
            date={day}
            timeSlots={timeSlots}
            events={dayEvents}
            isSelected={isSelected || false}
            isToday={isToday}
            onSlotClick={handleSlotClick}
            onEventClick={handleEventClick}
          />
        </div>
      )
    })
  }, [weekDays, eventsByDay, timeSlots, todayString, selectedDateString, handleSlotClick, handleEventClick])

  return (
    <div className={containerClassName}>
      {/* Time axis column */}
      <div className="sticky left-0 z-20 bg-white">
        <WeekTimeAxis timeSlots={timeSlots} />
      </div>
      
      {/* Day columns */}
      {dayColumns}
    </div>
  )
})

WeekGrid.displayName = 'WeekGrid'

export { WeekGrid }
