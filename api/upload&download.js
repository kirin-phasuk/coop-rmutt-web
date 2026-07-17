import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  const blobUrl = request.query.url;
  //  🛡️ เช็คสิทธิ์ความปลอดภัยตรงนี้ (เช่น ตรวจสอบว่าได้ Login แล้วหรือยัง)
  if (!isUserLoggedIn) {
     return res.status(401).send("Unauthorized");
  }
  // อนุญาตเฉพาะ Method POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 3. เอากุญแจลับ (Token) ไปไขประตู Vercel เพื่อขอดึงไฟล์
    const response = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`, // 👈 กุญแจลับใน ENV
      },
    });

    if (!response.ok) throw new Error('Failed to fetch from Vercel Blob');

    // 4. ส่งไฟล์กลับไปให้หน้าเว็บของนักศึกษา
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);
    
    // ตั้งค่าให้ดาวน์โหลดไฟล์ทันที (ถ้าอยากให้เปิดในแท็บใหม่ ให้ลบบรรทัดนี้ออก)
    // res.setHeader('Content-Disposition', 'attachment');

    // แปลงไฟล์แล้วส่งกลับ
    const buffer = await response.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));

  } catch (error) {
    res.status(500).send("Error downloading file");
  }
}