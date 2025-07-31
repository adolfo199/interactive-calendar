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
import type { CalendarEvent } from './types/appointment.types'
import { useCalendarTranslations } from './hooks/useCalendarTranslations'

interface CalendarWeekProps {
  events: CalendarEvent[]
  currentDate: Date
  selectedDate: Date | null
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  loading?: boolean
  locale?: string
  getWeekDays?: () => string[]
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

// Get the days of the current week
function getWeekDates(currentDate: Date): Date[] {
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

// Check if an event is in a specific time slot
function isEventInTimeSlot(event: CalendarEvent, timeSlot: string, date: Date): boolean {
  const eventDate = new Date(event.start)
  if (eventDate.toDateString() !== date.toDateString()) return false
  
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

export function CalendarWeek({
  events,
  currentDate,
  selectedDate,
  onDateClick,
  onEventClick,
  loading = false,
  locale = 'es',
  getWeekDays
}: CalendarWeekProps) {
  
  const { t } = useCalendarTranslations({ locale: locale as 'en' | 'es' })
  const timeSlots = generateTimeSlots()
  const weekDays = getWeekDates(currentDate)
  const weekDayNames = getWeekDays?.() || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date()

  // Convert locale to browser locale format
  const browserLocale = locale === 'en' ? 'en-US' : 'es-ES'

  // Función para obtener el icono del tipo de cita
  // Helper functions to map from Spanish to English (for backward compatibility)
  const mapStatusToEnglish = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'confirmada': return 'confirmed'
      case 'pendiente': return 'pending'
      case 'cancelada': return 'cancelled'
      case 'completada': return 'completed'
      case 'en_progreso': 
      case 'en proceso': return 'in_progress'
      default: return status.toLowerCase()
    }
  }

  const mapTypeToEnglish = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'consulta': return 'consultation'
      case 'reunion': return 'meeting'
      case 'entrenamiento': return 'training'
      default: return type.toLowerCase()
    }
  }

  // Function to get event icon based on appointment type
  const getEventIcon = (type: string) => {
    const englishType = mapTypeToEnglish(type)
    switch (englishType) {
      case 'consultation':
        return <CalendarIcon className="h-3 w-3" />
      case 'meeting':
        return <Users className="h-3 w-3" />
      case 'training':
        return <GraduationCap className="h-3 w-3" />
      case 'demo':
        return <PresentationIcon className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    const englishStatus = mapStatusToEnglish(status)
    switch (englishStatus) {
      case 'confirmed':
        return <CheckCircle2 className="h-2 w-2 text-green-600" />
      case 'pending':
        return <Clock className="h-2 w-2 text-yellow-600" />
      case 'cancelled':
        return <AlertCircle className="h-2 w-2 text-red-600" />
      case 'in_progress':
        return <Pause className="h-2 w-2 text-blue-600" />
      default:
        return <Clock className="h-2 w-2 text-gray-600" />
    }
  }

  // Function to get colors based on appointment STATUS (consistent with CalendarMain)
  const getEventColors = (status: string) => {
    const englishStatus = mapStatusToEnglish(status)
    switch (englishStatus) {
      case 'confirmed':
        return {
          bg: 'linear-gradient(135deg, #10b981, #059669)', // Green
          text: '#ffffff',
          border: '#059669',
          solid: '#10b981'
        }
      case 'pending':
        return {
          bg: 'linear-gradient(135deg, #f59e0b, #d97706)', // Yellow/Orange
          text: '#ffffff',
          border: '#d97706',
          solid: '#f59e0b'
        }
      case 'cancelled':
        return {
          bg: 'linear-gradient(135deg, #ef4444, #dc2626)', // Red
          text: '#ffffff',
          border: '#dc2626',
          solid: '#ef4444'
        }
      case 'completed':
        return {
          bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
          text: '#ffffff',
          border: '#1d4ed8',
          solid: '#3b82f6'
        }
      case 'in_progress':
        return {
          bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Purple
          text: '#ffffff',
          border: '#7c3aed',
          solid: '#8b5cf6'
        }
      default:
        return {
          bg: 'linear-gradient(135deg, #6b7280, #4b5563)', // Gray
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('loading.weeklyView')}</h3>
          <p className="text-sm text-muted-foreground">{t('loading.schedules')}</p>
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
                  {weekDayNames[index]}
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
                    const colors = getEventColors(event.extendedProps.status)
                    const tipoIcon = getEventIcon(event.extendedProps.type)
                    const statusIcon = getStatusIcon(event.extendedProps.status)
                    
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
                                {new Date(event.start).toLocaleTimeString(browserLocale, { 
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
                              {event.extendedProps.location}
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
                                {new Date(event.start).toLocaleTimeString(browserLocale, { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(event.end).toLocaleTimeString(browserLocale, { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{event.extendedProps.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(event.extendedProps.status)}
                              <span className="capitalize">{event.extendedProps.status}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getEventIcon(event.extendedProps.type)}
                              <span className="capitalize">{event.extendedProps.type}</span>
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
