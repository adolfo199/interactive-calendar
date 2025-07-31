/**
 * Hook para gestión del modal de citas
 * 
 * Maneja el estado del modal para crear/editar citas
 */

import { useState, useCallback, useEffect } from 'react'
import type { Cita, CitaFormData } from '../types/cita.types'

interface UseCitaModalProps {
  onSubmit?: (data: CitaFormData) => Promise<void>
  onDelete?: (citaId: number) => Promise<void>
}

export function useCitaModal({ onSubmit, onDelete }: UseCitaModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [citaToEdit, setCitaToEdit] = useState<Cita | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null)

  // Valores iniciales del formulario
  const getInitialFormData = useCallback((): CitaFormData => {
    if (mode === 'edit' && citaToEdit) {
      return {
        titulo: citaToEdit.titulo,
        descripcion: citaToEdit.descripcion || '',
        fecha: citaToEdit.fecha,
        hora_inicio: citaToEdit.hora_inicio,
        hora_fin: citaToEdit.hora_fin,
        tipo: citaToEdit.tipo,
        sucursal_id: citaToEdit.sucursal_id,
        local_id: citaToEdit.local_id,
        categoria_id: citaToEdit.categoria_id,
        cliente_nombre: citaToEdit.cliente_nombre,
        cliente_telefono: citaToEdit.cliente_telefono || '',
        cliente_email: citaToEdit.cliente_email || '',
        participantes: citaToEdit.participantes,
        observaciones: citaToEdit.observaciones || '',
      }
    }

    // Datos por defecto para nueva cita
    const now = new Date()
    const defaultDate = selectedDate || now
    const defaultHoraInicio = selectedTimeSlot?.start || '09:00'
    const defaultHoraFin = selectedTimeSlot?.end || '10:00'

    return {
      titulo: '',
      descripcion: '',
      fecha: defaultDate.toISOString().split('T')[0],
      hora_inicio: defaultHoraInicio,
      hora_fin: defaultHoraFin,
      tipo: 'reunion',
      sucursal_id: 0,
      local_id: 0,
      cliente_nombre: '',
      cliente_telefono: '',
      cliente_email: '',
      participantes: 1,
      observaciones: '',
    }
  }, [mode, citaToEdit, selectedDate, selectedTimeSlot])

  // Abrir modal para crear nueva cita
  const openCreateModal = useCallback((date?: Date, timeSlot?: { start: string; end: string }) => {
    setMode('create')
    setCitaToEdit(null)
    setSelectedDate(date || null)
    setSelectedTimeSlot(timeSlot || null)
    setError(null)
    setIsOpen(true)
  }, [])

  // Abrir modal para editar cita existente
  const openEditModal = useCallback((cita: Cita) => {
    setMode('edit')
    setCitaToEdit(cita)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setError(null)
    setIsOpen(true)
  }, [])

  // Abrir modal para ver cita (solo lectura)
  const openViewModal = useCallback((cita: Cita) => {
    setMode('view')
    setCitaToEdit(cita)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
    setError(null)
    setIsOpen(true)
  }, [])

  // Cerrar modal
  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setMode('create')
      setCitaToEdit(null)
      setSelectedDate(null)
      setSelectedTimeSlot(null)
      setError(null)
    }, 300) // Delay para permitir animación de cierre
  }, [])

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (formData: CitaFormData) => {
    if (!onSubmit) return

    setLoading(true)
    setError(null)

    try {
      await onSubmit(formData)
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la cita')
    } finally {
      setLoading(false)
    }
  }, [onSubmit, closeModal])

  // Manejar eliminación de cita
  const handleDelete = useCallback(async () => {
    if (!onDelete || !citaToEdit) return

    setLoading(true)
    setError(null)

    try {
      await onDelete(citaToEdit.id)
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la cita')
    } finally {
      setLoading(false)
    }
  }, [onDelete, citaToEdit, closeModal])

  // Cambiar a modo edición desde vista
  const switchToEdit = useCallback(() => {
    if (mode === 'view') {
      setMode('edit')
    }
  }, [mode])

  // Limpiar error cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  // Validar que se pueda eliminar la cita
  const canDelete = useCallback(() => {
    if (!citaToEdit) return false
    
    // No se puede eliminar si está en progreso o completada
    const nonDeletableStates = ['en_progreso', 'completada']
    return !nonDeletableStates.includes(citaToEdit.estado)
  }, [citaToEdit])

  // Validar que se pueda editar la cita
  const canEdit = useCallback(() => {
    if (!citaToEdit) return false
    
    // No se puede editar si está completada
    return citaToEdit.estado !== 'completada'
  }, [citaToEdit])

  // Generar título del modal
  const modalTitle = useCallback(() => {
    switch (mode) {
      case 'create':
        return 'Nueva Cita'
      case 'edit':
        return 'Editar Cita'
      case 'view':
        return 'Detalles de la Cita'
      default:
        return 'Cita'
    }
  }, [mode])

  return {
    // Estado del modal
    isOpen,
    mode,
    loading,
    error,
    citaToEdit,
    selectedDate,
    selectedTimeSlot,
    modalTitle: modalTitle(),
    
    // Funciones para abrir el modal
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    
    // Funciones de acción
    handleSubmit,
    handleDelete,
    switchToEdit,
    
    // Utilidades
    getInitialFormData,
    canDelete: canDelete(),
    canEdit: canEdit(),
    
    // Setters para casos especiales
    setError,
    setLoading,
  }
}
