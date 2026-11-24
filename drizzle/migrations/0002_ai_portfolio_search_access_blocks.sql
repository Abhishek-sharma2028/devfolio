CREATE TABLE public.ai_portfolio_search_blocks (
 user_id uuid PRIMARY KEY,
 message text NOT NULL,
 status integer NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.ai_portfolio_search_blocks TO authenticated;
GRANT ALL ON public.ai_portfolio_search_blocks TO service_role;
ALTER TABLE public.ai_portfolio_search_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read search access blocks" ON public.ai_portfolio_search_blocks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners store search access blocks" ON public.ai_portfolio_search_blocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update search access blocks" ON public.ai_portfolio_search_blocks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);