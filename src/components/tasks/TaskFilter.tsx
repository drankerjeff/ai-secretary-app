'use client'

import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/tasks/useTasks'
import type { TaskFilters } from '@/types/task'

const STATUS_OPTIONS = [
  { value: 'all', label: '全て' },
  { value: 'pending', label: '未完了' },
  { value: 'completed', label: '完了' },
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: '全て' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

const DUE_OPTIONS = [
  { value: 'all', label: '全て' },
  { value: 'today', label: '今日' },
  { value: 'week', label: '今週' },
  { value: 'overdue', label: '期限切れ' },
]

const SORT_OPTIONS = [
  { value: 'created_desc', label: '作成日（新しい順）' },
  { value: 'due_asc', label: '期限（近い順）' },
  { value: 'due_desc', label: '期限（遠い順）' },
  { value: 'priority_desc', label: '優先度（高い順）' },
]

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  due: 'all',
  search: '',
  sort: 'created_desc',
}

export function TaskFilter() {
  const { filters, setFilters } = useTasks()

  const isFiltered =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.due !== 'all' ||
    filters.search !== ''

  return (
    <div className="space-y-3">
      {/* Keyword search */}
      <div className="flex flex-col gap-1">
        <label className="text-footnote font-medium text-foreground-secondary">キーワード検索</label>
        <input
          type="text"
          placeholder="タイトルまたは説明で検索..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-body text-foreground placeholder:text-foreground-quaternary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Filters + sort row */}
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="ステータス"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(value) =>
            setFilters({ ...filters, status: value as TaskFilters['status'] })
          }
          className="w-36"
        />
        <Select
          label="優先度"
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(value) =>
            setFilters({ ...filters, priority: value as TaskFilters['priority'] })
          }
          className="w-32"
        />
        <Select
          label="期限"
          options={DUE_OPTIONS}
          value={filters.due}
          onChange={(value) =>
            setFilters({ ...filters, due: value as TaskFilters['due'] })
          }
          className="w-36"
        />
        <Select
          label="並び替え"
          options={SORT_OPTIONS}
          value={filters.sort}
          onChange={(value) =>
            setFilters({ ...filters, sort: value as TaskFilters['sort'] })
          }
          className="w-52"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="self-end"
          >
            フィルターをクリア
          </Button>
        )}
      </div>
    </div>
  )
}
