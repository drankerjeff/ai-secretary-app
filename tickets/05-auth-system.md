# Ticket #05: 認証システム実装


## 概要
Google OAuth認証を使用したユーザー認証システムを実装し、セッション管理機能を構築する。


## 目的
- Google OAuth 2.0認証の実装
- ユーザーセッション管理
- 認証状態の永続化


## 実装内容


### 1. Google OAuth設定
- Google Cloud Console設定
 - OAuth 2.0クライアントID作成
 - リダイレクトURI設定
- 環境変数設定
 - `GOOGLE_CLIENT_ID`
 - `GOOGLE_CLIENT_SECRET`
 - `NEXTAUTH_URL`
 - `NEXTAUTH_SECRET`


### 2. Supabase Auth設定
- Google プロバイダー設定
- リダイレクトURL設定
- メール確認無効化（Google認証のため）


### 3. 認証フロー実装（src/lib/auth/）


#### auth.ts - 認証ユーティリティ
```typescript
- signInWithGoogle()
- signOut()
- getSession()
- getUser()
```


#### AuthContext.tsx - 認証コンテキスト
```typescript
interface AuthContextType {
 user: User | null
 isLoading: boolean
 signIn: () => Promise<void>
 signOut: () => Promise<void>
}
```


### 4. 認証関連コンポーネント


#### LoginPage（src/app/login/page.tsx）
- Googleログインボタン
- ローディング状態
- エラーハンドリング


#### AuthGuard（src/components/auth/AuthGuard.tsx）
- 認証が必要なページを保護
- 未認証時は/loginへリダイレクト
- ローディング表示


#### UserMenu（src/components/auth/UserMenu.tsx）
- ユーザー情報表示
- ログアウトボタン
- プロフィール画像表示


### 5. ミドルウェア設定（src/middleware.ts）
```typescript
- 保護されたルートの定義
- 認証チェック
- リダイレクト処理
```


### 6. API Routes（src/app/api/auth/）
- `GET /api/auth/google`: Google認証開始
- `GET /api/auth/callback`: 認証コールバック
- `POST /api/auth/logout`: ログアウト処理
- `GET /api/auth/session`: セッション取得


## 技術要件
- Supabase Auth
- Google OAuth 2.0
- Next.js Middleware
- セッション永続化


## 完了条件
- [x] Google OAuth設定完了
- [x] ログイン/ログアウト機能動作確認
- [x] セッション管理動作確認
- [x] 保護ルートの動作確認（src/middleware.ts で307リダイレクト確認済み）
- [x] ユーザー情報の取得・表示確認（public.usersへの自動同期含む）


## 追加実装（チケット外）
- `src/middleware.ts` の配置修正（src/ディレクトリ構成では src/ 内が正しい場所）
- `getUser()` → `getSession()` 変更（ミドルウェアでのネットワーク呼び出し安定化）
- auth.users → public.users 自動同期トリガー（#04と連携）


## 注意事項
- 本番環境のリダイレクトURL設定
- NEXTAUTH_SECRETは必ず設定
- エラーハンドリングを適切に実装
- ローディング状態を必ず表示
