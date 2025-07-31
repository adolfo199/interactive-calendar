# Testing Guide - @interactive/calendar

## Métodos para Probar el Paquete

### 1. 🔧 Testing Local (Desarrollo)

#### Prerequisitos
```bash
npm install
```

#### Compilar y verificar tipos
```bash
npm run build
npm run typecheck
```

#### Tests unitarios
```bash
# Ejecutar tests una vez
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI
npm run test:ui
```

#### Linting
```bash
npm run lint
```

### 2. 📦 Testing como Paquete npm

#### Crear paquete local
```bash
npm run pack:local
```
Esto genera un archivo `.tgz` que puedes instalar en otros proyectos.

#### Instalar en proyecto de prueba
```bash
# En otra carpeta, crear proyecto de prueba
npm init -y
npm install ../path/to/interactive-calendar-1.0.0.tgz
```

#### Ejemplo de uso
```typescript
import { CalendarMain } from '@interactive/calendar'

function App() {
  return (
    <CalendarMain
      initialView="month"
      showToolbar={true}
      onDateClick={(date) => console.log('Fecha seleccionada:', date)}
      onEventClick={(event) => console.log('Evento clickeado:', event)}
    />
  )
}
```

### 3. 📖 Storybook (Documentación Interactiva)

#### Ejecutar Storybook
```bash
npm run storybook
```

#### Construir Storybook
```bash
npm run build-storybook
```

### 4. 🌐 Demo HTML

Abre el archivo `demo/index.html` en tu navegador para ver una demostración básica.

### 5. 🔗 npm link (Desarrollo Avanzado)

Para desarrollo con hot-reload en otro proyecto:

```bash
# En este proyecto
npm link

# En tu proyecto de prueba
npm link @interactive/calendar
```

### 6. 📱 Testing en Diferentes Entornos

#### Next.js
```typescript
import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import('@interactive/calendar').then(mod => ({ default: mod.CalendarMain })), {
  ssr: false
})

export default function CalendarPage() {
  return <Calendar />
}
```

#### Vite + React
```typescript
import { CalendarMain } from '@interactive/calendar'
import '@interactive/calendar/dist/style.css' // Si tienes estilos

function App() {
  return <CalendarMain />
}
```

#### Create React App
```typescript
import { CalendarMain } from '@interactive/calendar'

function App() {
  return (
    <div className="App">
      <CalendarMain />
    </div>
  )
}
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila el paquete para producción |
| `npm run dev` | Modo desarrollo con watch |
| `npm test` | Ejecuta tests unitarios |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:ui` | Interfaz visual para tests |
| `npm run typecheck` | Verificación de tipos TypeScript |
| `npm run lint` | Análisis de código |
| `npm run storybook` | Documentación interactiva |
| `npm run pack:local` | Genera paquete .tgz local |

## Checklist de Testing

- [ ] ✅ Compilación exitosa (`npm run build`)
- [ ] ✅ Tests pasan (`npm test`)
- [ ] ✅ No errores de tipos (`npm run typecheck`)
- [ ] ✅ No errores de linting (`npm run lint`)
- [ ] ✅ Paquete se puede instalar (`npm run pack:local`)
- [ ] ✅ Componente se renderiza correctamente
- [ ] ✅ Props funcionan como esperado
- [ ] ✅ Events/callbacks funcionan
- [ ] ✅ Estilos se aplican correctamente
- [ ] ✅ Compatible con diferentes frameworks

## Troubleshooting

### Error: Cannot resolve module
- Verificar que todas las dependencias están instaladas
- Revisar que el build fue exitoso
- Comprobar las rutas de importación

### Errores de tipos TypeScript
- Ejecutar `npm run typecheck`
- Verificar que `@types/react` está instalado en el proyecto host
- Comprobar versiones de TypeScript compatibles

### Estilos no se aplican
- Verificar que TailwindCSS está configurado en el proyecto host
- Importar estilos CSS si es necesario
- Revisar orden de carga de estilos CSS
