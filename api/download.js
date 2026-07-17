export default async function handler(req, res) {
  // รับ URL ของไฟล์ Vercel Blob ที่ Frontend ส่งมาให้
  const blobUrl = req.query.url; 

  //  เช็คสิทธิ์ความปลอดภัยตรงนี้ (เช่น ตรวจสอบว่าได้ Login แล้วหรือยัง)
   if (!isUserLoggedIn) {
     return res.status(401).send("Unauthorized");
   }

  try {
    // เอากุญแจลับ (Token) ไปไขประตู Vercel เพื่อขอดึงไฟล์
    const response = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`, // 👈 กุญแจลับใน ENV
      },
    });

    if (!response.ok) throw new Error('Failed to fetch from Vercel Blob');

    // ส่งไฟล์กลับไปให้หน้าเว็บของนักศึกษา
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);

    // แปลงไฟล์แล้วส่งกลับ
    const buffer = await response.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));

  } catch (error) {
    res.status(500).send("Error downloading file");
  }
}