/**
 * Weekly Calendar View Orchestrator
 * 
 * Coordinates the weekly calendar layout using specialized components
 * Optimized with React.memo, useCallback and useMemo for performance
 */

import React, { memo, useCallback, useMemo } from 'react'
import { WeekHeader, WeekGrid } from './components'
import { useCalendarTranslations } from '../../hooks/useCalendarTranslations'
import type { CalendarEvent } from '../../types/appointment.types'

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

// Generate 30-minute time intervals
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

export const CalendarWeek = memo<CalendarWeekProps>(({
  events,
  currentDate,
  selectedDate,
  onDateClick,
  onEventClick,
  loading = false,
  locale = 'es',
  getWeekDays
}) => {
  
  const { t } = useCalendarTranslations({ locale: locale as 'en' | 'es' })
  
  // Memoized time slots to prevent recreation on every render
  const timeSlots = useMemo(() => generateTimeSlots(), [])
  
  // Memoized week days to prevent recalculation
  const weekDays = useMemo(() => getWeekDates(currentDate), [currentDate])
  
  // Memoized week day names to prevent recreation
  const weekDayNames = useMemo(() => getWeekDays?.() || [
    t('common:weekDays.short.monday'),
    t('common:weekDays.short.tuesday'),
    t('common:weekDays.short.wednesday'),
    t('common:weekDays.short.thursday'),
    t('common:weekDays.short.friday'),
    t('common:weekDays.short.saturday'),
    t('common:weekDays.short.sunday')
  ], [getWeekDays, t])
  
  // Memoized today's date
  const today = useMemo(() => new Date(), [])

  // Memoized browser locale
  const browserLocale = useMemo(() => locale === 'en' ? 'en-US' : 'es-ES', [locale])

  // Memoized event handlers to prevent unnecessary re-renders
  const handleDateClick = useCallback((date: Date) => {
    console.log('Week - handleDateClick:', date)
    onDateClick?.(date)
  }, [onDateClick])

  const handleSlotClick = useCallback((date: Date, timeSlot: string) => {
    console.log('Week - handleSlotClick:', date, timeSlot)
    // For slot clicks, we pass the specific time slot date
    onDateClick?.(date)
  }, [onDateClick])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('Week - handleEventClick:', event)
    onEventClick?.(event)
  }, [onEventClick])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">{t('loading.calendar')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Week header with day names and dates */}
      <WeekHeader
        weekDays={weekDays}
        weekDayNames={weekDayNames}
        selectedDate={selectedDate}
        today={today}
        onDayClick={handleDateClick}
        locale={browserLocale}
        className="flex-shrink-0"
      />
      
      {/* Main week grid with time slots and events */}
      <div className="flex-1 overflow-hidden">
        <WeekGrid
          weekDays={weekDays}
          timeSlots={timeSlots}
          events={events}
          selectedDate={selectedDate}
          today={today}
          onSlotClick={handleSlotClick}
          onEventClick={handleEventClick}
          className="h-full"
        />
      </div>
    </div>
  )
})

CalendarWeek.displayName = 'CalendarWeek'
