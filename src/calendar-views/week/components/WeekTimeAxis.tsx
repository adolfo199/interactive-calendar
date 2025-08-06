/**
 * Week Time Axis Component
 * Displays the time labels for the weekly calendar view
 */

import React from 'react'
import { cn } from '../../../utils'

interface WeekTimeAxisProps {
  /** Array of time slots (e.g., ['07:00', '07:30', ...]) */
  timeSlots: string[]
  /** Additional CSS classes */
  className?: string
}

export function WeekTimeAxis({
  timeSlots,
  className
}: WeekTimeAxisProps) {

  return (
    <div className={cn('', className)}>
      {timeSlots.map((timeSlot, index) => {
        const isHour = timeSlot.endsWith(':00')
        
        return (
          <div
            key={timeSlot}
            className={cn(
              'h-12 flex items-start justify-end pr-2 border-r border-gray-200 bg-gray-50/30',
              {
                'border-b': index < timeSlots.length - 1,
                'border-b-gray-300': isHour,
                'border-b-gray-100': !isHour
              }
            )}
            style={{ minHeight: '48px' }}
          >
            {/* Only show time label for hour slots to avoid clutter */}
            {isHour && (
              <span className="text-xs text-gray-600 font-medium -mt-2">
                {timeSlot}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
