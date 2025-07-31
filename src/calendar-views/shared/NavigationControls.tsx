/**
 * Reusable component for calendar navigation controls
 * Includes previous, next and today buttons
 */

import React from 'react'
import { cn } from '../../utils'
import { Button } from '../../components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react'

interface NavigationControlsProps {
  /** Callback to navigate to previous period */
  onPrevious: () => void
  /** Callback to navigate to next period */
  onNext: () => void
  /** Callback to go to today */
  onToday: () => void
  /** Title to display (e.g. "January 2025", "Week of Jan 1-7") */
  title: string
  /** Whether in loading state */
  loading?: boolean
  /** Visual variant of the component */
  variant: 'full' | 'compact'
  /** Additional CSS classes */
  className?: string
  /** Custom text for the "Today" button */
  todayText?: string
}

export function NavigationControls({
  onPrevious,
  onNext,
  onToday,
  title,
  loading = false,
  variant = 'full',
  className,
  todayText = 'Hoy'
}: NavigationControlsProps) {

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onPrevious}
          disabled={loading}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-200 p-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm font-medium text-gray-900 min-w-0 truncate">
          {title}
        </span>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onNext}
          disabled={loading}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-200 p-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center space-x-4', className)}>
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 min-w-0">
        {title}
      </h2>
      
      {/* Navigation controls */}
      <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onPrevious}
          disabled={loading}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToday}
          disabled={loading}
          className="font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-primary/20"
        >
          {todayText}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onNext}
          disabled={loading}
          className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
