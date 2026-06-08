const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未授权'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'token无效或已过期'
    });
  }
};

router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { title, matrix, colors, pattern, theme } = req.body;

    if (!title || !matrix || !colors || !pattern) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    const [result] = await connection.execute(
      'INSERT INTO templates (user_id, title, matrix, colors, pattern, theme) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, title, JSON.stringify(matrix), JSON.stringify(colors), JSON.stringify(pattern), theme || 'blue']
    );

    res.status(201).json({
      success: true,
      message: '保存成功',
      data: {
        id: result.insertId,
        title,
        theme: theme || 'blue'
      }
    });
  } catch (error) {
    console.error('保存模板错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM templates WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );

    const templates = rows.map(row => ({
      id: row.id,
      title: row.title,
      matrix: JSON.parse(row.matrix),
      colors: JSON.parse(row.colors),
      pattern: JSON.parse(row.pattern),
      theme: row.theme,
      createdAt: row.created_at
    }));

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('获取模板列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    const [result] = await connection.execute(
      'DELETE FROM templates WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '模板不存在或无权限'
      });
    }

    res.status(200).json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除模板错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.get('/public', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM templates ORDER BY created_at DESC LIMIT 10'
    );

    const templates = rows.map(row => ({
      id: row.id,
      title: row.title,
      pattern: JSON.parse(row.pattern),
      theme: row.theme,
      createdAt: row.created_at
    }));

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('获取公共模板错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

module.exports = router;