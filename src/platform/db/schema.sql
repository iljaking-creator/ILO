-- K&I Kundenwerke — canonical schema (source of truth).
-- Apply via Supabase MCP apply_migration, then verify with list_tables + get_advisors.
-- Security model: RLS enabled + default-deny on every table. The backend uses the
-- service-role key (bypasses RLS) and is the only writer. The browser never holds
-- DB credentials. A future tenant-scoped admin UI would add explicit policies.

create extension if not exists pgcrypto;
create extension if not exists vector;

-- Contacts ------------------------------------------------------------------
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  channel_user_id text not null,
  email text,
  name text,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (channel, channel_user_id)
);

-- Conversations -------------------------------------------------------------
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(id) on delete cascade,
  channel text not null,
  status text not null default 'open' check (status in ('open','handed_off','closed')),
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_conversations_contact on conversations(contact_id);
create index if not exists idx_conversations_activity on conversations(last_activity_at);

-- Messages ------------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  tokens int,
  model text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_conversation on messages(conversation_id, created_at);

-- Knowledge base ------------------------------------------------------------
create table if not exists kb_documents (
  id uuid primary key default gen_random_uuid(),
  source_url text not null unique,
  title text,
  lang text not null default 'de',
  content_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists kb_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references kb_documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  source_url text not null,
  embedding vector(1024),
  fts tsvector generated always as (to_tsvector('german', content)) stored,
  created_at timestamptz not null default now()
);
create index if not exists idx_kb_chunks_fts on kb_chunks using gin(fts);
-- ivfflat index for semantic search is added once embeddings are populated:
--   create index idx_kb_chunks_embedding on kb_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Leads & handoffs ----------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  name text, email text, phone text, interest text, notes text,
  created_at timestamptz not null default now()
);

create table if not exists handoffs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open','assigned','closed')),
  assigned_to text,
  created_at timestamptz not null default now()
);

-- Append-only audit ---------------------------------------------------------
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  actor text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- RLS: enable + default-deny everywhere. Service-role bypasses RLS.
alter table contacts       enable row level security;
alter table conversations  enable row level security;
alter table messages       enable row level security;
alter table kb_documents   enable row level security;
alter table kb_chunks      enable row level security;
alter table leads          enable row level security;
alter table handoffs       enable row level security;
alter table audit_log      enable row level security;

-- No policies are created → no role except service-role can read/write.

-- Lexical KB search (German FTS). Hybrid pgvector search is layered on in M3.
create or replace function kb_search(q text, match_count int default 5)
returns table (id uuid, content text, source_url text, score real)
language sql stable
as $$
  select c.id, c.content, c.source_url,
         ts_rank(c.fts, websearch_to_tsquery('german', q)) as score
  from kb_chunks c
  where c.fts @@ websearch_to_tsquery('german', q)
  order by score desc
  limit match_count
$$;
