/**
 * Calendar Content Component
 * 
 * Handles the main calendar content area including loading states,
 * error states, and the current view renderer
 * Optimized with React.memo and useMemo for performance
 */

import React, { memo, useMemo } from 'react'
import { cn } from '../../../utils'
import { Button } from '../../../components/ui/button'
import { CalendarIcon, Loader2 } from 'lucide-react'

interface CalendarContentProps {
  /** Whether the calendar is loading */
  loading: boolean
  /** Whether events are loading */
  eventsLoading: boolean
  /** Error message if any */
  error?: string | null
  /** Current view renderer function */
  renderCurrentView: () => React.ReactNode
  /** Translated loading texts */
  loadingCalendarText: string
  loadingEventsText: string
  /** Translated error texts */
  loadEventsErrorText: string
  retryButtonText: string
  /** Retry function for loading events */
  onRetry: () => void
}

export const CalendarContent = memo<CalendarContentProps>(({
  loading,
  eventsLoading,
  error,
  renderCurrentView,
  loadingCalendarText,
  loadingEventsText,
  loadEventsErrorText,
  retryButtonText,
  onRetry
}) => {

  // Memoized loading overlay className
  const loadingOverlayClassName = useMemo(() => cn(
    "absolute inset-0 bg-white/50 backdrop-blur-sm transition-all duration-300 z-10",
    loading ? "opacity-100" : "opacity-0 pointer-events-none"
  ), [loading])

  // Show loading state if both calendar and events are loading
  if (loading && eventsLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
            <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {loadingCalendarText}
          </h3>
          <p className="text-sm text-muted-foreground">
            {loadingEventsText}
          </p>
        </div>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {loadEventsErrorText}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {error}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
          >
            {retryButtonText}
          </Button>
        </div>
      </div>
    )
  }

  // Show main content with optional loading overlay
  return (
    <div className="h-full overflow-auto relative">
      {/* Loading overlay */}
      <div className={loadingOverlayClassName}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
      
      {/* Current view content */}
      <div className="min-h-full transition-all duration-300 ease-in-out">
        {renderCurrentView()}
      </div>
    </div>
  )
})

CalendarContent.displayName = 'CalendarContent'
