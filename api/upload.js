import { put } from '@vercel/blob';

// ปิดการอ่าน Body อัตโนมัติ เพื่อให้รับไฟล์เป็นก้อนดิบๆ ได้
export const config = {
  api: { bodyParser: false },
};

export default async function handler(request, response) {
  // ดึงชื่อไฟล์จาก URL (เช่น /api/upload?filename=test.pdf)
  const filename = request.query.filename || 'default_name.pdf';

  try {
    // โยนก้อนไฟล์ขึ้น Vercel Blob แบบ Public
    const blob = await put(filename, request, {
      access: 'public', // 👈 สำคัญ: ให้ทุกคนเข้าถึงได้
    });

    // ส่งข้อมูลที่ Vercel ตอบกลับมา (รวมถึง URL) ไปให้หน้าเว็บ
    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}