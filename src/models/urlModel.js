import pool from '../config/db.js';

const createUrl = async (originalUrl, shortCode,expiresAt=null) => {
  const [result] = await pool.query(
    'INSERT INTO urls (original_url, short_code,expires_at) VALUES (?, ?,?)',
    [originalUrl, shortCode, expiresAt]
  );
  return result;
};

const findUrlByCode = async (shortCode) => {
  const [rows] = await pool.query(
    'SELECT * FROM urls WHERE short_code = ?',
    [shortCode]
  );
  return rows[0];
};

const incrementClicks = async (shortCode) => {
  await pool.query(
    'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?',
    [shortCode]
  );
};

const getUrlStats = async (shortCode) => {
  const [rows] = await pool.query(
    'SELECT short_code, original_url, clicks, created_at, expires_at FROM urls WHERE short_code = ?',
    [shortCode]
  );
  return rows[0];
};

export { createUrl, findUrlByCode, incrementClicks, getUrlStats };