/**
 * Types for the Appointment module
 * 
 * Defines interfaces and types used throughout the appointment management system
 */

// Appointment status types
export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

// Appointment types  
export type AppointmentType = 'meeting' | 'consultation' | 'maintenance' | 'event' | 'reservation' | 'training' | 'demo'

// Calendar view types
export type CalendarView = 'month' | 'week' | 'day'

// Main Appointment interface
export interface Appointment {
  id: number
  code: string
  title: string
  description?: string
  
  // References
  company_id: number
  branch_id: number
  location_id: number
  category_id?: number
  
  // Client/Requester
  client_name: string
  client_email?: string
  client_phone?: string
  
  // Date and time
  date: string // ISO date
  start_time: string // HH:mm format
  end_time: string // HH:mm format
  duration_minutes: number
  
  // Configuration
  type: AppointmentType
  status: AppointmentStatus
  participants: number
  
  // Metadata
  notes?: string
  configuration?: Record<string, unknown>
  
  // Audit
  created_at: string
  updated_at: string
  created_by: number
  modified_by: number
  
  // Relations (when included)
  company?: {
    id: number
    name: string
    code: string
  }
  branch?: {
    id: number
    name: string
    code: string
    address: string
  }
  location?: {
    id: number
    name: string
    code: string
    capacity: number
    category?: {
      id: number
      name: string
      color: string
    }
  }
}

// Calendar event (simplified version)
export interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  allDay: boolean
  color?: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps: {
    appointment: Appointment
    status: AppointmentStatus
    type: AppointmentType
    location: string
    participants: number
  }
}

// Create/edit form data
export interface AppointmentFormData {
  title: string
  description?: string
  branch_id: number
  location_id: number
  category_id?: number
  client_name: string
  client_email?: string
  client_phone?: string
  date: string
  start_time: string
  end_time: string
  type: AppointmentType
  participants: number
  notes?: string
}

// Search filters
export interface AppointmentFilters {
  date_from?: string
  date_to?: string
  branch_id?: number
  location_id?: number
  status?: AppointmentStatus[]
  type?: AppointmentType[]
  client?: string
}

// Available time slot
export interface TimeSlot {
  time: string // HH:mm
  available: boolean
  conflicts?: Appointment[]
  reason?: string // Reason why it's not available
}

// Location availability for a day
export interface LocationAvailability {
  location_id: number
  location_name: string
  date: string
  slots: TimeSlot[]
  opening_time: string
  closing_time: string
  blocked: boolean
  block_reason?: string
}

// Schedule configuration
export interface ScheduleConfig {
  opening: string // HH:mm
  closing: string // HH:mm
  slot_duration: number // minutes
  available_slots: string[] // ['09:00', '09:30', ...]
  working_days: number[] // [1,2,3,4,5] (Monday to Friday)
}

// Schedule conflict
export interface ScheduleConflict {
  type: 'overlap' | 'capacity' | 'closed' | 'blocked'
  message: string
  conflicting_appointments?: Appointment[]
  suggestions?: string[]
}

// Appointment statistics
export interface AppointmentStatistics {
  total: number
  by_status: Record<AppointmentStatus, number>
  by_type: Record<AppointmentType, number>
  average_occupancy: number
  most_used_locations: Array<{
    location_id: number
    location_name: string
    total_appointments: number
  }>
  peak_hours: Array<{
    hour: string
    total_appointments: number
  }>
}

// Common props for components
export interface CalendarProps {
  events: CalendarEvent[]
  view: CalendarView
  currentDate: Date
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onViewChange?: (view: CalendarView) => void
  onDateChange?: (date: Date) => void
  onCreateEvent?: (date?: Date) => void
  loading?: boolean
  className?: string
}

// API response types
export interface AppointmentResponse {
  success: boolean
  data: Appointment
  message?: string
}

export interface AppointmentListResponse {
  success: boolean
  data: Appointment[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
  message?: string
}

export interface AvailabilityResponse {
  success: boolean
  data: LocationAvailability[]
  message?: string
}

// Legacy types for backward compatibility (will be deprecated)
/** @deprecated Use AppointmentStatus instead */
export type EstadoCita = AppointmentStatus

/** @deprecated Use AppointmentType instead */
export type TipoCita = AppointmentType

/** @deprecated Use CalendarView instead */
export type VistaCalendario = CalendarView

/** @deprecated Use Appointment instead */
export type Cita = Appointment

/** @deprecated Use CalendarEvent instead */
export type CitaCalendarEvent = CalendarEvent
