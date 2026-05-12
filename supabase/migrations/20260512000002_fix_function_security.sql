-- Migration: fix_function_security
-- セキュリティ Advisor 指摘を修正
--
-- 問題1: handle_new_user / update_updated_at_column の search_path が未固定
--        → SET search_path = '' で SQL インジェクションリスクを排除
-- 問題2: handle_new_user が anon/authenticated ロールから直接呼び出せる状態
--        → REVOKE EXECUTE でトリガー経由のみに制限

-- 1. handle_new_user: search_path 固定 + 公開 API からの呼び出し禁止
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, google_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'provider_id'
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    name       = COALESCE(EXCLUDED.name, public.users.name),
    google_id  = COALESCE(EXCLUDED.google_id, public.users.google_id),
    updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- 2. update_updated_at_column: search_path 固定
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
