# 📅 Interactive Calendar

Un componente de calendario interactivo y moderno para React con TypeScript, diseñado especialmente para sistemas de gestión de citas y eventos.

## ✨ Características

- 🎨 **Interfaz moderna**: Diseñado con Tailwind CSS y componentes reutilizables
- 📱 **Responsive**: Se adapta a diferentes tamaños de pantalla
- ⚡ **Performance**: Optimizado con React y TypeScript
- 🔧 **Personalizable**: Fácil de integrar y personalizar
- 📅 **Múltiples vistas**: Soporte para vista mensual y otras vistas
- 🎯 **Eventos interactivos**: Manejo completo de eventos de clic y creación
- 💼 **Gestión de citas**: Diseñado para sistemas de citas médicas/profesionales

## 📦 Instalación

### 🚀 Opción SÚPER SIMPLE (Recomendada)

Para la experiencia más simple, solo importa el CSS pre-compilado:

```bash
npm install @interactive/calendar
```

```javascript
// En tu App.tsx - ¡Solo esto!
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1rem' }}>
      <CalendarMain 
        initialView="month"
        onDateClick={(date) => console.log('Fecha:', date)}
        onEventClick={(event) => console.log('Evento:', event)}
        onCreateEvent={(date) => console.log('Crear:', date)}
      />
    </div>
  );
}
```

✅ **Sin configuración de Tailwind**  
✅ **Sin variables CSS manuales**  
✅ **Funciona con cualquier setup**  
✅ **Solo 10KB de CSS**  

---

### ⚙️ Opción AVANZADA (Para customización)

Si necesitas personalizar colores o integrar con tu sistema de diseño:

```bash
npm install @interactive/calendar tailwindcss postcss autoprefixer
```

**1. Configurar Tailwind CSS:**
```bash
npx tailwindcss init -p
```

**2. Configurar `tailwind.config.js`:**
```javascript
import { tailwindPlugin } from '@interactive/calendar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@interactive/calendar/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [tailwindPlugin],
}
```

**3. Agregar directivas de Tailwind a `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Con esta opción puedes personalizar colores, agregar tus propias clases, etc.
```

## 🚀 Uso básico

```tsx
import React from 'react';
import { CalendarMain } from '@interactive/calendar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Mi Sistema de Citas
          </h1>
        </header>
        
        <main>
          <CalendarMain 
            initialView="month"
            onDateClick={(date: Date) => {
              console.log('Fecha seleccionada:', date);
              // Aquí puedes manejar la selección de fecha
            }}
            onEventClick={(event) => {
              console.log('Evento clickeado:', event);
              // Aquí puedes manejar el clic en un evento
            }}
            onCreateEvent={(date?: Date) => {
              console.log('Crear evento para fecha:', date);
              // Aquí puedes abrir un modal para crear un evento
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
```

## 📋 Props del componente CalendarMain

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
| `initialView` | `string` | Vista inicial del calendario (`"month"`, etc.) | ✅ |
| `onDateClick` | `(date: Date) => void` | Callback cuando se hace clic en una fecha | ✅ |
| `onEventClick` | `(event: any) => void` | Callback cuando se hace clic en un evento | ✅ |
| `onCreateEvent` | `(date?: Date) => void` | Callback para crear un nuevo evento | ✅ |

## 🎯 Ejemplo avanzado

```tsx
import React, { useState } from 'react';
import { CalendarMain } from '@interactive/calendar';

interface Cita {
  id: string;
  titulo: string;
  cliente_nombre: string;
  fecha: Date;
  // ... otras propiedades
}

function MiSistemaDeCitas() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Fecha seleccionada:', date.toLocaleDateString());
  };

  const handleEventClick = (event: any) => {
    const cita = event.extendedProps.cita;
    alert(`Cita: ${cita.titulo}\\nCliente: ${cita.cliente_nombre}`);
  };

  const handleCreateEvent = (date?: Date) => {
    setSelectedDate(date || new Date());
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CalendarMain
            initialView="month"
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
          />
        </div>
        
        {/* Aquí puedes agregar tu modal para crear eventos */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2>Crear nueva cita</h2>
              <p>Fecha: {selectedDate?.toLocaleDateString()}</p>
              <button 
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MiSistemaDeCitas;
```

## 🔧 Requisitos del sistema

- **React**: ^18.0.0
- **TypeScript**: ^4.0.0 (recomendado)
- **Node.js**: ^16.0.0
- **Tailwind CSS**: ^3.0.0

## ⚠️ Notas importantes

1. **Instalación súper simple**: Solo necesitas instalar el paquete y Tailwind CSS, el plugin se encarga del resto.

2. **Plugin automático**: El `tailwindPlugin` incluido configura automáticamente todos los colores, variables CSS y estilos necesarios.

3. **Compatible con cualquier proyecto**: Funciona tanto con ES modules como con CommonJS.

4. **Sin configuración manual**: No necesitas copiar variables CSS ni configurar colores manualmente.

## 🐛 Solución de problemas

### Las clases de Tailwind no se aplican

- Verifica que hayas agregado el `tailwindPlugin` a tu configuración de Tailwind
- Asegúrate de que las directivas `@tailwind` estén en tu CSS principal
- Revisa que PostCSS esté configurado correctamente

### Errores de importación del plugin

- Para ES modules: `import { tailwindPlugin } from '@interactive/calendar'`
- Para CommonJS: `const { tailwindPlugin } = require('@interactive/calendar')`

### El componente no se renderiza

- Verifica que hayas instalado React y TypeScript
- Asegúrate de que el plugin de Tailwind esté configurado correctamente

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

---

**Desarrollado con ❤️ para la comunidad React**
