/**
 * Reusable component for displaying calendar appointments/events
 * Adapts to different contexts: month, week, day, list
 */

import React from 'react'
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

export function AppointmentCard({
  event,
  variant = 'month',
  size = 'md',
  showDetails = false,
  showTooltip = true,
  onClick,
  className
}: AppointmentCardProps) {
  
  // Function to get appointment type icon
  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation':
        return <CalendarIcon className="h-3 w-3" />
      case 'meeting':
        return <Users className="h-3 w-3" />
      case 'training':
        return <GraduationCap className="h-3 w-3" />
      case 'demo':
        return <PresentationIcon className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle2 className="h-3 w-3 text-green-600" />
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-600" />
      case 'cancelled':
        return <AlertCircle className="h-3 w-3 text-red-600" />
      case 'in_progress':
        return <Pause className="h-3 w-3 text-blue-600" />
      case 'completed':
        return <CheckCircle2 className="h-3 w-3 text-blue-600" />
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  // Function to get colors based on status
  const getEventColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'linear-gradient(135deg, #10b981, #059669)', // Green
          text: '#ffffff',
          border: '#059669',
          solid: '#10b981'
        }
      case 'pending':
        return {
          bg: 'linear-gradient(135deg, #f59e0b, #d97706)', // Yellow/Orange
          text: '#ffffff',
          border: '#d97706',
          solid: '#f59e0b'
        }
      case 'cancelled':
        return {
          bg: 'linear-gradient(135deg, #ef4444, #dc2626)', // Red
          text: '#ffffff',
          border: '#dc2626',
          solid: '#ef4444'
        }
      case 'completed':
        return {
          bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
          text: '#ffffff',
          border: '#1d4ed8',
          solid: '#3b82f6'
        }
      case 'in_progress':
        return {
          bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Purple
          text: '#ffffff',
          border: '#7c3aed',
          solid: '#8b5cf6'
        }
      default:
        return {
          bg: 'linear-gradient(135deg, #6b7280, #4b5563)', // Gray
          text: '#ffffff',
          border: '#4b5563',
          solid: '#6b7280'
        }
    }
  }

  const colors = getEventColors(event.extendedProps.appointment.status)
  const typeIcon = getEventIcon(event.extendedProps.type)
  const statusIcon = getStatusIcon(event.extendedProps.appointment.status)

  // Base classes based on variant and size
  const baseClasses = cn(
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
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(event)
  }

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
      <div className="flex items-center space-x-1 mb-1">
        {typeIcon}
        <span className="font-medium truncate flex-1">
          {event.title}
        </span>
        {(variant === 'day' || variant === 'list' || showDetails) && statusIcon}
      </div>

      {/* Additional details based on variant */}
      {(variant === 'day' || variant === 'list' || showDetails) && (
        <div className="space-y-1">
          {/* Time */}
          {event.start && (
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <Clock className="h-2.5 w-2.5" />
              <span>
                {new Date(event.start).toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
          
          {/* Location */}
          {event.extendedProps.location && (
            <div className="flex items-center space-x-1 text-xs opacity-90">
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
        <div className="flex items-center space-x-1 text-xs opacity-90">
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
          <div className="space-y-1 text-xs">
            {event.start && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(event.start).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            )}
            {event.extendedProps.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{event.extendedProps.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              {getStatusIcon(event.extendedProps.appointment.status)}
              <span className="capitalize">
                {event.extendedProps.appointment.status}
              </span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}
