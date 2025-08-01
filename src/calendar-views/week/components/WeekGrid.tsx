/**
 * Week Grid Component
 * Main grid layout for the weekly calendar view
 */

import React from 'react'
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

export function WeekGrid({
  weekDays,
  timeSlots,
  events,
  selectedDate,
  today,
  onSlotClick,
  onEventClick,
  className
}: WeekGridProps) {

  // Filter events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const handleSlotClick = (date: Date, timeSlot: string) => {
    onSlotClick?.(date, timeSlot)
  }

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event)
  }

  return (
    <div className={cn('grid grid-cols-8 h-full overflow-auto', className)}>
      {/* Time axis column */}
      <div className="sticky left-0 z-20 bg-white">
        <WeekTimeAxis timeSlots={timeSlots} />
      </div>
      
      {/* Day columns */}
      {weekDays.map((day) => {
        const dayEvents = getEventsForDay(day)
        const isToday = day.toDateString() === today.toDateString()
        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
        
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
      })}
    </div>
  )
}
