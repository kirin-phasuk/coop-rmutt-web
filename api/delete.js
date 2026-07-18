// ตัวอย่างไฟล์ pages/api/delete.js (Backend Proxy)
import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'File URL is required' });
    }

    // สั่งลบไฟล์ผ่าน Vercel Blob โดยใช้ Token ที่ซ่อนไว้ในฝั่ง Server
    await del(url);
    
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete Proxy Error:', error);
    return res.status(500).json({ message: 'Failed to delete file' });
  }
}