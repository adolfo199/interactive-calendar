/**
 * Day header component for calendar day view
 * 
 * Displays the day information with current date highlighting
 */

import { cn } from '../../../utils'
import { useCalendarTranslations } from '../../../hooks/useCalendarTranslations'

interface DayHeaderProps {
  currentDate: Date
  locale?: string
  onDateClick?: (date: Date) => void
  className?: string
}

export function DayHeader({
  currentDate,
  locale = 'es',
  onDateClick,
  className
}: DayHeaderProps) {
  const { t } = useCalendarTranslations({ locale: locale as 'en' | 'es' })
  const today = new Date()
  const isToday = currentDate.toDateString() === today.toDateString()
  
  // Convert locale to browser locale format
  const browserLocale = locale === 'en' ? 'en-US' : 'es-ES'

  // Get day of week name using translations
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = dayNames[currentDate.getDay()]
  const weekdayName = t(`common:weekDays.long.${dayName}`)

  return (
    <div className={cn("border-b bg-muted/30", className)}>
      <div 
        className={cn(
          "h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
          isToday && "bg-blue-50"
        )}
        onClick={() => onDateClick?.(currentDate)}
      >
        <div className="text-sm text-muted-foreground uppercase tracking-wide">
          {weekdayName}
        </div>
        <div className={cn(
          "text-2xl font-bold",
          isToday && "text-primary"
        )}>
          {currentDate.getDate()}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentDate.toLocaleDateString(browserLocale, { month: 'long', year: 'numeric' })}
        </div>
        {isToday && (
          <div className="w-3 h-3 bg-primary rounded-full mt-1"></div>
        )}
      </div>
    </div>
  )
}
