-- Migration: fix_rls_insert_with_check
-- INSERT ポリシーに WITH CHECK を追加し、自分の user_id 以外への挿入を禁止する
-- 修正前: WITH CHECK なし（他ユーザーの user_id でも挿入可能な状態）
-- 修正後: WITH CHECK (auth.uid() = user_id) で自分のデータのみ挿入可能に

-- tasks
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- documents
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

-- users
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- writing_styles
DROP POLICY IF EXISTS "Users can insert own writing style" ON public.writing_styles;
CREATE POLICY "Users can insert own writing style" ON public.writing_styles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);
