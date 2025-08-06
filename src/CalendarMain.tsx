/**
 * Main Calendar Orchestrator Component
 * 
 * Coordinates all calendar views and provides global navigation and controls
 * Delegates to specific view components: CalendarMonth, CalendarWeek, CalendarDay
 * Optimized with React.memo, useCallback and useMemo for performance
 */

import React, { memo, useCallback, useMemo } from 'react'
import { cn } from './utils'
import { Card, CardContent, CardHeader } from './components/ui/card'

// Import main subcomponents
import { 
  CalendarToolbar,
  CalendarStatsBar,
  CalendarContent
} from './calendar-views/main/components'

// Import view components
import { CalendarDay } from './calendar-views/day'
import { CalendarWeek } from './calendar-views/week' 
import { CalendarMonth } from './calendar-views/month'

// Import hooks and types
import { useCalendar } from './hooks/useCalendar'
import { useCalendarEvents } from './hooks/useCalendarEvents'
import { useAppointmentModal } from './hooks/useAppointmentModal'
import { useCalendarTranslations } from './hooks/useCalendarTranslations'
import type { 
  CalendarProps, 
  CalendarEvent, 
  CalendarView,
} from './types/appointment.types'

interface CalendarMainProps extends Omit<CalendarProps, 'events' | 'view' | 'currentDate'> {
  /** Initial view to display */
  initialView?: CalendarView
  /** Initial date to display */
  initialDate?: Date
  /** Calendar height */
  height?: string | number
  /** Whether to show the main toolbar */
  showToolbar?: boolean
  /** Whether to show create appointment button */
  showCreateButton?: boolean
  /** Whether to show view selector */
  showViewSelector?: boolean
  /** Locale for internationalization */
  locale?: 'en' | 'es'
  /** Callback for appointment creation */
  onAppointmentCreate?: (data: CalendarEvent) => Promise<void>
  /** Callback for appointment updates */
  onAppointmentUpdate?: (data: CalendarEvent) => Promise<void>
  /** Callback for appointment deletion */
  onAppointmentDelete?: (id: number) => Promise<void>
}

export const CalendarMain = memo<CalendarMainProps>(({
  initialView = 'month',
  initialDate = new Date(),
  height = 'auto',
  showToolbar = true,
  showCreateButton = true,
  showViewSelector = true,
  locale = 'en',
  onDateClick,
  onEventClick,
  onCreateEvent,
  onAppointmentCreate,
  onAppointmentDelete,
  loading = false,
  className,
}) => {
  
  // Hooks
  const t = useCalendarTranslations({ locale })
  
  const calendar = useCalendar({
    initialView,
    initialDate,
    locale
  })
  
  const events = useCalendarEvents({
    // Events will be loaded from API
  })
  
  const modal = useAppointmentModal({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: onAppointmentCreate as any, // TODO: Fix type mismatch in Phase 6
    onDelete: onAppointmentDelete
  })

  // Memoized event handlers to prevent unnecessary re-renders
  const handleDateClick = useCallback((date: Date) => {
    console.log('Main orchestrator - handleDateClick:', date)
    
    // Execute custom callback if provided
    if (onDateClick) {
      onDateClick(date)
    }
    
    // Default behavior: navigate to day view
    calendar.goToDate(date)
    calendar.setView('day')
  }, [onDateClick, calendar])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    console.log('Main orchestrator - handleEventClick:', event)
    
    // Execute custom callback if provided
    onEventClick?.(event)
    
    // Default behavior: open view modal
    if (!onEventClick) {
      modal.openViewModal(event.extendedProps.appointment)
    }
  }, [onEventClick, modal])

  const handleCreateEvent = useCallback((date?: Date) => {
    console.log('Main orchestrator - handleCreateEvent:', date)
    
    // Execute custom callback if provided
    onCreateEvent?.(date)
    
    // Default behavior: open create modal
    if (!onCreateEvent) {
      modal.openCreateModal(date)
    }
  }, [onCreateEvent, modal])

  // Navigation handlers (memoized)
  const handleViewChange = useCallback((newView: CalendarView) => {
    console.log('Main orchestrator - handleViewChange:', newView)
    calendar.setView(newView)
  }, [calendar])

  const handlePrevious = useCallback(() => {
    console.log('Main orchestrator - handlePrevious')
    calendar.navigate('prev')
  }, [calendar])

  const handleNext = useCallback(() => {
    console.log('Main orchestrator - handleNext')
    calendar.navigate('next')
  }, [calendar])

  const handleToday = useCallback(() => {
    console.log('Main orchestrator - handleToday')
    calendar.goToToday()
  }, [calendar])

  // Memoized common props for view components to prevent unnecessary re-renders
  const commonViewProps = useMemo(() => ({
    events: events.events,
    currentDate: calendar.currentDate,
    selectedDate: calendar.selectedDate,
    onDateClick: handleDateClick,
    onEventClick: handleEventClick,
    loading: loading || events.loading,
    locale
  }), [
    events.events,
    calendar.currentDate,
    calendar.selectedDate,
    handleDateClick,
    handleEventClick,
    loading,
    events.loading,
    locale
  ])

  // Memoized view selector labels to prevent recreation
  const viewSelectorLabels = useMemo(() => ({
    month: t.t('views.month'),
    week: t.t('views.week'),
    day: t.t('views.day')
  }), [t])

  // Memoized container styles
  const containerStyle = useMemo(() => ({
    height: height === 'auto' ? 'auto' : (typeof height === 'number' ? `${height}px` : height),
    minHeight: height === 'auto' ? '500px' : undefined
  }), [height])

  // Memoized translation functions for subcomponents
  const getStatusText = useCallback((status: string, count: number) => {
    return t.t(`appointments:statusPlural.${status}`, { count })
  }, [t])

  const retryEvents = useCallback(() => {
    events.loadEvents()
  }, [events])

  // Render current view (memoized)
  const renderCurrentView = useCallback(() => {
    switch (calendar.view) {
      case 'day':
        return <CalendarDay {...commonViewProps} />
      
      case 'week':
        return <CalendarWeek {...commonViewProps} />
      
      case 'month':
      default:
        return <CalendarMonth {...commonViewProps} selectedDate={calendar.selectedDate || undefined} />
    }
  }, [calendar.view, commonViewProps, calendar.selectedDate])

  return (
    <Card className={cn('w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50', className)}>
      {showToolbar && (
        <CardHeader className="pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          {/* Main navigation and controls */}
          <CalendarToolbar
            calendarTitle={calendar.title}
            currentView={calendar.view}
            loading={loading}
            showCreateButton={showCreateButton}
            showViewSelector={showViewSelector}
            viewSelectorLabels={viewSelectorLabels}
            calendarTitleText={t.t('common:title')}
            todayText={t.t('navigation.today')}
            createButtonText={t.t('buttons.create')}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            onViewChange={handleViewChange}
            onCreateEvent={() => handleCreateEvent()}
          />

          {/* Statistics and status indicators */}
          <CalendarStatsBar
            eventStats={events.eventStats}
            totalAppointmentsText={t.t('stats.totalAppointments', { count: events.eventStats.total })}
            statusText={t.t('stats.status')}
            getStatusText={getStatusText}
          />
        </CardHeader>
      )}

      <CardContent 
        className="p-0 bg-white" 
        style={containerStyle}
      >
        <CalendarContent
          loading={loading}
          eventsLoading={events.loading}
          error={events.error}
          renderCurrentView={renderCurrentView}
          loadingCalendarText={t.t('loading.calendar')}
          loadingEventsText={t.t('loading.events')}
          loadEventsErrorText={t.t('errors.loadEvents')}
          retryButtonText={t.t('buttons.retry')}
          onRetry={retryEvents}
        />
      </CardContent>
    </Card>
  )
})

CalendarMain.displayName = 'CalendarMain'
