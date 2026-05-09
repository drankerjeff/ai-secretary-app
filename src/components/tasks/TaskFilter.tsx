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

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  due: 'all',
}

export function TaskFilter() {
  const { filters, setFilters } = useTasks()

  const isFiltered =
    filters.status !== 'all' || filters.priority !== 'all' || filters.due !== 'all'

  return (
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
  )
}
