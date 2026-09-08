-- DevHub Supabase 数据库初始化
-- 在 Supabase Dashboard → SQL Editor 中执行

-- 1. 对话表
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '新对话',
  model TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_code TEXT,
  token_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 用户偏好表
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  default_provider TEXT DEFAULT 'anthropic',
  default_model TEXT DEFAULT 'claude-sonnet-4-20250514',
  default_temperature REAL DEFAULT 0.7,
  default_max_tokens INTEGER DEFAULT 4096,
  default_system_prompt TEXT DEFAULT '你是一个专业的开发者助手，擅长编程、调试和技术问题解答。',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- 5. RLS (Row Level Security) — 确保用户只能访问自己的数据
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 注意：RLS policy 需要使用 Supabase Auth 的 uid()
-- 因为我们使用 Clerk 认证，服务端通过 service_role key 绕过 RLS
-- 以下 policy 仅用于 Supabase 客户端直接访问（如果需要）
-- 服务端 API 使用 service_role key，不受 RLS 限制
