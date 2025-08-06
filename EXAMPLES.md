# 📝 Usage Examples - Interactive Calendar

This guide contains practical examples for using the Interactive Calendar component in different scenarios.

## 🚀 Basic Example

The simplest example to get started with the calendar:

```tsx
import React from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1rem' }}>
      <CalendarMain 
        initialView="month"
        onDateClick={(date) => console.log('Selected date:', date)}
        onEventClick={(event) => console.log('Event clicked:', event)}
        onCreateEvent={(date) => console.log('Create event for:', date)}
      />
    </div>
  );
}

export default App;
```

## 🎯 Example with State and Modal

A more advanced example that includes state management and modal for creating events:

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
    console.log('Selected date:', date.toLocaleDateString());
  };

  const handleEventClick = (event: any) => {
    alert(`Event: ${event.title}`);
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
          My Personal Calendar
        </h1>
        
        <CalendarMain
          initialView="month"
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
        />
        
        {/* Modal for creating events */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Create New Event</h2>
              <p className="text-gray-600 mb-4">
                Date: {selectedDate?.toLocaleDateString()}
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
                    Event title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g: Important meeting"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Event details..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Create Event
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

## 🏥 Medical Appointment System Example

A complete example for a medical appointment management system:

```tsx
import React, { useState, useEffect } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

interface Appointment {
  id: string;
  title: string;
  patient_name: string;
  patient_phone: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

function MedicalAppointmentSystem() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Simulate appointment data
  useEffect(() => {
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        title: 'General Consultation',
        patient_name: 'Mary Garcia',
        patient_phone: '+34 123 456 789',
        date: new Date(2025, 7, 8), // August 8th
        time: '10:00',
        status: 'confirmed',
        notes: 'First consultation'
      },
      {
        id: '2',
        title: 'Check-up',
        patient_name: 'John Perez',
        patient_phone: '+34 987 654 321',
        date: new Date(2025, 7, 10), // August 10th
        time: '15:30',
        status: 'pending'
      }
    ];
    setAppointments(sampleAppointments);
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayAppointments = appointments.filter(appointment => 
      appointment.date.toDateString() === date.toDateString()
    );
    
    if (dayAppointments.length > 0) {
      console.log(`Appointments for ${date.toLocaleDateString()}:`, dayAppointments);
    } else {
      console.log(`No appointments for ${date.toLocaleDateString()}`);
    }
  };

  const handleEventClick = (event: any) => {
    const appointment = appointments.find(a => a.id === event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setShowModal(true);
    }
  };

  const handleCreateEvent = (date?: Date) => {
    setSelectedDate(date || new Date());
    setSelectedAppointment(null);
    setShowModal(true);
  };

  const createAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: Date.now().toString()
    };
    setAppointments([...appointments, appointment]);
    setShowModal(false);
    setSelectedDate(null);
  };

  const updateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Medical Appointment System
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments efficiently
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmed Appointments
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Appointments
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Total This Month
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {appointments.length}
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
              {selectedAppointment ? (
                // View/Edit existing appointment
                <div>
                  <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                  <div className="space-y-3">
                    <p><strong>Patient:</strong> {selectedAppointment.patient_name}</p>
                    <p><strong>Phone:</strong> {selectedAppointment.patient_phone}</p>
                    <p><strong>Date:</strong> {selectedAppointment.date.toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedAppointment.time}</p>
                    <p><strong>Type:</strong> {selectedAppointment.title}</p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedAppointment.status}
                      </span>
                    </p>
                    {selectedAppointment.notes && (
                      <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <div className="space-x-2">
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Create new appointment
                <div>
                  <h2 className="text-xl font-bold mb-4">New Appointment</h2>
                  <p className="text-gray-600 mb-4">
                    Date: {selectedDate?.toLocaleDateString()}
                  </p>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    createAppointment({
                      title: formData.get('title') as string,
                      patient_name: formData.get('patient_name') as string,
                      patient_phone: formData.get('patient_phone') as string,
                      date: selectedDate!,
                      time: formData.get('time') as string,
                      status: 'pending',
                      notes: formData.get('notes') as string || undefined
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          name="patient_name"
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="e.g: Mary Garcia"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="patient_phone"
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="+34 123 456 789"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Consultation Type
                          </label>
                          <select
                            name="title"
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">Select...</option>
                            <option value="General Consultation">General Consultation</option>
                            <option value="Check-up">Check-up</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Follow-up">Follow-up</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            name="time"
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (optional)
                        </label>
                        <textarea
                          name="notes"
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded"
                          placeholder="Additional observations..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Create Appointment
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

export default MedicalAppointmentSystem;
```

## 🔗 Example with External API

Calendar integration with a REST API:

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

  // Load events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Replace with your actual endpoint
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Error loading events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
        throw new Error('Error creating event');
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
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
        throw new Error('Error updating event');
      }

      const updatedEvent = await response.json();
      setEvents(events.map(event => 
        event.id === id ? updatedEvent : event
      ));
      
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting event');
      }

      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  const handleDateClick = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleEventClick = (event: any) => {
    const apiEvent = events.find(e => e.id === event.id);
    if (apiEvent) {
      console.log('API Event:', apiEvent);
      // Here you can show a modal with details
    }
  };

  const handleCreateEvent = async (date?: Date) => {
    const eventDate = date || new Date();
    
    try {
      const newEvent = await createEvent({
        title: 'New Event',
        date: eventDate.toISOString(),
        description: 'Event created from calendar'
      });
      
      console.log('Event created:', newEvent);
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading calendar...</p>
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
            Retry
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
            Calendar with API
          </h1>
          <p className="text-gray-600 mt-2">
            Events synchronized with server - Total: {events.length}
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

## 🎨 Example with Custom Themes

Calendar visual customization:

```tsx
import React, { useState } from 'react';
import { CalendarMain } from '@interactive/calendar';
import '@interactive/calendar/styles';

type Theme = 'default' | 'dark' | 'colorful' | 'minimal';

function CalendarWithThemes() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

  const themes = {
    default: {
      name: 'Default',
      class: '',
      description: 'Standard calendar theme'
    },
    dark: {
      name: 'Dark',
      class: 'dark-theme',
      description: 'Dark theme for low-light environments'
    },
    colorful: {
      name: 'Colorful',
      class: 'colorful-theme',
      description: 'Vibrant theme with eye-catching colors'
    },
    minimal: {
      name: 'Minimal',
      class: 'minimal-theme',
      description: 'Clean and minimalist design'
    }
  };

  const handleDateClick = (date: Date) => {
    console.log('Date:', date);
  };

  const handleEventClick = (event: any) => {
    console.log('Event:', event);
  };

  const handleCreateEvent = (date?: Date) => {
    console.log('Create event:', date);
  };

  return (
    <div className={`min-h-screen p-4 transition-all duration-300 ${
      currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Theme Selector */}
        <div className={`rounded-lg shadow-sm p-6 mb-6 ${
          currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h1 className={`text-3xl font-bold mb-4 ${
            currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Calendar with Custom Themes
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

        {/* Theme Information */}
        <div className={`mt-6 p-4 rounded-lg ${
          currentTheme === 'dark' 
            ? 'bg-gray-800 text-gray-300' 
            : 'bg-blue-50 text-blue-800'
        }`}>
          <h3 className="font-semibold mb-2">
            Current Theme: {themes[currentTheme].name}
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

## 📱 Responsive Example

Calendar that adapts to different screen sizes:

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
    console.log('Date:', date);
  };

  const handleEventClick = (event: any) => {
    console.log('Event:', event);
  };

  const handleCreateEvent = (date?: Date) => {
    console.log('Create event:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      {screenSize === 'mobile' && (
        <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Calendar</h1>
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
                My Calendar
              </h1>
            )}
            
            {/* Mini calendar or event list */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Upcoming Events
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Team Meeting</p>
                    <p className="text-sm text-blue-600">Today 3:00 PM</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Presentation</p>
                    <p className="text-sm text-green-600">Tomorrow 10:00 AM</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full p-2 text-left text-blue-600 hover:bg-blue-50 rounded">
                    + New Event
                  </button>
                  <button className="w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded">
                    📅 View Agenda
                  </button>
                  <button className="w-full p-2 text-left text-gray-600 hover:bg-gray-50 rounded">
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {screenSize === 'mobile' && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-h-screen">
          <div className={`p-${screenSize === 'mobile' ? '4' : '6'}`}>
            {screenSize !== 'mobile' && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Responsive Calendar
                </h1>
                <p className="text-gray-600">
                  Screen size: {screenSize} 
                  ({window.innerWidth}px x {window.innerHeight}px)
                </p>
              </div>
            )}

            {/* Adaptive calendar */}
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
              <CalendarMain
                initialView="month"
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onCreateEvent={handleCreateEvent}
              />
            </div>

            {/* Additional information for tablets and desktop */}
            {screenSize !== 'mobile' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Events Today
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">3</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    This Week
                  </h3>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    This Month
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

## 💡 Tips and Best Practices

### 🚀 Performance Optimization

```tsx
import React, { memo, useCallback, useMemo } from 'react';
import { CalendarMain } from '@interactive/calendar';

// Optimized component with React.memo
const OptimizedCalendar = memo(() => {
  // Use useCallback for functions passed as props
  const handleDateClick = useCallback((date: Date) => {
    console.log('Optimized date:', date);
  }, []);

  const handleEventClick = useCallback((event: any) => {
    console.log('Optimized event:', event);
  }, []);

  const handleCreateEvent = useCallback((date?: Date) => {
    console.log('Create optimized event:', date);
  }, []);

  // Use useMemo for expensive calculations
  const calendarConfig = useMemo(() => ({
    initialView: "month" as const,
    // Other configurations...
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

### 🎯 State Management

```tsx
import React, { useReducer } from 'react';

// Reducer for complex state management
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

  // Using the reducer...
}
```

### 🔧 Advanced Customization

```css
/* Custom CSS styles */
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

### 📱 Accessibility

```tsx
// Example with enhanced accessibility features
function AccessibleCalendar() {
  return (
    <div role="application" aria-label="Interactive calendar">
      <CalendarMain
        initialView="month"
        onDateClick={(date) => {
          // Announce selected date for screen readers
          const announcement = `Selected date: ${date.toLocaleDateString()}`;
          // You can use a library like react-aria-live for announcements
          console.log(announcement);
        }}
        onEventClick={(event) => {
          // Provide contextual event information
          console.log(`Event: ${event.title}`);
        }}
        onCreateEvent={(date) => {
          console.log(`Create new event for: ${date?.toLocaleDateString()}`);
        }}
      />
    </div>
  );
}
```

---

## 📚 Additional Resources

- **Complete documentation**: See `README.md`
- **Available components**: `src/calendar-views/`
- **TypeScript types**: `src/types/`
- **Custom hooks**: `src/hooks/`
- **Utilities**: `src/utils/`

---

*Need more examples or have specific questions? Don't hesitate to check the complete documentation or create an issue in the repository!*
