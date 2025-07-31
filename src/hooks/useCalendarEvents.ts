
import { useState, useCallback, useMemo, useEffect } from 'react'
import type { 
  Appointment, 
  CalendarEvent, 
  AppointmentFilters,
  AppointmentStatus
} from '../types/appointment.types'

interface UseCalendarEventsProps {
  initialEvents?: CalendarEvent[]
}

export function useCalendarEvents({ initialEvents = [] }: UseCalendarEventsProps = {}) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AppointmentFilters>({})

  // Convert legacy Appointment to new CalendarEvent format
  const appointmentToEvent = useCallback((appointment: Appointment): CalendarEvent => {
    const dateBase = new Date(appointment.date)
    const [startHours, startMinutes] = appointment.start_time.split(':').map(Number)
    const [endHours, endMinutes] = appointment.end_time.split(':').map(Number)
    
    const start = new Date(dateBase)
    start.setHours(startHours, startMinutes, 0, 0)
    
    const end = new Date(dateBase)
    end.setHours(endHours, endMinutes, 0, 0)
    
    // Colors by status
    const getStatusColor = (status: AppointmentStatus) => {
      switch (status) {
        case 'pending': return '#fbbf24'
        case 'confirmed': return '#22c55e'
        case 'in_progress': return '#3b82f6'
        case 'completed': return '#10b981'
        case 'cancelled': return '#ef4444'
        default: return '#6b7280'
      }
    }
    
    const color = getStatusColor(appointment.status)
    
    return {
      id: appointment.id,
      title: appointment.title,
      start,
      end,
      allDay: false,
      color,
      backgroundColor: color,
      borderColor: color,
      textColor: appointment.status === 'pending' ? '#1f2937' : '#ffffff',
      extendedProps: {
        appointment,
        status: appointment.status,
        type: appointment.type,
        location: appointment.location?.name || 'Location not specified',
        participants: appointment.participants,
      }
    }
  }, [])

  // Add event
  const addEvent = useCallback((appointment: Appointment) => {
    const event = appointmentToEvent(appointment)
    setEvents(prev => [...prev, event])
  }, [appointmentToEvent])

  // Update event
  const updateEvent = useCallback((updatedAppointment: Appointment) => {
    const updatedEvent = appointmentToEvent(updatedAppointment)
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedAppointment.id ? updatedEvent : event
      )
    )
  }, [appointmentToEvent])

  // Remove event
  const removeEvent = useCallback((appointmentId: number) => {
    setEvents(prev => prev.filter(event => event.id !== appointmentId))
  }, [])

  // Load events (simulated - in practice would be an API call)
  const loadEvents = useCallback(async (newFilters: AppointmentFilters = {}) => {
    setLoading(true)
    setError(null)
    setFilters(newFilters)
    
    try {
      // Simulate data loading from mock
      const { simulateDataLoad } = await import('../mockData')
      const mockEvents = await simulateDataLoad()
      setEvents(mockEvents)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading events')
    } finally {
      setLoading(false)
    }
  }, [])

  // Get events for a specific day
  const getEventsForDay = useCallback((date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }, [events])

  // Get events in a date range
  const getEventsInRange = useCallback((startDate: Date, endDate: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate >= startDate && eventDate <= endDate
    })
  }, [events])

  // Search events
  const searchEvents = useCallback((searchTerm: string): CalendarEvent[] => {
    if (!searchTerm.trim()) return events
    
    const term = searchTerm.toLowerCase()
    return events.filter(event => 
      event.title.toLowerCase().includes(term) ||
      event.extendedProps.location.toLowerCase().includes(term) ||
      event.extendedProps.appointment.client_name.toLowerCase().includes(term)
    )
  }, [events])

  // Filtered events
  const filteredEvents = useMemo(() => {
    let filtered = [...events]
    
    // Filter by dates
    if (filters.date_from) {
      const dateFrom = new Date(filters.date_from)
      filtered = filtered.filter(event => new Date(event.start) >= dateFrom)
    }
    
    if (filters.date_to) {
      const dateTo = new Date(filters.date_to)
      filtered = filtered.filter(event => new Date(event.start) <= dateTo)
    }
    
    // Filter by branch
    if (filters.branch_id) {
      filtered = filtered.filter(event => 
        event.extendedProps.appointment.branch_id === filters.branch_id
      )
    }
    
    // Filter by location
    if (filters.location_id) {
      filtered = filtered.filter(event => 
        event.extendedProps.appointment.location_id === filters.location_id
      )
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(event => 
        filters.status?.includes(event.extendedProps.status)
      )
    }
    
    // Filter by types
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(event => 
        filters.type?.includes(event.extendedProps.type)
      )
    }
    
    // Filter by client
    if (filters.client) {
      const clientTerm = filters.client.toLowerCase()
      filtered = filtered.filter(event => 
        event.extendedProps.appointment.client_name.toLowerCase().includes(clientTerm)
      )
    }
    
    return filtered
  }, [events, filters])

  // Load events automatically on initialization
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Event statistics
  const eventStats = useMemo(() => {
    const total = filteredEvents.length
    const byStatus = filteredEvents.reduce((acc, event) => {
      const status = event.extendedProps.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byType = filteredEvents.reduce((acc, event) => {
      const type = event.extendedProps.type
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total,
      byStatus,
      byType
    }
  }, [filteredEvents])

  // Check conflicts
  const checkConflicts = useCallback((newEvent: { 
    location_id: number, 
    date: string, 
    start_time: string, 
    end_time: string 
  }): CalendarEvent[] => {
    const newStart = new Date(`${newEvent.date}T${newEvent.start_time}`)
    const newEnd = new Date(`${newEvent.date}T${newEvent.end_time}`)
    
    return events.filter(event => {
      // Same location and date
      if (event.extendedProps.appointment.location_id !== newEvent.location_id) return false
      if (event.start.toDateString() !== newStart.toDateString()) return false
      
      // Check time overlap
      return (
        (newStart >= event.start && newStart < event.end) ||
        (newEnd > event.start && newEnd <= event.end) ||
        (newStart <= event.start && newEnd >= event.end)
      )
    })
  }, [events])

  return {
    // State
    events: filteredEvents,
    allEvents: events,
    loading,
    error,
    filters,
    eventStats,
    
    // Actions
    addEvent,
    updateEvent,
    removeEvent,
    loadEvents,
    setFilters,
    
    // Queries
    getEventsForDay,
    getEventsInRange,
    searchEvents,
    checkConflicts,
    
    // Utilities
    appointmentToEvent
  }
}
