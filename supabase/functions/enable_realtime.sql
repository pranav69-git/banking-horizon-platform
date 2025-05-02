
-- Enable REPLICA IDENTITY FULL for the transactions table to ensure complete row data is captured
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

-- Add the transactions table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
