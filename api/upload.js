import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  // อนุญาตเฉพาะ Method POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // ดึงชื่อไฟล์ที่แนบมากับ URL
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');

    if (!filename) {
      return response.status(400).json({ message: 'Filename is required' });
    }

    // โยนไฟล์ (request body) ขึ้น Vercel Blob และตั้งให้เป็นสาธารณะ (เปิดดูได้)
    const blob = await put(filename, request, {
      access: 'public',
    });

    // ส่ง URL ของไฟล์ที่อัปโหลดเสร็จแล้วกลับไปให้ React
    return response.status(200).json(blob);
    
  } catch (error) {
    console.error("Upload Error:", error);
    return response.status(500).json({ error: error.message });
  }
}