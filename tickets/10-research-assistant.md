# Ticket #10: リサーチ機能実装

## 概要
Perplexity API で Web 検索を実行し、OpenAI gpt-4o-mini で要約・構造化してユーザーに提供する機能を実装する。

## 目的
- Perplexity API による Web リサーチの自動化
- 検索結果の要約と出典管理
- リサーチ履歴の保存・管理

## 実装内容

### 1. リサーチページ（src/app/dashboard/documents/research/page.tsx）
- ✅ Google 風 2 画面切り替えレイアウト（検索前: 中央検索画面 / 検索後: 全画面結果）
- ✅ リサーチクエリ入力（500文字制限・⌘+Enter ショートカット）
- ✅ 「AI でリサーチする」ボタン
- ✅ 「新しい検索」で検索画面に戻る
- ✅ リサーチ履歴（検索画面下部・結果画面下部）
- ❌ リサーチ詳細ページ（/research/[id]）— インライン表示で代替
- ❌ 検索タイプ選択（総合/最新/学術/ニュース）— 'general' 固定で運用

### 2. リサーチ関連コンポーネント

#### ResearchResult（src/components/research/ResearchResult.tsx）
- ✅ 概要（overview）表示
- ✅ 主要ポイント（key_points）箇条書き
- ✅ 関連トピック（related_topics）チップ表示
- ✅ 出典リスト（SourcesList）
- ❌ 重要度ハイライト
- ❌ エクスポート機能（PDF/Markdown/JSON）

#### SourcesList（src/components/research/SourcesList.tsx）
- ✅ 出典 URL 一覧表示
- ✅ 外部リンクアイコン（新しいタブで開く）
- ❌ 信頼度スコア（Perplexity API 非提供）
- ❌ 公開日・著者情報

#### ResearchHistory（src/components/research/ResearchHistory.tsx）
- ✅ 過去リサーチ一覧
- ✅ クリックで結果復元
- ✅ 削除機能（ホバー表示）
- ❌ 検索・フィルター機能
- ❌ お気に入り機能

### 3. API Routes（src/app/api/research/）

#### POST /api/research
- ✅ Perplexity API (sonar model) で Web 検索
- ✅ citations フィールドから出典 URL 抽出
- ✅ OpenAI gpt-4o-mini で summary 構造化（overview/key_points/related_topics）
- ✅ Supabase documents テーブルへ保存（type='research'）
- ❌ /api/research/prompt-optimize（Perplexity が直接最適化するため不要）

#### GET /api/research
- ✅ リサーチ履歴取得（最新 20 件）

#### GET /api/research/[id]
- ✅ リサーチ詳細取得

#### DELETE /api/research/[id]
- ✅ 所有権チェック付き削除

### 4. AI 統合（src/lib/research/）

#### perplexityClient.ts
- ✅ OpenAI SDK 互換（baseURL='https://api.perplexity.ai'）
- ✅ sonar モデル使用
- ✅ citations 抽出（非標準フィールドを unknown キャスト経由で取得）
- ❌ リサーチ戦略分岐（latestInfo / trends / academic）

#### summarizer.ts
- ✅ structureSummary() — gpt-4o-mini JSON mode で overview/key_points/related_topics 生成
- ❌ extractKeyPoints / generateOverview（summarizer 内に統合）

### 5. カスタムフック（src/hooks/research/useResearch.ts）
- ✅ search() — Perplexity→OpenAI→DB の一連処理
- ✅ loadHistory() — 履歴取得
- ✅ deleteResearch() — 楽観的削除
- ✅ clearResult() — 結果クリア（検索画面に戻る）
- ✅ restoreFromHistory() — 履歴から結果復元
- ❌ useResearchHistory.ts（useResearch.ts に統合）
- ❌ useSourceValidation.ts（不要）

### 6. 型定義（src/types/research.ts）
- ✅ SearchType / Source / ResearchSummary / ResearchMetadata / ResearchResult

## 技術要件
- ✅ Perplexity API（sonar モデル）
- ✅ OpenAI API（gpt-4o-mini、JSON mode）
- ✅ Supabase（documents テーブル、type='research'）
- ❌ キャッシュ戦略（未実装）

## 完了条件
- [x] Perplexity 検索動作確認
- [x] 要約生成（overview/key_points/related_topics）確認
- [x] 出典 URL 表示確認
- [x] リサーチ履歴保存・復元確認
- [ ] エクスポート機能確認（未実装）

## 注意事項
- ✅ Perplexity citations は非標準フィールド — `as unknown as { citations?: string[] }` で抽出
- ✅ sonar モデルは OpenAI SDK 互換で利用可能
- ❌ 検索結果のキャッシュ（毎回 API コール）
- ❌ 大量検索時のレート制限対策
