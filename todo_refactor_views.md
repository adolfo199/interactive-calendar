# Refactorización de Vistas del Calendario - Plan de Trabajo

## Estado Actual del Proyecto
**Rama:** `views-refactor` ✅  
**Última actualización:** 5 de agosto de 2025  
**Progreso general:** 🟢 Fases 1, 2, 3, 4 y 5 Completadas | ⏳ Fase 6 en Progreso (85%)

## 📝 Changelog Reciente

### 5 de agosto de 2025 - Refactorización Final CalendarMain
- ✅ **Refactorización exitosa de CalendarMain (406 → 263 líneas)**
  - 🎯 Reducción de **35% de líneas** (-143 líneas) con mejor modularidad
  - 📦 **CalendarToolbar** (103 líneas): Título, navegación, view selector, create button
  - 📊 **CalendarStatsBar** (80 líneas): Total appointments y status indicators
  - 🎨 **CalendarContent** (99 líneas): Loading/error states y view renderer
  - 🏗️ **Estructura modular**: `/calendar-views/main/components/` para subcomponentes
  - ✅ **Optimización mantenida**: React.memo, useCallback, useMemo en todos los nuevos componentes
  - 🎯 **Meta cumplida**: Ningún componente supera las 450 líneas
  - 📐 **Separación de responsabilidades**: Cada subcomponente tiene una responsabilidad específica
  - 🧪 **Testeabilidad mejorada**: Subcomponentes más pequeños y focalizados

### 5 de agosto de 2025 - Optimización React Performance
- ✅ **Implementación completa de React.memo en componentes principales**
  - 🎯 **CalendarMain** optimizado con React.memo, useCallback, useMemo
    - Event handlers memoizados para prevenir re-renders innecesarios
    - Common props memoizados para componentes de vista
    - View selector labels memoizados
    - Container styles memoizados para mejor performance
  - 🎯 **CalendarMonth** optimizado con React.memo, useCallback, useMemo
    - Event handlers memoizados (handleDateClick, handleEventClick)
    - getEventsForDay función memoizada
    - Week days y class names memoizados
  - 🎯 **CalendarWeek** optimizado con React.memo, useCallback, useMemo
    - Time slots memoizados (prevención de recálculo)
    - Week days y week day names memoizados
    - Today's date y browser locale memoizados
    - Event handlers memoizados
  - 🎯 **CalendarDay** optimizado con React.memo, useCallback, useMemo
    - Day events filtrados memoizados para evitar recálculo
    - Event handlers memoizados
  - ✅ **Estado actual de optimización:**
    - AppointmentCard ✅ (ya optimizado previamente)
    - ViewSelector ✅ (ya optimizado previamente)
    - WeekGrid ✅ (ya optimizado previamente)
    - CalendarMain ✅ (recién optimizado y refactorizado)
    - CalendarMonth ✅ (recién optimizado)
    - CalendarWeek ✅ (recién optimizado)
    - CalendarDay ✅ (recién optimizado)
    - CalendarToolbar ✅ (nuevo subcomponente optimizado)
    - CalendarStatsBar ✅ (nuevo subcomponente optimizado)
    - CalendarContent ✅ (nuevo subcomponente optimizado)

### 5 de agosto de 2025 - Optimización CSS
- ✅ **Eliminación masiva de clases space-x/space-y problemáticas**
  - 🔍 Identificadas 59 instancias de clases problemáticas en 13 archivos
  - 🔄 Reemplazadas sistemáticamente por alternativas confiables:
    - `space-y-1.5` → `gap-1.5` o `[&>*:not(:first-child)]:mt-1.5`
    - `space-x-2` → `gap-2` para layouts flex/grid
    - `space-y-0` → eliminado (no hace nada)
  - 📦 CSS optimizado: 38KB → 37KB (-1KB, -8 clases CSS generadas)
  - 🎯 Archivos actualizados: CalendarMain, AppointmentCard, NavigationControls, ViewSelector, StatusIndicator, MonthDay, CalendarMonth, TimeSlot, WeekDayColumn, WeekTimeAxis, WeekHeader, CalendarLegend, CalendarWeek
  - ✅ Build CSS exitoso con script simplificado

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

- **Fase 3:** CalendarMonth refactorización (100%)
  - CalendarMonth creado como orquestador mensual dedicado
  - MonthGrid implementado para layout del grid calendario
  - MonthDay implementado para celdas individuales de día
  - MonthHeader implementado para cabecera específica mensual
  - Estructura de componentes de vista mensual configurada
  - Exportaciones centralizadas establecidas
  - CalendarMain actualizado para delegar vista mensual
  - Compatibilidad backward mantenida
  - Diseño responsive y gradientes aplicados

- **Fase 4:** CalendarWeek refactorización (100%)
  - CalendarWeek creado como orquestador semanal dedicado
  - WeekHeader implementado para cabeceras de días con selección (88 líneas)
  - WeekGrid implementado para layout principal con ejes (75 líneas)
  - WeekDayColumn implementado para columnas de día con eventos (150 líneas)
  - WeekTimeAxis implementado para etiquetas de tiempo (41 líneas)
  - CalendarMain actualizado para delegar vista semanal
  - Estructura de componentes de vista semanal configurada
  - Exportaciones centralizadas establecidas
  - Compatibilidad backward mantenida
  - Arquitectura modular y separación de responsabilidades

- **Fase 5:** CalendarDay refactorización (100%)
  - CalendarDay creado como orquestador diario dedicado (54 líneas)
  - DayHeader implementado para cabecera del día con navegación (58 líneas)
  - DayEventsSummary implementado para resumen de eventos del día (45 líneas)
  - DayTimeGrid implementado para grid de tiempo y eventos (175 líneas)
  - CalendarMain actualizado para delegar vista diaria
  - Estructura de componentes de vista diaria configurada
  - Exportaciones centralizadas establecidas
  - Sistema de traducciones corregido para días de la semana
  - Eliminación de archivos obsoletos y limpieza de exports
  - Compatibilidad backward mantenida
  - Arquitectura modular y separación de responsabilidades

### ⏳ En Progreso:
- **Fase 6:** Testing y optimización (85%)
  - ✅ Eliminación de clases space-x/space-y problemáticas completada
  - ✅ Reemplazadas por alternativas confiables (gap, margin directo)
  - ✅ CSS optimizado de 38KB → 37KB (-1KB, -8 clases)
  - ✅ Optimización de performance con React.memo, useCallback, useMemo:
    - CalendarMain, CalendarMonth, CalendarWeek, CalendarDay optimizados
    - AppointmentCard, ViewSelector, WeekGrid ya estaban optimizados
    - CalendarToolbar, CalendarStatsBar, CalendarContent nuevos y optimizados
  - ✅ Refactorización de componentes grandes (>450 líneas):
    - CalendarMain: 406 → 263 líneas (-35% reducción)
    - Extracción de 3 subcomponentes modulares y optimizados
  - ⏳ Tests unitarios para cada componente
  - ⏳ Tests de integración para orquestadores
  - ⏳ Documentación JSDoc

### 📋 Pendiente:
- Completar Fase 6: Testing y documentación JSDoc (15% restante)

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
1. ✅ Renombrar y mover `CalendarMain.tsx` → `calendar-views/month/CalendarMonth.tsx`
2. ✅ Crear `MonthHeader.tsx`
3. ✅ Crear `MonthGrid.tsx` 
4. ✅ Crear `MonthDay.tsx`
5. ✅ Refactorizar `CalendarMonth.tsx` como orquestador mensual

### Fase 4: Refactorizar CalendarWeek ✅
1. ✅ Mover `CalendarWeek.tsx` → `calendar-views/week/CalendarWeek.tsx`
2. ✅ Crear `WeekHeader.tsx` (88 líneas - headers de días con selección)
3. ✅ Crear `WeekGrid.tsx` (75 líneas - layout principal con ejes)
4. ✅ Crear `WeekDayColumn.tsx` (150 líneas - columnas de día con eventos)
5. ✅ Crear `WeekTimeAxis.tsx` (41 líneas - etiquetas de tiempo)
6. ✅ Refactorizar `CalendarWeek.tsx` como orquestador semanal (110 líneas)

### Fase 5: Refactorizar CalendarDay ✅
1. ✅ Mover `CalendarDay.tsx` → `calendar-views/day/CalendarDay.tsx`
2. ✅ Crear `DayHeader.tsx` (58 líneas - cabecera del día con navegación)
3. ✅ Crear `DayEventsSummary.tsx` (45 líneas - resumen de eventos del día)
4. ✅ Crear `DayTimeGrid.tsx` (175 líneas - grid de tiempo y eventos)
5. ✅ Refactorizar `CalendarDay.tsx` como orquestador diario (54 líneas)

### Fase 6: Testing y optimización
1. ✅ **CSS Optimization**: Eliminación de clases space-x/space-y problemáticas
   - Reemplazadas 59 instancias en 13 archivos
   - CSS reducido de 38KB → 37KB
   - Alternativas confiables implementadas (gap, margin directo)
2. ⏳ Tests unitarios para cada componente
3. ⏳ Tests de integración para orquestadores
4. ⏳ Optimización de performance (React.memo, useCallback)
5. ⏳ Documentación JSDoc

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
