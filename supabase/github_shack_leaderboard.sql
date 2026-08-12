create table if not exists public.github_shack_leaderboard (
  username text primary key,
  display_username text not null,
  avatar_url text,
  contributions integer not null default 0,
  commits integer not null default 0,
  pints integer not null default 0,
  tier integer not null default 1,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists github_shack_leaderboard_contributions_idx
  on public.github_shack_leaderboard (contributions desc);

