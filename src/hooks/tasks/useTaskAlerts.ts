import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { getAlertTasks } from '@/lib/supabase/tasks'
import type { Task } from '@/types/task'

export function useTaskAlerts() {
  const { user } = useAuth()
  const [alertTasks, setAlertTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAlertTasks([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    getAlertTasks(user.id).then(({ data, error }) => {
      if (!error && data) {
        setAlertTasks(data as Task[])
      }
      setIsLoading(false)
    })
  }, [user])

  return { alertTasks, isLoading }
}
