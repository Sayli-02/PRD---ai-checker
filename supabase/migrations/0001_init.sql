-- Run in the Supabase SQL editor (or `supabase db push`).
-- RLS is on with no policies: only the server's service-role key can read or write. The browser never talks to Supabase.

create table checks (
  id            uuid primary key default gen_random_uuid(),
  url           text not null,
  domain        text not null,
  category      text not null,
  city          text not null,
  status        text not null default 'running' check (status in ('running', 'done', 'failed')),
  run_count     int  not null default 1,        -- the first run plus retries
  ip_hash       text not null,
  score         int,
  mentioned_count int,
  result_json   jsonb,
  utm_json      jsonb,
  created_at    timestamptz not null default now(),
  started_at    timestamptz not null default now(),
  completed_at  timestamptz
);
create index checks_ip_idx on checks (ip_hash, created_at);
create index checks_domain_idx on checks (domain, created_at);

-- One row per engine call. answers_done is derived from the row count, so there is no counter to drift.
create table check_answers (
  id              uuid primary key default gen_random_uuid(),
  check_id        uuid not null references checks (id) on delete cascade,
  engine          text not null check (engine in ('openai', 'gemini', 'perplexity')),
  question        text not null,
  answer_text     text not null default '',
  citations_json  jsonb not null default '[]',  -- every URL found in the answer or returned by the engine
  status          text not null check (status in ('ok', 'timeout', 'error')),
  latency_ms      int not null default 0,
  mentioned       boolean not null default false,
  position        int,
  competitors_json jsonb not null default '[]',
  created_at      timestamptz not null default now(),
  unique (check_id, engine, question)
);
create index check_answers_check_idx on check_answers (check_id);

create table leads (
  id                  uuid primary key default gen_random_uuid(),
  check_id            uuid not null unique references checks (id) on delete cascade,
  name                text not null,
  mobile              text not null,            -- E.164, e.g. +919876543210
  email               text not null,
  consent_at          timestamptz not null,
  consent_text        text not null,            -- the exact wording the visitor agreed to
  otp_hash            text,                     -- HMAC, never the code itself
  otp_expires_at      timestamptz,
  otp_attempts        int not null default 0,
  otp_sends           int not null default 0,
  otp_sent_at         timestamptz,
  mobile_verified_at  timestamptz,
  utm_json            jsonb,
  user_agent          text,
  fbp                 text,
  fbc                 text,
  event_id            text,                     -- shared by the browser Pixel and the Conversions API
  webhook_status      text check (webhook_status in ('sending', 'delivered', 'failed')),
  webhook_attempts    int not null default 0,
  webhook_error       text,
  webhook_delivered_at timestamptz,
  created_at          timestamptz not null default now()
);
create index leads_mobile_idx on leads (mobile, mobile_verified_at);

alter table checks        enable row level security;
alter table check_answers enable row level security;
alter table leads         enable row level security;

-- One verified check per mobile and per domain every 30 days. The API checks first for friendly errors;
-- this trigger is the backstop, so two simultaneous verifications cannot both win.
create function enforce_30_day_lock() returns trigger language plpgsql as $$
declare
  dom text;
begin
  if new.mobile_verified_at is null or (tg_op = 'UPDATE' and old.mobile_verified_at is not null) then
    return new;
  end if;
  select domain into dom from checks where id = new.check_id;
  perform pg_advisory_xact_lock(hashtextextended('mobile:' || new.mobile, 0));
  perform pg_advisory_xact_lock(hashtextextended('domain:' || dom, 0));
  if exists (
    select 1 from leads l
    where l.mobile = new.mobile and l.id <> new.id and l.mobile_verified_at > now() - interval '30 days'
  ) then
    raise exception 'mobile locked' using errcode = '23505';
  end if;
  if exists (
    select 1 from leads l join checks c on c.id = l.check_id
    where c.domain = dom and l.id <> new.id and l.mobile_verified_at > now() - interval '30 days'
  ) then
    raise exception 'domain locked' using errcode = '23505';
  end if;
  return new;
end $$;

create trigger leads_30_day_lock before insert or update on leads
  for each row execute function enforce_30_day_lock();
