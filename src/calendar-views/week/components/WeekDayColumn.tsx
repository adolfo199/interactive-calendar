/**
 * Week Day Column Component
 * Displays a single day column with time slots and events
 */

import React from 'react'
import { cn } from '../../../utils'
import { AppointmentCard } from '../../shared'
import type { CalendarEvent } from '../../../types/appointment.types'

interface WeekDayColumnProps {
  /** Date for this column */
  date: Date
  /** Array of time slots */
  timeSlots: string[]
  /** Events for this day */
  events: CalendarEvent[]
  /** Whether this day is selected */
  isSelected?: boolean
  /** Whether this day is today */
  isToday?: boolean
  /** Callback when a time slot is clicked */
  onSlotClick?: (date: Date, timeSlot: string) => void
  /** Callback when an event is clicked */
  onEventClick?: (event: CalendarEvent) => void
  /** Additional CSS classes */
  className?: string
}

// Helper functions (moved from main CalendarWeek)
function isEventInTimeSlot(event: CalendarEvent, timeSlot: string, date: Date): boolean {
  const eventDate = new Date(event.start)
  if (eventDate.toDateString() !== date.toDateString()) return false
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const slotTime = slotHour * 60 + slotMinute
  
  const eventStartTime = eventDate.getHours() * 60 + eventDate.getMinutes()
  const eventEndTime = new Date(event.end).getHours() * 60 + new Date(event.end).getMinutes()
  
  return eventStartTime <= slotTime && eventEndTime > slotTime
}

function isEventStart(event: CalendarEvent, timeSlot: string, date: Date): boolean {
  const eventDate = new Date(event.start)
  if (eventDate.toDateString() !== date.toDateString()) return false
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const eventHour = eventDate.getHours()
  const eventMinute = eventDate.getMinutes()
  
  // Adjust to nearest 30-minute grid
  const adjustedEventMinute = eventMinute < 30 ? 0 : 30
  
  return eventHour === slotHour && adjustedEventMinute === slotMinute
}

function getEventDuration(event: CalendarEvent): number {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  return Math.ceil(durationMinutes / 30) // Round up to 30-min slots
}

export function WeekDayColumn({
  date,
  timeSlots,
  events,
  isSelected = false,
  isToday = false,
  onSlotClick,
  onEventClick,
  className
}: WeekDayColumnProps) {

  const handleSlotClick = (timeSlot: string) => {
    // Create a date object for this specific time slot
    const [hour, minute] = timeSlot.split(':').map(Number)
    const slotDate = new Date(date)
    slotDate.setHours(hour, minute, 0, 0)
    
    onSlotClick?.(slotDate, timeSlot)
  }

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event)
  }

  return (
    <div className={cn('space-y-0', className)}>
      {timeSlots.map((timeSlot, index) => {
        const slotEvents = events.filter(event => 
          isEventInTimeSlot(event, timeSlot, date)
        )
        
        const isHour = timeSlot.endsWith(':00')
        
        return (
          <div
            key={timeSlot}
            className={cn(
              'h-12 border-r border-gray-200 relative cursor-pointer transition-colors duration-150',
              'hover:bg-blue-50/30',
              {
                'border-b': index < timeSlots.length - 1,
                'border-b-gray-300': isHour,
                'border-b-gray-100': !isHour,
                'bg-blue-50/20': isSelected,
                'bg-yellow-50/20': isToday && !isSelected
              }
            )}
            style={{ minHeight: '48px' }}
            onClick={() => handleSlotClick(timeSlot)}
          >
            {/* Render events that start in this slot */}
            {slotEvents.map(event => {
              if (!isEventStart(event, timeSlot, date)) return null
              
              const duration = getEventDuration(event)
              const eventHeight = Math.max(duration * 48, 24) // Minimum 24px height
              
              return (
                <div
                  key={event.id}
                  className="absolute left-1 right-1 z-10"
                  style={{ 
                    height: `${eventHeight}px`,
                    maxHeight: `${duration * 48}px`
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEventClick(event)
                  }}
                >
                  <AppointmentCard
                    event={event}
                    variant="week"
                    size="sm"
                    showDetails={false}
                    showTooltip={true}
                    onClick={handleEventClick}
                    className="h-full text-xs"
                  />
                </div>
              )
            })}
            
            {/* Empty slot indicator */}
            {slotEvents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-10 transition-opacity duration-200">
                <span className="text-xs text-gray-400">+</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
