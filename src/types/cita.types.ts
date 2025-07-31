/**
 * Tipos para el módulo de Citas
 * 
 * Define las interfaces y tipos utilizados en todo el sistema de gestión de citas
 */

// Estados de las citas
export type EstadoCita = 'pendiente' | 'confirmada' | 'en_progreso' | 'completada' | 'cancelada'

// Tipos de citas
export type TipoCita = 'reunion' | 'consulta' | 'mantenimiento' | 'evento' | 'reserva' | 'entrenamiento' | 'demo'

// Vista del calendario
export type VistaCalendario = 'month' | 'week' | 'day'

// Interfaz principal de Cita
export interface Cita {
  id: number
  codigo: string
  titulo: string
  descripcion?: string
  
  // Referencias
  empresa_id: number
  sucursal_id: number
  local_id: number
  categoria_id?: number
  
  // Cliente/Solicitante
  cliente_nombre: string
  cliente_email?: string
  cliente_telefono?: string
  
  // Fecha y hora
  fecha: string // ISO date
  hora_inicio: string // HH:mm format
  hora_fin: string // HH:mm format
  duracion_minutos: number
  
  // Configuración
  tipo: TipoCita
  estado: EstadoCita
  participantes: number
  
  // Metadatos
  observaciones?: string
  configuracion?: Record<string, unknown>
  
  // Auditoría
  created_at: string
  updated_at: string
  created_by: number
  modified_by: number
  
  // Relaciones (cuando están incluidas)
  empresa?: {
    id: number
    nombre: string
    codigo: string
  }
  sucursal?: {
    id: number
    nombre: string
    codigo: string
    direccion: string
  }
  local?: {
    id: number
    nombre: string
    codigo: string
    capacidad: number
    categoria?: {
      id: number
      nombre: string
      color: string
    }
  }
}

// Evento para el calendario (versión simplificada)
export interface CitaCalendarEvent {
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
    cita: Cita
    estado: EstadoCita
    tipo: TipoCita
    local: string
    participantes: number
  }
}

// Formulario de creación/edición
export interface CitaFormData {
  titulo: string
  descripcion?: string
  sucursal_id: number
  local_id: number
  categoria_id?: number
  cliente_nombre: string
  cliente_email?: string
  cliente_telefono?: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  tipo: TipoCita
  participantes: number
  observaciones?: string
}

// Filtros para búsqueda
export interface CitaFilters {
  fecha_desde?: string
  fecha_hasta?: string
  sucursal_id?: number
  local_id?: number
  estado?: EstadoCita[]
  tipo?: TipoCita[]
  cliente?: string
}

// Slot de tiempo disponible
export interface TimeSlot {
  hora: string // HH:mm
  disponible: boolean
  conflictos?: Cita[]
  motivo?: string // Razón por la que no está disponible
}

// Disponibilidad de un local en un día
export interface LocalDisponibilidad {
  local_id: number
  local_nombre: string
  fecha: string
  slots: TimeSlot[]
  horario_apertura: string
  horario_cierre: string
  bloqueado: boolean
  motivo_bloqueo?: string
}

// Configuración de horarios
export interface HorarioConfig {
  apertura: string // HH:mm
  cierre: string // HH:mm
  slot_duracion: number // minutos
  slots_disponibles: string[] // ['09:00', '09:30', ...]
  dias_laborales: number[] // [1,2,3,4,5] (lunes a viernes)
}

// Conflicto de horario
export interface ConflictoHorario {
  tipo: 'overlap' | 'capacity' | 'closed' | 'blocked'
  mensaje: string
  citas_conflicto?: Cita[]
  sugerencias?: string[]
}

// Estadísticas de citas
export interface CitaEstadisticas {
  total: number
  por_estado: Record<EstadoCita, number>
  por_tipo: Record<TipoCita, number>
  ocupacion_promedio: number
  locales_mas_usados: Array<{
    local_id: number
    local_nombre: string
    total_citas: number
  }>
  horas_pico: Array<{
    hora: string
    total_citas: number
  }>
}

// Props comunes para componentes
export interface CalendarProps {
  events: CitaCalendarEvent[]
  view: VistaCalendario
  currentDate: Date
  onDateClick?: (date: Date) => void
  onEventClick?: (event: CitaCalendarEvent) => void
  onViewChange?: (view: VistaCalendario) => void
  onDateChange?: (date: Date) => void
  onCreateEvent?: (date?: Date) => void
  loading?: boolean
  className?: string
}

// Response types para API
export interface CitaResponse {
  success: boolean
  data: Cita
  message?: string
}

export interface CitasListResponse {
  success: boolean
  data: Cita[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
  message?: string
}

export interface DisponibilidadResponse {
  success: boolean
  data: LocalDisponibilidad[]
  message?: string
}
