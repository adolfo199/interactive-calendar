/**
 * Reusable component for displaying status indicators
 * Used in statistics and legends
 */

import React from 'react'
import { cn } from '../../utils'
import { Badge } from '../../components/ui/badge'

type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in_progress'

interface StatusIndicatorProps {
  /** Status to display */
  status: AppointmentStatus
  /** Number of appointments with this status */
  count?: number
  /** Show only the color circle */
  minimal?: boolean
  /** Custom text instead of status */
  customText?: string
  /** Additional CSS classes */
  className?: string
}

export function StatusIndicator({
  status,
  count,
  minimal = false,
  customText,
  className
}: StatusIndicatorProps) {

  // Color and text configuration by status
  const statusConfig = {
    confirmed: {
      color: 'bg-green-500',
      text: 'Confirmadas',
      badgeClass: 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
    },
    pending: {
      color: 'bg-yellow-500',
      text: 'Pendientes',
      badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
    },
    cancelled: {
      color: 'bg-red-500',
      text: 'Canceladas',
      badgeClass: 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
    },
    completed: {
      color: 'bg-blue-500',
      text: 'Completadas',
      badgeClass: 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
    },
    in_progress: {
      color: 'bg-purple-500',
      text: 'En Progreso',
      badgeClass: 'border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-100'
    }
  }

  const config = statusConfig[status]
  const displayText = customText || config.text

  if (minimal) {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        <div className={cn('w-3 h-3 rounded-full', config.color)} />
        {(count !== undefined || customText) && (
          <span className="text-xs text-gray-600">
            {customText || displayText}
            {count !== undefined && ` (${count})`}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('w-3 h-3 rounded-full', config.color)} />
      <Badge 
        variant="outline" 
        className={cn('transition-colors text-xs', config.badgeClass)}
      >
        {displayText}
        {count !== undefined && ` (${count})`}
      </Badge>
    </div>
  )
}
