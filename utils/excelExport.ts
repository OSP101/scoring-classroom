import * as XLSX from 'xlsx';

interface Student {
  stdid: string;
  name: string;
  image: string;
  point: string | number;
}

interface WorkData {
  idtitelwork: number;
  namework: string;
  length: number;
  maxpoint: number;
  avgpoint: string;
  data: Student[];
}

export const exportToExcel = (data: WorkData[]) => {
  // สร้าง workbook ใหม่
  const workbook = XLSX.utils.book_new();

  data.forEach((work) => {
    // สร้าง worksheet สำหรับแต่ละงาน
    const worksheet = XLSX.utils.json_to_sheet(work.data.map(student => ({
      'Student ID': student.stdid,
      'Name': student.name,
      'Point': student.point
    })));

    // เพิ่มข้อมูลสรุปที่ส่วนบนของ worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [
      [`Work: ${work.namework}`],
      [`Total Students: ${work.length}`],
      [`Max Point: ${work.maxpoint}`],
      [`Average Point: ${work.avgpoint}`],
      [],  // เว้นบรรทัดว่าง
      ['Student ID', 'Name', 'Point']  // หัวข้อคอลัมน์
    ], { origin: 'A1' });

    // เพิ่ม worksheet ลงใน workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, work.namework);
  });

  // แปลง workbook เป็น array buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // สร้าง Blob จาก array buffer
  const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  // ตรวจสอบว่ากำลังรันอยู่ที่ฝั่ง client
  if (typeof window !== 'undefined') {
    const FileSaver = require('file-saver');
    FileSaver.saveAs(excelBlob, 'student_scores.xlsx');
  }
}