import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      // ==========================================
      // 1. เมนูด้านข้าง (Sidebar) & Header
      // ==========================================
      "app_title": "RMUTT CWIE International",
      "current_user": "ผู้ใช้งานปัจจุบัน",
      "menu_dashboard": "หน้าหลัก",
      "menu_spreadsheet": "ตารางข้อมูล",
      "menu_new_reg": "ลงทะเบียนใหม่",
      "menu_approvals": "ระบบอนุมัติ",
      "menu_users": "จัดการผู้ใช้งาน",
      "menu_guide": "คู่มือการใช้งาน",
      "menu_logout": "ออกจากระบบ",

      "header_dashboard": "ภาพรวมหน้าหลัก",
      "header_spreadsheet": "ตารางข้อมูล : ระเบียนนักศึกษา",
      "header_entry": "แบบฟอร์มลงทะเบียนนักศึกษา",
      "header_approval": "ระบบจัดการการอนุมัติ",
      "header_users": "จัดการบัญชีผู้ใช้",
      "header_edit": "แก้ไขข้อมูลนักศึกษา",
      "header_guide": "คู่มือการใช้งาน",

      // ==========================================
      // 2. หน้า Dashboard (สถิติและแผนที่)
      // ==========================================
      "stat_total": "ข้อมูลทั้งหมด",
      "stat_submitted": "ยื่นเอกสารแล้ว",
      "stat_in_prog_fac": "รอคณะพิจารณา",
      "stat_app_fac": "คณะอนุมัติแล้ว",
      "stat_hold_fac": "คณะระงับการพิจารณา",
      "stat_rej_fac": "คณะปฏิเสธ",
      "stat_in_prog_uni": "รอมหาวิทยาลัยพิจารณา",
      "stat_app_uni": "มหาวิทยาลัยอนุมัติแล้ว",
      "stat_hold_uni": "มหาวิทยาลัยระงับการพิจารณา",
      "stat_rej_uni": "มหาวิทยาลัยปฏิเสธ",
      "stat_complete": "เสร็จสมบูรณ์",

      "map_title": "แผนที่การกระจายตัวนักศึกษาสหกิจศึกษา",
      "map_view_all": "ดูทั้งหมด",
      "map_recent_entries": "รายการล่าสุด",
      "map_students_in": "นักศึกษาใน",
      "map_no_students": "ไม่มีนักศึกษาในภูมิภาคนี้",

      // ==========================================
      // 3. ฟอร์มกรอกข้อมูล (Data Entry / Edit)
      // ==========================================
      "form_create_title": "สร้างข้อมูลใหม่",
      "form_edit_title": "แก้ไขข้อมูลนักศึกษา",
      "form_profile_pic": "รูปถ่ายหน้าตรง (Profile Picture)",
      "form_pic_desc": "แนะนำ: .jpg, .png (สูงสุด 5MB) ระบบจะบีบอัดภาพอัตโนมัติ",
      
      "form_sec_student": "ข้อมูลนักศึกษา",
      "form_student_id": "รหัสนักศึกษา (Username)",
      "form_prefix": "คำนำหน้า",
      "form_fname": "ชื่อจริง",
      "form_lname": "นามสกุล",
      "form_gpax": "เกรดเฉลี่ยสะสม (GPAX)",
      "form_eng_test": "คะแนนทดสอบภาษาอังกฤษ (เช่น TOEIC)",
      "form_faculty": "คณะ",

      "form_sec_company": "ข้อมูลสถานประกอบการ",
      "form_company_name": "ชื่อสถานประกอบการ",
      "form_country": "ประเทศ",
      "form_position": "ตำแหน่งงาน",
      "form_year": "ปีการศึกษา",
      "form_semester": "ภาคเรียน",

      "form_sec_schedule": "กำหนดการฝึกงาน",
      "form_dep_date": "วันเดินทางไป",
      "form_start_date": "วันเริ่มฝึกงาน",
      "form_end_date": "วันสิ้นสุดฝึกงาน",
      "form_return_date": "วันเดินทางกลับ",

      "form_sec_doc": "เอกสารขอรับทุนสนับสนุน",
      "form_doc_fac": "1. คำขอทุนระดับคณะ",
      "form_doc_uni": "2. คำขอทุนระดับมหาวิทยาลัย",
      "form_attach_pdf": "แนบลิงก์ไฟล์ (URL)",
      "form_req_amount": "จำนวนเงินที่ขอ (บาท)",
      "form_student_notice": "นักศึกษาไม่สามารถอัปโหลดไฟล์ขอทุนเองได้ โปรดติดต่อผู้ประสานงานคณะ",

      "form_sec_project": "การส่งและประเมินโครงงาน",
      "form_proj_name": "ชื่อโครงงาน",
      "form_proj_desc": "รายละเอียดโครงงาน",
      "form_proj_drive": "ลิงก์โครงงาน Google Drive",
      "form_report_drive": "ลิงก์รายงาน Google Drive",

      "btn_save_submit": "บันทึกและส่งข้อมูล",
      "btn_cancel": "ยกเลิก",
      "btn_save_project": "บันทึกและส่งโครงงาน",
      "btn_update": "อัปเดตข้อมูล",

      // ==========================================
      // 4. หน้าตารางข้อมูล (Spreadsheet)
      // ==========================================
      "list_total_records": "จำนวนทั้งหมด",
      "btn_export_excel": "ส่งออกเป็น Excel",
      "btn_export_pdf": "ส่งออกเป็น PDF",
      "search_placeholder": "ค้นหาด้วยชื่อ, สถานประกอบการ, ประเทศ, ตำแหน่ง...",
      "filter_all_status": "สถานะทั้งหมด",
      "filter_all_years": "ปีการศึกษาทั้งหมด",
      
      "table_status": "สถานะ",
      "table_student_id": "รหัสนักศึกษา",
      "table_prefix": "คำนำหน้า",
      "table_fname": "ชื่อจริง",
      "table_lname": "นามสกุล",
      "table_gpax": "GPAX",
      "table_eng_test": "คะแนนภาษา",
      "table_org": "องค์กร",
      "table_country": "ประเทศ",
      "table_position": "ตำแหน่ง",
      "table_year": "ปีการศึกษา",
      "table_sem": "เทอม",
      "table_fac_fund": "ทุนคณะ (บาท)",
      "table_uni_fund": "ทุนมหาลัย (บาท)",
      "table_document": "เอกสาร",
      "table_action": "จัดการ",
      "table_no_data": "ไม่พบข้อมูลนักศึกษาที่ตรงกับเงื่อนไข",

      // ==========================================
      // 5. ระบบอนุมัติ (Approval Queue)
      // ==========================================
      "appr_queue": "คิวรออนุมัติ",
      "filter_all": "ทั้งหมด",
      "filter_active": "กำลังดำเนินการ",
      "filter_hold": "ระงับไว้",
      "filter_resolved": "เสร็จสิ้น",
      "appr_org": "องค์กร:",
      "appr_position": "ตำแหน่ง:",
      "appr_academic": "ประวัติการศึกษา:",
      "appr_duration": "ระยะเวลา:",
      "appr_fac_fund": "ทุนคณะ:",
      "appr_uni_fund": "ทุนมหาลัย:",
      "btn_revert": "ย้อนกลับเป็นสถานะเริ่มต้น",
      "appr_complete_msg": "ดำเนินการครบทุกขั้นตอนแล้ว",

      // ==========================================
      // 6. จัดการผู้ใช้งาน (User Management)
      // ==========================================
      "user_add_title": "เพิ่มบัญชีผู้ใช้ใหม่",
      "user_edit_title": "แก้ไขบัญชี :",
      "user_username": "ชื่อผู้ใช้ / รหัสนักศึกษา",
      "user_password": "รหัสผ่าน",
      "user_fullname": "ชื่อ-นามสกุล",
      "user_role": "บทบาทผู้ใช้",
      "user_faculty": "คณะ",
      "btn_add_user": "เพิ่มผู้ใช้",
      "user_list_title": "ผู้ใช้งานในระบบ",
      "search_user": "ค้นหาด้วยชื่อ, ชื่อผู้ใช้, บทบาท...",
      "btn_edit": "แก้ไข",
      "btn_revoke": "เพิกถอนสิทธิ์",

      // ==========================================
      // 7. หน้า Login
      // ==========================================
      "login_desc": "เข้าสู่ระบบเพื่อจัดการข้อมูลนักศึกษา",
      "login_username": "ชื่อผู้ใช้งาน",
      "login_password": "รหัสผ่าน",
      "btn_login": "เข้าสู่ระบบ"
    }
  },
  en: {
    translation: {
      // ==========================================
      // 1. Sidebar & Header
      // ==========================================
      "app_title": "RMUTT CWIE International",
      "current_user": "Current User",
      "menu_dashboard": "Dashboard",
      "menu_spreadsheet": "Spreadsheet",
      "menu_new_reg": "New Registration",
      "menu_approvals": "Approvals",
      "menu_users": "User Management",
      "menu_guide": "User Guide",
      "menu_logout": "Log Out",

      "header_dashboard": "Dashboard Overview",
      "header_spreadsheet": "Spreadsheet : Student Records",
      "header_entry": "Student Registration Form",
      "header_approval": "Approval Management System",
      "header_users": "User Account Management",
      "header_edit": "Edit Student Record",
      "header_guide": "User Guide",

      // ==========================================
      // 2. Dashboard 
      // ==========================================
      "stat_total": "Total Records",
      "stat_submitted": "Submitted",
      "stat_in_prog_fac": "In Progress Faculty",
      "stat_app_fac": "Approved Faculty",
      "stat_hold_fac": "Hold On Faculty",
      "stat_rej_fac": "Rejected Faculty",
      "stat_in_prog_uni": "In Progress University",
      "stat_app_uni": "Approved University",
      "stat_hold_uni": "Hold On University",
      "stat_rej_uni": "Rejected University",
      "stat_complete": "Complete",

      "map_title": "Cooperative Education Deployment Map",
      "map_view_all": "View All",
      "map_recent_entries": "Recent Entries",
      "map_students_in": "Students in",
      "map_no_students": "No students deployed in this region.",

      // ==========================================
      // 3. Data Entry / Edit Form
      // ==========================================
      "form_create_title": "Create New Record",
      "form_edit_title": "Edit Student Record",
      "form_profile_pic": "Profile Picture",
      "form_pic_desc": "Recommended: .jpg, .png (Max 5MB). The system will automatically compress the image.",
      
      "form_sec_student": "Student Information",
      "form_student_id": "Student ID (Username)",
      "form_prefix": "Prefix",
      "form_fname": "First Name",
      "form_lname": "Last Name",
      "form_gpax": "GPAX",
      "form_eng_test": "English Proficiency Test",
      "form_faculty": "Faculty",

      "form_sec_company": "Host Organization Information",
      "form_company_name": "Organization Name",
      "form_country": "Country",
      "form_position": "Position / Job Title",
      "form_year": "Academic Year",
      "form_semester": "Semester",

      "form_sec_schedule": "Internship Schedule",
      "form_dep_date": "Departure Date",
      "form_start_date": "Internship Start Date",
      "form_end_date": "Internship End Date",
      "form_return_date": "Return Date",

      "form_sec_doc": "Scholarship Documents Request",
      "form_doc_fac": "1. Faculty Scholarship Request",
      "form_doc_uni": "2. University Scholarship Request",
      "form_attach_pdf": "Document Link (URL)",
      "form_req_amount": "Requested Amount (THB)",
      "form_student_notice": "Students cannot upload scholarship files directly. Please contact your Faculty Coordinator.",

      "form_sec_project": "Project Submission & Evaluation",
      "form_proj_name": "Project Name",
      "form_proj_desc": "Project Description",
      "form_proj_drive": "Project GoogleDrive Link (Optional)",
      "form_report_drive": "Report GoogleDrive Link (Optional)",

      "btn_save_submit": "Save and Submit",
      "btn_cancel": "Cancel",
      "btn_save_project": "Save & Submit Project",
      "btn_update": "Update Record",

      // ==========================================
      // 4. Spreadsheet (List View)
      // ==========================================
      "list_total_records": "Total records",
      "btn_export_excel": "Export to Excel",
      "btn_export_pdf": "Export to PDF",
      "search_placeholder": "Search by name, organization, country, position...",
      "filter_all_status": "All Statuses",
      "filter_all_years": "All Academic Years",
      
      "table_status": "Status",
      "table_student_id": "Student ID",
      "table_prefix": "Prefix",
      "table_fname": "First Name",
      "table_lname": "Last Name",
      "table_gpax": "GPAX",
      "table_eng_test": "English Test",
      "table_org": "Organization",
      "table_country": "Country",
      "table_position": "Position",
      "table_year": "Academic Year",
      "table_sem": "Semester",
      "table_fac_fund": "Faculty Scholarship (THB)",
      "table_uni_fund": "University Scholarship (THB)",
      "table_document": "Document",
      "table_action": "Actions",
      "table_no_data": "No student records found matching your criteria.",

      // ==========================================
      // 5. Approval Queue
      // ==========================================
      "appr_queue": "Approval Queue",
      "filter_all": "All",
      "filter_active": "Active",
      "filter_hold": "On Hold",
      "filter_resolved": "Resolved",
      "appr_org": "Organization:",
      "appr_position": "Position:",
      "appr_academic": "Academic Record:",
      "appr_duration": "Duration:",
      "appr_fac_fund": "Faculty Scholarship:",
      "appr_uni_fund": "University Scholarship:",
      "btn_revert": "Revert to Submitted",
      "appr_complete_msg": "All Steps Completed",

      // ==========================================
      // 6. User Management
      // ==========================================
      "user_add_title": "Add New Account",
      "user_edit_title": "Edit Account :",
      "user_username": "Username / StudentID",
      "user_password": "Password",
      "user_fullname": "Full Name",
      "user_role": "Account Role",
      "user_faculty": "Faculty",
      "btn_add_user": "Add User",
      "user_list_title": "Registered Users",
      "search_user": "Search by name, username, role...",
      "btn_edit": "Edit",
      "btn_revoke": "Revoke",

      // ==========================================
      // 7. Login Screen
      // ==========================================
      "login_desc": "Login in to manage student records",
      "login_username": "USERNAME",
      "login_password": "PASSWORD",
      "btn_login": "LOGIN"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "th",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;