import type { Meta, StoryObj } from '@storybook/react'
import { CalendarMain } from '../CalendarMain'

const meta: Meta<typeof CalendarMain> = {
  title: 'Calendar/CalendarMain',
  component: CalendarMain,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithoutToolbar: Story = {
  args: {
    showToolbar: false,
  },
}

export const WeekView: Story = {
  args: {
    initialView: 'week',
  },
}

export const DayView: Story = {
  args: {
    initialView: 'day',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const CustomHeight: Story = {
  args: {
    height: 600,
  },
}
