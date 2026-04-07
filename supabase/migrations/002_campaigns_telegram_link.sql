alter table campaigns
  add column if not exists web_user_id text,
  add column if not exists pending_link boolean default false;

notify pgrst, 'reload schema';
