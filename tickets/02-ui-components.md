# Ticket #02: 共通UIコンポーネント作成

## 概要
アプリ全体で使用する共通UIコンポーネントをApple風のデザインで実装する。

## 目的
- 再利用可能なコンポーネントライブラリの構築
- 一貫性のあるUI体験の提供
- 開発効率の向上

## 実装内容

### 1. Button コンポーネント（src/components/ui/Button.tsx）
- バリアント: primary, secondary, outline, ghost, destructive
- サイズ: sm, md, lg（全サイズ min-h-[44px] — Apple HIG 準拠）
- 状態: loading（invisible でレイアウト保持）, disabled
- アイコン対応（leftIcon / rightIcon）

### 2. Input コンポーネント（src/components/ui/Input.tsx）
- タイプ: text, email, password, number, search
- パスワードトグル（キーボード操作可能・aria-pressed 付き）
- ラベル・プレースホルダー・ヒント対応
- エラー状態表示（aria-invalid / aria-describedby）

### 3. Card コンポーネント（src/components/ui/Card.tsx）
- ヘッダー、ボディ、フッター構造（CardHeader / CardBody / CardFooter）
- ホバーエフェクト（scale + shadow）
- クリック可能バリアント（role=button・Enter/Space キーボード対応）

### 4. Modal コンポーネント（src/components/ui/Modal.tsx）
- オーバーレイ（クリックで閉じる）
- tailwindcss-animate アニメーション
- サイズバリエーション（sm / md / lg）
- フォーカストラップ・Escape クローズ・フォーカス復元

### 5. Alert コンポーネント（src/components/ui/Alert.tsx）
- タイプ: info, success, warning, error
- role=status（info/success）/ role=alert（warning/error）+ aria-live 対応
- 閉じるボタン（min 44×44px）・アイコン・左アクセントバー

### 6. Select コンポーネント（src/components/ui/Select.tsx）
- ドロップダウン（absolute 配置バグ修正済み）
- 検索可能オプション（searchable）
- キーボード操作（Arrow / Enter / Escape）

### 7. Textarea コンポーネント（src/components/ui/Textarea.tsx）
- 自動リサイズ（autoResize）
- 文字数カウンター（maxLength）
- resize-none / resize-y 競合バグ修正済み

### 8. Badge コンポーネント（src/components/ui/Badge.tsx）
- カラーバリエーション（default / primary / success / warning / destructive / outline）
- サイズバリエーション（sm / md）
- 削除可能バリアント（p-3/-m-3 で 44px タッチターゲット確保）

### 9. Spinner コンポーネント（src/components/ui/Spinner.tsx）
- サイズバリエーション（sm / md / lg）
- カラーバリエーション（primary / foreground / muted）
- role=status / aria-label / sr-only テキスト

### 10. Tabs コンポーネント（src/components/ui/Tabs.tsx）
- タブナビゲーション（role=tablist / role=tab / aria-selected / aria-controls）
- アクティブ状態・ホバー（hover:bg-fill）
- キーボード操作（ArrowLeft / ArrowRight / Home / End）
- fullWidth バリアント

## 技術要件
- [x] TypeScript 対応（全コンポーネントに Props インターフェース定義）
- [x] CSS 変数使用（bg-background, text-foreground 等。gray-* / 生 HEX 値なし）
- [x] アクセシビリティ対応（ARIA 属性・キーボード操作・44px タッチターゲット）
- [x] レスポンシブデザイン

## 完了条件
- [x] 全コンポーネントの実装完了（10/10）
- [x] TypeScript 型定義完了
- [x] コンポーネントの Props ドキュメント作成（VISUAL_SPEC.md）
- [ ] ストーリーブック（オプション・未着手）

## テスト
- Jest + Testing Library: 220 tests / 220 passing ✅
- 対象: 全 10 コンポーネント（Button・Input・Textarea・Select・Card・Badge・Alert・Modal・Spinner・Tabs）

## ステータス
**✅ 完了**（2026-04-29）
