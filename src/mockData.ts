/**
 * Datos de ejemplo para el módulo de citas
 * 
 * Proporciona datos mock para la demo del calendario
 */

import type { Cita, CitaCalendarEvent } from './types/cita.types'

// Citas de ejemplo
export const citasEjemplo: Cita[] = [
  {
    id: 1,
    codigo: 'CITA-001',
    titulo: 'Reunión con Cliente ABC',
    descripcion: 'Discutir propuesta de proyecto',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 1,
    categoria_id: 1,
    cliente_nombre: 'Juan Pérez',
    cliente_email: 'juan.perez@email.com',
    cliente_telefono: '+54 11 1234-5678',
    fecha: new Date().toISOString().split('T')[0], // Hoy
    hora_inicio: '09:00',
    hora_fin: '10:00',
    duracion_minutos: 60,
    tipo: 'reunion',
    estado: 'confirmada',
    participantes: 3,
    observaciones: 'Traer laptop y presentación',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    empresa: {
      id: 1,
      nombre: 'Mi Empresa',
      codigo: 'EMP001'
    },
    sucursal: {
      id: 1,
      nombre: 'Sucursal Centro',
      codigo: 'SUC001',
      direccion: 'Av. Principal 123'
    },
    local: {
      id: 1,
      nombre: 'Sala de Juntas',
      codigo: 'SAL001',
      capacidad: 8,
      categoria: {
        id: 1,
        nombre: 'Salas de Reuniones',
        color: '#3b82f6'
      }
    }
  },
  {
    id: 2,
    codigo: 'CITA-002',
    titulo: 'Consulta Técnica',
    descripcion: 'Revisión de sistema',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 2,
    cliente_nombre: 'María González',
    cliente_email: 'maria.gonzalez@email.com',
    fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mañana
    hora_inicio: '14:00',
    hora_fin: '15:30',
    duracion_minutos: 90,
    tipo: 'consulta',
    estado: 'pendiente',
    participantes: 2,
    observaciones: 'Revisar logs del sistema',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 2,
      nombre: 'Laboratorio IT',
      codigo: 'LAB001',
      capacidad: 4
    }
  },
  {
    id: 3,
    codigo: 'CITA-003',
    titulo: 'Evento de Lanzamiento',
    descripcion: 'Presentación del nuevo producto',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 3,
    cliente_nombre: 'Carlos Rodríguez',
    cliente_telefono: '+54 11 9876-5432',
    fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Pasado mañana
    hora_inicio: '18:00',
    hora_fin: '21:00',
    duracion_minutos: 180,
    tipo: 'evento',
    estado: 'confirmada',
    participantes: 50,
    observaciones: 'Preparar catering y presentación',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 3,
      nombre: 'Auditorio Principal',
      codigo: 'AUD001',
      capacidad: 100
    }
  },
  {
    id: 4,
    codigo: 'CITA-004',
    titulo: 'Mantenimiento Programado',
    descripcion: 'Revisión de equipos',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 1,
    cliente_nombre: 'Servicio Técnico',
    fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Próxima semana
    hora_inicio: '08:00',
    hora_fin: '12:00',
    duracion_minutos: 240,
    tipo: 'mantenimiento',
    estado: 'pendiente',
    participantes: 1,
    observaciones: 'Revisar aire acondicionado y proyector',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 1,
      nombre: 'Sala de Juntas',
      codigo: 'SAL001',
      capacidad: 8
    }
  },
  {
    id: 5,
    codigo: 'CITA-005',
    titulo: 'Reserva Personal',
    descripcion: 'Celebración de cumpleaños',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 4,
    cliente_nombre: 'Ana López',
    cliente_email: 'ana.lopez@email.com',
    cliente_telefono: '+54 11 5555-1234',
    fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 3 días
    hora_inicio: '19:00',
    hora_fin: '23:00',
    duracion_minutos: 240,
    tipo: 'reserva',
    estado: 'confirmada',
    participantes: 15,
    observaciones: 'Decoración incluida',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 4,
      nombre: 'Salón de Eventos',
      codigo: 'SAL002',
      capacidad: 30
    }
  },
  // Más eventos para esta semana con mayor variedad
  {
    id: 6,
    codigo: 'CITA-006',
    titulo: 'Entrenamiento Producto',
    descripcion: 'Capacitación para nuevo personal',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 2,
    cliente_nombre: 'RR.HH.',
    fecha: new Date().toISOString().split('T')[0], // Hoy
    hora_inicio: '15:00',
    hora_fin: '17:00',
    duracion_minutos: 120,
    tipo: 'entrenamiento',
    estado: 'en_progreso',
    participantes: 8,
    observaciones: 'Sesión en curso - Traer manuales y laptop',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 2,
      nombre: 'Laboratorio 12',
      codigo: 'LAB012',
      capacidad: 12
    }
  },
  {
    id: 7,
    codigo: 'CITA-007',
    titulo: 'Demo Producto X',
    descripcion: 'Demostración para cliente potencial',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 3,
    cliente_nombre: 'Roberto Silva',
    cliente_email: 'roberto.silva@empresa.com',
    fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mañana
    hora_inicio: '10:30',
    hora_fin: '12:00',
    duracion_minutos: 90,
    tipo: 'demo',
    estado: 'pendiente',
    participantes: 4,
    observaciones: 'Preparar laptop y proyector',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 3,
      nombre: 'Sala de Demos',
      codigo: 'DEMO001',
      capacidad: 6
    }
  },
  {
    id: 8,
    codigo: 'CITA-008',
    titulo: 'Reunión de Ventas',
    descripcion: 'Revisión de métricas mensuales',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 1,
    cliente_nombre: 'Equipo Ventas',
    fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Pasado mañana
    hora_inicio: '09:30',
    hora_fin: '11:00',
    duracion_minutos: 90,
    tipo: 'reunion',
    estado: 'pendiente',
    participantes: 6,
    observaciones: 'Traer reportes de ventas',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 1,
      nombre: 'Sala de Juntas',
      codigo: 'SAL001',
      capacidad: 8
    }
  },
  {
    id: 9,
    codigo: 'CITA-009',
    titulo: 'Consulta Especializada',
    descripcion: 'Asesoría técnica avanzada',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 2,
    cliente_nombre: 'Patricia Morales',
    cliente_email: 'patricia.morales@tech.com',
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ayer
    hora_inicio: '11:00',
    hora_fin: '12:30',
    duracion_minutos: 90,
    tipo: 'consulta',
    estado: 'completada',
    participantes: 3,
    observaciones: 'Sesión completada exitosamente',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 2,
      nombre: 'Laboratorio 12',
      codigo: 'LAB012',
      capacidad: 12
    }
  },
  {
    id: 10,
    codigo: 'CITA-010',
    titulo: 'Evento Networking',
    descripcion: 'Encuentro empresarial',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 4,
    cliente_nombre: 'Cámara de Comercio',
    fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 3 días
    hora_inicio: '17:00',
    hora_fin: '20:00',
    duracion_minutos: 180,
    tipo: 'demo',
    estado: 'confirmada',
    participantes: 25,
    observaciones: 'Incluye catering y material promocional',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 4,
      nombre: 'Salón Principal',
      codigo: 'SAL002',
      capacidad: 40
    }
  },
  {
    id: 11,
    codigo: 'CITA-011',
    titulo: 'Sesión Cancelada',
    descripcion: 'Reunión que fue cancelada',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 1,
    cliente_nombre: 'Cliente Inactivo',
    fecha: '2025-07-29', // 29 de julio - fecha fija para que aparezca
    hora_inicio: '16:00',
    hora_fin: '17:00',
    duracion_minutos: 60,
    tipo: 'reunion',
    estado: 'cancelada',
    participantes: 4,
    observaciones: 'Cancelada por el cliente',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 1,
      nombre: 'Sala de Juntas',
      codigo: 'SAL001',
      capacidad: 8
    }
  },
  {
    id: 12,
    codigo: 'CITA-012',
    titulo: 'Workshop Innovación',
    descripcion: 'Taller de metodologías ágiles',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 2,
    cliente_nombre: 'Equipo Desarrollo',
    fecha: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 4 días
    hora_inicio: '13:30',
    hora_fin: '16:30',
    duracion_minutos: 180,
    tipo: 'entrenamiento',
    estado: 'pendiente',
    participantes: 10,
    observaciones: 'Incluye almuerzo y certificado',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 2,
      nombre: 'Laboratorio 12',
      codigo: 'LAB012',
      capacidad: 12
    }
  },
  {
    id: 13,
    codigo: 'CITA-013',
    titulo: 'Reunión Cancelada',
    descripcion: 'Reunión cancelada por el cliente',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 2,
    cliente_nombre: 'Empresa ABC',
    cliente_email: 'contacto@empresa-abc.com',
    fecha: '2025-07-30', // 30 de julio
    hora_inicio: '11:00',
    hora_fin: '12:00',
    duracion_minutos: 60,
    tipo: 'reunion',
    estado: 'cancelada',
    participantes: 5,
    observaciones: 'Cliente canceló por motivos personales',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 2,
      nombre: 'Laboratorio IT',
      codigo: 'LAB001',
      capacidad: 4
    }
  },
  {
    id: 14,
    codigo: 'CITA-014',
    titulo: 'Cita Cancelada',
    descripcion: 'Cita cancelada de último momento',
    empresa_id: 1,
    sucursal_id: 1,
    local_id: 1,
    cliente_nombre: 'Pedro Martínez',
    cliente_email: 'pedro.martinez@email.com',
    fecha: '2025-08-03', // 3 de agosto
    hora_inicio: '09:30',
    hora_fin: '10:30',
    duracion_minutos: 60,
    tipo: 'consulta',
    estado: 'cancelada',
    participantes: 2,
    observaciones: 'Cliente canceló por enfermedad',
    configuracion: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 1,
    modified_by: 1,
    local: {
      id: 1,
      nombre: 'Sala de Juntas',
      codigo: 'SAL001',
      capacidad: 8
    }
  }
]

// Convertir citas a eventos de calendario
function citaToCalendarEvent(cita: Cita): CitaCalendarEvent {
  const fechaBase = new Date(cita.fecha)
  const [horaInicioHoras, horaInicioMinutos] = cita.hora_inicio.split(':').map(Number)
  const [horaFinHoras, horaFinMinutos] = cita.hora_fin.split(':').map(Number)
  
  const start = new Date(fechaBase)
  start.setHours(horaInicioHoras, horaInicioMinutos, 0, 0)
  
  const end = new Date(fechaBase)
  end.setHours(horaFinHoras, horaFinMinutos, 0, 0)
  
  // Colores basados únicamente en ESTADO (más intuitivo y consistente)
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'confirmada': return '#10b981'    // Verde - Cita confirmada
      case 'pendiente': return '#f59e0b'     // Amarillo - Por confirmar  
      case 'cancelada': return '#ef4444'     // Rojo - Cancelada
      case 'completada': return '#3b82f6'    // Azul - Completada
      case 'en_progreso': return '#8b5cf6'   // Púrpura - En progreso
      default: return '#6b7280'              // Gris - Estado desconocido
    }
  }
  
  const color = getEstadoColor(cita.estado)
  
  return {
    id: cita.id,
    title: cita.titulo,
    start,
    end,
    allDay: false,
    color,
    backgroundColor: color,
    borderColor: color,
    textColor: cita.estado === 'pendiente' ? '#1f2937' : '#ffffff',
    extendedProps: {
      cita,
      estado: cita.estado,
      tipo: cita.tipo,
      local: cita.local?.nombre || 'Local no especificado',
      participantes: cita.participantes,
    }
  }
}

// Eventos de ejemplo para el calendario
export const eventosEjemplo: CitaCalendarEvent[] = citasEjemplo.map(citaToCalendarEvent)

// Función para obtener eventos de ejemplo con fecha relativa
export function getEventosEjemplo(): CitaCalendarEvent[] {
  return eventosEjemplo
}

// Función para simular carga de datos
export function simulateDataLoad(): Promise<CitaCalendarEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getEventosEjemplo())
    }, 1000) // Simular 1 segundo de carga
  })
}
