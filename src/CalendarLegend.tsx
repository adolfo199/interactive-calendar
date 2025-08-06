/**
 * Leyenda de colores para el calendario de citas
 * 
 * Muestra el significado de cada color de estado
 */

import { cn } from './utils'
import { Badge } from './components/ui/badge'

interface CalendarLegendProps {
  className?: string
  compact?: boolean
}

export function CalendarLegend({ className, compact = false }: CalendarLegendProps) {
  const estadosInfo = [
    {
      estado: 'confirmada',
      color: 'bg-green-500',
      label: 'Confirmadas',
      description: 'Citas confirmadas y programadas',
      badgeClass: 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
    },
    {
      estado: 'pendiente', 
      color: 'bg-yellow-500',
      label: 'Pendientes',
      description: 'Citas por confirmar',
      badgeClass: 'border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
    },
    {
      estado: 'completada',
      color: 'bg-blue-500', 
      label: 'Completadas',
      description: 'Citas ya realizadas',
      badgeClass: 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100'
    },
    {
      estado: 'en_progreso',
      color: 'bg-purple-500',
      label: 'En Progreso', 
      description: 'Citas en curso',
      badgeClass: 'border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-100'
    },
    {
      estado: 'cancelada',
      color: 'bg-red-500',
      label: 'Canceladas',
      description: 'Citas canceladas',
      badgeClass: 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100'
    }
  ]

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className="text-xs font-medium text-gray-600">Estados:</span>
        {estadosInfo.map((info) => (
          <div key={info.estado} className="flex items-center gap-1">
            <div className={cn('w-3 h-3 rounded-full', info.color)}></div>
            <span className="text-xs text-gray-600">{info.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg p-4 shadow-sm border', className)}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Leyenda de Estados</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {estadosInfo.map((info) => (
          <div key={info.estado} className="flex items-center gap-2">
            <div className={cn('w-4 h-4 rounded-full shadow-sm', info.color)}></div>
            <div className="flex-1 min-w-0">
              <Badge 
                variant="outline" 
                className={cn('text-xs transition-colors', info.badgeClass)}
              >
                {info.label}
              </Badge>
              <p className="text-xs text-gray-500 mt-1 truncate">{info.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
