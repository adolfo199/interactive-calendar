/**
 * Example data for the appointments module
 * 
 * Provides mock data for calendar demo
 */

import type { Appointment, CalendarEvent } from './types/appointment.types'

// Example appointments
export const exampleAppointments: Appointment[] = [
  {
    id: 1,
    code: 'APPT-001',
    title: 'Meeting with Client ABC',
    description: 'Discuss project proposal',
    company_id: 1,
    branch_id: 1,
    location_id: 1,
    category_id: 1,
    client_name: 'John Doe',
    client_email: 'john.doe@email.com',
    client_phone: '+54 11 1234-5678',
    date: new Date().toISOString().split('T')[0], // Today
    start_time: '09:00',
    end_time: '10:00',
    duration_minutes: 60,
    type: 'meeting',
    status: 'confirmed',
    participants: 3,
    notes: 'Bring laptop and presentation',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    company: {
      id: 1,
      name: 'My Company',
      code: 'EMP001'
    },
    branch: {
      id: 1,
      name: 'Downtown Branch',
      code: 'BRANCH001',
      address: 'Main Street 123'
    },
    location: {
      id: 1,
      name: 'Meeting Room',
      code: 'ROOM001',
      capacity: 8,
      category: {
        id: 1,
        name: 'Meeting Rooms',
        color: '#3b82f6'
      }
    }
  },
  {
    id: 2,
    code: 'APPT-002',
    title: 'Technical Consultation',
    description: 'System review',
    company_id: 1,
    branch_id: 1,
    location_id: 2,
    client_name: 'Maria Gonzalez',
    client_email: 'maria.gonzalez@email.com',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    start_time: '14:00',
    end_time: '15:30',
    duration_minutes: 90,
    type: 'consultation',
    status: 'pending',
    participants: 2,
    notes: 'Review system logs',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 2,
      name: 'IT Lab',
      code: 'LAB001',
      capacity: 4
    }
  },
  {
    id: 3,
    code: 'APPT-003',
    title: 'Product Launch Event',
    description: 'New product presentation',
    company_id: 1,
    branch_id: 1,
    location_id: 3,
    client_name: 'Carlos Rodriguez',
    client_phone: '+54 11 9876-5432',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    start_time: '18:00',
    end_time: '21:00',
    duration_minutes: 180,
    type: 'event',
    status: 'confirmed',
    participants: 50,
    notes: 'Prepare catering and presentation',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 3,
      name: 'Main Auditorium',
      code: 'AUD001',
      capacity: 100
    }
  },
  {
    id: 4,
    code: 'APPT-004',
    title: 'Scheduled Maintenance',
    description: 'Equipment review',
    company_id: 1,
    branch_id: 1,
    location_id: 1,
    client_name: 'Technical Service',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
    start_time: '08:00',
    end_time: '12:00',
    duration_minutes: 240,
    type: 'maintenance',
    status: 'pending',
    participants: 1,
    notes: 'Check air conditioning and projector',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 1,
      name: 'Meeting Room',
      code: 'ROOM001',
      capacity: 8
    }
  },
  {
    id: 5,
    code: 'APPT-005',
    title: 'Personal Reservation',
    description: 'Birthday celebration',
    company_id: 1,
    branch_id: 1,
    location_id: 4,
    client_name: 'Ana Lopez',
    client_email: 'ana.lopez@email.com',
    client_phone: '+54 11 5555-1234',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 3 days
    start_time: '19:00',
    end_time: '23:00',
    duration_minutes: 240,
    type: 'reservation',
    status: 'confirmed',
    participants: 15,
    notes: 'Decoration included',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 4,
      name: 'Event Hall',
      code: 'HALL002',
      capacity: 30
    }
  },
  {
    id: 6,
    code: 'APPT-006',
    title: 'Product Training',
    description: 'Training for new staff',
    company_id: 1,
    branch_id: 1,
    location_id: 2,
    client_name: 'HR Department',
    date: new Date().toISOString().split('T')[0], // Today
    start_time: '15:00',
    end_time: '17:00',
    duration_minutes: 120,
    type: 'training',
    status: 'in_progress',
    participants: 8,
    notes: 'Session in progress - Bring manuals and laptop',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 2,
      name: 'Lab 12',
      code: 'LAB012',
      capacity: 12
    }
  },
  {
    id: 7,
    code: 'APPT-007',
    title: 'Product X Demo',
    description: 'Demo for potential client',
    company_id: 1,
    branch_id: 1,
    location_id: 3,
    client_name: 'Roberto Silva',
    client_email: 'roberto.silva@company.com',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    start_time: '10:30',
    end_time: '12:00',
    duration_minutes: 90,
    type: 'demo',
    status: 'pending',
    participants: 4,
    notes: 'Prepare laptop and projector',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 3,
      name: 'Demo Room',
      code: 'DEMO001',
      capacity: 6
    }
  },
  {
    id: 8,
    code: 'APPT-008',
    title: 'Sales Meeting',
    description: 'Monthly metrics review',
    company_id: 1,
    branch_id: 1,
    location_id: 1,
    client_name: 'Sales Team',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    start_time: '09:30',
    end_time: '11:00',
    duration_minutes: 90,
    type: 'meeting',
    status: 'pending',
    participants: 6,
    notes: 'Bring sales reports',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 1,
      name: 'Meeting Room',
      code: 'ROOM001',
      capacity: 8
    }
  },
  {
    id: 9,
    code: 'APPT-009',
    title: 'Specialized Consultation',
    description: 'Advanced technical advisory',
    company_id: 1,
    branch_id: 1,
    location_id: 2,
    client_name: 'Patricia Morales',
    client_email: 'patricia.morales@tech.com',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    start_time: '11:00',
    end_time: '12:30',
    duration_minutes: 90,
    type: 'consultation',
    status: 'completed',
    participants: 3,
    notes: 'Session completed successfully',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 2,
      name: 'Lab 12',
      code: 'LAB012',
      capacity: 12
    }
  },
  {
    id: 10,
    code: 'APPT-010',
    title: 'Networking Event',
    description: 'Business meeting',
    company_id: 1,
    branch_id: 1,
    location_id: 4,
    client_name: 'Chamber of Commerce',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 3 days
    start_time: '17:00',
    end_time: '20:00',
    duration_minutes: 180,
    type: 'demo',
    status: 'confirmed',
    participants: 25,
    notes: 'Includes catering and promotional material',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 4,
      name: 'Main Hall',
      code: 'HALL002',
      capacity: 40
    }
  },
  {
    id: 11,
    code: 'APPT-011',
    title: 'Cancelled Session',
    description: 'Meeting that was cancelled',
    company_id: 1,
    branch_id: 1,
    location_id: 1,
    client_name: 'Inactive Client',
    date: '2025-07-29', // July 29 - fixed date
    start_time: '16:00',
    end_time: '17:00',
    duration_minutes: 60,
    type: 'meeting',
    status: 'cancelled',
    participants: 4,
    notes: 'Cancelled by client',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 1,
      name: 'Meeting Room',
      code: 'ROOM001',
      capacity: 8
    }
  },
  {
    id: 12,
    code: 'APPT-012',
    title: 'Innovation Workshop',
    description: 'Agile methodologies workshop',
    company_id: 1,
    branch_id: 1,
    location_id: 2,
    client_name: 'Development Team',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // In 4 days
    start_time: '13:30',
    end_time: '16:30',
    duration_minutes: 180,
    type: 'training',
    status: 'pending',
    participants: 10,
    notes: 'Includes lunch and certificate',
    configuration: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    location: {
      id: 2,
      name: 'Lab 12',
      code: 'LAB012',
      capacity: 12
    }
  }
]

// Convert appointments to calendar events
function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  const dateBase = new Date(appointment.date)
  const [startHours, startMinutes] = appointment.start_time.split(':').map(Number)
  const [endHours, endMinutes] = appointment.end_time.split(':').map(Number)
  
  const start = new Date(dateBase)
  start.setHours(startHours, startMinutes, 0, 0)
  
  const end = new Date(dateBase)
  end.setHours(endHours, endMinutes, 0, 0)
  
  // Colors based only on STATUS (more intuitive and consistent)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#10b981'    // Green - Confirmed appointment
      case 'pending': return '#f59e0b'      // Yellow - To be confirmed  
      case 'cancelled': return '#ef4444'    // Red - Cancelled
      case 'completed': return '#3b82f6'    // Blue - Completed
      case 'in_progress': return '#8b5cf6'  // Purple - In progress
      default: return '#6b7280'             // Gray - Unknown status
    }
  }
  
  const color = getStatusColor(appointment.status)
  
  return {
    id: appointment.id,
    title: appointment.title,
    start,
    end,
    allDay: false,
    color,
    backgroundColor: color,
    borderColor: color,
    textColor: appointment.status === 'pending' ? '#1f2937' : '#ffffff',
    extendedProps: {
      appointment,
      status: appointment.status,
      type: appointment.type,
      location: appointment.location?.name || 'Location not specified',
      participants: appointment.participants,
    }
  }
}

// Example events for calendar
export const exampleEvents: CalendarEvent[] = exampleAppointments.map(appointmentToCalendarEvent)

// Function to get example events with relative date
export function getExampleEvents(): CalendarEvent[] {
  return exampleEvents
}

// Function to simulate data loading
export function simulateDataLoad(): Promise<CalendarEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getExampleEvents())
    }, 1000) // Simulate 1 second loading
  })
}
