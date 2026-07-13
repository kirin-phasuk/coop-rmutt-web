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

  // 2. สร้างข้อมูลใหม่ (CREATE)
  else if (req.method === 'POST') {
    try {
      const data = { ...req.body };
      
      // PostgreSQL ไม่ชอบค่าว่าง ("") ในช่องที่เป็นตัวเลข เราต้องแปลงให้เป็น null ก่อน
      for (const key in data) {
        if (data[key] === "") data[key] = null;
      }

      const keys = Object.keys(data);
      const values = Object.values(data);
      
      // สร้างคำสั่ง SQL อัตโนมัติ: INSERT INTO students ("id", "name", ...) VALUES ($1, $2, ...)
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `INSERT INTO students (${cols}) VALUES (${placeholders}) RETURNING *`;
      const result = await pool.query(query, values);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Database Insert Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // 3. แก้ไขข้อมูล (UPDATE)
  else if (req.method === 'PUT') {
    try {
      const data = { ...req.body };
      const id = data.id;
      delete data.id; // ถอด ID ออกจากการอัปเดต

      for (const key in data) {
        if (data[key] === "") data[key] = null;
      }

      const keys = Object.keys(data);
      const values = Object.values(data);
      
      // สร้างคำสั่ง SQL: UPDATE students SET "status" = $1, "gpax" = $2 WHERE "id" = $3
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      values.push(id); // เอา ID ไปต่อท้าย Array ของ Value
      
      const query = `UPDATE students SET ${setClause} WHERE "id" = $${values.length} RETURNING *`;
      const result = await pool.query(query, values);
      
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // 4. ลบข้อมูล (DELETE)
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await pool.query('DELETE FROM students WHERE "id" = $1', [id]);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // กรณีเรียก Method ผิด
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
