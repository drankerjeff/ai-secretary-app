'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { TimeScrollPicker } from '@/components/tasks/TimeScrollPicker'
import type { CalendarEvent, EventInput } from '@/types/calendar'

interface EventFormProps {
  event?: CalendarEvent
  defaultDate?: string
  onSubmit: (input: EventInput) => Promise<void>
  onCancel: () => void
  onDelete?: () => Promise<void>
}

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

function parseDatetime(isoString: string) {
  const local = new Date(isoString)
  const date = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`
  const h = String(local.getHours()).padStart(2, '0')
  const m = local.getMinutes() < 30 ? '00' : '30'
  return { date, time: `${h}:${m}` }
}

const dateInputClass = [
  'flex-1 rounded-lg bg-background-secondary border border-border',
  'text-callout text-foreground px-3.5 py-2.5',
  'transition-all duration-250 [color-scheme:dark]',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
].join(' ')

export function EventForm({ event, defaultDate, onSubmit, onCancel, onDelete }: EventFormProps) {
  const startInitial = event?.start_datetime
    ? parseDatetime(event.start_datetime)
    : { date: defaultDate ?? '', time: '09:00' }
  const endInitial = event?.end_datetime
    ? parseDatetime(event.end_datetime)
    : { date: defaultDate ?? '', time: '10:00' }

  const [title, setTitle] = useState(event?.title ?? '')
  const [isAllDay, setIsAllDay] = useState(event?.is_all_day ?? true)
  const [startDate, setStartDate] = useState(startInitial.date)
  const [startTime, setStartTime] = useState(startInitial.time)
  const [endDate, setEndDate] = useState(endInitial.date)
  const [endTime, setEndTime] = useState(endInitial.time)
  const [location, setLocation] = useState(event?.location ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAllDayToggle = () => {
    setIsAllDay((prev) => !prev)
    // 終日に戻したとき終了日を開始日に合わせる
    if (!isAllDay) setEndDate(startDate)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !startDate) return
    setError(null)
    setIsSubmitting(true)
    try {
      let start_datetime: string
      let end_datetime: string

      if (isAllDay) {
        // 終日: ローカル日付の00:00をISOに変換
        start_datetime = new Date(`${startDate}T00:00:00`).toISOString()
        end_datetime = new Date(`${startDate}T00:00:00`).toISOString()
      } else {
        start_datetime = new Date(`${startDate}T${startTime}`).toISOString()
        end_datetime = new Date(`${(endDate || startDate)}T${endTime}`).toISOString()
      }

      const input: EventInput = {
        title: title.trim(),
        start_datetime,
        end_datetime,
        is_all_day: isAllDay,
        ...(location.trim() && { location: location.trim() }),
        ...(description.trim() && { description: description.trim() }),
      }
      await onSubmit(input)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setError(null)
    setIsDeleting(true)
    try {
      await onDelete()
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}

      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="イベントのタイトルを入力"
        required
        autoFocus
      />

      {/* 終日トグル */}
      <button
        type="button"
        role="switch"
        aria-checked={isAllDay}
        onClick={handleAllDayToggle}
        className="flex items-center gap-2.5 group"
      >
        <span
          className={[
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
            isAllDay ? 'bg-primary' : 'bg-fill',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
              isAllDay ? 'translate-x-4' : 'translate-x-0.5',
            ].join(' ')}
          />
        </span>
        <span className="text-subheadline font-medium text-foreground">終日</span>
      </button>

      {isAllDay ? (
        /* 終日: 日付のみ */
        <div className="flex flex-col gap-1.5">
          <span className="text-subheadline font-medium text-foreground">日付</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setEndDate(e.target.value) }}
            required
            className={dateInputClass}
          />
        </div>
      ) : (
        /* 時刻あり: 開始・終了 */
        <>
          <div className="flex flex-col gap-1.5">
            <span className="text-subheadline font-medium text-foreground">開始日時</span>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={dateInputClass}
              />
              <TimeScrollPicker
                items={TIME_SLOTS}
                value={startTime}
                onChange={setStartTime}
                disabled={!startDate}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-subheadline font-medium text-foreground">終了日時</span>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className={dateInputClass}
              />
              <TimeScrollPicker
                items={TIME_SLOTS}
                value={endTime}
                onChange={setEndTime}
                disabled={!endDate}
              />
            </div>
          </div>
        </>
      )}

      <Input
        label="場所（任意）"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="場所を入力"
      />

      <Textarea
        label="説明（任意）"
        value={description}
        onChange={(value) => setDescription(value)}
        placeholder="詳細を入力"
        rows={3}
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        {onDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isSubmitting}
            className="text-destructive hover:bg-destructive/10"
          >
            削除
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting || isDeleting}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!title.trim() || !startDate || isDeleting}
          >
            {event ? '保存' : '作成'}
          </Button>
        </div>
      </div>
    </form>
  )
}
