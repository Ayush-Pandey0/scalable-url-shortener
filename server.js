import app from './src/app.js';
import dotenv from 'dotenv';
import pool from './src/config/db.js';
import './src/config/redis.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  const connection = await pool.getConnection();
  console.log('✅ MySQL connected successfully');
  connection.release();
} catch (err) {
  console.error('❌ MySQL connection failed:', err.message);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});