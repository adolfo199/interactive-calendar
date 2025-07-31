/**
 * Reusable component for selecting calendar view
 * Allows switching between day, week and month views
 */

import React from 'react'
import { cn } from '../../utils'
import { Button } from '../../components/ui/button'
import { 
  Grid3x3,
  BarChart3, 
  FileText,
  Loader2
} from 'lucide-react'

import type { CalendarView } from '../../types/appointment.types'

interface ViewSelectorProps {
  /** Current active view */
  currentView: CalendarView
  /** Callback when view changes */
  onViewChange: (view: CalendarView) => void
  /** Available views to display */
  availableViews?: CalendarView[]
  /** Whether in loading state */
  loading?: boolean
  /** Additional CSS classes */
  className?: string
  /** Custom texts for views */
  labels?: {
    month?: string
    week?: string
    day?: string
  }
}

export function ViewSelector({
  currentView,
  onViewChange,
  availableViews = ['month', 'week', 'day'],
  loading = false,
  className,
  labels = {
    month: 'Mes',
    week: 'Semana', 
    day: 'Día'
  }
}: ViewSelectorProps) {

  // View configuration with icons
  const viewConfig = {
    month: {
      icon: Grid3x3,
      label: labels.month || 'Mes'
    },
    week: {
      icon: BarChart3,
      label: labels.week || 'Semana'
    },
    day: {
      icon: FileText,
      label: labels.day || 'Día'
    }
  }

  return (
    <div className={cn('flex space-x-1 bg-white rounded-lg p-1 shadow-sm border', className)}>
      {availableViews.map((viewType) => {
        const config = viewConfig[viewType]
        const Icon = config.icon
        const isActive = currentView === viewType

        return (
          <Button
            key={viewType}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(viewType)}
            disabled={loading}
            className={cn(
              "transition-all duration-200 font-medium",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-primary/10 hover:text-primary"
            )}
          >
            {loading && isActive ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Icon className="h-4 w-4 mr-1" />
            )}
            {config.label}
          </Button>
        )
      })}
    </div>
  )
}
