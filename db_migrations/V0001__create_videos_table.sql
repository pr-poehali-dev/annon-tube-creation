-- Создание таблицы для хранения видео
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    author_name VARCHAR(255) NOT NULL,
    author_avatar VARCHAR(500),
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    video_type VARCHAR(20) DEFAULT 'regular',
    category VARCHAR(50) DEFAULT 'entertainment',
    duration INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    is_nsfw BOOLEAN DEFAULT false,
    is_nsfl BOOLEAN DEFAULT false,
    show_in_newsfeed BOOLEAN DEFAULT true,
    allow_comments BOOLEAN DEFAULT true,
    video_format VARCHAR(20) DEFAULT 'hd',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_videos_video_type ON videos(video_type);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_uploaded_at ON videos(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);