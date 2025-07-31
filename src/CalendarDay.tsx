/**
 * Componente de vista diaria del calendario
 * 
 * Muestra una columna con intervalos de tiempo para un día específico
 */

import { cn } from './utils'
import type { CitaCalendarEvent } from './types/cita.types'

interface CalendarDayProps {
  events: CitaCalendarEvent[]
  currentDate: Date
  selectedDate: Date | null
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CitaCalendarEvent) => void
  loading?: boolean
}

// Generar intervalos de tiempo de 30 minutos
function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

// Verificar si un evento está en un slot de tiempo específico
function isEventInTimeSlot(event: CitaCalendarEvent, timeSlot: string): boolean {
  const eventDate = new Date(event.start)
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const slotTime = slotHour * 60 + slotMinute
  
  const eventStartTime = eventDate.getHours() * 60 + eventDate.getMinutes()
  const eventEndTime = new Date(event.end).getHours() * 60 + new Date(event.end).getMinutes()
  
  return eventStartTime <= slotTime && eventEndTime > slotTime
}

// Calcular la duración del evento en slots
function getEventDuration(event: CitaCalendarEvent): number {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
  return Math.ceil(durationMinutes / 30) // Redondear hacia arriba a slots de 30 min
}

// Verificar si es el primer slot del evento
function isEventStart(event: CitaCalendarEvent, timeSlot: string): boolean {
  const eventDate = new Date(event.start)
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const eventHour = eventDate.getHours()
  const eventMinute = eventDate.getMinutes()
  
  // Ajustar a la grilla de 30 minutos más cercana
  const adjustedEventMinute = eventMinute < 30 ? 0 : 30
  
  return eventHour === slotHour && adjustedEventMinute === slotMinute
}

export function CalendarDay({
  events,
  currentDate,
  onDateClick,
  onEventClick,
  loading = false
}: CalendarDayProps) {
  
  const timeSlots = generateTimeSlots()
  const today = new Date()
  const isToday = currentDate.toDateString() === today.toDateString()
  
  // Filtrar eventos del día actual
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start)
    return eventDate.toDateString() === currentDate.toDateString()
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Cargando vista diaria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Encabezado del día */}
      <div className="border-b bg-muted/30">
        <div 
          className={cn(
            "h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
            isToday && "bg-blue-50"
          )}
          onClick={() => onDateClick?.(currentDate)}
        >
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            {currentDate.toLocaleDateString('es-ES', { weekday: 'long' })}
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isToday && "text-primary"
          )}>
            {currentDate.getDate()}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </div>
          {isToday && (
            <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
          )}
        </div>
      </div>

      {/* Resumen de eventos del día */}
      {dayEvents.length > 0 && (
        <div className="border-b bg-muted/10 p-4">
          <div className="text-sm font-medium mb-2">
            {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''} programado{dayEvents.length !== 1 ? 's' : ''}
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
                {event.extendedProps.estado}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de tiempo y eventos */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Columna de horas */}
          <div className="w-20 flex-shrink-0 border-r bg-background">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="h-16 border-b border-border/50 flex items-start justify-end pr-3 pt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {timeSlot}
                </span>
              </div>
            ))}
          </div>
          
          {/* Columna de eventos */}
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
                  {/* Renderizar eventos que comienzan en este slot */}
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
                          height: `${duration * 64 - 4}px`, // 64px por slot menos padding
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
                          📍 {event.extendedProps.local}
                        </div>
                        <div className="text-xs opacity-90 mb-1">
                          👤 {event.extendedProps.cita.cliente_nombre}
                        </div>
                        <div className="text-xs opacity-75">
                          ⏰ {new Date(event.start).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(event.end).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {event.extendedProps.participantes > 1 && (
                          <div className="text-xs opacity-75">
                            👥 {event.extendedProps.participantes} participantes
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
