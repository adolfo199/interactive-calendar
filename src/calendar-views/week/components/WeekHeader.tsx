/**
 * Week Header Component
 * Displays the days of the week for the weekly calendar view
 */

import React from 'react'
import { cn } from '../../../utils'

interface WeekHeaderProps {
  /** Array of Date objects representing the week days */
  weekDays: Date[]
  /** Array of weekday names (localized) */
  weekDayNames: string[]
  /** Currently selected date */
  selectedDate: Date | null
  /** Current date (today) */
  today: Date
  /** Callback when a day header is clicked */
  onDayClick?: (date: Date) => void
  /** Browser locale for date formatting */
  locale?: string
  /** Additional CSS classes */
  className?: string
}

export function WeekHeader({
  weekDays,
  weekDayNames,
  selectedDate,
  today,
  onDayClick,
  locale = 'en-US',
  className
}: WeekHeaderProps) {

  const handleDayClick = (date: Date) => {
    onDayClick?.(date)
  }

  return (
    <div className={cn('grid grid-cols-8 border-b', className)}>
      {/* Time column header */}
      <div className="p-4 text-center text-sm font-semibold text-gray-600 bg-gray-50/50 border-r">
        Time
      </div>
      
      {/* Day headers */}
      {weekDays.map((day, index) => {
        const isToday = day.toDateString() === today.toDateString()
        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
        
        return (
          <div
            key={day.toISOString()}
            className={cn(
              "p-4 text-center border-r cursor-pointer transition-all duration-200",
              "hover:bg-blue-50/50",
              {
                'bg-blue-100 border-blue-300': isSelected,
                'bg-yellow-50 border-yellow-300': isToday && !isSelected,
                'bg-gray-50/30': !isToday && !isSelected
              }
            )}
            onClick={() => handleDayClick(day)}
          >
            <div className="flex flex-col gap-1">
              {/* Weekday name */}
              <div className="text-xs font-medium text-gray-600 uppercase">
                {weekDayNames[index] || day.toLocaleDateString(locale, { weekday: 'short' })}
              </div>
              
              {/* Day number */}
              <div className={cn(
                "text-lg font-bold transition-colors",
                {
                  'text-blue-600': isSelected,
                  'text-yellow-600': isToday && !isSelected,
                  'text-gray-900': !isToday && !isSelected
                }
              )}>
                {day.getDate()}
              </div>
              
              {/* Month (if different from previous day or first day) */}
              {(index === 0 || day.getMonth() !== weekDays[index - 1].getMonth()) && (
                <div className="text-xs text-gray-500">
                  {day.toLocaleDateString(locale, { month: 'short' })}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
