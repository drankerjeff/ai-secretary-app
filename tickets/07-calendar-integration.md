# Ticket #07: Googleカレンダー連携機能

## 概要
Google Calendar APIを使用してカレンダー機能を実装し、タスク管理機能との連携を構築する。

## 目的
- Googleカレンダーとの双方向同期
- タスクの期限とカレンダーイベントの連携
- カレンダービューでのタスク表示

## 実装内容

### 1. Google Calendar API設定
- Google Cloud Console設定
 - Calendar API有効化
 - OAuth 2.0スコープ設定
- 環境変数設定
 - `GOOGLE_CALENDAR_API_KEY`
 - `GOOGLE_CALENDAR_CLIENT_ID`
 - `GOOGLE_CALENDAR_CLIENT_SECRET`

### 2. カレンダーページ（src/app/dashboard/calendar/page.tsx）
- 月表示/週表示/日表示の切り替え
- イベント作成ボタン
- タスク期限の表示
- カレンダーナビゲーション

### 3. カレンダー関連コンポーネント

#### CalendarView（src/components/calendar/CalendarView.tsx）
- カレンダーグリッド表示
- イベント・タスク表示
- ドラッグ&ドロップ対応
- クリックでイベント詳細表示

#### EventForm（src/components/calendar/EventForm.tsx）
- イベント作成/編集フォーム
- フィールド：
 - タイトル
 - 終日トグル（デフォルト ON）
 - 開始日時
 - 終了日時
 - 場所
 - 説明
 - リマインダー設定
- タスクとして保存オプション

#### EventItem（src/components/calendar/EventItem.tsx）
- イベント個別表示
- ソリッドカラーコーディング（google/manual/task別）
- 時刻表示（時刻あり時）
- クリックで編集

#### CalendarHeader（src/components/calendar/CalendarHeader.tsx）
- 表示期間切り替え（月）
- 前後ナビゲーション
- 今日へ移動ボタン
- 同期ステータス表示（最終同期時刻）
- Googleと同期ボタン（スピナー付き）

### 4. API Routes（src/app/api/calendar/）

#### GET /api/calendar/events
- イベント一覧取得
- パラメータ：start_date, end_date
- タスク期限も含めて返却

#### POST /api/calendar/events
- イベント作成
- Googleカレンダーへの同期
- タスク連携オプション

#### PATCH /api/calendar/events/[id]
- イベント更新
- 双方向同期

#### DELETE /api/calendar/events/[id]
- イベント削除
- 関連タスクの処理

#### POST /api/calendar/sync
- 手動/自動同期実行
- 差分検出と更新

### 5. カレンダー連携サービス（src/lib/calendar/）

#### googleCalendar.ts
- listGoogleEvents（ページネーション対応）
- createGoogleEvent
- updateGoogleEvent
- deleteGoogleEvent
- GoogleCalendarError クラス

### 6. カスタムフック（src/hooks/calendar/）

#### useCalendar.ts
- CalendarContext ラッパーフック

### 7. Context（src/contexts/CalendarContext.tsx）
- events CRUD + Google同期
- 5分ごと自動同期（バックグラウンド）
- provider_token を用いた Google API 認証

## 技術要件
- Google Calendar API v3
- OAuth 2.0認証（Supabase provider_token）
- 5分間隔自動同期
- タイムゾーン対応（JST）

## 完了条件
- [x] Google Calendar認証完了
- [x] イベントCRUD操作確認
- [x] カレンダービュー表示確認（月表示）
- [x] タスクとの連携動作確認
- [x] 同期機能動作確認（手動 + 5分自動）

## 注意事項
- APIレート制限への対応
- オフライン時の処理
- タイムゾーン処理（JST対応済み）
- 大量イベントのパフォーマンス対策
