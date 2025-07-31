# 📅 Interactive Calendar

A modern, interactive calendar component library for React with TypeScript. Designed specifically for appointment management systems with comprehensive event handling, multiple view modes, and Spanish localization.

## ✨ Features

- 🎨 **Modern UI**: Built with Tailwind CSS and reusable components
- 📱 **Responsive**: Adapts to different screen sizes
- ⚡ **Optimized**: High performance with React and TypeScript
- 🔧 **Customizable**: Easy to integrate and customize
- 📅 **Multiple Views**: Support for month, week, and day views
- 🎯 **Interactive Events**: Complete event handling for clicks and creation
- 💼 **Appointment Management**: Designed for medical/professional appointment systems
- 🌍 **Spanish Localization**: Full Spanish language support

## 📦 Installation

### 🚀 Quick Start (Recommended)

The simplest way to get started - just import the pre-compiled CSS:

```bash
npm install @interactive/calendar
```

```javascript
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1rem' }}>
      <CalendarMain 
        initialView="month"
        onDateClick={(date) => console.log('Date:', date)}
        onEventClick={(event) => console.log('Event:', event)}
        onCreateEvent={(date) => console.log('Create:', date)}
      />
    </div>
  );
}
```

✅ **No Tailwind setup required**  
✅ **No manual CSS variables**  
✅ **Works with any setup**  
✅ **Only 10KB of CSS**  

---

### ⚙️ Advanced Setup (For Customization)

If you need to customize colors or integrate with your design system:

```bash
npm install @interactive/calendar tailwindcss postcss autoprefixer
```

**1. Setup Tailwind CSS:**
```bash
npx tailwindcss init -p
```

**2. Configure `tailwind.config.js`:**
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

**3. Add Tailwind directives to `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🚀 Basic Usage

```tsx
import React from 'react';
import { CalendarMain } from '@interactive/calendar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            My Appointment System
          </h1>
        </header>
        
        <main>
          <CalendarMain 
            initialView="month"
            onDateClick={(date: Date) => {
              console.log('Selected date:', date);
              // Handle date selection
            }}
            onEventClick={(event) => {
              console.log('Clicked event:', event);
              // Handle event click
            }}
            onCreateEvent={(date?: Date) => {
              console.log('Create event for date:', date);
              // Open modal to create an event
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
```

## 📋 CalendarMain Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `initialView` | `string` | Initial calendar view (`"month"`, etc.) | ✅ |
| `onDateClick` | `(date: Date) => void` | Callback when a date is clicked | ✅ |
| `onEventClick` | `(event: any) => void` | Callback when an event is clicked | ✅ |
| `onCreateEvent` | `(date?: Date) => void` | Callback to create a new event | ✅ |

## 🎯 Advanced Example

```tsx
import React, { useState } from 'react';
import { CalendarMain } from '@interactive/calendar';

interface Appointment {
  id: string;
  title: string;
  clientName: string;
  date: Date;
}

function MyAppointmentSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date.toLocaleDateString());
  };

  const handleEventClick = (event: any) => {
    const appointment = event.extendedProps.cita;
    alert(`Appointment: ${appointment.titulo}\\nClient: ${appointment.cliente_nombre}`);
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
        
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2>Create New Appointment</h2>
              <p>Date: {selectedDate?.toLocaleDateString()}</p>
              <button 
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointmentSystem;
```

## 🔧 System Requirements

- **React**: ^18.0.0
- **TypeScript**: ^4.0.0 (recommended)
- **Node.js**: ^16.0.0
- **Tailwind CSS**: ^3.0.0

## 🐛 Troubleshooting

### Tailwind classes not applying

- Verify that you've added the `tailwindPlugin` to your Tailwind configuration
- Make sure the `@tailwind` directives are in your main CSS file
- Check that PostCSS is configured correctly

### Plugin import errors

- For ES modules: `import { tailwindPlugin } from '@interactive/calendar'`
- For CommonJS: `const { tailwindPlugin } = require('@interactive/calendar')`

### Component not rendering

- Verify that you've installed React and TypeScript
- Make sure the Tailwind plugin is configured correctly

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/adolfo199/interactive-calendar)
- [npm Package](https://www.npmjs.com/package/@interactive/calendar)
- [Issues](https://github.com/adolfo199/interactive-calendar/issues)

---

**Built with ❤️ for the React community**