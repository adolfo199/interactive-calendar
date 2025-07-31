/**
 * Month Day Component
 * Renders individual day cell in monthly calendar view
 */

import React from 'react'
import { cn } from '../../../utils'
import { AppointmentCard } from '../../shared'
import type { CalendarEvent } from '../../../types/appointment.types'

interface MonthDayProps {
  /** Date for this day cell */
  date: Date
  /** Events for this day */
  events: CalendarEvent[]
  /** Whether this day is in the current month */
  isCurrentMonth: boolean
  /** Whether this day is selected */
  isSelected: boolean
  /** Whether this day is today */
  isToday: boolean
  /** Current locale */
  locale?: 'en' | 'es'
  /** Callback when date is clicked */
  onDateClick?: (date: Date) => void
  /** Callback when event is clicked */
  onEventClick?: (event: CalendarEvent) => void
  /** Additional CSS classes */
  className?: string
}

export function MonthDay({
  date,
  events,
  isCurrentMonth,
  isSelected,
  isToday,
  locale: _locale = 'en', // Prefixed with underscore to indicate intentionally unused
  onDateClick,
  onEventClick,
  className
}: MonthDayProps) {

  const handleDateClick = () => {
    console.log('MonthDay - handleDateClick:', date)
    onDateClick?.(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('MonthDay - handleEventClick:', event)
    onEventClick?.(event)
  }

  return (
    <div
      className={cn(
        "min-h-[120px] p-2 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
        isSelected && "bg-gradient-to-br from-primary/10 to-primary/5 border-primary shadow-md",
        isToday && "ring-2 ring-primary ring-offset-2 bg-gradient-to-br from-blue-50 to-blue-100",
        !isCurrentMonth && "text-muted-foreground bg-muted/10",
        className
      )}
      onClick={handleDateClick}
    >
      {/* Day number with better design */}
      <div className={cn(
        "text-sm font-semibold mb-2 flex items-center justify-between",
        isToday && "text-primary"
      )}>
        <span className={cn(
          "transition-all duration-200",
          isToday && "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-sm"
        )}>
          {date.getDate()}
        </span>
        
        {/* Availability indicator */}
        {events.length > 0 && (
          <div className="flex items-center space-x-1">
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              events.length > 3 ? "bg-red-500" : events.length > 1 ? "bg-yellow-500" : "bg-green-500"
            )} />
            <span className="text-xs text-muted-foreground font-medium">
              {events.length}
            </span>
          </div>
        )}
      </div>

      {/* Day events with improved design */}
      <div className="space-y-1.5">
        {events.slice(0, 2).map((event, index) => (
          <AppointmentCard
            key={`${event.id}-${index}`}
            event={event}
            variant="month"
            size="sm"
            showDetails={false}
            showTooltip={true}
            onClick={handleEventClick}
            className="relative"
          />
        ))}
        
        {/* More events indicator */}
        {events.length > 2 && (
          <div 
            className="text-xs text-center py-1 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors font-medium"
            onClick={(e) => {
              e.stopPropagation()
              console.log('More events clicked for date:', date)
              handleDateClick() // Open day view
            }}
          >
            +{events.length - 2} more
          </div>
        )}
      </div>
    </div>
  )
}
