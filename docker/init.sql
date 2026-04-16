-- StrangerWorld Database Schema
-- Used for: moderation reports, analytics, banned IPs

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for text search

-- ─── MODERATION ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id   VARCHAR(128) NOT NULL,   -- socket ID (ephemeral)
  reported_id   VARCHAR(128) NOT NULL,
  reason        VARCHAR(100) NOT NULL DEFAULT 'unspecified',
  room_id       UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON reports (created_at DESC);

-- ─── BANNED IPs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banned_ips (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address  INET NOT NULL UNIQUE,
  reason      TEXT,
  banned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,           -- NULL = permanent
  banned_by   VARCHAR(64) DEFAULT 'system'
);

CREATE INDEX ON banned_ips (ip_address);
CREATE INDEX ON banned_ips (expires_at);

-- ─── ANALYTICS (aggregated, no PII) ─────────────────────────────
CREATE TABLE IF NOT EXISTS daily_stats (
  date              DATE PRIMARY KEY,
  peak_online       INT  NOT NULL DEFAULT 0,
  total_connections INT  NOT NULL DEFAULT 0,
  total_messages    BIGINT NOT NULL DEFAULT 0,
  total_files       INT  NOT NULL DEFAULT 0,
  avg_session_secs  INT  NOT NULL DEFAULT 0
);

-- ─── LANGUAGE USAGE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS language_stats (
  language    VARCHAR(64) NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  count       INT NOT NULL DEFAULT 1,
  PRIMARY KEY (language, date)
);

-- Upsert function for language stats
CREATE OR REPLACE FUNCTION increment_language(lang VARCHAR)
RETURNS VOID AS $$
BEGIN
  INSERT INTO language_stats (language, date, count) VALUES (lower(lang), CURRENT_DATE, 1)
  ON CONFLICT (language, date) DO UPDATE SET count = language_stats.count + 1;
END;
$$ LANGUAGE plpgsql;

-- ─── CONTENT FILTER WORDS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blocked_words (
  id      SERIAL PRIMARY KEY,
  word    VARCHAR(128) NOT NULL UNIQUE,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VIEWS ───────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_top_languages AS
SELECT language, SUM(count) AS total
FROM language_stats
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY language
ORDER BY total DESC
LIMIT 20;

CREATE OR REPLACE VIEW v_report_summary AS
SELECT reason, COUNT(*) as count, MAX(created_at) as last_seen
FROM reports
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY reason
ORDER BY count DESC;
