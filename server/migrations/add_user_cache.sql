-- Migration to add user cache table for efficient Firebase user data caching

CREATE TABLE IF NOT EXISTS user_cache (
    user_id VARCHAR(128) PRIMARY KEY,
    display_name VARCHAR(255),
    photo_url TEXT,
    email VARCHAR(255),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Index for efficient cleanup of old entries
CREATE INDEX IF NOT EXISTS idx_user_cache_updated ON user_cache(last_updated);

-- Index for user_id lookups (already covered by PRIMARY KEY but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_user_cache_user_id ON user_cache(user_id);
