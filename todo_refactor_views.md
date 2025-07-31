# Refactorización de Vistas del Calendario - Plan de Trabajo

## Estado Actual del Proyecto
**Rama:** `views-refactor` ✅  
**Última actualización:** 31 de julio de 2025  
**Progreso general:** 🟢 Fase 1 y 2 Completadas | ⏳ Fase 3 En Progreso

### ✅ Completado:
- **Fase 1:** Estructura y componentes compartidos (100%)
  - Estructura de carpetas creada
  - 5 componentes compartidos implementados:
    - `AppointmentCard.tsx` - Tarjeta reutilizable con 4 variantes
    - `NavigationControls.tsx` - Controles de navegación (full/compact)
    - `ViewSelector.tsx` - Selector de vistas con iconos
    - `TimeSlot.tsx` - Slots de tiempo para day/week
    - `StatusIndicator.tsx` - Indicadores de estado con colores
  - Exportaciones centralizadas configuradas
  - Comentarios en inglés aplicados
  - TypeScript strict mode aplicado

- **Fase 2:** Orquestador principal CalendarMain (100%)
  - Nuevo CalendarMain como orquestador principal creado
  - Sistema de delegación de vistas implementado
  - Toolbar global con NavigationControls y ViewSelector
  - Manejo centralizado de eventos y estado
  - Compatibilidad backward mantenida
  - Vista temporal para month hasta Fase 3
  - Integración con componentes compartidos

### ⏳ En Progreso:
- **Fase 3:** CalendarMonth refactorización (0%)

### 📋 Pendiente:
- Fases 4-6: Refactorización de vistas restantes

## Objetivo

Dividir los componentes `CalendarDay`, `CalendarWeek` y `CalendarMain` en subcomponentes más pequeños y especializados para mejorar la mantenibilidad, reutilización y testeo del código.

## Nueva Estructura Propuesta

```
src/
├── CalendarMain.tsx                  # 🔄 Orquestador PRINCIPAL de todas las vistas
├── calendar-views/
│   ├── day/
│   │   ├── CalendarDay.tsx           # 🔄 Orquestador de vista diaria
│   │   ├── components/
│   │   │   ├── DayHeader.tsx         # ✨ Cabecera del día con navegación
│   │   │   ├── DayTimeSlots.tsx      # ✨ Slots de tiempo del día
│   │   │   ├── DayAppointments.tsx   # ✨ Lista de citas del día
│   │   │   └── DayControls.tsx       # ✨ Controles de navegación específicos
│   │   └── index.ts                  # ✨ Exportaciones limpias
│   ├── week/
│   │   ├── CalendarWeek.tsx          # 🔄 Orquestador de vista semanal
│   │   ├── components/
│   │   │   ├── WeekHeader.tsx        # ✨ Cabecera de la semana
│   │   │   ├── WeekGrid.tsx          # ✨ Grid de días de la semana
│   │   │   ├── WeekDayColumn.tsx     # ✨ Columna individual de día
│   │   │   ├── WeekTimeAxis.tsx      # ✨ Eje de tiempo lateral
│   │   │   └── WeekControls.tsx      # ✨ Controles de navegación específicos
│   │   └── index.ts                  # ✨ Exportaciones limpias
│   ├── month/
│   │   ├── CalendarMonth.tsx         # 🔄 Orquestador de vista mensual (antes CalendarMain)
│   │   ├── components/
│   │   │   ├── MonthHeader.tsx       # ✨ Cabecera del mes con navegación
│   │   │   ├── MonthGrid.tsx         # ✨ Grid del calendario mensual
│   │   │   ├── MonthDay.tsx          # ✨ Celda individual de día
│   │   │   ├── MonthControls.tsx     # ✨ Controles de navegación específicos
│   │   │   └── MonthSidebar.tsx      # ✨ Panel lateral (opcional)
│   │   └── index.ts                  # ✨ Exportaciones limpias
│   └── shared/
│       ├── AppointmentCard.tsx       # ✨ Tarjeta de cita reutilizable
│       ├── TimeSlot.tsx              # ✨ Slot de tiempo reutilizable
│       ├── NavigationControls.tsx    # ✨ Controles de navegación compartidos
│       ├── ViewSelector.tsx          # ✨ Selector de vista (día/semana/mes)
│       └── StatusIndicator.tsx       # ✨ Indicador de estado reutilizable
```

## Leyenda
- 🔄 **Refactorizar**: Componente existente que se convierte en orquestador
- ✨ **Crear**: Nuevo componente a crear
- 📦 **Reutilizar**: Componente compartido entre vistas

## Análisis de Componentes Actuales

### 1. CalendarMain.tsx (NUEVO ORQUESTADOR PRINCIPAL)
**Nueva responsabilidad:**
- Orquestación general del sistema de calendario
- Toolbar principal con navegación y controles globales
- Selector de vistas (día/semana/mes)
- Delegación a vistas específicas
- Manejo de estados y eventos globales
- Estadísticas y leyenda general

**Estructura propuesta:**
```tsx
// CalendarMain.tsx -> Orquestador PRINCIPAL
├── NavigationControls.tsx   # Navegación global (shared)
├── ViewSelector.tsx         # Selector de vistas (shared)
├── CalendarMonth.tsx        # Vista mensual
├── CalendarWeek.tsx         # Vista semanal
└── CalendarDay.tsx          # Vista diaria
```

### 2. CalendarMonth.tsx (antes CalendarMain)
**Responsabilidades específicas:**
- Vista mensual del calendario
- Grid del calendario mensual
- Celdas de días del mes
- Manejo de eventos mensuales

**Refactorización propuesta:**
```tsx
// CalendarMonth.tsx -> Orquestador mensual (antes CalendarMain)
├── MonthHeader.tsx      # Cabecera específica del mes
├── MonthGrid.tsx        # Grid del calendario mensual
├── MonthDay.tsx         # Celda individual de día
└── AppointmentCard.tsx  # Tarjeta de cita (shared)
```

### 3. CalendarWeek.tsx
**Responsabilidades específicas:**
- Vista semanal del calendario
- Grid de días de la semana
- Slots de tiempo semanales
- Manejo de eventos semanales

**Refactorización propuesta:**
```tsx
// CalendarWeek.tsx -> Orquestador semanal
├── WeekHeader.tsx       # Cabecera con días de la semana
├── WeekGrid.tsx         # Grid principal de la semana
├── WeekDayColumn.tsx    # Columna de día individual
├── WeekTimeAxis.tsx     # Eje lateral de horas
└── AppointmentCard.tsx  # Tarjeta de cita (shared)
```

### 4. CalendarDay.tsx
**Responsabilidades específicas:**
- Vista diaria del calendario
- Slots de tiempo del día
- Lista de citas diarias
- Navegación diaria

**Refactorización propuesta:**
```tsx
// CalendarDay.tsx -> Orquestador diario
├── DayHeader.tsx        # Cabecera del día
├── DayTimeSlots.tsx     # Slots de tiempo
├── DayAppointments.tsx  # Lista de citas
└── AppointmentCard.tsx  # Tarjeta de cita (shared)
```

## Componentes Compartidos (shared/)

### AppointmentCard.tsx
```tsx
interface AppointmentCardProps {
  event: CalendarEvent
  variant: 'month' | 'week' | 'day' | 'list'
  size: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  onClick?: (event: CalendarEvent) => void
  className?: string
}
```

### TimeSlot.tsx
```tsx
interface TimeSlotProps {
  time: Date
  duration: number // minutos
  events: CalendarEvent[]
  onSlotClick?: (time: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  view: 'day' | 'week'
}
```

### NavigationControls.tsx
```tsx
interface NavigationControlsProps {
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  title: string
  loading?: boolean
  variant: 'full' | 'compact'
}
```

### ViewSelector.tsx
```tsx
interface ViewSelectorProps {
  currentView: CalendarView
  onViewChange: (view: CalendarView) => void
  availableViews: CalendarView[]
  loading?: boolean
}
```

## Plan de Implementación

### Fase 1: Crear estructura y componentes compartidos
1. ✅ Crear carpetas `calendar-views/` y subcarpetas
2. ✅ Crear componentes en `shared/`
3. ✅ Migrar lógica común a componentes compartidos

### Fase 2: Refactorizar CalendarMain (Orquestador Principal)
1. ✅ Crear nuevo `CalendarMain.tsx` como orquestador principal
2. ✅ Migrar toolbar y controles globales
3. ✅ Implementar delegación a vistas específicas
4. ✅ Actualizar exportaciones principales

### Fase 3: Refactorizar CalendarMonth (antes CalendarMain)
1. ⏳ Renombrar y mover `CalendarMain.tsx` → `calendar-views/month/CalendarMonth.tsx`
2. ⏳ Crear `MonthHeader.tsx`
3. ⏳ Crear `MonthGrid.tsx` 
4. ⏳ Crear `MonthDay.tsx`
5. ⏳ Refactorizar `CalendarMonth.tsx` como orquestador mensual

### Fase 4: Refactorizar CalendarWeek
1. ⏳ Mover `CalendarWeek.tsx` → `calendar-views/week/CalendarWeek.tsx`
2. ⏳ Crear `WeekHeader.tsx`
3. ⏳ Crear `WeekGrid.tsx`
4. ⏳ Crear `WeekDayColumn.tsx`
5. ⏳ Crear `WeekTimeAxis.tsx`
6. ⏳ Refactorizar `CalendarWeek.tsx` como orquestador semanal

### Fase 5: Refactorizar CalendarDay
1. ⏳ Mover `CalendarDay.tsx` → `calendar-views/day/CalendarDay.tsx`
2. ⏳ Crear `DayHeader.tsx`
3. ⏳ Crear `DayTimeSlots.tsx`
4. ⏳ Crear `DayAppointments.tsx`
5. ⏳ Refactorizar `CalendarDay.tsx` como orquestador diario

### Fase 6: Testing y optimización
1. ⏳ Tests unitarios para cada componente
2. ⏳ Tests de integración para orquestadores
3. ⏳ Optimización de performance (React.memo, useCallback)
4. ⏳ Documentación JSDoc

## Migración y Compatibilidad

### Cambios de Nombres y Ubicaciones:
```
ANTES:
src/CalendarMain.tsx (570+ líneas)

DESPUÉS:
src/CalendarMain.tsx              # 🔄 NUEVO: Orquestador principal
src/calendar-views/month/CalendarMonth.tsx  # 🔄 RENOMBRADO: Vista mensual específica
```

### API Pública:
```tsx
// La API de CalendarMain se mantiene igual para compatibilidad
export function CalendarMain(props: CalendarMainProps) {
  // Internamente delega a CalendarMonth, CalendarWeek, o CalendarDay
  // según la vista actual
}

// Nueva exportación adicional para uso directo
export { CalendarMonth } from './calendar-views/month'
export { CalendarWeek } from './calendar-views/week'
export { CalendarDay } from './calendar-views/day'
```

## Beneficios Esperados

### 🎯 **Mantenibilidad**
- Archivos más pequeños y enfocados
- Responsabilidades claras y separadas
- Más fácil debuggear y modificar

### 🔄 **Reutilización**
- Componentes compartidos entre vistas
- Menos duplicación de código
- Consistencia visual entre vistas

### 🧪 **Testing**
- Tests más específicos y rápidos
- Mockeo más simple
- Mejor cobertura de código

### ⚡ **Performance**
- Mejor optimización con React.memo
- Re-renders más específicos
- Lazy loading de componentes

### 👥 **Colaboración**
- Múltiples desarrolladores trabajando en paralelo
- Merge conflicts reducidos
- Onboarding más simple

## Criterios de Éxito

- [ ] Todos los tests existentes siguen pasando
- [ ] No hay regresiones en funcionalidad
- [ ] Cada archivo tiene menos de 200 líneas
- [ ] Cobertura de tests >= 80%
- [ ] Performance igual o mejor
- [ ] Documentación JSDoc completa

## Notas Importantes

### 🚨 **Mantener Compatibilidad**
- La API pública de los componentes principales no debe cambiar
- Los props existentes deben seguir funcionando
- Backward compatibility con versiones anteriores

### 📝 **Convenciones de Código**
- Usar TypeScript strict mode
- Props interfaces bien definidas
- Consistent naming conventions
- JSDoc para componentes complejos

### 🎨 **Diseño**
- Mantener el sistema de colores actual
- Preservar las animaciones y transiciones
- Responsive design en todos los subcomponentes

### 🌐 **Internacionalización**
- Todos los subcomponentes deben soportar i18n
- Usar `useCalendarTranslations` hook
- Mantener soporte para locale prop

## Checklist de Refactorización

### Antes de empezar
- [x] Crear rama `views-refactor`
- [x] Backup de componentes actuales
- [x] Configurar estructura de carpetas

### Durante la refactorización
- [x] Mantener tests corriendo
- [x] Commits frecuentes y descriptivos
- [ ] Revisar performance en cada paso
- [ ] Validar i18n en cada componente

### Al finalizar
- [ ] Todos los tests pasan
- [ ] Build sin errores
- [ ] Demo funcional en proyecto de pruebas
- [ ] Documentación actualizada
- [ ] Merge a develop

---

**Creado:** 31 de julio de 2025  
**Objetivo:** Mejorar la arquitectura y mantenibilidad del sistema de vistas del calendario
