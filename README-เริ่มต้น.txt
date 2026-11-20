โลกของคุณไข่ — รุ่นต้นแบบ v1

สิ่งที่มี: เกาะทุ่งหญ้า บ้าน แมวสองตัว / เช้า-เย็น-กลางคืน / ฝนภาพ / เสียงสังเคราะห์ลม ฝน คลื่น นก / ลากย้ายของตกแต่ง / จำค่าบนเครื่อง / PWA

วิธีง่ายที่สุด (ฟรี):
1. แตกไฟล์ zip
2. สร้าง repository ใหม่บน GitHub ชื่อ khunkhai-world (เลือก Public)
3. Upload files: อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์ khunkhai-world (รวม icons)
4. Settings > Pages > Build and deployment > Deploy from a branch > main / (root) > Save
5. เว็บไซต์จะอยู่ที่ https://USERNAME.github.io/khunkhai-world/ (เปลี่ยน USERNAME เป็นชื่อ GitHub ของตน)
6. เปิดเว็บด้วย Safari บน iPhone > Share > Add to Home Screen หรือ Chrome/Edge บนอุปกรณ์ที่รองรับ > Install app

ทดลองบนคอมพิวเตอร์ก่อน: เปิด terminal ในโฟลเดอร์ แล้วรัน python3 -m http.server 8000 จากนั้นเปิด http://localhost:8000

หมายเหตุ: การดับจอแล้วเล่นเสียงต่อไม่รับประกันในทุกมือถือ เสียงในรุ่นนี้สังเคราะห์จาก Web Audio เพื่อให้ทดลองระบบฟรี และเสียงนกร้องเป็นเสียงโทน noise เบื้องต้น ยังไม่สมจริงเท่าไฟล์บันทึกเสียงธรรมชาติจริง
