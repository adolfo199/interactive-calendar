/**
 * Month Header Component
 * Renders the weekday headers for monthly calendar view
 */

import React from 'react'
import { cn } from '../../../utils'

interface MonthHeaderProps {
  /** Array of weekday names */
  weekDays: string[]
  /** Current locale */
  locale?: 'en' | 'es'
  /** Additional CSS classes */
  className?: string
}

export function MonthHeader({
  weekDays,
  locale: _locale = 'en',
  className
}: MonthHeaderProps) {

  return (
    <div className={cn('mb-4', className)}>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-3 bg-muted/20 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
