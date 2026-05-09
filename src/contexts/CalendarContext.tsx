'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { createClient } from '@/lib/supabase/client'
import type { CalendarEvent, EventInput } from '@/types/calendar'

interface SyncResult {
  synced: number | null
  message?: string
}

interface CalendarContextType {
  events: CalendarEvent[]
  isLoading: boolean
  currentDate: Date
  setCurrentDate: (date: Date) => void
  isSyncing: boolean
  lastSyncedAt: Date | null
  createEvent: (input: EventInput) => Promise<void>
  updateEvent: (id: string, input: Partial<EventInput>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  syncWithGoogle: () => Promise<SyncResult>
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function monthRange(date: Date): { start: string; end: string } {
  // グリッドに表示される先月末〜来月初のセルを含め、さらに±1日のタイムゾーン吸収バッファを追加
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay() - 1)

  const gridEnd = new Date(lastOfMonth)
  gridEnd.setDate(lastOfMonth.getDate() + (6 - lastOfMonth.getDay()) + 1)

  return { start: toDateStr(gridStart), end: toDateStr(gridEnd) }
}

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date())
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

  const load = useCallback(async (date: Date) => {
    if (!user) {
      setEvents([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const { start, end } = monthRange(date)
    try {
      const res = await fetch(`/api/calendar/events?start=${start}&end=${end}`)
      if (res.ok) {
        const data: CalendarEvent[] = await res.json()
        setEvents(data)
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    load(currentDate)
  }, [load, currentDate])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.provider_token ?? null
  }, [])

  const createEvent = useCallback(async (input: EventInput) => {
    const accessToken = await getAccessToken()
    const res = await fetch('/api/calendar/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, access_token: accessToken }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? err.message ?? 'イベントの作成に失敗しました')
    }
    const created: CalendarEvent = await res.json()
    setEvents((prev) => [created, ...prev])
  }, [getAccessToken])

  const updateEvent = useCallback(async (id: string, input: Partial<EventInput>) => {
    const accessToken = await getAccessToken()
    const res = await fetch(`/api/calendar/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, access_token: accessToken }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? err.message ?? 'イベントの更新に失敗しました')
    }
    const updated: CalendarEvent = await res.json()
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }, [getAccessToken])

  const deleteEvent = useCallback(async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    const accessToken = await getAccessToken()
    const url = accessToken
      ? `/api/calendar/events/${id}?access_token=${encodeURIComponent(accessToken)}`
      : `/api/calendar/events/${id}`
    const res = await fetch(url, { method: 'DELETE' })
    if (!res.ok) {
      await load(currentDate)
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? err.message ?? 'イベントの削除に失敗しました')
    }
  }, [getAccessToken, load, currentDate])

  const syncWithGoogle = useCallback(async (): Promise<SyncResult> => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const accessToken = session?.provider_token

    if (!accessToken) {
      throw new Error('Googleカレンダーと連携するには再ログインが必要です')
    }

    setIsSyncing(true)
    try {
      const res = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? err.message ?? '同期に失敗しました')
      }
      const result: SyncResult = await res.json()
      setLastSyncedAt(new Date())
      await load(currentDate)
      return result
    } finally {
      setIsSyncing(false)
    }
  }, [load, currentDate])

  // 5分ごとの自動同期（エラーはサイレントに処理）
  const syncWithGoogleRef = useRef(syncWithGoogle)
  useEffect(() => { syncWithGoogleRef.current = syncWithGoogle }, [syncWithGoogle])

  useEffect(() => {
    if (!user) return
    const FIVE_MINUTES = 5 * 60 * 1000
    const id = setInterval(() => {
      syncWithGoogleRef.current().catch(() => {/* provider_token切れ等はサイレント */})
    }, FIVE_MINUTES)
    return () => clearInterval(id)
  }, [user])

  return (
    <CalendarContext.Provider
      value={{
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
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendarContext(): CalendarContextType {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error('useCalendarContext must be used within a CalendarProvider')
  }
  return context
}
