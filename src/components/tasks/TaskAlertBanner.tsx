'use client'

import { Alert } from '@/components/ui/Alert'
import { useTaskAlerts } from '@/hooks/tasks/useTaskAlerts'

export function TaskAlertBanner() {
  const { alertTasks, isLoading } = useTaskAlerts()

  if (isLoading || alertTasks.length === 0) return null

  return (
    <Alert type="warning" title="期限が近いタスクがあります">
      {alertTasks.length}件のタスクが期限2日以内です
    </Alert>
  )
}
