/**
 * Hook para gestión de eventos del calendario
 * 
 * Maneja el estado de las citas/eventos y operaciones CRUD
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Cita, CitaCalendarEvent, CitaFilters } from '../types/cita.types'

interface UseCalendarEventsProps {
  initialEvents?: CitaCalendarEvent[]
}

export function useCalendarEvents({ initialEvents = [] }: UseCalendarEventsProps = {}) {
  const [events, setEvents] = useState<CitaCalendarEvent[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CitaFilters>({})

  // Convertir cita a evento de calendario
  const citaToEvent = useCallback((cita: Cita): CitaCalendarEvent => {
    const fechaBase = new Date(cita.fecha)
    const [horaInicioHoras, horaInicioMinutos] = cita.hora_inicio.split(':').map(Number)
    const [horaFinHoras, horaFinMinutos] = cita.hora_fin.split(':').map(Number)
    
    const start = new Date(fechaBase)
    start.setHours(horaInicioHoras, horaInicioMinutos, 0, 0)
    
    const end = new Date(fechaBase)
    end.setHours(horaFinHoras, horaFinMinutos, 0, 0)
    
    // Colores según estado
    const getEstadoColor = (estado: string) => {
      switch (estado) {
        case 'pendiente': return '#fbbf24'
        case 'confirmada': return '#22c55e'
        case 'en_progreso': return '#3b82f6'
        case 'completada': return '#10b981'
        case 'cancelada': return '#ef4444'
        default: return '#6b7280'
      }
    }
    
    const color = getEstadoColor(cita.estado)
    
    return {
      id: cita.id,
      title: cita.titulo,
      start,
      end,
      allDay: false,
      color,
      backgroundColor: color,
      borderColor: color,
      textColor: cita.estado === 'pendiente' ? '#1f2937' : '#ffffff',
      extendedProps: {
        cita,
        estado: cita.estado,
        tipo: cita.tipo,
        local: cita.local?.nombre || 'Local no especificado',
        participantes: cita.participantes,
      }
    }
  }, [])

  // Agregar evento
  const addEvent = useCallback((cita: Cita) => {
    const event = citaToEvent(cita)
    setEvents(prev => [...prev, event])
  }, [citaToEvent])

  // Actualizar evento
  const updateEvent = useCallback((citaActualizada: Cita) => {
    const eventActualizado = citaToEvent(citaActualizada)
    setEvents(prev => 
      prev.map(event => 
        event.id === citaActualizada.id ? eventActualizado : event
      )
    )
  }, [citaToEvent])

  // Eliminar evento
  const removeEvent = useCallback((citaId: number) => {
    setEvents(prev => prev.filter(event => event.id !== citaId))
  }, [])

  // Cargar eventos (simulado - en la práctica sería una llamada a API)
  const loadEvents = useCallback(async (newFilters: CitaFilters = {}) => {
    setLoading(true)
    setError(null)
    setFilters(newFilters)
    
    try {
      // Simular carga de datos desde mock
      const { simulateDataLoad } = await import('../mockData')
      const mockEvents = await simulateDataLoad()
      setEvents(mockEvents)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Obtener eventos para un día específico
  const getEventsForDay = useCallback((date: Date): CitaCalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }, [events])

  // Obtener eventos en un rango de fechas
  const getEventsInRange = useCallback((startDate: Date, endDate: Date): CitaCalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate >= startDate && eventDate <= endDate
    })
  }, [events])

  // Buscar eventos
  const searchEvents = useCallback((searchTerm: string): CitaCalendarEvent[] => {
    if (!searchTerm.trim()) return events
    
    const term = searchTerm.toLowerCase()
    return events.filter(event => 
      event.title.toLowerCase().includes(term) ||
      event.extendedProps.local.toLowerCase().includes(term) ||
      event.extendedProps.cita.cliente_nombre.toLowerCase().includes(term)
    )
  }, [events])

  // Eventos filtrados
  const filteredEvents = useMemo(() => {
    let filtered = [...events]
    
    // Filtrar por fechas
    if (filters.fecha_desde) {
      const fechaDesde = new Date(filters.fecha_desde)
      filtered = filtered.filter(event => new Date(event.start) >= fechaDesde)
    }
    
    if (filters.fecha_hasta) {
      const fechaHasta = new Date(filters.fecha_hasta)
      filtered = filtered.filter(event => new Date(event.start) <= fechaHasta)
    }
    
    // Filtrar por sucursal
    if (filters.sucursal_id) {
      filtered = filtered.filter(event => 
        event.extendedProps.cita.sucursal_id === filters.sucursal_id
      )
    }
    
    // Filtrar por local
    if (filters.local_id) {
      filtered = filtered.filter(event => 
        event.extendedProps.cita.local_id === filters.local_id
      )
    }
    
    // Filtrar por estados
    if (filters.estado && filters.estado.length > 0) {
      filtered = filtered.filter(event => 
        filters.estado?.includes(event.extendedProps.estado)
      )
    }
    
    // Filtrar por tipos
    if (filters.tipo && filters.tipo.length > 0) {
      filtered = filtered.filter(event => 
        filters.tipo?.includes(event.extendedProps.tipo)
      )
    }
    
    // Filtrar por cliente
    if (filters.cliente) {
      const clienteTerm = filters.cliente.toLowerCase()
      filtered = filtered.filter(event => 
        event.extendedProps.cita.cliente_nombre.toLowerCase().includes(clienteTerm)
      )
    }
    
    return filtered
  }, [events, filters])

  // Cargar datos automáticamente al inicializar
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Estadísticas de eventos
  const eventStats = useMemo(() => {
    const total = filteredEvents.length
    const porEstado = filteredEvents.reduce((acc, event) => {
      const estado = event.extendedProps.estado
      acc[estado] = (acc[estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const porTipo = filteredEvents.reduce((acc, event) => {
      const tipo = event.extendedProps.tipo
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total,
      porEstado,
      porTipo
    }
  }, [filteredEvents])

  // Verificar conflictos
  const checkConflicts = useCallback((newEvent: { 
    local_id: number, 
    fecha: string, 
    hora_inicio: string, 
    hora_fin: string 
  }): CitaCalendarEvent[] => {
    const newStart = new Date(`${newEvent.fecha}T${newEvent.hora_inicio}`)
    const newEnd = new Date(`${newEvent.fecha}T${newEvent.hora_fin}`)
    
    return events.filter(event => {
      // Mismo local y fecha
      if (event.extendedProps.cita.local_id !== newEvent.local_id) return false
      if (event.start.toDateString() !== newStart.toDateString()) return false
      
      // Verificar overlap de horarios
      return (
        (newStart >= event.start && newStart < event.end) ||
        (newEnd > event.start && newEnd <= event.end) ||
        (newStart <= event.start && newEnd >= event.end)
      )
    })
  }, [events])

  return {
    // Estado
    events: filteredEvents,
    allEvents: events,
    loading,
    error,
    filters,
    eventStats,
    
    // Acciones
    addEvent,
    updateEvent,
    removeEvent,
    loadEvents,
    setFilters,
    
    // Consultas
    getEventsForDay,
    getEventsInRange,
    searchEvents,
    checkConflicts,
    
    // Utilidades
    citaToEvent
  }
}
