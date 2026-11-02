-- Run in the Supabase SQL editor (or `supabase db push`).
-- RLS is on with no policies: only the server's service-role key can read or write.

create table checks (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  domain       text not null,
  category     text not null,
  city         text not null,
  status       text not null default 'created'
               check (status in ('created', 'running', 'done', 'failed')),
  run_count    int  not null default 0,
  ip_hash      text not null,
  score        int,
  mentions     int,
  total_answers int,
  result       jsonb,
  utm          jsonb,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);
create index checks_ip_idx on checks (ip_hash, created_at);
create index checks_domain_idx on checks (domain, created_at);

create table answers (
  id          uuid primary key default gen_random_uuid(),
  check_id    uuid not null references checks (id) on delete cascade,
  engine      text not null,
  question    text not null,
  raw         text,            -- null when the engine call failed
  mentioned   boolean not null default false,
  position    int,
  competitors jsonb not null default '[]',
  cited_urls  jsonb not null default '[]',
  created_at  timestamptz not null default now()
);
create index answers_check_idx on answers (check_id);

create table leads (
  id             uuid primary key default gen_random_uuid(),
  check_id       uuid not null unique references checks (id) on delete cascade,
  name           text not null,
  mobile         text not null,   -- 10 digits
  email          text not null,
  consent_at     timestamptz not null,
  otp_hash       text,
  otp_expires_at timestamptz,
  otp_attempts   int not null default 0,
  otp_sends      int not null default 0,
  otp_sent_at    timestamptz,
  verified_at    timestamptz,
  utm            jsonb,
  created_at     timestamptz not null default now()
);
create index leads_mobile_idx on leads (mobile, verified_at);

alter table checks  enable row level security;
alter table answers enable row level security;
alter table leads   enable row level security;
