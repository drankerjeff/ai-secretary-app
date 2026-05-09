const GOOGLE_CALENDAR_BASE_URL =
  'https://www.googleapis.com/calendar/v3/calendars/primary'

export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  location?: string
  colorId?: string
}

interface GoogleEventListResponse {
  items?: GoogleCalendarEvent[]
  nextPageToken?: string
}

type GoogleEventInput = {
  summary: string
  description?: string
  start: object
  end: object
  location?: string
}

/**
 * Google Calendar API から指定期間のイベント一覧を取得する。
 * pageToken を使って全ページを収集する。
 */
export async function listGoogleEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string
): Promise<GoogleCalendarEvent[]> {
  const allEvents: GoogleCalendarEvent[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(`${GOOGLE_CALENDAR_BASE_URL}/events`)
    url.searchParams.set('timeMin', timeMin)
    url.searchParams.set('timeMax', timeMax)
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')
    url.searchParams.set('maxResults', '250')
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new GoogleCalendarError(
        `Google Calendar API error: ${response.status} ${response.statusText}`,
        response.status,
        errorBody
      )
    }

    const data: GoogleEventListResponse = await response.json()
    if (data.items) {
      allEvents.push(...data.items)
    }
    pageToken = data.nextPageToken
  } while (pageToken)

  return allEvents
}

/**
 * Google Calendar にイベントを新規作成する。
 */
export async function createGoogleEvent(
  accessToken: string,
  event: GoogleEventInput
): Promise<GoogleCalendarEvent> {
  const response = await fetch(`${GOOGLE_CALENDAR_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new GoogleCalendarError(
      `Failed to create Google Calendar event: ${response.status} ${response.statusText}`,
      response.status,
      errorBody
    )
  }

  return response.json()
}

/**
 * Google Calendar の既存イベントを更新する。
 */
export async function updateGoogleEvent(
  accessToken: string,
  eventId: string,
  event: Partial<GoogleEventInput>
): Promise<GoogleCalendarEvent> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_BASE_URL}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new GoogleCalendarError(
      `Failed to update Google Calendar event: ${response.status} ${response.statusText}`,
      response.status,
      errorBody
    )
  }

  return response.json()
}

/**
 * Google Calendar のイベントを削除する。
 */
export async function deleteGoogleEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_BASE_URL}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  // 204 No Content が正常レスポンス。410 Gone は既に削除済みなので無視する。
  if (!response.ok && response.status !== 410) {
    const errorBody = await response.text()
    throw new GoogleCalendarError(
      `Failed to delete Google Calendar event: ${response.status} ${response.statusText}`,
      response.status,
      errorBody
    )
  }
}

/** Google Calendar API エラーを表すカスタム例外クラス */
export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body: string
  ) {
    super(message)
    this.name = 'GoogleCalendarError'
  }
}
