/**
 * Calendar utilities
 * 
 * Helper functions for date, schedule and event manipulation
 */

import { format, addDays, startOfWeek, startOfMonth, isSameDay, isSameMonth, isToday, addMinutes, isAfter, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Appointment, CalendarEvent, TimeSlot, AppointmentStatus, AppointmentType, ScheduleConflict } from '../types/appointment.types'

/**
 * Generates array of days for the monthly calendar view
 * Includes days from previous and next month to complete the grid
 */
export function getCalendarDays(date: Date): Date[] {
  const startDate = startOfWeek(startOfMonth(date), { weekStartsOn: 1 }) // Empezar el lunes
  const days: Date[] = []
  
  // Generar 42 días (6 semanas x 7 días)
  for (let i = 0; i < 42; i++) {
    days.push(addDays(startDate, i))
  }
  
  return days
}

/**
 * Genera array de días para la vista semanal
 */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const days: Date[] = []
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i))
  }
  
  return days
}

/**
 * Converts an appointment to a calendar event
 */
export function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  const baseDate = new Date(appointment.date)
  const [startHours, startMinutes] = appointment.start_time.split(':').map(Number)
  const [endHours, endMinutes] = appointment.end_time.split(':').map(Number)
  
  const start = new Date(baseDate)
  start.setHours(startHours, startMinutes, 0, 0)
  
  const end = new Date(baseDate)
  end.setHours(endHours, endMinutes, 0, 0)
  
  return {
    id: appointment.id,
    title: appointment.title,
    start,
    end,
    allDay: false,
    color: getStatusColor(appointment.status),
    backgroundColor: getStatusColor(appointment.status),
    borderColor: getStatusColor(appointment.status, 'border'),
    textColor: getStatusTextColor(appointment.status),
    extendedProps: {
      appointment,
      status: appointment.status,
      type: appointment.type,
      location: appointment.location?.name || 'Location not specified',
      participants: appointment.participants,
    }
  }
}

/**
 * Gets the color according to the appointment status
 */
export function getStatusColor(status: AppointmentStatus, variant: 'bg' | 'border' = 'bg'): string {
  const colors = {
    pending: {
      bg: '#fbbf24', // yellow-400
      border: '#f59e0b' // yellow-500
    },
    confirmed: {
      bg: '#22c55e', // green-500
      border: '#16a34a' // green-600
    },
    in_progress: {
      bg: '#3b82f6', // blue-500
      border: '#2563eb' // blue-600
    },
    completed: {
      bg: '#10b981', // emerald-500
      border: '#059669' // emerald-600
    },
    cancelled: {
      bg: '#ef4444', // red-500
      border: '#dc2626' // red-600
    }
  }
  
  return colors[status][variant]
}

/**
 * Gets the text color according to the status
 */
export function getStatusTextColor(status: AppointmentStatus): string {
  // All statuses have white text except pending
  return status === 'pending' ? '#1f2937' : '#ffffff'
}

/**
 * Gets the color according to the appointment type
 */
export function getTypeColor(type: AppointmentType): string {
  const colors = {
    meeting: '#3b82f6', // blue-500
    consultation: '#10b981', // emerald-500
    maintenance: '#f59e0b', // amber-500
    event: '#8b5cf6', // violet-500
    reservation: '#06b6d4', // cyan-500
    training: '#e11d48', // rose-600
    demo: '#7c3aed' // violet-600
  }
  
  return colors[type] || '#6b7280' // gray-500 as fallback
}

/**
 * Generates available time slots for a specific date
 */
export function generateTimeSlots(
  date: Date,
  openingTime: string = '09:00',
  closingTime: string = '18:00',
  slotDuration: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const [openingHours, openingMinutes] = openingTime.split(':').map(Number)
  const [closingHours, closingMinutes] = closingTime.split(':').map(Number)
  
  const opening = new Date(date)
  opening.setHours(openingHours, openingMinutes, 0, 0)
  
  const closing = new Date(date)
  closing.setHours(closingHours, closingMinutes, 0, 0)
  
  let currentTime = new Date(opening)
  
  while (isBefore(currentTime, closing)) {
    slots.push({
      time: format(currentTime, 'HH:mm'),
      available: true
    })
    
    currentTime = addMinutes(currentTime, slotDuration)
  }
  
  return slots
}

/**
 * Checks for schedule conflicts
 */
export function checkScheduleConflict(
  newAppointment: {
    date: string
    start_time: string
    end_time: string
    location_id: number
    participants: number
  },
  existingAppointments: Appointment[],
  locationCapacity: number
): ScheduleConflict | null {
  // Convert to Date objects for comparison
  const newDate = new Date(newAppointment.date)
  const [startH, startM] = newAppointment.start_time.split(':').map(Number)
  const [endH, endM] = newAppointment.end_time.split(':').map(Number)
  
  const newStart = new Date(newDate)
  newStart.setHours(startH, startM, 0, 0)
  
  const newEnd = new Date(newDate)
  newEnd.setHours(endH, endM, 0, 0)
  
  // Filter appointments in the same location and date, excluding cancelled ones
  const appointmentsSameLocation = existingAppointments.filter(appointment => 
    appointment.location_id === newAppointment.location_id &&
    appointment.date === newAppointment.date &&
    appointment.status !== 'cancelled'
  )
  
  // Check for time overlaps
  const conflictingAppointments = appointmentsSameLocation.filter(appointment => {
    const [cStartH, cStartM] = appointment.start_time.split(':').map(Number)
    const [cEndH, cEndM] = appointment.end_time.split(':').map(Number)
    
    const appointmentStart = new Date(newDate)
    appointmentStart.setHours(cStartH, cStartM, 0, 0)
    
    const appointmentEnd = new Date(newDate)
    appointmentEnd.setHours(cEndH, cEndM, 0, 0)
    
    // Check if there's overlap
    return (
      (isAfter(newStart, appointmentStart) && isBefore(newStart, appointmentEnd)) ||
      (isAfter(newEnd, appointmentStart) && isBefore(newEnd, appointmentEnd)) ||
      (isBefore(newStart, appointmentStart) && isAfter(newEnd, appointmentEnd)) ||
      (newStart.getTime() === appointmentStart.getTime())
    )
  })
  
  if (conflictingAppointments.length > 0) {
    return {
      type: 'overlap',
      message: `Schedule conflict with ${conflictingAppointments.length} existing appointment(s)`,
      conflicting_appointments: conflictingAppointments,
      suggestions: [
        'Select a different time',
        'Choose a different location',
        'Modify the appointment duration'
      ]
    }
  }
  
  // Check capacity (sum of participants in the same time slot)
  const participantsInSlot = appointmentsSameLocation
    .filter(appointment => {
      const [cStartH, cStartM] = appointment.start_time.split(':').map(Number)
      const [cEndH, cEndM] = appointment.end_time.split(':').map(Number)
      
      const appointmentStart = new Date(newDate)
      appointmentStart.setHours(cStartH, cStartM, 0, 0)
      
      const appointmentEnd = new Date(newDate)
      appointmentEnd.setHours(cEndH, cEndM, 0, 0)
      
      // Partial or total overlap
      return !(isAfter(newStart, appointmentEnd) || isBefore(newEnd, appointmentStart))
    })
    .reduce((total, appointment) => total + appointment.participants, 0)
  
  if (participantsInSlot + newAppointment.participants > locationCapacity) {
    return {
      type: 'capacity',
      message: `Capacity exceeded. Location: ${locationCapacity}, Requested: ${participantsInSlot + newAppointment.participants}`,
      suggestions: [
        'Reduce the number of participants',
        'Select a location with greater capacity',
        'Split the appointment into multiple sessions'
      ]
    }
  }
  
  return null
}

/**
 * Formats a date for display
 */
export function formatDateForDisplay(date: Date, formatStr: string = 'dd/MM/yyyy'): string {
  return format(date, formatStr, { locale: es })
}

/**
 * Formats a time range
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`
}

/**
 * Calcula la duración en minutos entre dos horas
 */
export function calculateDuration(horaInicio: string, horaFin: string): number {
  const [inicioH, inicioM] = horaInicio.split(':').map(Number)
  const [finH, finM] = horaFin.split(':').map(Number)
  
  const inicio = inicioH * 60 + inicioM
  const fin = finH * 60 + finM
  
  return fin - inicio
}

/**
 * Verifica si una fecha está dentro del horario laboral
 */
export function isWorkingDay(date: Date, diasLaborales: number[] = [1, 2, 3, 4, 5]): boolean {
  const dayOfWeek = date.getDay()
  // Convertir domingo (0) a lunes (1) como primer día
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek
  return diasLaborales.includes(adjustedDay)
}

/**
 * Gets events for a specific day
 */
export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => isSameDay(event.start, date))
}

/**
 * Checks if a date is today
 */
export function isDateToday(date: Date): boolean {
  return isToday(date)
}

/**
 * Checks if a date belongs to the current displayed month
 */
export function isDateInCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth)
}
