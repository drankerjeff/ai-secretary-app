'use client'

import { useState, useCallback } from 'react'
import { CalendarProvider } from '@/contexts/CalendarContext'
import { useCalendar } from '@/hooks/calendar/useCalendar'
import { CalendarHeader } from '@/components/calendar/CalendarHeader'
import { CalendarView } from '@/components/calendar/CalendarView'
import { EventForm } from '@/components/calendar/EventForm'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import type { CalendarEvent, EventInput } from '@/types/calendar'

function CalendarContent() {
  const {
    events,
    isLoading,
    currentDate,
    setCurrentDate,
    isSyncing,
    lastSyncedAt,
    createEvent,
    updateEvent,
    deleteEvent,
    syncWithGoogle,
  } = useCalendar()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
  const [syncError, setSyncError] = useState<string | null>(null)

  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }, [currentDate, setCurrentDate])

  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }, [currentDate, setCurrentDate])

  const goToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [setCurrentDate])

  const handleSync = useCallback(async () => {
    setSyncError(null)
    try {
      await syncWithGoogle()
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : '同期に失敗しました')
    }
  }, [syncWithGoogle])

  const openCreate = useCallback((date: string) => {
    setEditingEvent(null)
    setSelectedDate(date)
    setModalOpen(true)
  }, [])

  const openEdit = useCallback((event: CalendarEvent) => {
    setEditingEvent(event)
    setSelectedDate(undefined)
    setModalOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setModalOpen(false)
    setEditingEvent(null)
    setSelectedDate(undefined)
  }, [])

  const handleSubmit = useCallback(async (input: EventInput) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, input)
    } else {
      await createEvent(input)
    }
    handleClose()
  }, [editingEvent, updateEvent, createEvent, handleClose])

  const handleDelete = useCallback(async () => {
    if (!editingEvent) return
    await deleteEvent(editingEvent.id)
    handleClose()
  }, [editingEvent, deleteEvent, handleClose])

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-title1 font-semibold text-foreground">カレンダー</h1>
        <p className="text-callout text-foreground-secondary">スケジュールを確認・管理できます。</p>
      </div>

      {syncError && (
        <Alert type="error" dismissible onDismiss={() => setSyncError(null)}>
          {syncError}
        </Alert>
      )}

      <div className="apple-card px-4 pt-4 pb-0">
        <CalendarHeader
          currentDate={currentDate}
          onPrev={prevMonth}
          onNext={nextMonth}
          onToday={goToday}
          onSync={handleSync}
          isSyncing={isSyncing}
          lastSyncedAt={lastSyncedAt}
        />
      </div>

      <div className={isLoading ? 'opacity-50 pointer-events-none' : undefined}>
        <CalendarView
          events={events}
          currentDate={currentDate}
          onEventClick={openEdit}
          onDayClick={openCreate}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        title={editingEvent ? 'イベントを編集' : 'イベントを追加'}
        size="md"
      >
        <EventForm
          event={editingEvent ?? undefined}
          defaultDate={selectedDate}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onDelete={editingEvent ? handleDelete : undefined}
        />
      </Modal>
    </div>
  )
}

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  )
}
