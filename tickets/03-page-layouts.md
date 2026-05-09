# Ticket #03: ページレイアウト構築

## 概要
各ページ用のレイアウトコンポーネント（Header、Sidebar）を作成し、ダッシュボード構造を構築する。

## 目的
- 統一されたページ構造の確立
- ナビゲーション機能の実装
- レスポンシブ対応のレイアウト

## 実装内容

### 1. DashboardLayout（src/app/dashboard/layout.tsx）
- ダッシュボード全体のレイアウト管理
- Sidebar・Header・Main 領域の配置
- レスポンシブ対応（モバイルメニュー）

### 2. Header コンポーネント（src/components/layout/Header.tsx）
- アプリロゴ/タイトル表示
- ユーザーメニュー（アバター、ドロップダウン）
- 通知アイコン（未読バッジ付き）
- 検索ポップオーバー（SearchPopover — クリックで展開・Escape/外クリックで閉じる）

### 3. Sidebar コンポーネント（src/components/layout/Sidebar.tsx）
- ナビゲーションメニュー（5項目）
  - ダッシュボード
  - タスク管理
  - カレンダー
  - 文章校正
  - 議事録
- アクティブ状態の表示（aria-current="page"）
- アイコン付きメニュー項目
- 折りたたみ機能（モバイル — MobileMenu 経由）

### 4. UserMenu コンポーネント（src/components/layout/UserMenu.tsx）
- ユーザー情報表示
- プロフィール設定リンク
- ログアウトボタン
- ドロップダウンメニュー（Escape/外クリックで閉じる）

### 5. NavigationItem コンポーネント（src/components/layout/NavigationItem.tsx）
- メニュー項目の共通コンポーネント
- アイコン、ラベル、バッジ対応
- アクティブ状態スタイル
- ホバーエフェクト（min-h-[44px] タッチターゲット）

### 6. MobileMenu コンポーネント（src/components/layout/MobileMenu.tsx）
- ハンバーガーメニュー
- スライドインアニメーション（.animate-slide-in-left — globals.css 定義）
- オーバーレイ・ボディスクロールロック

## ページ構造
```
/dashboard
 ├── layout.tsx（DashboardLayout）
 ├── page.tsx（ダッシュボードホーム + クイックアクション）
 ├── tasks/
 │   └── page.tsx（空状態プレースホルダー）
 ├── calendar/
 │   └── page.tsx（空状態プレースホルダー）
 └── documents/
     ├── proofread/page.tsx（空状態プレースホルダー）
     ├── minutes/page.tsx（空状態プレースホルダー）
     └── research/page.tsx（検索 — ヘッダーからリンク）
```

## 技術要件
- [x] Next.js App Router 対応
- [x] CSS 変数使用（bg-background 等。gray-* / 生 HEX 値なし）
- [x] レスポンシブブレークポイント対応（lg: デスクトップサイドバー / モバイルメニュー）
- [x] アクセシビリティ対応（ARIA・44px タッチターゲット・フォーカス管理）

## 完了条件
- [x] DashboardLayout 実装完了
- [x] Header / Sidebar / UserMenu / NavigationItem / MobileMenu 実装完了
- [x] ナビゲーション機能動作確認（active ハイライト・Next.js Link）
- [x] レスポンシブ対応確認（モバイルスライドメニュー動作）
- [x] 各ページへのルーティング確認（7ルート全て静的ビルド成功）

## テスト
- Jest + Testing Library: 220 tests / 220 passing ✅
- 対象: Sidebar・Header・UserMenu・NavigationItem・MobileMenu・全ページ

## ステータス
**✅ 完了**（2026-04-29）
