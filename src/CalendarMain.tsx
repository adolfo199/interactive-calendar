/**
 * Main Calendar Orchestrator Component
 * 
 * Coordinates all calendar views and provides global navigation and controls
 * Delegates to specific view components: CalendarMonth, CalendarWeek, CalendarDay
 */

import React from 'react'
import { cn } from './utils'
import { Card, CardContent, CardHeader } from './components/ui/card'
import { Button } from './components/ui/button'
import { CalendarIcon, Plus, Loader2 } from 'lucide-react'

// Import shared components
import { 
  NavigationControls, 
  ViewSelector, 
  StatusIndicator 
} from './calendar-views/shared'

// Import view components
import { CalendarDay } from './CalendarDay'
import { CalendarWeek } from './CalendarWeek' 
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

export function CalendarMain({
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
}: CalendarMainProps) {
  
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

  // Event handlers
  const handleDateClick = (date: Date) => {
    console.log('Main orchestrator - handleDateClick:', date)
    
    // Execute custom callback if provided
    if (onDateClick) {
      onDateClick(date)
    }
    
    // Default behavior: navigate to day view
    calendar.goToDate(date)
    calendar.setView('day')
  }

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Main orchestrator - handleEventClick:', event)
    
    // Execute custom callback if provided
    onEventClick?.(event)
    
    // Default behavior: open view modal
    if (!onEventClick) {
      modal.openViewModal(event.extendedProps.appointment)
    }
  }

  const handleCreateEvent = (date?: Date) => {
    console.log('Main orchestrator - handleCreateEvent:', date)
    
    // Execute custom callback if provided
    onCreateEvent?.(date)
    
    // Default behavior: open create modal
    if (!onCreateEvent) {
      modal.openCreateModal(date)
    }
  }

  // View change handler
  const handleViewChange = (newView: CalendarView) => {
    console.log('Main orchestrator - handleViewChange:', newView)
    calendar.setView(newView)
  }

  // Navigation handlers
  const handlePrevious = () => {
    console.log('Main orchestrator - handlePrevious')
    calendar.navigate('prev')
  }

  const handleNext = () => {
    console.log('Main orchestrator - handleNext')
    calendar.navigate('next')
  }

  const handleToday = () => {
    console.log('Main orchestrator - handleToday')
    calendar.goToToday()
  }

  // Render current view
  const renderCurrentView = () => {
    const commonProps = {
      events: events.events,
      currentDate: calendar.currentDate,
      selectedDate: calendar.selectedDate,
      onDateClick: handleDateClick,
      onEventClick: handleEventClick,
      loading: loading || events.loading,
      locale
    }

    switch (calendar.view) {
      case 'day':
        return <CalendarDay {...commonProps} />
      
      case 'week':
        return <CalendarWeek {...commonProps} />
      
      case 'month':
      default:
        return <CalendarMonth {...commonProps} selectedDate={calendar.selectedDate || undefined} />
    }
  }

  return (
    <Card className={cn('w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50', className)}>
      {showToolbar && (
        <CardHeader className="pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          {/* Main navigation and controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              {/* Calendar title with icon */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t.t('common:title')}
                </h1>
              </div>
              
              {/* Navigation controls */}
              <NavigationControls
                title={calendar.title}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToday={handleToday}
                loading={loading}
                variant="full"
                todayText={t.t('navigation.today')}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* View selector */}
              {showViewSelector && (
                <ViewSelector
                  currentView={calendar.view}
                  onViewChange={handleViewChange}
                  loading={loading}
                  labels={{
                    month: t.t('views.month'),
                    week: t.t('views.week'),
                    day: t.t('views.day')
                  }}
                />
              )}

              {/* Create appointment button */}
              {showCreateButton && (
                <Button 
                  onClick={() => handleCreateEvent()}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                  size="default"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {t.t('buttons.create')}
                </Button>
              )}
            </div>
          </div>

          {/* Statistics and status indicators */}
          <div className="flex items-center justify-between bg-white/60 rounded-lg p-3 shadow-sm border">
            {/* Total appointments */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                {t.t('stats.totalAppointments', { count: events.eventStats.total })}
              </span>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                {t.t('stats.status')}
              </span>
              
              <div className="flex items-center space-x-3">
                {events.eventStats.byStatus.confirmed > 0 && (
                  <StatusIndicator
                    status="confirmed"
                    count={events.eventStats.byStatus.confirmed}
                    minimal={true}
                    customText={t.t('appointments:statusPlural.confirmed', { 
                      count: events.eventStats.byStatus.confirmed 
                    })}
                  />
                )}
                
                {events.eventStats.byStatus.pending > 0 && (
                  <StatusIndicator
                    status="pending"
                    count={events.eventStats.byStatus.pending}
                    minimal={true}
                    customText={t.t('appointments:statusPlural.pending', { 
                      count: events.eventStats.byStatus.pending 
                    })}
                  />
                )}
                
                {events.eventStats.byStatus.completed > 0 && (
                  <StatusIndicator
                    status="completed"
                    count={events.eventStats.byStatus.completed}
                    minimal={true}
                    customText={t.t('appointments:statusPlural.completed', { 
                      count: events.eventStats.byStatus.completed 
                    })}
                  />
                )}
                
                {events.eventStats.byStatus.cancelled > 0 && (
                  <StatusIndicator
                    status="cancelled"
                    count={events.eventStats.byStatus.cancelled}
                    minimal={true}
                    customText={t.t('appointments:statusPlural.cancelled', { 
                      count: events.eventStats.byStatus.cancelled 
                    })}
                  />
                )}
                
                {events.eventStats.byStatus.in_progress > 0 && (
                  <StatusIndicator
                    status="in_progress"
                    count={events.eventStats.byStatus.in_progress}
                    minimal={true}
                    customText={t.t('appointments:statusPlural.in_progress', { 
                      count: events.eventStats.byStatus.in_progress 
                    })}
                  />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent 
        className="p-0 bg-white" 
        style={{ 
          height: height === 'auto' ? 'auto' : (typeof height === 'number' ? `${height}px` : height),
          minHeight: height === 'auto' ? '500px' : undefined
        }}
      >
        {/* Loading state */}
        {loading && events.loading ? (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center p-8">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
                <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.t('loading.calendar')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.t('loading.events')}
              </p>
            </div>
          </div>
        ) : events.error ? (
          /* Error state */
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.t('errors.loadEvents')}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {events.error}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => events.loadEvents()}
              >
                {t.t('buttons.retry')}
              </Button>
            </div>
          </div>
        ) : (
          /* Main content */
          <div className="h-full overflow-auto relative">
            {/* Loading overlay */}
            <div className={cn(
              "absolute inset-0 bg-white/50 backdrop-blur-sm transition-all duration-300 z-10",
              loading ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </div>
            
            {/* Current view content */}
            <div className="min-h-full transition-all duration-300 ease-in-out">
              {renderCurrentView()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
