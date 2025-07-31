/**
 * Reusable component for time slots in daily and weekly views
 * Handles display of time ranges and events
 */

import React from 'react'
import { cn } from '../../utils'
import { AppointmentCard } from './AppointmentCard'

import type { CalendarEvent } from '../../types/appointment.types'

interface TimeSlotProps {
  /** Slot start time */
  time: Date
  /** Slot duration in minutes */
  duration: number
  /** Events occurring in this slot */
  events: CalendarEvent[]
  /** Current view (to adjust rendering) */
  view: 'day' | 'week'
  /** Callback when clicking empty slot */
  onSlotClick?: (time: Date) => void
  /** Callback when clicking an event */
  onEventClick?: (event: CalendarEvent) => void
  /** Whether to show time label */
  showTimeLabel?: boolean
  /** Whether it's an "all-day" slot */
  isAllDay?: boolean
  /** Additional CSS classes */
  className?: string
}

export function TimeSlot({
  time,
  duration,
  events,
  view,
  onSlotClick,
  onEventClick,
  showTimeLabel = true,
  isAllDay = false,
  className
}: TimeSlotProps) {

  const handleSlotClick = () => {
    onSlotClick?.(time)
  }

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event)
  }

  // Format time for display
  const timeLabel = time.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  // Calculate height based on duration (for weekly view)
  const slotHeight = view === 'week' ? `${duration}px` : 'auto'

  return (
    <div 
      className={cn(
        "relative border-b border-gray-100 transition-colors duration-150",
        "hover:bg-blue-50/30 cursor-pointer",
        {
          'min-h-[60px]': view === 'day' && !isAllDay,
          'min-h-[40px]': view === 'week' && !isAllDay,
          'min-h-[30px]': isAllDay,
          'bg-gray-50/50': isAllDay
        },
        className
      )}
      style={{ 
        height: view === 'week' ? slotHeight : undefined 
      }}
      onClick={handleSlotClick}
    >
      {/* Time label (only in daily view or first weekly slot) */}
      {showTimeLabel && !isAllDay && (
        <div className="absolute left-0 top-0 text-xs text-gray-500 font-medium px-2 py-1">
          {timeLabel}
        </div>
      )}

      {/* Events container */}
      <div className={cn(
        "h-full",
        {
          'pl-16': showTimeLabel && view === 'day', // Space for time label
          'pl-2': !showTimeLabel || view === 'week',
          'pr-2 py-1': true
        }
      )}>
        {events.length > 0 ? (
          <div className={cn(
            "space-y-1 h-full",
            {
              'pt-1': showTimeLabel && view === 'day'
            }
          )}>
            {events.map((event, index) => (
              <AppointmentCard
                key={`${event.id}-${index}`}
                event={event}
                variant={view}
                size={view === 'day' ? 'md' : 'sm'}
                showDetails={view === 'day'}
                onClick={handleEventClick}
                className={cn(
                  {
                    'max-w-full': view === 'week'
                  }
                )}
              />
            ))}
          </div>
        ) : (
          // Clickable empty area
          <div className={cn(
            "h-full min-h-[inherit] w-full",
            "flex items-center justify-center",
            "opacity-0 hover:opacity-10 transition-opacity duration-200",
            "text-gray-400 text-xs font-medium"
          )}>
            {!isAllDay && "Add appointment"}
          </div>
        )}
      </div>

      {/* Half-hour divider line (only in daily view) */}
      {view === 'day' && duration >= 60 && (
        <div 
          className="absolute left-16 right-2 border-t border-gray-100/50"
          style={{ top: '50%' }}
        />
      )}
    </div>
  )
}
