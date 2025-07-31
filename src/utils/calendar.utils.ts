/**
 * Utilidades para el calendario de citas
 * 
 * Funciones helper para manipulación de fechas, horarios y eventos
 */

import { format, addDays, startOfWeek, startOfMonth, isSameDay, isSameMonth, isToday, addMinutes, isAfter, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Cita, CitaCalendarEvent, TimeSlot, ConflictoHorario, EstadoCita, TipoCita } from '../types/cita.types'

/**
 * Genera array de días para la vista mensual del calendario
 * Incluye días del mes anterior y siguiente para completar la grilla
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
 * Convierte una cita en evento de calendario
 */
export function citaToCalendarEvent(cita: Cita): CitaCalendarEvent {
  const fechaBase = new Date(cita.fecha)
  const [horaInicioHoras, horaInicioMinutos] = cita.hora_inicio.split(':').map(Number)
  const [horaFinHoras, horaFinMinutos] = cita.hora_fin.split(':').map(Number)
  
  const start = new Date(fechaBase)
  start.setHours(horaInicioHoras, horaInicioMinutos, 0, 0)
  
  const end = new Date(fechaBase)
  end.setHours(horaFinHoras, horaFinMinutos, 0, 0)
  
  return {
    id: cita.id,
    title: cita.titulo,
    start,
    end,
    allDay: false,
    color: getEstadoColor(cita.estado),
    backgroundColor: getEstadoColor(cita.estado),
    borderColor: getEstadoColor(cita.estado, 'border'),
    textColor: getEstadoTextColor(cita.estado),
    extendedProps: {
      cita,
      estado: cita.estado,
      tipo: cita.tipo,
      local: cita.local?.nombre || 'Local no especificado',
      participantes: cita.participantes,
    }
  }
}

/**
 * Obtiene el color según el estado de la cita
 */
export function getEstadoColor(estado: EstadoCita, variant: 'bg' | 'border' = 'bg'): string {
  const colors = {
    pendiente: {
      bg: '#fbbf24', // yellow-400
      border: '#f59e0b' // yellow-500
    },
    confirmada: {
      bg: '#22c55e', // green-500
      border: '#16a34a' // green-600
    },
    en_progreso: {
      bg: '#3b82f6', // blue-500
      border: '#2563eb' // blue-600
    },
    completada: {
      bg: '#10b981', // emerald-500
      border: '#059669' // emerald-600
    },
    cancelada: {
      bg: '#ef4444', // red-500
      border: '#dc2626' // red-600
    }
  }
  
  return colors[estado][variant]
}

/**
 * Obtiene el color del texto según el estado
 */
export function getEstadoTextColor(estado: EstadoCita): string {
  // Todos los estados tienen texto blanco excepto pendiente
  return estado === 'pendiente' ? '#1f2937' : '#ffffff'
}

/**
 * Obtiene el color según el tipo de cita
 */
export function getTipoColor(tipo: TipoCita): string {
  const colors = {
    reunion: '#3b82f6', // blue-500
    consulta: '#10b981', // emerald-500
    mantenimiento: '#f59e0b', // amber-500
    evento: '#8b5cf6', // violet-500
    reserva: '#06b6d4', // cyan-500
    entrenamiento: '#e11d48', // rose-600
    demo: '#7c3aed' // violet-600
  }
  
  return colors[tipo] || '#6b7280' // gray-500 como fallback
}

/**
 * Genera slots de tiempo para un día específico
 */
export function generateTimeSlots(
  fecha: Date,
  horaApertura: string = '09:00',
  horaCierre: string = '18:00',
  duracionSlot: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const [aperturaHoras, aperturaMinutos] = horaApertura.split(':').map(Number)
  const [cierreHoras, cierreMinutos] = horaCierre.split(':').map(Number)
  
  const apertura = new Date(fecha)
  apertura.setHours(aperturaHoras, aperturaMinutos, 0, 0)
  
  const cierre = new Date(fecha)
  cierre.setHours(cierreHoras, cierreMinutos, 0, 0)
  
  let currentTime = new Date(apertura)
  
  while (isBefore(currentTime, cierre)) {
    slots.push({
      hora: format(currentTime, 'HH:mm'),
      disponible: true
    })
    
    currentTime = addMinutes(currentTime, duracionSlot)
  }
  
  return slots
}

/**
 * Verifica si hay conflictos de horario
 */
export function checkConflictoHorario(
  nuevaCita: {
    fecha: string
    hora_inicio: string
    hora_fin: string
    local_id: number
    participantes: number
  },
  citasExistentes: Cita[],
  capacidadLocal: number
): ConflictoHorario | null {
  // Convertir a objetos Date para comparación
  const fechaNueva = new Date(nuevaCita.fecha)
  const [inicioH, inicioM] = nuevaCita.hora_inicio.split(':').map(Number)
  const [finH, finM] = nuevaCita.hora_fin.split(':').map(Number)
  
  const inicioNueva = new Date(fechaNueva)
  inicioNueva.setHours(inicioH, inicioM, 0, 0)
  
  const finNueva = new Date(fechaNueva)
  finNueva.setHours(finH, finM, 0, 0)
  
  // Filtrar citas del mismo local y fecha, excluyendo canceladas
  const citasMismoLocal = citasExistentes.filter(cita => 
    cita.local_id === nuevaCita.local_id &&
    cita.fecha === nuevaCita.fecha &&
    cita.estado !== 'cancelada'
  )
  
  // Verificar overlaps de horario
  const citasConflicto = citasMismoLocal.filter(cita => {
    const [cInicioH, cInicioM] = cita.hora_inicio.split(':').map(Number)
    const [cFinH, cFinM] = cita.hora_fin.split(':').map(Number)
    
    const inicioCita = new Date(fechaNueva)
    inicioCita.setHours(cInicioH, cInicioM, 0, 0)
    
    const finCita = new Date(fechaNueva)
    finCita.setHours(cFinH, cFinM, 0, 0)
    
    // Verificar si hay overlap
    return (
      (isAfter(inicioNueva, inicioCita) && isBefore(inicioNueva, finCita)) ||
      (isAfter(finNueva, inicioCita) && isBefore(finNueva, finCita)) ||
      (isBefore(inicioNueva, inicioCita) && isAfter(finNueva, finCita)) ||
      (inicioNueva.getTime() === inicioCita.getTime())
    )
  })
  
  if (citasConflicto.length > 0) {
    return {
      tipo: 'overlap',
      mensaje: `Conflicto de horario con ${citasConflicto.length} cita(s) existente(s)`,
      citas_conflicto: citasConflicto,
      sugerencias: [
        'Selecciona otro horario',
        'Elige un local diferente',
        'Modifica la duración de la cita'
      ]
    }
  }
  
  // Verificar capacidad (suma de participantes en el mismo slot)
  const participantesEnSlot = citasMismoLocal
    .filter(cita => {
      const [cInicioH, cInicioM] = cita.hora_inicio.split(':').map(Number)
      const [cFinH, cFinM] = cita.hora_fin.split(':').map(Number)
      
      const inicioCita = new Date(fechaNueva)
      inicioCita.setHours(cInicioH, cInicioM, 0, 0)
      
      const finCita = new Date(fechaNueva)
      finCita.setHours(cFinH, cFinM, 0, 0)
      
      // Overlap parcial o total
      return !(isAfter(inicioNueva, finCita) || isBefore(finNueva, inicioCita))
    })
    .reduce((total, cita) => total + cita.participantes, 0)
  
  if (participantesEnSlot + nuevaCita.participantes > capacidadLocal) {
    return {
      tipo: 'capacity',
      mensaje: `Capacidad excedida. Local: ${capacidadLocal}, Solicitado: ${participantesEnSlot + nuevaCita.participantes}`,
      sugerencias: [
        'Reduce el número de participantes',
        'Selecciona un local con mayor capacidad',
        'Divide la cita en varias sesiones'
      ]
    }
  }
  
  return null
}

/**
 * Formatea una fecha para mostrar
 */
export function formatDateForDisplay(date: Date, formatStr: string = 'dd/MM/yyyy'): string {
  return format(date, formatStr, { locale: es })
}

/**
 * Formatea un rango de tiempo
 */
export function formatTimeRange(horaInicio: string, horaFin: string): string {
  return `${horaInicio} - ${horaFin}`
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
 * Obtiene eventos para un día específico
 */
export function getEventsForDay(events: CitaCalendarEvent[], date: Date): CitaCalendarEvent[] {
  return events.filter(event => isSameDay(event.start, date))
}

/**
 * Verifica si una fecha es hoy
 */
export function isDateToday(date: Date): boolean {
  return isToday(date)
}

/**
 * Verifica si una fecha pertenece al mes actual mostrado
 */
export function isDateInCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth)
}
