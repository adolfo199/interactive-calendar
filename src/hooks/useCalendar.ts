/**
 * Hook for calendar state management
 * 
 * Handles navigation, view and date selection for the calendar
 */

import { useState, useCallback, useMemo } from 'react'
import type { CalendarView } from '../types/appointment.types'
import { useCalendarTranslations } from './useCalendarTranslations'

interface UseCalendarProps {
  initialView?: CalendarView
  initialDate?: Date
  locale?: 'en' | 'es'
}

// Helper function to get calendar days
function getCalendarDays(currentDate: Date, view: CalendarView): Date[] {
  const days: Date[] = []
  
  if (view === 'month') {
    // For monthly view, get all days of the month with some from previous and next
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    
    // Get the first Monday of the grid (may be from previous month)
    const startDate = new Date(firstDay)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay() // Monday = 1
    startDate.setDate(startDate.getDate() - (firstDayOfWeek - 1))
    
    // Generate 42 days (6 weeks x 7 days)
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
  } else if (view === 'week') {
    // For weekly view, get the 7 days of the week
    const startOfWeek = new Date(currentDate)
    const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
    startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1))
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
  } else {
    // For daily view, only the current day
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
  initialDate = new Date(),
  locale = 'es'
}: UseCalendarProps = {}) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [view, setView] = useState<CalendarView>(initialView)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Get translations
  const { t } = useCalendarTranslations({ locale })

  // Convert locale to browser locale format
  const browserLocale = locale === 'en' ? 'en-US' : 'es-ES'

  // Get calendar days based on view
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentDate, view)
  }, [currentDate, view])

  // Get calendar title
  const title = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric' 
    }
    
    switch (view) {
      case 'month':
        return currentDate.toLocaleDateString(browserLocale, options)
      case 'week': {
        const startOfWeek = new Date(currentDate)
        const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()
        startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1))
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        // Use localized "de" for Spanish, "of" for English
        const connector = locale === 'en' ? 'of' : 'de'
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${connector} ${currentDate.toLocaleDateString(browserLocale, { month: 'long', year: 'numeric' })}`
      }
      case 'day':
        return currentDate.toLocaleDateString(browserLocale, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      default:
        return currentDate.toLocaleDateString(browserLocale, options)
    }
  }, [currentDate, view, browserLocale, locale])

  // Navigation
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

  // Go to today
  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  // Go to specific date
  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  // Select date
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  // Clear selection
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
    // Return localized weekday abbreviations starting from Monday
    const weekDayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return weekDayKeys.map(day => t(`weekDays.short.${day}`))
  }, [t])

  return {
    // State
    currentDate,
    view,
    selectedDate,
    calendarDays,
    title,
    
    // Actions
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
