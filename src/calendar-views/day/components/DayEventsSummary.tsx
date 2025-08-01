/**
 * Day events summary component
 * 
 * Shows a summary of all events for the current day
 */

import type { CalendarEvent } from '../../../types/appointment.types'
import { useCalendarTranslations } from '../../../hooks/useCalendarTranslations'

interface DayEventsSummaryProps {
  events: CalendarEvent[]
  locale?: string
  onEventClick?: (event: CalendarEvent) => void
  className?: string
}

export function DayEventsSummary({
  events,
  locale = 'es',
  onEventClick,
  className
}: DayEventsSummaryProps) {
  const { t } = useCalendarTranslations({ locale: locale as 'en' | 'es' })

  if (events.length === 0) {
    return null
  }

  return (
    <div className={`border-b bg-muted/10 p-4 ${className || ''}`}>
      <div className="text-sm font-medium mb-2">
        {t('common:dayView.eventsCount', { 
          count: events.length
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {events.map(event => (
          <div
            key={event.id}
            className="text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: event.backgroundColor,
              color: event.textColor
            }}
            onClick={() => onEventClick?.(event)}
            title={event.title}
          >
            {t(`appointments:status.${event.extendedProps.status}`)}
          </div>
        ))}
      </div>
    </div>
  )
}
