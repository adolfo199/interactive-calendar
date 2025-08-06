/**
 * Calendar Toolbar Component
 * 
 * Contains the main calendar toolbar with title, navigation controls,
 * view selector, and create appointment button
 * Optimized with React.memo, useCallback and useMemo for performance
 */

import React, { memo, useMemo } from 'react'
import { Button } from '../../../components/ui/button'
import { CalendarIcon, Plus, Loader2 } from 'lucide-react'
import { NavigationControls, ViewSelector } from '../../shared'
import type { CalendarView } from '../../../types/appointment.types'

interface CalendarToolbarProps {
  /** Calendar title from useCalendar hook */
  calendarTitle: string
  /** Current calendar view */
  currentView: CalendarView
  /** Loading state */
  loading?: boolean
  /** Whether to show create appointment button */
  showCreateButton?: boolean
  /** Whether to show view selector */
  showViewSelector?: boolean
  /** View selector labels */
  viewSelectorLabels: {
    month: string
    week: string
    day: string
  }
  /** Translated calendar title */
  calendarTitleText: string
  /** Translated today text */
  todayText: string
  /** Translated create button text */
  createButtonText: string
  /** Navigation handlers */
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: CalendarView) => void
  onCreateEvent: () => void
}

export const CalendarToolbar = memo<CalendarToolbarProps>(({
  calendarTitle,
  currentView,
  loading = false,
  showCreateButton = true,
  showViewSelector = true,
  viewSelectorLabels,
  calendarTitleText,
  todayText,
  createButtonText,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onCreateEvent
}) => {

  // Memoized create button content to prevent recreation
  const createButtonContent = useMemo(() => (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      {createButtonText}
    </>
  ), [loading, createButtonText])

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-6">
        {/* Calendar title with icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {calendarTitleText}
          </h1>
        </div>
        
        {/* Navigation controls */}
        <NavigationControls
          title={calendarTitle}
          onPrevious={onPrevious}
          onNext={onNext}
          onToday={onToday}
          loading={loading}
          variant="full"
          todayText={todayText}
        />
      </div>

      <div className="flex items-center gap-4">
        {/* View selector */}
        {showViewSelector && (
          <ViewSelector
            currentView={currentView}
            onViewChange={onViewChange}
            loading={loading}
            labels={viewSelectorLabels}
          />
        )}

        {/* Create appointment button */}
        {showCreateButton && (
          <Button 
            onClick={onCreateEvent}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            size="default"
          >
            {createButtonContent}
          </Button>
        )}
      </div>
    </div>
  )
})

CalendarToolbar.displayName = 'CalendarToolbar'
