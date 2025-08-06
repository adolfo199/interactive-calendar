/**
 * Calendar Statistics Bar Component
 * 
 * Displays total appointments count and status indicators
 * Optimized with React.memo and useMemo for performance
 */

import React, { memo, useMemo } from 'react'
import { CalendarIcon } from 'lucide-react'
import { StatusIndicator } from '../../shared'
import type { AppointmentStatus } from '../../../types/appointment.types'

interface EventStats {
  total: number
  byStatus: Record<string, number>
  byType: Record<string, number>
}

interface CalendarStatsBarProps {
  /** Event statistics */
  eventStats: EventStats
  /** Translated total appointments text */
  totalAppointmentsText: string
  /** Translated status text */
  statusText: string
  /** Translation function for status plurals */
  getStatusText: (status: string, count: number) => string
}

export const CalendarStatsBar = memo<CalendarStatsBarProps>(({
  eventStats,
  totalAppointmentsText,
  statusText,
  getStatusText
}) => {

  // Memoized status indicators to prevent recreation
  const statusIndicators = useMemo(() => {
    const indicators: React.ReactNode[] = []
    const statusTypes: AppointmentStatus[] = ['confirmed', 'pending', 'completed', 'cancelled', 'in_progress']
    
    statusTypes.forEach(status => {
      const count = eventStats.byStatus[status] || 0
      if (count > 0) {
        indicators.push(
          <StatusIndicator
            key={status}
            status={status}
            count={count}
            minimal={true}
            customText={getStatusText(status, count)}
          />
        )
      }
    })
    
    return indicators
  }, [eventStats.byStatus, getStatusText])

  return (
    <div className="flex items-center justify-between bg-white/60 rounded-lg p-3 shadow-sm border">
      {/* Total appointments */}
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-600">
          {totalAppointmentsText}
        </span>
      </div>
      
      {/* Status indicators */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-600">
          {statusText}
        </span>
        
        <div className="flex items-center gap-3">
          {statusIndicators}
        </div>
      </div>
    </div>
  )
})

CalendarStatsBar.displayName = 'CalendarStatsBar'
