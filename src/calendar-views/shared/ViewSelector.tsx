/**
 * Reusable component for selecting calendar view
 * Allows switching between day, week and month views
 * Optimized with React.memo and useMemo for performance
 */

import React, { memo, useMemo, useCallback } from 'react'
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

// Memoized view configuration to prevent recreation
const viewConfig = {
  month: {
    icon: Grid3x3,
    defaultLabel: 'Mes'
  },
  week: {
    icon: BarChart3,
    defaultLabel: 'Semana'
  },
  day: {
    icon: FileText,
    defaultLabel: 'Día'
  }
} as const

const ViewSelector = memo<ViewSelectorProps>(({
  currentView,
  onViewChange,
  availableViews = ['month', 'week', 'day'],
  loading = false,
  className,
  labels = {}
}) => {

  // Memoize the final view config with custom labels
  const finalViewConfig = useMemo(() => ({
    month: {
      ...viewConfig.month,
      label: labels.month || viewConfig.month.defaultLabel
    },
    week: {
      ...viewConfig.week,
      label: labels.week || viewConfig.week.defaultLabel
    },
    day: {
      ...viewConfig.day,
      label: labels.day || viewConfig.day.defaultLabel
    }
  }), [labels])

  // Memoize the container className
  const containerClassName = useMemo(() => 
    cn('flex space-x-1 bg-white rounded-lg p-1 shadow-sm border', className)
  , [className])

  // Memoize the view click handler factory
  const createViewHandler = useCallback((viewType: CalendarView) => {
    return () => onViewChange(viewType)
  }, [onViewChange])

  // Memoize the rendered buttons
  const buttons = useMemo(() => {
    return availableViews.map((viewType) => {
      const config = finalViewConfig[viewType]
      const Icon = config.icon
      const isActive = currentView === viewType

      const buttonClassName = cn(
        "transition-all duration-200 font-medium",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "hover:bg-primary/10 hover:text-primary"
      )

      const icon = loading && isActive ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Icon className="h-4 w-4 mr-1" />
      )

      return (
        <Button
          key={viewType}
          variant={isActive ? 'default' : 'ghost'}
          size="sm"
          onClick={createViewHandler(viewType)}
          disabled={loading}
          className={buttonClassName}
        >
          {icon}
          {config.label}
        </Button>
      )
    })
  }, [availableViews, finalViewConfig, currentView, loading, createViewHandler])

  return (
    <div className={containerClassName}>
      {buttons}
    </div>
  )
})

ViewSelector.displayName = 'ViewSelector'

export { ViewSelector }
