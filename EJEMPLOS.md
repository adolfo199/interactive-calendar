# 📝 Ejemplos de Uso - Interactive Calendar

Esta guía contiene ejemplos prácticos para usar el componente Interactive Calendar en diferentes escenarios.

## 🚀 Ejemplo Básico

El ejemplo más simple para comenzar a usar el calendario:

```tsx
import React from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1rem' }}>
      <CalendarMain 
        initialView="month"
        onDateClick={(date) => console.log('Fecha seleccionada:', date)}
        onEventClick={(event) => console.log('Evento clickeado:', event)}
        onCreateEvent={(date) => console.log('Crear evento para:', date)}
      />
    </div>
  );
}

export default App;
```

## 🎯 Ejemplo con Estado y Modal

Un ejemplo más avanzado que incluye manejo de estado y modal para crear eventos:

```tsx
import React, { useState } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

interface NewEvent {
  title: string;
  date: Date;
  description?: string;
}

function CalendarWithModal() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<NewEvent[]>([]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Fecha seleccionada:', date.toLocaleDateString());
  };

  const handleEventClick = (event: any) => {
    alert(`Evento: ${event.title}`);
  };

  const handleCreateEvent = (date?: Date) => {
    setSelectedDate(date || new Date());
    setShowModal(true);
  };

  const createEvent = (title: string, description: string) => {
    if (!selectedDate) return;
    
    const newEvent: NewEvent = {
      title,
      date: selectedDate,
      description
    };
    
    setEvents([...events, newEvent]);
    setShowModal(false);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Mi Calendario Personal
        </h1>
        
        <CalendarMain
          initialView="month"
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
        />
        
        {/* Modal para crear eventos */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Crear Nuevo Evento</h2>
              <p className="text-gray-600 mb-4">
                Fecha: {selectedDate?.toLocaleDateString()}
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createEvent(
                  formData.get('title') as string,
                  formData.get('description') as string
                );
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del evento
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Ej: Reunión importante"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Detalles del evento..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Crear Evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarWithModal;
```

## 🏥 Ejemplo Sistema de Citas Médicas

Un ejemplo completo para un sistema de gestión de citas médicas:

```tsx
import React, { useState, useEffect } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

interface Cita {
  id: string;
  titulo: string;
  cliente_nombre: string;
  cliente_telefono: string;
  fecha: Date;
  hora: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  notas?: string;
}

function SistemaCitasMedicas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  // Simular datos de citas
  useEffect(() => {
    const citasEjemplo: Cita[] = [
      {
        id: '1',
        titulo: 'Consulta General',
        cliente_nombre: 'María García',
        cliente_telefono: '+34 123 456 789',
        fecha: new Date(2025, 7, 8), // 8 de agosto
        hora: '10:00',
        estado: 'confirmada',
        notas: 'Primera consulta'
      },
      {
        id: '2',
        titulo: 'Revisión',
        cliente_nombre: 'Juan Pérez',
        cliente_telefono: '+34 987 654 321',
        fecha: new Date(2025, 7, 10), // 10 de agosto
        hora: '15:30',
        estado: 'pendiente'
      }
    ];
    setCitas(citasEjemplo);
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const citasDelDia = citas.filter(cita => 
      cita.fecha.toDateString() === date.toDateString()
    );
    
    if (citasDelDia.length > 0) {
      console.log(`Citas para ${date.toLocaleDateString()}:`, citasDelDia);
    } else {
      console.log(`No hay citas para ${date.toLocaleDateString()}`);
    }
  };

  const handleEventClick = (event: any) => {
    const cita = citas.find(c => c.id === event.id);
    if (cita) {
      setSelectedCita(cita);
      setShowModal(true);
    }
  };

  const handleCreateEvent = (date?: Date) => {
    setSelectedDate(date || new Date());
    setSelectedCita(null);
    setShowModal(true);
  };

  const crearCita = (nuevaCita: Omit<Cita, 'id'>) => {
    const cita: Cita = {
      ...nuevaCita,
      id: Date.now().toString()
    };
    setCitas([...citas, cita]);
    setShowModal(false);
    setSelectedDate(null);
  };

  const actualizarEstadoCita = (id: string, nuevoEstado: Cita['estado']) => {
    setCitas(citas.map(cita => 
      cita.id === id ? { ...cita, estado: nuevoEstado } : cita
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistema de Citas Médicas
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus citas de manera eficiente
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Citas Confirmadas
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {citas.filter(c => c.estado === 'confirmada').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Citas Pendientes
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {citas.filter(c => c.estado === 'pendiente').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Total del Mes
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {citas.length}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CalendarMain
            initialView="month"
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              {selectedCita ? (
                // Ver/Editar cita existente
                <div>
                  <h2 className="text-xl font-bold mb-4">Detalles de la Cita</h2>
                  <div className="space-y-3">
                    <p><strong>Cliente:</strong> {selectedCita.cliente_nombre}</p>
                    <p><strong>Teléfono:</strong> {selectedCita.cliente_telefono}</p>
                    <p><strong>Fecha:</strong> {selectedCita.fecha.toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {selectedCita.hora}</p>
                    <p><strong>Tipo:</strong> {selectedCita.titulo}</p>
                    <p>
                      <strong>Estado:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        selectedCita.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                        selectedCita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedCita.estado}
                      </span>
                    </p>
                    {selectedCita.notas && (
                      <p><strong>Notas:</strong> {selectedCita.notas}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <div className="space-x-2">
                      <button
                        onClick={() => actualizarEstadoCita(selectedCita.id, 'confirmada')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => actualizarEstadoCita(selectedCita.id, 'cancelada')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Cancelar
                      </button>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                // Crear nueva cita
                <div>
                  <h2 className="text-xl font-bold mb-4">Nueva Cita</h2>
                  <p className="text-gray-600 mb-4">
                    Fecha: {selectedDate?.toLocaleDateString()}
                  </p>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    crearCita({
                      titulo: formData.get('titulo') as string,
                      cliente_nombre: formData.get('cliente_nombre') as string,
                      cliente_telefono: formData.get('cliente_telefono') as string,
                      fecha: selectedDate!,
                      hora: formData.get('hora') as string,
                      estado: 'pendiente',
                      notas: formData.get('notas') as string || undefined
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Cliente
                        </label>
                        <input
                          type="text"
                          name="cliente_nombre"
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Ej: María García"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="cliente_telefono"
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="+34 123 456 789"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Consulta
                          </label>
                          <select
                            name="titulo"
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">Seleccionar...</option>
                            <option value="Consulta General">Consulta General</option>
                            <option value="Revisión">Revisión</option>
                            <option value="Urgencia">Urgencia</option>
                            <option value="Seguimiento">Seguimiento</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora
                          </label>
                          <input
                            type="time"
                            name="hora"
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas (opcional)
                        </label>
                        <textarea
                          name="notas"
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Observaciones adicionales..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Crear Cita
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SistemaCitasMedicas;
```

## 🔗 Ejemplo con API Externa

Integración del calendario con una API REST:

```tsx
import React, { useState, useEffect } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

interface ApiEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  attendees?: string[];
}

function CalendarWithAPI() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos desde la API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Reemplaza con tu endpoint real
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<ApiEvent, 'id'>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Error al crear evento');
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      
      return newEvent;
    } catch (err) {
      console.error('Error creando evento:', err);
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<ApiEvent>) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar evento');
      }

      const updatedEvent = await response.json();
      setEvents(events.map(event => 
        event.id === id ? updatedEvent : event
      ));
      
      return updatedEvent;
    } catch (err) {
      console.error('Error actualizando evento:', err);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar evento');
      }

      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error eliminando evento:', err);
      throw err;
    }
  };

  const handleDateClick = (date: Date) => {
    console.log('Fecha seleccionada:', date);
  };

  const handleEventClick = (event: any) => {
    const apiEvent = events.find(e => e.id === event.id);
    if (apiEvent) {
      console.log('Evento de API:', apiEvent);
      // Aquí puedes mostrar un modal con los detalles
    }
  };

  const handleCreateEvent = async (date?: Date) => {
    const eventDate = date || new Date();
    
    try {
      const newEvent = await createEvent({
        title: 'Nuevo Evento',
        date: eventDate.toISOString(),
        description: 'Evento creado desde el calendario'
      });
      
      console.log('Evento creado:', newEvent);
    } catch (err) {
      console.error('Error al crear evento:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
          <button
            onClick={fetchEvents}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Calendario con API
          </h1>
          <p className="text-gray-600 mt-2">
            Eventos sincronizados con el servidor - Total: {events.length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CalendarMain
            initialView="month"
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarWithAPI;
```

## 🎨 Ejemplo con Temas Personalizados

Personalización visual del calendario:

```tsx
import React, { useState } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

type Theme = 'default' | 'dark' | 'colorful' | 'minimal';

function CalendarWithThemes() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

  const themes = {
    default: {
      name: 'Por Defecto',
      class: '',
      description: 'Tema estándar del calendario'
    },
    dark: {
      name: 'Oscuro',
      class: 'dark-theme',
      description: 'Tema oscuro para entornos con poca luz'
    },
    colorful: {
      name: 'Colorido',
      class: 'colorful-theme',
      description: 'Tema vibrante con colores llamativos'
    },
    minimal: {
      name: 'Minimalista',
      class: 'minimal-theme',
      description: 'Diseño limpio y minimalista'
    }
  };

  const handleDateClick = (date: Date) => {
    console.log('Fecha:', date);
  };

  const handleEventClick = (event: any) => {
    console.log('Evento:', event);
  };

  const handleCreateEvent = (date?: Date) => {
    console.log('Crear evento:', date);
  };

  return (
    <div className={`min-h-screen p-4 transition-all duration-300 ${
      currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Selector de Temas */}
        <div className={`rounded-lg shadow-sm p-6 mb-6 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h1 className={`text-3xl font-bold mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Calendario con Temas Personalizados
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key as Theme)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentTheme === key
                    ? 'border-blue-500 bg-blue-50'
                    : currentTheme === 'dark'
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className={`font-semibold ${
                  currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {theme.name}
                </h3>
                <p className={`text-sm mt-1 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {theme.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Calendario */}
        <div className={`calendar-container ${themes[currentTheme].class}`}>
          <style jsx>{`
            /* Tema Oscuro */
            .dark-theme {
              --calendar-bg: #1f2937;
              --calendar-text: #f9fafb;
              --calendar-border: #374151;
              --calendar-hover: #4b5563;
              --calendar-selected: #3b82f6;
            }

            /* Tema Colorido */
            .colorful-theme {
              --calendar-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              --calendar-text: #ffffff;
              --calendar-border: #8b5cf6;
              --calendar-hover: #a855f7;
              --calendar-selected: #ec4899;
            }

            /* Tema Minimalista */
            .minimal-theme {
              --calendar-bg: #ffffff;
              --calendar-text: #1f2937;
              --calendar-border: #e5e7eb;
              --calendar-hover: #f3f4f6;
              --calendar-selected: #111827;
            }

            .calendar-container {
              background: var(--calendar-bg, #ffffff);
              border-radius: 0.5rem;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
              padding: 1.5rem;
            }
          `}</style>
          
          <CalendarMain
            initialView="month"
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onCreateEvent={handleCreateEvent}
          />
        </div>

        {/* Información del Tema */}
        <div className={`mt-6 p-4 rounded-lg ${
          currentTheme === 'dark' 
            ? 'bg-gray-800 text-gray-300' 
            : 'bg-blue-50 text-blue-800'
        }`}>
          <h3 className="font-semibold mb-2">
            Tema Actual: {themes[currentTheme].name}
          </h3>
          <p className="text-sm">
            {themes[currentTheme].description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CalendarWithThemes;
```

## 📱 Ejemplo Responsive

Calendario que se adapta a diferentes tamaños de pantalla:

```tsx
import React, { useState, useEffect } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

function ResponsiveCalendar() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
        setIsSidebarOpen(false);
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDateClick = (date: Date) => {
    console.log('Fecha:', date);
  };

  const handleEventClick = (event: any) => {
    console.log('Evento:', event);
  };

  const handleCreateEvent = (date?: Date) => {
    console.log('Crear evento:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil */}
      {screenSize === 'mobile' && (
        <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Calendario</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          ${screenSize === 'mobile' 
            ? `fixed inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`
            : 'relative w-64'
          } 
          bg-white shadow-lg ${screenSize !== 'mobile' ? 'min-h-screen' : ''}
        `}>
          <div className="p-6">
            {screenSize !== 'mobile' && (
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Mi Calendario
              </h1>
            )}
            
            {/* Mini calendario o lista de eventos */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Próximos Eventos
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Reunión Equipo</p>
                    <p className="text-sm text-blue-600">Hoy 15:00</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Presentación</p>
                    <p className="text-sm text-green-600">Mañana 10:00</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  <button className="w-full p-2 text-left text-blue-600 hover:bg-blue-50 rounded">
                    + Nuevo Evento
                  </button>
                  <button className="w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded">
                    📅 Ver Agenda
                  </button>
                  <button className="w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded">
                    ⚙️ Configuración
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay para móvil */}
        {screenSize === 'mobile' && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 min-h-screen">
          <div className={`p-${screenSize === 'mobile' ? '4' : '6'}`}>
            {screenSize !== 'mobile' && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Calendario Responsive
                </h1>
                <p className="text-gray-600">
                  Tamaño de pantalla: {screenSize} 
                  ({window.innerWidth}px x {window.innerHeight}px)
                </p>
              </div>
            )}

            {/* Calendario adaptativo */}
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
              <CalendarMain
                initialView="month"
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onCreateEvent={handleCreateEvent}
              />
            </div>

            {/* Información adicional para tablets y desktop */}
            {screenSize !== 'mobile' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Eventos Hoy
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">3</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Esta Semana
                  </h3>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Este Mes
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">45</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponsiveCalendar;
```

## 💡 Tips y Mejores Prácticas

### 🚀 Optimización de Rendimiento

```tsx
import React, { memo, useCallback, useMemo } from 'react';
import { CalendarMain } from '@interactive/calendar';

// Componente optimizado con React.memo
const OptimizedCalendar = memo(() => {
  // Usar useCallback para funciones que se pasan como props
  const handleDateClick = useCallback((date: Date) => {
    console.log('Fecha optimizada:', date);
  }, []);

  const handleEventClick = useCallback((event: any) => {
    console.log('Evento optimizado:', event);
  }, []);

  const handleCreateEvent = useCallback((date?: Date) => {
    console.log('Crear evento optimizado:', date);
  }, []);

  // Usar useMemo para cálculos costosos
  const calendarConfig = useMemo(() => ({
    initialView: "month" as const,
    // Otras configuraciones...
  }), []);

  return (
    <CalendarMain
      {...calendarConfig}
      onDateClick={handleDateClick}
      onEventClick={handleEventClick}
      onCreateEvent={handleCreateEvent}
    />
  );
});
```

### 🎯 Manejo de Estados

```tsx
import React, { useReducer } from 'react';

// Reducer para manejo complejo de estado
interface CalendarState {
  selectedDate: Date | null;
  events: Event[];
  view: 'month' | 'week' | 'day';
  loading: boolean;
}

type CalendarAction = 
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'CHANGE_VIEW'; payload: 'month' | 'week' | 'day' }
  | { type: 'SET_LOADING'; payload: boolean };

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'SELECT_DATE':
      return { ...state, selectedDate: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'CHANGE_VIEW':
      return { ...state, view: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

function CalendarWithReducer() {
  const [state, dispatch] = useReducer(calendarReducer, {
    selectedDate: null,
    events: [],
    view: 'month',
    loading: false
  });

  // Uso del reducer...
}
```

### 🔧 Personalización Avanzada

```css
/* Estilos CSS personalizados */
.custom-calendar {
  --calendar-primary-color: #3b82f6;
  --calendar-secondary-color: #e5e7eb;
  --calendar-text-color: #1f2937;
  --calendar-background: #ffffff;
  --calendar-border-radius: 0.5rem;
  --calendar-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.custom-calendar .calendar-day:hover {
  background-color: var(--calendar-secondary-color);
  transform: scale(1.02);
  transition: all 0.2s ease;
}

.custom-calendar .calendar-event {
  background: linear-gradient(45deg, var(--calendar-primary-color), #8b5cf6);
  border-radius: var(--calendar-border-radius);
  box-shadow: var(--calendar-shadow);
}
```

### 📱 Accesibilidad

```tsx
// Ejemplo con características de accesibilidad mejoradas
function AccessibleCalendar() {
  return (
    <div role="application" aria-label="Calendario interactivo">
      <CalendarMain
        initialView="month"
        onDateClick={(date) => {
          // Anunciar la fecha seleccionada para lectores de pantalla
          const announcement = `Fecha seleccionada: ${date.toLocaleDateString()}`;
          // Puedes usar una librería como react-aria-live para anuncios
          console.log(announcement);
        }}
        onEventClick={(event) => {
          // Proporcionar información contextual del evento
          console.log(`Evento: ${event.title}`);
        }}
        onCreateEvent={(date) => {
          console.log(`Crear nuevo evento para: ${date?.toLocaleDateString()}`);
        }}
      />
    </div>
  );
}
```

---

## 📚 Recursos Adicionales

- **Documentación completa**: Ver `README.md`
- **Componentes disponibles**: `src/calendar-views/`
- **Tipos TypeScript**: `src/types/`
- **Hooks personalizados**: `src/hooks/`
- **Utilidades**: `src/utils/`

---

*¿Necesitas más ejemplos o tienes alguna pregunta específica? ¡No dudes en consultar la documentación completa o crear un issue en el repositorio!*
