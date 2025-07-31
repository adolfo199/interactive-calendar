/**
 * Daily calendar view component
 * 
 * Shows a column with time intervals for a specific day
 */

import { cn } from './utils'
import type { CalendarEvent } from './types/appointment.types'
import { useCalendarTranslations } from './hooks/useCalendarTranslations'

interface CalendarDayProps {
  events: CalendarEvent[]
  currentDate: Date
  selectedDate: Date | null
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  loading?: boolean
  locale?: string
}

// Generate 30-minute time slots
function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

// Check if an event is in a specific time slot
function isEventInTimeSlot(event: CalendarEvent, timeSlot: string): boolean {
  const eventDate = new Date(event.start)
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const slotTime = slotHour * 60 + slotMinute
  
  const eventStartTime = eventDate.getHours() * 60 + eventDate.getMinutes()
  const eventEndTime = new Date(event.end).getHours() * 60 + new Date(event.end).getMinutes()
  
  return eventStartTime <= slotTime && eventEndTime > slotTime
}

// Calculate event duration in slots
function getEventDuration(event: CalendarEvent): number {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  return Math.ceil(durationMinutes / 30) // Round up to 30-min slots
}

// Check if it's the first slot of the event
function isEventStart(event: CalendarEvent, timeSlot: string): boolean {
  const eventDate = new Date(event.start)
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const eventHour = eventDate.getHours()
  const eventMinute = eventDate.getMinutes()
  
  // Adjust to nearest 30-minute grid
  const adjustedEventMinute = eventMinute < 30 ? 0 : 30
  
  return eventHour === slotHour && adjustedEventMinute === slotMinute
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
  const timeSlots = generateTimeSlots()
  const today = new Date()
  const isToday = currentDate.toDateString() === today.toDateString()
  
  // Convert locale to browser locale format
  const browserLocale = locale === 'en' ? 'en-US' : 'es-ES'
  
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
      {/* Day header */}
      <div className="border-b bg-muted/30">
        <div 
          className={cn(
            "h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
            isToday && "bg-blue-50"
          )}
          onClick={() => onDateClick?.(currentDate)}
        >
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            {currentDate.toLocaleDateString(browserLocale, { weekday: 'long' })}
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isToday && "text-primary"
          )}>
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentDate.toLocaleDateString(browserLocale, { month: 'long', year: 'numeric' })}
          </div>
          {isToday && (
            <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
          )}
        </div>
      </div>

      {/* Day events summary */}
      {dayEvents.length > 0 && (
        <div className="border-b bg-muted/10 p-4">
          <div className="text-sm font-medium mb-2">
            {locale === 'en' 
              ? `${dayEvents.length} scheduled ${dayEvents.length === 1 ? 'appointment' : 'appointments'}`
              : `${dayEvents.length} evento${dayEvents.length !== 1 ? 's' : ''} programado${dayEvents.length !== 1 ? 's' : ''}`
            }
          </div>
          <div className="flex flex-wrap gap-2">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: event.backgroundColor,
                  color: event.textColor
                }}
                onClick={() => onEventClick?.(event)}
                title={event.title}
              >
                {t(`appointments:status.${event.extendedProps.status}`)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time grid and events */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 flex-shrink-0 border-r bg-background">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="h-16 border-b border-border/50 flex items-start justify-end pr-3 pt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {timeSlot}
                </span>
              </div>
            ))}
          </div>
          
          {/* Events column */}
          <div className="flex-1 relative">
            {timeSlots.map((timeSlot) => {
              const eventsInSlot = dayEvents.filter(event => 
                isEventInTimeSlot(event, timeSlot)
              )
              
              return (
                <div
                  key={timeSlot}
                  className={cn(
                    "h-16 border-b border-border/50 p-1 relative hover:bg-muted/30 cursor-pointer transition-colors",
                    isToday && "bg-blue-50/30"
                  )}
                  onClick={() => onDateClick?.(currentDate)}
                >
                  {/* Render events that start in this slot */}
                  {eventsInSlot.map(event => {
                    if (!isEventStart(event, timeSlot)) return null
                    
                    const duration = getEventDuration(event)
                    
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-1 right-1 rounded p-2 cursor-pointer hover:opacity-80 transition-opacity z-10",
                          "flex flex-col justify-center font-medium shadow-lg border"
                        )}
                        style={{
                          backgroundColor: event.backgroundColor,
                          color: event.textColor,
                          height: `${duration * 64 - 4}px`, // 64px per slot minus padding
                          top: '2px',
                          borderColor: event.borderColor
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                      >
                        <div className="font-semibold text-sm mb-1">
                          {event.title}
                        </div>
                        <div className="text-xs opacity-90 mb-1">
                          📍 {event.extendedProps.location}
                        </div>
                        <div className="text-xs opacity-90 mb-1">
                          👤 {event.extendedProps.appointment.client_name}
                        </div>
                        <div className="text-xs opacity-75">
                          ⏰ {new Date(event.start).toLocaleTimeString(browserLocale, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(event.end).toLocaleTimeString(browserLocale, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {event.extendedProps.participants > 1 && (
                          <div className="text-xs opacity-75">
                            👥 {event.extendedProps.participants} {locale === 'en' ? 'participants' : 'participantes'}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
