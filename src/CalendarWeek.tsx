/**
 * Componente de vista semanal del calendario
 * 
 * Muestra 7 columnas (días) con filas de intervalos de tiempo
 */

import { cn } from './utils'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  GraduationCap,
  Presentation as PresentationIcon,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Pause
} from 'lucide-react'
import type { CitaCalendarEvent } from './types/cita.types'

interface CalendarWeekProps {
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

// Obtener los días de la semana actual
function getWeekDays(currentDate: Date): Date[] {
  const days: Date[] = []
  const startOfWeek = new Date(currentDate)
  const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
  startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1))
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push(day)
  }
  
  return days
}

// Verificar si un evento está en un slot de tiempo específico
function isEventInTimeSlot(event: CitaCalendarEvent, timeSlot: string, date: Date): boolean {
  const eventDate = new Date(event.start)
  if (eventDate.toDateString() !== date.toDateString()) return false
  
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
function isEventStart(event: CitaCalendarEvent, timeSlot: string, date: Date): boolean {
  const eventDate = new Date(event.start)
  if (eventDate.toDateString() !== date.toDateString()) return false
  
  const [slotHour, slotMinute] = timeSlot.split(':').map(Number)
  const eventHour = eventDate.getHours()
  const eventMinute = eventDate.getMinutes()
  
  // Ajustar a la grilla de 30 minutos más cercana
  const adjustedEventMinute = eventMinute < 30 ? 0 : 30
  
  return eventHour === slotHour && adjustedEventMinute === slotMinute
}

export function CalendarWeek({
  events,
  currentDate,
  selectedDate,
  onDateClick,
  onEventClick,
  loading = false
}: CalendarWeekProps) {
  
  const timeSlots = generateTimeSlots()
  const weekDays = getWeekDays(currentDate)
  const today = new Date()

  // Función para obtener el icono del tipo de cita
  const getEventIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'consulta':
        return <CalendarIcon className="h-3 w-3" />
      case 'reunion':
        return <Users className="h-3 w-3" />
      case 'entrenamiento':
        return <GraduationCap className="h-3 w-3" />
      case 'demo':
        return <PresentationIcon className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  // Función para obtener el icono del estado
  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return <CheckCircle2 className="h-2 w-2 text-green-600" />
      case 'pendiente':
        return <Clock className="h-2 w-2 text-yellow-600" />
      case 'cancelada':
        return <AlertCircle className="h-2 w-2 text-red-600" />
      case 'en proceso':
        return <Pause className="h-2 w-2 text-blue-600" />
      default:
        return <Clock className="h-2 w-2 text-gray-600" />
    }
  }

  // Función para obtener colores basados en el ESTADO de la cita (consistente con CalendarMain)
  const getEventColors = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return {
          bg: 'linear-gradient(135deg, #10b981, #059669)', // Verde
          text: '#ffffff',
          border: '#059669',
          solid: '#10b981'
        }
      case 'pendiente':
        return {
          bg: 'linear-gradient(135deg, #f59e0b, #d97706)', // Amarillo/Naranja
          text: '#ffffff',
          border: '#d97706',
          solid: '#f59e0b'
        }
      case 'cancelada':
        return {
          bg: 'linear-gradient(135deg, #ef4444, #dc2626)', // Rojo
          text: '#ffffff',
          border: '#dc2626',
          solid: '#ef4444'
        }
      case 'completada':
        return {
          bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Azul
          text: '#ffffff',
          border: '#1d4ed8',
          solid: '#3b82f6'
        }
      case 'en_progreso':
      case 'en proceso':
        return {
          bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Púrpura
          text: '#ffffff',
          border: '#7c3aed',
          solid: '#8b5cf6'
        }
      default:
        return {
          bg: 'linear-gradient(135deg, #6b7280, #4b5563)', // Gris
          text: '#ffffff',
          border: '#4b5563',
          solid: '#6b7280'
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8">
          <div className="relative">
            <div className="animate-spin h-10 w-10 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="absolute inset-0 h-10 w-10 border-3 border-blue-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando vista semanal...</h3>
          <p className="text-sm text-muted-foreground">Preparando horarios y eventos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50/30">
      {/* Encabezado con días de la semana mejorado */}
      <div className="flex border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
        {/* Columna de horas */}
        <div className="w-20 flex-shrink-0 border-r-2 border-gray-200 bg-white">
          <div className="h-20 flex items-center justify-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Columnas de días */}
        {weekDays.map((day, index) => {
          const isToday = day.toDateString() === today.toDateString()
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.start)
            return eventDate.toDateString() === day.toDateString()
          })
          
          return (
            <div
              key={index}
              className={cn(
                "flex-1 border-r-2 last:border-r-0 border-gray-200 cursor-pointer transition-all duration-200",
                "hover:bg-white hover:shadow-md hover:scale-[1.02]",
                isSelected && "bg-primary/10 border-primary shadow-md",
                isToday && "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300"
              )}
              onClick={() => onDateClick?.(day)}
            >
              <div className="h-20 flex flex-col items-center justify-center p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div className={cn(
                  "text-xl font-bold transition-all duration-200",
                  isToday ? "text-primary" : "text-gray-900"
                )}>
                  {day.getDate()}
                </div>
                
                {/* Indicador de eventos */}
                <div className="flex items-center space-x-1 mt-1">
                  {dayEvents.length > 0 && (
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      dayEvents.length > 3 ? "bg-red-500 shadow-red-200 shadow-lg" : 
                      dayEvents.length > 1 ? "bg-yellow-500 shadow-yellow-200 shadow-lg" : 
                      "bg-green-500 shadow-green-200 shadow-lg"
                    )} />
                  )}
                  {isToday && (
                    <div className="w-2 h-2 bg-primary rounded-full shadow-lg animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grid de tiempo y eventos mejorado */}
      <div className="flex-1 overflow-auto bg-white">
        {timeSlots.map((timeSlot, slotIndex) => (
          <div key={timeSlot} className={cn(
            "flex border-b border-gray-100 min-h-[70px] transition-all duration-150",
            slotIndex % 2 === 0 && "bg-gray-50/30" // Alternar colores para mejor legibilidad
          )}>
            {/* Columna de hora mejorada */}
            <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-white flex items-start justify-end pr-4 pt-3">
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {timeSlot}
                </span>
              </div>
            </div>
            
            {/* Columnas de días */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = events.filter(event => {
                const eventDate = new Date(event.start)
                return eventDate.toDateString() === day.toDateString()
              })
              
              const eventsInSlot = dayEvents.filter(event => 
                isEventInTimeSlot(event, timeSlot, day)
              )
              
              const isToday = day.toDateString() === today.toDateString()
              
              return (
                <div
                  key={`${timeSlot}-${dayIndex}`}
                  className={cn(
                    "flex-1 border-r last:border-r-0 border-gray-200 p-1 relative cursor-pointer transition-all duration-200 min-h-[70px]",
                    "hover:bg-blue-50/50 hover:shadow-inner",
                    isToday && "bg-blue-50/20"
                  )}
                  onClick={() => onDateClick?.(day)}
                >
                  {/* Renderizar eventos que comienzan en este slot con diseño mejorado */}
                  {eventsInSlot.map(event => {
                    if (!isEventStart(event, timeSlot, day)) return null
                    
                    const duration = getEventDuration(event)
                    const colors = getEventColors(event.extendedProps.cita.estado)
                    const tipoIcon = getEventIcon(event.extendedProps.tipo)
                    const statusIcon = getStatusIcon(event.extendedProps.cita.estado)
                    
                    return (
                      <div key={event.id} className="group relative">
                        <div
                          className={cn(
                            "absolute left-1 right-1 rounded-lg text-xs cursor-pointer z-10 transition-all duration-200",
                            "hover:scale-105 hover:shadow-xl hover:z-20 border-l-4 shadow-md",
                            "flex flex-col justify-start font-medium p-2"
                          )}
                          style={{
                            background: colors.bg,
                            color: colors.text,
                            borderLeftColor: colors.border,
                            height: `${duration * 70 - 4}px`, // 70px por slot menos padding
                            top: '2px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick?.(event)
                          }}
                        >
                          {/* Header del evento */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-1">
                              {tipoIcon}
                              <span className="font-bold text-xs">
                                {new Date(event.start).toLocaleTimeString('es-ES', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            {statusIcon}
                          </div>
                          
                          {/* Título del evento */}
                          <div className="font-bold truncate mb-1 text-sm">
                            {event.title}
                          </div>
                          
                          {/* Ubicación */}
                          <div className="flex items-center space-x-1 opacity-90">
                            <MapPin className="h-2.5 w-2.5" />
                            <span className="truncate text-xs">
                              {event.extendedProps.local}
                            </span>
                          </div>
                          
                          {/* Duración si es más de 30 minutos */}
                          {duration > 1 && (
                            <div className="text-xs opacity-75 mt-1">
                              {duration * 30} min
                            </div>
                          )}
                        </div>

                        {/* Tooltip mejorado al hacer hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-max max-w-xs shadow-xl">
                          <div className="font-semibold mb-2">{event.title}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(event.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(event.end).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{event.extendedProps.local}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(event.extendedProps.cita.estado)}
                              <span className="capitalize">{event.extendedProps.cita.estado}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getEventIcon(event.extendedProps.tipo)}
                              <span className="capitalize">{event.extendedProps.tipo}</span>
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
