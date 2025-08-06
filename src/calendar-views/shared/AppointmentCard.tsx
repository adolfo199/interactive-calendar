/**
 * Reusable component for displaying calendar appointments/events
 * Adapts to different contexts: month, week, day, list
 * Optimized with React.memo and useMemo for performance
 */

import React, { memo, useMemo, useCallback } from 'react'
import { cn } from '../../utils'
import { 
  Calendar as CalendarIcon,
  Users,
  GraduationCap,
  Presentation as PresentationIcon,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Pause,
} from 'lucide-react'

import type { CalendarEvent } from '../../types/appointment.types'

interface AppointmentCardProps {
  /** The event/appointment to display */
  event: CalendarEvent
  /** Visual variant based on usage context */
  variant: 'month' | 'week' | 'day' | 'list'
  /** Component size */
  size: 'sm' | 'md' | 'lg'
  /** Whether to show additional details */
  showDetails?: boolean
  /** Whether to show tooltip on hover */
  showTooltip?: boolean
  /** Callback when clicking on the appointment */
  onClick?: (event: CalendarEvent) => void
  /** Additional CSS classes */
  className?: string
}

// Memoized icon mapping for performance
const eventIconMap = {
  consultation: CalendarIcon,
  meeting: Users,
  training: GraduationCap,
  demo: PresentationIcon,
  default: CalendarIcon
} as const

const statusIconMap = {
  confirmed: CheckCircle2,
  pending: Clock,
  cancelled: AlertCircle,
  in_progress: Pause,
  completed: CheckCircle2,
  default: Clock
} as const

const statusColors = {
  confirmed: {
    bg: 'linear-gradient(135deg, #10b981, #059669)',
    text: '#ffffff',
    border: '#059669',
    solid: '#10b981'
  },
  pending: {
    bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    text: '#ffffff',
    border: '#d97706',
    solid: '#f59e0b'
  },
  cancelled: {
    bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
    text: '#ffffff',
    border: '#dc2626',
    solid: '#ef4444'
  },
  completed: {
    bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    text: '#ffffff',
    border: '#1d4ed8',
    solid: '#3b82f6'
  },
  in_progress: {
    bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    text: '#ffffff',
    border: '#7c3aed',
    solid: '#8b5cf6'
  },
  default: {
    bg: 'linear-gradient(135deg, #6b7280, #4b5563)',
    text: '#ffffff',
    border: '#4b5563',
    solid: '#6b7280'
  }
} as const

const statusIconColors = {
  confirmed: 'text-green-600',
  pending: 'text-yellow-600',
  cancelled: 'text-red-600',
  in_progress: 'text-blue-600',
  completed: 'text-blue-600',
  default: 'text-gray-600'
} as const

const AppointmentCard = memo<AppointmentCardProps>(({
  event,
  variant = 'month',
  size = 'md',
  showDetails = false,
  showTooltip = true,
  onClick,
  className
}) => {
  const status = event.extendedProps.appointment.status || 'default'
  const type = event.extendedProps.type || 'default'

  // Memoize icons to prevent recreation on every render
  const typeIcon = useMemo(() => {
    const IconComponent = eventIconMap[type as keyof typeof eventIconMap] || eventIconMap.default
    return <IconComponent className="h-3 w-3" />
  }, [type])

  const statusIcon = useMemo(() => {
    const IconComponent = statusIconMap[status as keyof typeof statusIconMap] || statusIconMap.default
    const colorClass = statusIconColors[status as keyof typeof statusIconColors] || statusIconColors.default
    return <IconComponent className={`h-3 w-3 ${colorClass}`} />
  }, [status])

  // Memoize colors to prevent recalculation
  const colors = useMemo(() => {
    return statusColors[status as keyof typeof statusColors] || statusColors.default
  }, [status])

  // Memoize formatted time
  const formattedTime = useMemo(() => {
    return event.start ? new Date(event.start).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : ''
  }, [event.start])

  // Memoize CSS classes
  const baseClasses = useMemo(() => cn(
    "group relative cursor-pointer transition-all duration-200 border rounded-lg",
    "hover:scale-105 hover:shadow-md",
    {
      // Variants
      'p-1.5 text-xs': variant === 'month',
      'p-2 text-sm': variant === 'week',
      'p-3 text-sm': variant === 'day',
      'p-4 text-base': variant === 'list',
      
      // Sizes
      'min-h-[2rem]': size === 'sm',
      'min-h-[3rem]': size === 'md', 
      'min-h-[4rem]': size === 'lg',
    },
    className
  ), [variant, size, className])

  // Memoize click handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(event)
  }, [onClick, event])

  // Determine if should show details
  const shouldShowDetails = useMemo(() => 
    variant === 'day' || variant === 'list' || showDetails
  , [variant, showDetails])
  return (
    <div
      className={baseClasses}
      style={{ 
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border
      }}
      onClick={handleClick}
    >
      {/* Main content */}
      <div className="flex items-center gap-1 mb-1">
        {typeIcon}
        <span className="font-medium truncate flex-1">
          {event.title}
        </span>
        {shouldShowDetails && statusIcon}
      </div>

      {/* Additional details based on variant */}
      {shouldShowDetails && (
        <div className="flex flex-col gap-1">
          {/* Time */}
          {formattedTime && (
            <div className="flex items-center gap-1 text-xs opacity-90">
              <Clock className="h-2.5 w-2.5" />
              <span>{formattedTime}</span>
            </div>
          )}
          
          {/* Location */}
          {event.extendedProps.location && (
            <div className="flex items-center gap-1 text-xs opacity-90">
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate">
                {event.extendedProps.location}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Location for monthly view (more compact) */}
      {variant === 'month' && event.extendedProps.location && !showDetails && (
        <div className="flex items-center gap-1 text-xs opacity-90">
          <MapPin className="h-2.5 w-2.5" />
          <span className="truncate">
            {event.extendedProps.location}
          </span>
        </div>
      )}

      {/* Custom tooltip on hover */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-max max-w-xs shadow-lg">
          <div className="font-semibold mb-1">{event.title}</div>
          <div className="flex flex-col gap-1 text-xs">
            {formattedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formattedTime}</span>
              </div>
            )}
            {event.extendedProps.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{event.extendedProps.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="h-3 w-3">{statusIcon}</div>
              <span className="capitalize">{status}</span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
})

AppointmentCard.displayName = 'AppointmentCard'

export { AppointmentCard }