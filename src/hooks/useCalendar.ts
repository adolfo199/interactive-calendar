/**
 * Hook para gestión del estado del calendario
 * 
 * Maneja la navegación, vista y selección de fechas del calendario
 */

import { useState, useCallback, useMemo } from 'react'
import type { VistaCalendario } from '../types/cita.types'

interface UseCalendarProps {
  initialView?: VistaCalendario
  initialDate?: Date
}

// Función auxiliar para obtener días del calendario
function getCalendarDays(currentDate: Date, view: VistaCalendario): Date[] {
  const days: Date[] = []
  
  if (view === 'month') {
    // Para vista mensual, obtener todos los días del mes con algunos del anterior y siguiente
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    
    // Obtener el primer lunes de la cuadrícula (puede ser del mes anterior)
    const startDate = new Date(firstDay)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay() // Lunes = 1
    startDate.setDate(startDate.getDate() - (firstDayOfWeek - 1))
    
    // Generar 42 días (6 semanas x 7 días)
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
  } else if (view === 'week') {
    // Para vista semanal, obtener los 7 días de la semana
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
    startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1))
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
  } else {
    // Para vista diaria, solo el día actual
    days.push(new Date(currentDate))
  }
  
  return days
}

// Funciones auxiliares para fechas
function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function subMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() - months)
  return result
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + (weeks * 7))
  return result
}

function subWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - (weeks * 7))
  return result
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function isSameDay(date1: Date, date2: Date): boolean {
  return startOfDay(date1).getTime() === startOfDay(date2).getTime()
}

export function useCalendar({ 
  initialView = 'month', 
  initialDate = new Date() 
}: UseCalendarProps = {}) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [view, setView] = useState<VistaCalendario>(initialView)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Obtener días del calendario según la vista
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentDate, view)
  }, [currentDate, view])

  // Obtener título del calendario
  const title = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric' 
    }
    
    switch (view) {
      case 'month':
        return currentDate.toLocaleDateString('es-ES', options)
      case 'week': {
        const startOfWeek = new Date(currentDate)
        const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
        startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1))
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
      }
      case 'day':
        return currentDate.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      default:
        return currentDate.toLocaleDateString('es-ES', options)
    }
  }, [currentDate, view])

  // Navegación
  const navigate = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      switch (view) {
        case 'month':
          return direction === 'prev' 
            ? subMonths(prevDate, 1) 
            : addMonths(prevDate, 1)
        case 'week':
          return direction === 'prev' 
            ? subWeeks(prevDate, 1) 
            : addWeeks(prevDate, 1)
        case 'day':
          return direction === 'prev' 
            ? subDays(prevDate, 1) 
            : addDays(prevDate, 1)
        default:
          return prevDate
      }
    })
  }, [view])

  // Ir a hoy
  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  // Ir a una fecha específica
  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  // Seleccionar fecha
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedDate(null)
  }, [])

  // Helpers
  const isToday = useCallback((date: Date) => {
    return isSameDay(date, new Date())
  }, [])

  const isSelected = useCallback((date: Date) => {
    return selectedDate ? isSameDay(date, selectedDate) : false
  }, [selectedDate])

  const isSameMonth = useCallback((date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }, [currentDate])

  const getWeekDays = useCallback(() => {
    // Retornar días de la semana empezando por lunes
    return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  }, [])

  return {
    // Estado
    currentDate,
    view,
    selectedDate,
    calendarDays,
    title,
    
    // Acciones
    navigate,
    goToToday,
    goToDate,
    selectDate,
    clearSelection,
    setView,
    
    // Helpers
    isToday,
    isSelected,
    isSameMonth,
    getWeekDays,
  }
}
