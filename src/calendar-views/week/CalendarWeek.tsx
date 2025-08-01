/**
 * Weekly Calendar View Orchestrator
 * 
 * Coordinates the weekly calendar layout using specialized components
 */

import React from 'react'
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
  
  // Generate localized week day names using translations
  const weekDayNames = getWeekDays?.() || [
    t('common:weekDays.short.monday'),
    t('common:weekDays.short.tuesday'),
    t('common:weekDays.short.wednesday'),
    t('common:weekDays.short.thursday'),
    t('common:weekDays.short.friday'),
    t('common:weekDays.short.saturday'),
    t('common:weekDays.short.sunday')
  ]
  
  const today = new Date()

  // Convert locale to browser locale format
  const browserLocale = locale === 'en' ? 'en-US' : 'es-ES'

  // Event handlers
  const handleDateClick = (date: Date) => {
    console.log('Week - handleDateClick:', date)
    onDateClick?.(date)
  }

  const handleSlotClick = (date: Date, timeSlot: string) => {
    console.log('Week - handleSlotClick:', date, timeSlot)
    // For slot clicks, we pass the specific time slot date
    onDateClick?.(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Week - handleEventClick:', event)
    onEventClick?.(event)
  }

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
}
