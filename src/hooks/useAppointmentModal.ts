/**
 * Hook for appointment modal management
 * 
 * Manages modal state for creating/editing appointments
 */

import { useState, useCallback, useEffect } from 'react'
import type { Appointment, AppointmentFormData } from '../types/appointment.types'

interface UseAppointmentModalProps {
  onSubmit?: (data: AppointmentFormData) => Promise<void>
  onDelete?: (appointmentId: number) => Promise<void>
}

export function useAppointmentModal({ onSubmit, onDelete }: UseAppointmentModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null)

  // Initial form values
  const getInitialFormData = useCallback((): AppointmentFormData => {
    if (mode === 'edit' && appointmentToEdit) {
      return {
        title: appointmentToEdit.title,
        description: appointmentToEdit.description || '',
        date: appointmentToEdit.date,
        start_time: appointmentToEdit.start_time,
        end_time: appointmentToEdit.end_time,
        type: appointmentToEdit.type,
        branch_id: appointmentToEdit.branch_id,
        location_id: appointmentToEdit.location_id,
        category_id: appointmentToEdit.category_id,
        client_name: appointmentToEdit.client_name,
        client_phone: appointmentToEdit.client_phone || '',
        client_email: appointmentToEdit.client_email || '',
        participants: appointmentToEdit.participants,
        notes: appointmentToEdit.notes || '',
      }
    }

    // Default data for new appointment
    const now = new Date()
    const defaultDate = selectedDate || now
    const defaultStartTime = selectedTimeSlot?.start || '09:00'
    const defaultEndTime = selectedTimeSlot?.end || '10:00'

    return {
      title: '',
      description: '',
      date: defaultDate.toISOString().split('T')[0],
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      type: 'meeting',
      branch_id: 0,
      location_id: 0,
      client_name: '',
      client_phone: '',
      client_email: '',
      participants: 1,
      notes: '',
    }
  }, [mode, appointmentToEdit, selectedDate, selectedTimeSlot])

    // Modal controls
  const openCreateModal = useCallback((date?: Date, timeSlot?: { start: string; end: string }) => {
    setMode('create')
    setSelectedDate(date || null)
    setSelectedTimeSlot(timeSlot || null)
    setAppointmentToEdit(null)
    setError(null)
    setIsOpen(true)
  }, [])

  const openViewModal = useCallback((appointment: Appointment) => {
    setMode('view')
    setAppointmentToEdit(appointment)
    setError(null)
    setIsOpen(true)
  }, [])

  const openEditModal = useCallback((appointment: Appointment) => {
    setMode('edit')
    setAppointmentToEdit(appointment)
    setError(null)
    setIsOpen(true)
  }, [])

  // Cerrar modal
  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setMode('create')
      setAppointmentToEdit(null)
      setSelectedDate(null)
      setSelectedTimeSlot(null)
      setError(null)
    }, 300) // Delay to allow closing animation
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (formData: AppointmentFormData) => {
    if (!onSubmit) return

    setLoading(true)
    setError(null)

    try {
      await onSubmit(formData)
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving appointment')
    } finally {
      setLoading(false)
    }
  }, [onSubmit, closeModal])

  // Handle appointment deletion
  const handleDelete = useCallback(async () => {
    if (!onDelete || !appointmentToEdit) return

    setLoading(true)
    setError(null)

    try {
      await onDelete(appointmentToEdit.id)
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting appointment')
    } finally {
      setLoading(false)
    }
  }, [onDelete, appointmentToEdit, closeModal])

  // Switch to edit mode from view
  const switchToEdit = useCallback(() => {
    if (mode === 'view') {
      setMode('edit')
    }
  }, [mode])

  // Clear error when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
    }
  }, [isOpen])

  // Validate if appointment can be deleted
  const canDelete = useCallback(() => {
    if (!appointmentToEdit) return false
    
    // Cannot delete if in progress or completed
    const nonDeletableStates = ['in_progress', 'completed']
    return !nonDeletableStates.includes(appointmentToEdit.status)
  }, [appointmentToEdit])

  // Validate if appointment can be edited
  const canEdit = useCallback(() => {
    if (!appointmentToEdit) return false
    
    // Cannot edit if completed
    return appointmentToEdit.status !== 'completed'
  }, [appointmentToEdit])

  // Generate modal title
  const modalTitle = useCallback(() => {
    switch (mode) {
      case 'create':
        return 'New Appointment'
      case 'edit':
        return 'Edit Appointment'
      case 'view':
        return 'Appointment Details'
      default:
        return 'Appointment'
    }
  }, [mode])

  return {
    // Modal state
    isOpen,
    mode,
    loading,
    error,
    appointmentToEdit,
    selectedDate,
    selectedTimeSlot,
    modalTitle: modalTitle(),
    
    // Functions to open modal
    openCreateModal,
    openEditModal,
    openViewModal,
    closeModal,
    
    // Action functions
    handleSubmit,
    handleDelete,
    switchToEdit,
    
    // Utilities
    getInitialFormData,
    canDelete: canDelete(),
    canEdit: canEdit(),
    
    // Setters for special cases
    setError,
    setLoading,
  }
}
