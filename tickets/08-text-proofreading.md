# Ticket #08: 文章校正機能実装

## 概要
OpenAI APIを使用してAIによる文章校正機能を実装し、ユーザーの文体を学習・適用する機能を構築する。

## 目的
- AI文章校正機能の実装
- ユーザー文体の学習・分析
- パーソナライズされた校正提案

## 実装内容

### 1. 文章校正ページ（src/app/dashboard/documents/proofread/page.tsx）
- ✅ 2パネルレイアウト（修正前 / 修正後）
- ✅ 「文書入力」「文体分析」タブ切り替え（ページ上部）
- ✅ 校正実行ボタン
- ✅ 校正結果表示エリア
- ✅ 履歴一覧
- ✅ 校正完了後に自動で文体分析タブへ遷移

### 2. 文章校正関連コンポーネント

#### ProofreadResult（src/components/documents/ProofreadResult.tsx）
- ✅ 修正後テキスト表示（コピーボタン付き）
- ✅ 種別フィルタータブ（すべて / 誤字 / 文法 / 文体 / 句読点）
- ✅ 提案カードごとの「採用」「却下」ボタン
- ✅ 「すべて採用」ボタン
- ✅ 却下するとリアルタイムで修正後テキストから差し戻し
- ✅ 各提案の説明表示
- ✅ 色分けバッジ（誤字=赤 / 文法=オレンジ / 文体=青 / 句読点=緑）

#### WritingStyleAnalyzer（文体分析タブ内に統合）
- ✅ 修正提案数サマリー（全体 + 種別グリッド表示）
- ✅ 修正前後の文字数比較
- ✅ 種別内訳バー（割合 %）
- ✅ 文体の特徴：形式性レベル（バー + ラベル）
- ✅ 文体の特徴：文の長さ（短い / 普通 / 長い）
- ✅ 文体の特徴：適書レベル（読みやすい / 標準的 / 改善が必要）
- ✅ 文体の特徴：よく使う表現（チップ一覧）

#### ProofreadHistory（src/components/documents/ProofreadHistory.tsx）
- ✅ 校正履歴一覧
- ✅ 日付・提案件数表示
- ✅ 履歴から再編集（テキスト復元）
- ✅ 削除機能（楽観的更新）

### 3. API Routes

#### POST /api/documents/proofread
- ✅ テキスト検証（必須・5000文字以内）
- ✅ OpenAI gpt-4o-mini呼び出し（JSON mode）
- ✅ Supabase documents テーブルへの保存
- ✅ ProofreadResult 形式でレスポンス

#### GET /api/documents/proofread
- ✅ 校正履歴取得（最新20件）

#### DELETE /api/documents/proofread/[id]
- ✅ 所有権チェック付き削除

### 4. OpenAI統合（src/lib/ai/openai.ts）
- ✅ proofreadText() 関数
- ✅ 文書タイプ別プロンプト（email / report / general）
- ✅ JSON モードによる構造化レスポンス
- ✅ OpenAIError クラス

### 5. カスタムフック（src/hooks/documents/useProofread.ts）
- ✅ proofread() 実行・ローディング・エラー管理
- ✅ loadHistory() / deleteHistory() / clearResult()

### 6. 型定義（src/types/document.ts）
- ✅ DocumentType / Suggestion / ProofreadResult / ProofreadMetadata

## 未実装（スコープ外として保留）
- ❌ 文体学習API（writing-style/analyze, GET writing-style）— 現在は結果ごとにクライアント側で分析
- ❌ パーソナライズ校正（ユーザー過去文体の反映）
- ❌ 差分ハイライト（original/suggested の位置情報なし）
- ❌ リッチテキストエディター（textarea で代替）
- ❌ 履歴検索機能

## 技術要件
- ✅ OpenAI API (gpt-4o-mini)
- ❌ リッチテキストエディター（未使用）
- ❌ 差分表示アルゴリズム（未使用）
- ✅ 文体分析（クライアントサイドで算出）

## 完了条件
- [x] 文章校正機能動作確認
- [x] 誤字脱字・文法チェック確認
- [x] 文体分析表示確認（形式性・文の長さ・適書レベル・よく使う表現）
- [x] 校正履歴保存確認
- [x] 採用・却下によるリアルタイム修正確認
- [ ] パーソナライズ校正確認（保留）

## 注意事項
- APIコール数の最適化
- 長文対応（5000文字上限）
- プライバシー配慮（文書の暗号化）
- レスポンス時間の最適化
