import * as XLSX from 'xlsx';

interface StudentData {
    stdid: string;
    name: string;
    point: string;
}

interface LabData {
    idtitelwork: number;
    namework: string;
    maxpoint: number;
    data: StudentData[];
}

export const exportToExcel = (labsData: LabData[], idcouesr: any) => {
    if (!labsData || labsData.length === 0) {
        alert("ไม่มีข้อมูลที่จะ export");
        return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // กำหนดความกว้างของคอลัมน์
    const columnWidths = [
        { wch: 15 },  // รหัสนักศึกษา
        { wch: 30 },  // ชื่อ - นามสกุล
        { wch: 15 },  // คะแนนพิเศษ
    ];
    labsData.filter(lab => lab.idtitelwork !== 0).forEach(() => {
        columnWidths.push({ wch: 15 });  // คะแนนแต่ละแลป
    });
    columnWidths.push({ wch: 15 });  // รวมคะแนน
    worksheet['!cols'] = columnWidths;

    // สร้างส่วนหัวของตาราง
    const headers = ['รหัสนักศึกษา', 'ชื่อ - นามสกุล', 'คะแนนพิเศษ'];
    labsData.filter(lab => lab.idtitelwork !== 0).forEach(lab => headers.push(lab.namework));
    headers.push('รวมคะแนน');
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    // จัดรูปแบบส่วนหัว
    const headerStyle = {
        font: { bold: true, name: 'TH Sarabun New', size: 14 },
        fill: { fgColor: { rgb: "FFFF00" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
        }
    };
    for (let i = 0; i < headers.length; i++) {
        const cell = XLSX.utils.encode_cell({ r: 0, c: i });
        if (worksheet[cell]) {
            worksheet[cell].s = headerStyle;
        } else {
            worksheet[cell] = { v: headers[i], t: 's', s: headerStyle };
        }
    }

    // รวบรวมข้อมูลนักเรียนทั้งหมด
    const allStudents = labsData[1] ? labsData[1].data.map(student => ({
        ...student,
        points: {} as { [key: string]: string }
    })) : [];

    // เพิ่มคะแนนแต่ละแลปให้กับนักเรียน
    labsData.forEach(lab => {
        lab.data.forEach(studentData => {
            const student = allStudents.find(s => s.stdid === studentData.stdid);
            if (student) {
                student.points[lab.namework] = studentData.point;
            }
        });
    });

    // เพิ่มข้อมูลนักเรียนแต่ละคน
    allStudents.forEach((student, index) => {
        const row = [
            student.stdid,
            student.name,
            student.points['คะแนนพิเศษ'] || '0'
        ];

        let totalPoints = 0; // เริ่มต้นที่ 0 โดยไม่รวมคะแนนพิเศษ
        labsData.filter(lab => lab.idtitelwork !== 0).forEach(lab => {
            const point = student.points[lab.namework] || '0';
            row.push(point);
            totalPoints += Number(point);
        });

        row.push(totalPoints.toString()); // คะแนนรวมที่ไม่รวมคะแนนพิเศษ
        XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: `A${index + 2}` });
    });

    // จัดรูปแบบข้อมูลนักเรียน
    const dataStyle = {
        font: { name: 'TH Sarabun New', size: 12 },
        alignment: { vertical: "center" },
        border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
        }
    };
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let R = 1; R <= range.e.r; R++) {
        for (let C = 0; C <= range.e.c; C++) {
            const cell = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cell]) continue;
            worksheet[cell].s = dataStyle;
            if (C > 1) {  // ตั้งแต่คอลัมน์คะแนนพิเศษเป็นต้นไป
                worksheet[cell].s = { ...dataStyle, alignment: { ...dataStyle.alignment, horizontal: "center" } };
            }
        }
    }

    // เพิ่มแถวคะแนนเฉลี่ยของชั้นเรียน
    const avgRow = ['คะแนนเฉลี่ยของชั้นเรียน', '', ''];
    let totalAvg = 0;
    labsData.filter(lab => lab.idtitelwork !== 0).forEach(lab => {
        if (lab.data && lab.data.length > 0) {
            const avg = lab.data.reduce((sum, student) => sum + Number(student.point || 0), 0) / lab.data.length;
            avgRow.push(avg.toFixed(2));
            totalAvg += avg;
        } else {
            avgRow.push('0.00');
        }
    });
    avgRow.push(totalAvg.toFixed(2)); // คะแนนเฉลี่ยรวมที่ไม่รวมคะแนนพิเศษ
    XLSX.utils.sheet_add_aoa(worksheet, [avgRow], { origin: `A${allStudents.length + 2}` });

    // จัดรูปแบบแถวคะแนนเฉลี่ย
    const avgStyle = {
        font: { bold: true, name: 'TH Sarabun New', size: 12 },
        fill: { fgColor: { rgb: "E0E0E0" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
        }
    };
    const lastRow = allStudents.length + 2;
    for (let i = 0; i < headers.length; i++) {
        const cell = XLSX.utils.encode_cell({ r: lastRow - 1, c: i });
        if (worksheet[cell]) {
            worksheet[cell].s = avgStyle;
        } else {
            worksheet[cell] = { v: avgRow[i] || '', t: 's', s: avgStyle };
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'คะแนนนักเรียน');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    if (typeof window !== 'undefined') {
        const FileSaver = require('file-saver');
        FileSaver.saveAs(excelBlob, `${idcouesr}_scores.xlsx`);
    }
}