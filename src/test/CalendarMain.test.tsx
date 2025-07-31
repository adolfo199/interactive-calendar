import { describe, it, expect } from 'vitest'
import { render, screen as testingScreen } from '@testing-library/react'
import { CalendarMain } from '../CalendarMain'

describe('CalendarMain', () => {
  it('should render calendar component', () => {
    render(<CalendarMain />)
    
    // Verificar que el componente se renderiza
    expect(testingScreen.getByRole('button', { name: /hoy/i })).toBeInTheDocument()
    expect(testingScreen.getByText(/nueva cita/i)).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(<CalendarMain loading={true} />)
    
    expect(testingScreen.getByText(/cargando calendario/i)).toBeInTheDocument()
  })

  it('should handle view changes', () => {
    render(<CalendarMain showViewSelector={true} />)
    
    // Verificar que los botones de vista están presentes
    expect(testingScreen.getByText(/mes/i)).toBeInTheDocument()
    expect(testingScreen.getByText(/semana/i)).toBeInTheDocument()
    expect(testingScreen.getByText(/día/i)).toBeInTheDocument()
  })
})
