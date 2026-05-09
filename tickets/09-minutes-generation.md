# Ticket #09: 議事録作成機能実装

## 概要
AssemblyAI APIを使用して音声ファイルから自動文字起こしを行い、OpenAI APIで議事録フォーマットに整形する機能を実装する。

## 目的
- 音声ファイルの文字起こし
- 議事録フォーマットでの自動生成
- 議事録の保存・管理

## 実装内容

### 1. 議事録作成ページ（src/app/dashboard/documents/minutes/page.tsx）
- ✅ 2カラムレイアウト（アップロード左 / 議事録表示右）
- ✅ 音声ファイルアップロード
- ✅ 処理状況表示（ポーリング中）
- ✅ 議事録一覧（左下）
- ❌ 新規作成ボタン（AudioUploader が常時表示のため不要）

### 2. 議事録詳細ページ
- ✅ 議事録表示（MinutesDisplay で右パネルに表示）
- ✅ 編集機能（全セクション編集モード対応）
- ✅ 削除機能
- ❌ 専用詳細ページ（/minutes/[id]）— インライン表示で代替
- ❌ エクスポート機能（PDF/Word/Markdown）

### 3. 議事録関連コンポーネント

#### AudioUploader（src/components/documents/AudioUploader.tsx）
- ✅ ドラッグ&ドロップ対応
- ✅ ファイル形式検証（mp3, wav, m4a, mp4, webm）
- ✅ ファイルサイズ表示・バリデーション（最大 200MB）
- ✅ アップロード中スピナー表示
- ✅ タイトル入力フィールド
- ❌ キャンセル機能（アップロード開始後のキャンセル）

#### TranscriptionProgress（src/components/documents/TranscriptionProgress.tsx）
- ✅ 4ステップ表示（アップロード / 音声認識 / 議事録生成 / 完了）
- ✅ 全体の進捗ゲージ（数値 % + バー）
- ✅ 各ステップのアクティブ / 完了 / 待機状態
- ✅ エラー表示
- ❌ 推定残り時間

#### MinutesDisplay（src/components/documents/MinutesDisplay.tsx）
- ✅ サマリー表示・編集
- ✅ 議論された内容（表示・項目追加/削除/編集）
- ✅ 決定事項（表示・項目追加/削除/編集）
- ✅ ネクストアクション（タスク/担当者/期日の表示・編集）
- ✅ 文字起こし全文（折りたたみ表示）
- ✅ タイトル編集
- ✅ 編集モード / 保存 / キャンセル
- ❌ 自動保存（手動保存ボタンで代替）

#### MinutesList（src/components/documents/MinutesList.tsx）
- ✅ 議事録一覧表示
- ✅ 作成日表示
- ✅ ステータスバッジ（処理中/完了/失敗）
- ✅ 選択・削除機能
- ❌ 検索機能
- ❌ フィルター・ページネーション

### 4. API Routes

#### POST /api/documents/minutes
- ✅ FormData で音声ファイル受け取り
- ✅ Supabase Storage アップロード
- ✅ AssemblyAI 文字起こしジョブ起動
- ✅ documents テーブルへ保存（type='minutes'）
- ✅ `{ id, status: 'transcribing' }` レスポンス

#### GET /api/documents/minutes
- ✅ 議事録一覧取得（最新20件）
- ✅ MinutesDocument[] 形式で返却

#### GET /api/documents/minutes/[id]
- ✅ 議事録詳細取得

#### PATCH /api/documents/minutes/[id]
- ✅ title / discussed_topics / decisions / next_actions の部分更新

#### DELETE /api/documents/minutes/[id]
- ✅ 所有権チェック付き削除

#### GET /api/documents/minutes/[id]/status（ポーリング用）
- ✅ AssemblyAI ステータス確認
- ✅ 完了時に OpenAI で議事録生成
- ✅ DB を generating → completed に更新
- ✅ 失敗時に failed に更新

### 5. AssemblyAI統合（src/lib/transcription/assemblyai.ts）
- ✅ createTranscription(audioUrl) — 日本語・speech_models 指定
- ✅ getTranscriptionStatus(id) — queued/processing/completed/error 対応
- ✅ AssemblyAIError クラス
- ❌ transcriptionQueue.ts（ポーリング方式で不要）

### 6. 議事録生成（src/lib/minutes/minutesGenerator.ts）
- ✅ generateMinutes(transcription) — gpt-4o-mini JSON mode
- ✅ title / summary / discussed_topics / decisions / next_actions 生成
- ✅ レスポンススキーマ検証
- ✅ MinutesGenerationError クラス
- ❌ minutesTemplates.ts（プロンプト内で定義）

### 7. ファイルストレージ（src/lib/storage/audioStorage.ts）
- ✅ Supabase Storage アップロード（audio-files バケット、private）
- ✅ ファイル名サニタイズ（タイムスタンプ.拡張子形式）
- ✅ 24時間有効の署名付きURL生成（AssemblyAI からのアクセス用）
- ❌ deleteFromStorage（削除時にストレージも削除する機能）

### 8. カスタムフック（src/hooks/documents/useMinutes.ts）
- ✅ uploadMinutes() — アップロード + ジョブ起動
- ✅ pollStatus() — 5秒間隔ポーリング、completed/failed で停止
- ✅ loadList() — 一覧取得
- ✅ deleteMinutes() — 楽観的削除
- ✅ updateMinutes() — PATCH 呼び出し

### 9. 型定義（src/types/minutes.ts）
- ✅ MinutesStatus / NextAction / MinutesMetadata / MinutesDocument

## 技術要件
- ✅ AssemblyAI API（speech_models: ['universal-2'], language_code: 'ja'）
- ✅ OpenAI API（gpt-4o-mini、JSON mode）
- ✅ ファイルストレージ（Supabase Storage）
- ✅ 非同期処理（クライアント5秒ポーリング方式）
- ❌ WebSocket（ポーリングで代替）

## 完了条件
- [x] 音声ファイルアップロード確認
- [x] 文字起こし処理動作確認
- [x] 議事録自動生成確認
- [x] 議事録編集・保存確認
- [ ] エクスポート機能確認（未実装）

## 注意事項
- ✅ ファイル名サニタイズ（日本語・記号対応）
- ✅ Supabase Storage → 署名付きURL で AssemblyAI に渡す
- ✅ Next.js Route Handler maxDuration=60 設定済み
- ❌ 大容量ファイル対応（チャンク分割）— 200MB 上限で運用
- ❌ 処理失敗時のリトライ機能
