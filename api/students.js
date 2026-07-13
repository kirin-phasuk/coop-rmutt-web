import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // ⚠️ PostgreSQL ต้องใส่ "" ครอบชื่อคอลัมน์ที่มีตัวพิมพ์ใหญ่
      const result = await pool.query('SELECT * FROM students ORDER BY "submittedAt" DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}