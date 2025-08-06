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
  /** Whether this status is currently selected/filtered */
  isSelected?: boolean
  /** Additional CSS classes */
  className?: string
}

export function StatusIndicator({
  status,
  count,
  minimal = false,
  customText,
  isSelected = false,
  className
}: StatusIndicatorProps) {

  // Color and text configuration by status
  const statusConfig = {
    confirmed: {
      color: 'bg-green-500',
      text: 'Confirmadas',
      badgeClass: 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100',
      selectedClass: 'bg-green-500 text-white shadow-lg shadow-green-200 border-green-600'
    },
    pending: {
      color: 'bg-yellow-500',
      text: 'Pendientes',
      badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100',
      selectedClass: 'bg-yellow-500 text-white shadow-lg shadow-yellow-200 border-yellow-600'
    },
    cancelled: {
      color: 'bg-red-500',
      text: 'Canceladas',
      badgeClass: 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100',
      selectedClass: 'bg-red-500 text-white shadow-lg shadow-red-200 border-red-600'
    },
    completed: {
      color: 'bg-blue-500',
      text: 'Completadas',
      badgeClass: 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100',
      selectedClass: 'bg-blue-500 text-white shadow-lg shadow-blue-200 border-blue-600'
    },
    in_progress: {
      color: 'bg-purple-500',
      text: 'En Progreso',
      badgeClass: 'border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-100',
      selectedClass: 'bg-purple-500 text-white shadow-lg shadow-purple-200 border-purple-600'
    }
  }

  const config = statusConfig[status]
  const dotColorClass = isSelected ? config.color.replace('bg-', 'bg-') + ' ring-2 ring-white ring-offset-1' : config.color

  if (minimal) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('w-2.5 h-2.5 rounded-full transition-all duration-200', dotColorClass)} />
        {(count !== undefined || customText) && (
          <div className="flex items-center gap-1">
            <span className={cn(
              'text-xs font-medium transition-colors duration-200',
              isSelected ? 'text-gray-900 font-semibold' : 'text-gray-600'
            )}>
              {customText || config.text}
            </span>
            {count !== undefined && (
              <span className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center transition-all duration-200',
                isSelected 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-800 bg-gray-100'
              )}>
                {count}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('w-2.5 h-2.5 rounded-full transition-all duration-200', dotColorClass)} />
      <Badge 
        variant="outline" 
        className={cn(
          'transition-all duration-200 text-xs flex items-center gap-1.5',
          isSelected ? config.selectedClass : config.badgeClass
        )}
      >
        {customText || config.text}
        {count !== undefined && (
          <span className={cn(
            'font-semibold px-1 py-0.5 rounded text-xs transition-colors duration-200',
            isSelected ? 'bg-white/20' : 'bg-white/50'
          )}>
            {count}
          </span>
        )}
      </Badge>
    </div>
  )
}
