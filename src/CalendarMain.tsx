/**
 * Componente principal del calendario de citas
 * 
 * Orquesta la vista del calendario con eventos y navegación
 */

import { cn } from './utils'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { 
  Loader2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Users,
  GraduationCap,
  Presentation as PresentationIcon,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Pause,
  Grid3x3,
  BarChart3, 
  FileText
} from 'lucide-react'

import { CalendarWeek } from './CalendarWeek'
import { CalendarDay } from './CalendarDay'
import { CalendarLegend } from './CalendarLegend'
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
  initialView?: CalendarView
  initialDate?: Date
  height?: string | number
  showToolbar?: boolean
  showCreateButton?: boolean
  showViewSelector?: boolean
  locale?: 'en' | 'es'
  onAppointmentCreate?: (data: CalendarEvent) => Promise<void>
  onAppointmentUpdate?: (data: CalendarEvent) => Promise<void>
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
  
  // Translation hook
  const t = useCalendarTranslations({ locale })
  
  // Hooks del calendario
  const calendar = useCalendar({
    initialView,
    initialDate,
    locale
  })
  
  const events = useCalendarEvents({
    // initialEvents se cargarían desde la API
  })
  
  const modal = useAppointmentModal({
    onSubmit: onAppointmentCreate as (data: unknown) => Promise<void>, // Tipo temporal hasta definir bien la interface
    onDelete: onAppointmentDelete
  })

  // Función para obtener el icono del tipo de cita
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

  // Función para obtener el icono del estado
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
      default:
        return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  // Función para obtener colores basados en el ESTADO de la cita (más intuitivo)
  const getEventColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'linear-gradient(135deg, #10b981, #059669)', // Verde
          text: '#ffffff',
          border: '#059669',
          solid: '#10b981'
        }
      case 'pending':
        return {
          bg: 'linear-gradient(135deg, #f59e0b, #d97706)', // Amarillo/Naranja
          text: '#ffffff',
          border: '#d97706',
          solid: '#f59e0b'
        }
      case 'cancelled':
        return {
          bg: 'linear-gradient(135deg, #ef4444, #dc2626)', // Rojo
          text: '#ffffff',
          border: '#dc2626',
          solid: '#ef4444'
        }
      case 'completed':
        return {
          bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Azul
          text: '#ffffff',
          border: '#1d4ed8',
          solid: '#3b82f6'
        }
      case 'in_progress':
        return {
          bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Púrpura
          text: '#ffffff',
          border: '#7c3aed',
          solid: '#8b5cf6'
        }
      default:
        return {
          bg: 'linear-gradient(135deg, #6b7280, #4b5563)', // Gris
          text: '#ffffff',
          border: '#4b5563',
          solid: '#6b7280'
        }
    }
  }

  // Manejar click en fecha
  const handleDateClick = (date: Date) => {
    console.log('handleDateClick called with date:', date)
    console.log('onDateClick prop:', onDateClick)
    
    // Ejecutar el callback personalizado si existe
    if (onDateClick) {
      onDateClick(date)
    }
    
    // Siempre navegar a la vista diaria como comportamiento por defecto
    console.log('Navigating to day view for date:', date)
    console.log('Current view before change:', calendar.view)
    console.log('Current date before change:', calendar.currentDate)
    
    // Cambiar la fecha actual del calendario
    calendar.goToDate(date)
    // Cambiar a vista diaria
    calendar.setView('day')
    
    console.log('View changed to day, new date:', date)
  }

  // Manejar click en evento
  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event)
    
    // Si no hay evento customizado, abrir modal de vista
    if (!onEventClick) {
      modal.openViewModal(event.extendedProps.appointment)
    }
  }

  // Manejar creación de evento
  const handleCreateEvent = (date?: Date) => {
    onCreateEvent?.(date)
    
    // Si no hay evento customizado, abrir modal de creación
    if (!onCreateEvent) {
      modal.openCreateModal(date)
    }
  }

  // Cambiar vista
  const handleViewChange = (newView: CalendarView) => {
    calendar.setView(newView)
  }

  // Navegación
  const handlePrevious = () => {
    calendar.navigate('prev')
  }

  const handleNext = () => {
    calendar.navigate('next')
  }

  const handleToday = () => {
    calendar.goToToday()
  }

  // Renderizar vista del calendario
  const renderCalendarView = () => {
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
      case 'week':
        return <CalendarWeek {...commonProps} />
      
      case 'day':
        return <CalendarDay {...commonProps} />
      
      case 'month':
      default:
        return renderMonthView()
    }
  }

  // Vista mensual mejorada con efectos visuales
  const renderMonthView = () => {
    return (
      <div className="p-4">
        {/* Encabezados de días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {calendar.getWeekDays().map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-3 bg-muted/20 rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid del calendario con animaciones */}
        <div className="grid grid-cols-7 gap-1">
          {calendar.calendarDays.map((date, index) => {
            const dayEvents = events.getEventsForDay(date)
            const isCurrentMonth = calendar.isSameMonth(date)
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[10px] p-2 border-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out",
                  "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                  calendar.isSelected(date) && "bg-gradient-to-br from-primary/10 to-primary/5 border-primary shadow-md",
                  calendar.isToday(date) && "ring-2 ring-primary ring-offset-2 bg-gradient-to-br from-blue-50 to-blue-100",
                  !isCurrentMonth && "text-muted-foreground bg-muted/10"
                )}
                onClick={() => {
                  console.log('Day cell clicked:', date)
                  handleDateClick(date)
                }}
              >
                {/* Número del día con mejor diseño */}
                <div className={cn(
                  "text-sm font-semibold mb-2 flex items-center justify-between",
                  calendar.isToday(date) && "text-primary"
                )}>
                  <span className={cn(
                    "transition-all duration-200",
                    calendar.isToday(date) && "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-sm"
                  )}>
                    {date.getDate()}
                  </span>
                  
                  {/* Indicador de disponibilidad */}
                  {dayEvents.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        dayEvents.length > 3 ? "bg-red-500" : dayEvents.length > 1 ? "bg-yellow-500" : "bg-green-500"
                      )} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {dayEvents.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Eventos del día con diseño mejorado */}
                <div className="space-y-1.5">
                  {dayEvents.slice(0, 2).map((event) => {
                    const colors = getEventColors(event.extendedProps.appointment.status)
                    const tipoIcon = getEventIcon(event.extendedProps.type)
                    const statusIcon = getStatusIcon(event.extendedProps.appointment.status)

                    return (
                      <div
                        key={event.id}
                        className="group relative"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event)
                        }}
                      >
                        <div
                          className="text-xs p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md border"
                          style={{ 
                            background: colors.bg,
                            color: colors.text,
                            borderColor: colors.border
                          }}
                          title={`${event.title} - ${event.extendedProps.location}\n${t.t(`appointments:status.${event.extendedProps.appointment.status}`)} | ${t.t(`appointments:types.${event.extendedProps.type}`)}`}
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            {tipoIcon}
                            <span className="font-medium truncate flex-1">
                              {event.title}
                            </span>
                            {statusIcon}
                          </div>
                          <div className="flex items-center space-x-1 text-xs opacity-90">
                            <MapPin className="h-2.5 w-2.5" />
                            <span className="truncate">
                              {event.extendedProps.location}
                            </span>
                          </div>
                        </div>

                        {/* Tooltip personalizado al hacer hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-max max-w-xs shadow-lg">
                          <div className="font-semibold mb-1">{event.title}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{event.start ? new Date(event.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.extendedProps.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(event.extendedProps.appointment.status)}
                              <span className="capitalize">{t.t(`appointments:status.${event.extendedProps.appointment.status}`)}</span>
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Indicador de más eventos */}
                  {dayEvents.length > 2 && (
                    <div 
                      className="text-xs text-center py-1 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors font-medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('More events clicked for date:', date)
                        handleDateClick(date) // Abrir vista de día
                      }}
                    >
                      {t.t('stats.moreEvents', { count: dayEvents.length - 2 })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card className={cn('w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50', className)}>
      {showToolbar && (
        <CardHeader className="pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          {/* Primera fila: Título, navegación, controles principales */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              {/* Título con fecha actual y icono */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {calendar.title}
                </CardTitle>
              </div>
              
              {/* Navegación mejorada */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handlePrevious}
                  disabled={loading}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleToday}
                  disabled={loading}
                  className="font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-primary/20"
                >
                  {t.t('navigation.today')}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNext}
                  disabled={loading}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Selector de vista mejorado */}
              {showViewSelector && (
                <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border">
                  {(['month', 'week', 'day'] as CalendarView[]).map((viewType) => (
                    <Button
                      key={viewType}
                      variant={calendar.view === viewType ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleViewChange(viewType)}
                      disabled={loading}
                      className={cn(
                        "transition-all duration-200 font-medium",
                        calendar.view === viewType 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {viewType === 'month' ? (
                        <>
                          <Grid3x3 className="h-4 w-4 mr-1" />
                          {t.t('views.month')}
                        </>
                      ) : viewType === 'week' ? (
                        <>
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {t.t('views.week')}
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-1" />
                          {t.t('views.day')}
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              )}

              {/* Botón crear cita mejorado */}
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

          {/* Segunda fila: Estadísticas y leyenda de colores */}
          <div className="flex items-center justify-between bg-white/60 rounded-lg p-3 shadow-sm border">
            {/* Total de citas */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                {t.t('stats.totalAppointments', { count: events.eventStats.total })}
              </Badge>
            </div>
            
            {/* Leyenda de colores por estado */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">{t.t('stats.status')}</span>
              
              <div className="flex items-center space-x-3">
                {/* Verde - Confirmadas */}
                {events.eventStats.byStatus.confirmed > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 hover:bg-green-100 transition-colors text-xs">
                      {t.t('appointments:statusPlural.confirmed', { count: events.eventStats.byStatus.confirmed })}
                    </Badge>
                  </div>
                )}
                
                {/* Amarillo - Pendientes */}
                {events.eventStats.byStatus.pending > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors text-xs">
                      {t.t('appointments:statusPlural.pending', { count: events.eventStats.byStatus.pending })}
                    </Badge>
                  </div>
                )}
                
                {/* Azul - Completadas */}
                {events.eventStats.byStatus.completed > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors text-xs">
                      {t.t('appointments:statusPlural.completed', { count: events.eventStats.byStatus.completed })}
                    </Badge>
                  </div>
                )}
                
                {/* Rojo - Canceladas */}
                {events.eventStats.byStatus.cancelled > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50 hover:bg-red-100 transition-colors text-xs">
                      {t.t('appointments:statusPlural.cancelled', { count: events.eventStats.byStatus.cancelled })}
                    </Badge>
                  </div>
                )}
                
                {/* Púrpura - En progreso */}
                {events.eventStats.byStatus.in_progress > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors text-xs">
                      {t.t('appointments:statusPlural.in_progress', { count: events.eventStats.byStatus.in_progress })}
                    </Badge>
                  </div>
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
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-pink-50">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-red-600" />
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
                className="bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800 transition-all duration-200"
                onClick={() => events.loadEvents()}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                {t.t('buttons.retry')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto relative">
            {/* Overlay de transición suave */}
            <div className={cn(
              "absolute inset-0 bg-white/50 backdrop-blur-sm transition-all duration-300 z-10",
              loading ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </div>
            
            {/* Contenido del calendario con transición */}
            <div className="min-h-full transition-all duration-300 ease-in-out flex flex-col">
              <div className="flex-1 overflow-auto">
                {renderCalendarView()}
              </div>
              
              {/* Leyenda de colores */}
              <div className="p-4 border-t bg-gray-50/50 flex-shrink-0">
                <CalendarLegend compact={true} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
