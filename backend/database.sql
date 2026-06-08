-- =========================================
-- 拼豆模板项目数据库初始化脚本
-- =========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS pd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pd;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 模板表
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(100) NOT NULL,
  matrix TEXT NOT NULL,
  colors TEXT NOT NULL,
  pattern TEXT NOT NULL,
  theme VARCHAR(20) DEFAULT 'blue',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- 数据库表说明
-- =========================================
-- users: 用户表
--   - id: 用户ID（自增主键）
--   - username: 用户名（唯一）
--   - email: 邮箱（唯一）
--   - password: 密码（加密存储）
--   - avatar: 头像URL
--   - created_at: 创建时间
--   - updated_at: 更新时间
--
-- templates: 模板表
--   - id: 模板ID（自增主键）
--   - user_id: 用户ID（外键）
--   - title: 模板标题
--   - matrix: 拼豆矩阵数据（JSON格式）
--   - colors: 颜色映射（JSON格式）
--   - pattern: 图案数据
--   - theme: 主题颜色
--   - created_at: 创建时间
--   - updated_at: 更新时间
-- =========================================
