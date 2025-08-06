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
  /** Translation function for status names (without numbers) */
  getStatusText: (status: string) => string
  /** Currently selected status filter */
  selectedStatusFilter?: AppointmentStatus | null
  /** Callback when a status filter is clicked */
  onStatusFilterClick?: (status: AppointmentStatus) => void
}

export const CalendarStatsBar = memo<CalendarStatsBarProps>(({
  eventStats,
  totalAppointmentsText,
  getStatusText,
  selectedStatusFilter,
  onStatusFilterClick
}) => {

  // Memoized status indicators to prevent recreation
  const statusIndicators = useMemo(() => {
    const indicators: React.ReactNode[] = []
    const statusTypes: AppointmentStatus[] = ['confirmed', 'pending', 'completed', 'cancelled', 'in_progress']
    
    statusTypes.forEach(status => {
      const count = eventStats.byStatus[status] || 0
      if (count > 0) {
        const isSelected = selectedStatusFilter === status
        indicators.push(
          <div
            key={status}
            onClick={() => onStatusFilterClick?.(status)}
            className="cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <StatusIndicator
              status={status}
              count={count}
              minimal={true}
              customText={getStatusText(status)}
              isSelected={isSelected}
            />
          </div>
        )
      }
    })
    
    return indicators
  }, [eventStats.byStatus, getStatusText, selectedStatusFilter, onStatusFilterClick])

  return (
    <div className="flex items-center justify-between bg-white/80 rounded-xl p-4 shadow-sm border border-gray-100/50 backdrop-blur-sm">
      {/* Total appointments */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-gray-700">
          {totalAppointmentsText}
        </span>
      </div>
      
      {/* Status indicators */}
      <div className="flex items-center gap-4">
        {statusIndicators}
      </div>
    </div>
  )
})

CalendarStatsBar.displayName = 'CalendarStatsBar'
