import React, { useState, useEffect } from 'react'
import { Spinner, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Snippet, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Avatar, Chip, Tabs, Tab, Textarea } from "@heroui/react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });



export default function PersonTab(idcouesr: any) {

    interface Persons {
        id: number,
        stdid: string,
        idcourse: string,
        name: string,
        email: string,
        section: number,
        image: string,
        track: string,
        type: number
    }

    enum LoadingState {
        Loading = "loading",
        Error = "error",
        Idle = "idle"
    }

    const [dataTeacher, setDataTeacher] = useState<Persons[]>([]);
    const [dataStudent, setDataStudent] = useState<Persons[]>([]);
    const [statusLoadTeach, setStatusLoadTeach] = useState(false);
    const [statusLoadStudent, setStatusLoadStudent] = useState(false);

    // Modal states
    const { isOpen: isAddStudentOpen, onOpen: onAddStudentOpen, onOpenChange: onAddStudentOpenChange } = useDisclosure();
    const { isOpen: isAddTeacherOpen, onOpen: onAddTeacherOpen, onOpenChange: onAddTeacherOpenChange } = useDisclosure();

    // Teacher search states
    const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
    const [teacherSearchResults, setTeacherSearchResults] = useState<any[]>([]);
    const [isSearchingTeachers, setIsSearchingTeachers] = useState(false);
    const [isAddingTeacher, setIsAddingTeacher] = useState(false);

    // Bulk enroll states
    const [bulkStudentData, setBulkStudentData] = useState("");
    const [bulkStudentResults, setBulkStudentResults] = useState<any[]>([]);
    const [isProcessingBulk, setIsProcessingBulk] = useState(false);
    const [isBulkEnrolling, setIsBulkEnrolling] = useState(false);
    const [bulkEnrollProgress, setBulkEnrollProgress] = useState<{ [key: string]: 'pending' | 'success' | 'error' }>({});

    useEffect(() => {
        if (idcouesr.idcouesr) {
            getDataTeacher();
            getDataStudent();
        }
    }, []);

    const getDataTeacher = async () => {
        try {

            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const responseone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enllo/teacher/${idcouesr.idcouesr}`, {
                method: 'GET',
                headers: headers
            });

            // console.log(responseone.data);
            const dataCourses = await responseone.json();
            setDataTeacher(dataCourses);
            setStatusLoadTeach(true);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const getDataStudent = async () => {
        try {

            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const responseone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enllo/person/${idcouesr.idcouesr}`, {
                method: 'GET',
                headers: headers
            });

            // console.log(responseone.data);
            const dataCourses = await responseone.json();
            setDataStudent(dataCourses);
            setStatusLoadStudent(true);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    // Search and add teachers
    const handleSearchTeachers = async (search: string) => {
        if (!idcouesr.idcouesr || !search.trim()) {
            setTeacherSearchResults([]);
            return;
        }

        setIsSearchingTeachers(true);
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${idcouesr.idcouesr}/add-teacher?search=${encodeURIComponent(search)}`, {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to search teachers');
            setTeacherSearchResults(data);
        } catch (error) {
            console.error("Failed to search teachers", error);
            toast.error("Failed to search teachers.");
            setTeacherSearchResults([]);
        } finally {
            setIsSearchingTeachers(false);
        }
    };

    const handleAddTeacher = async (teacherId: string) => {
        if (!idcouesr.idcouesr) return;

        setIsAddingTeacher(true);
        try {
            const res = await fetch(`/api/v2/admin/course-offerings/${idcouesr.idcouesr}/add-teacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                },
                body: JSON.stringify({ teacherId })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(`เพิ่ม ${data.teacher.name} เป็นผู้สอนเรียบร้อยแล้ว!`);
                // Refresh data
                getDataTeacher();
                // Clear search
                setTeacherSearchTerm("");
                setTeacherSearchResults([]);
            } else {
                throw new Error(data.message || 'Failed to add teacher');
            }
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsAddingTeacher(false);
        }
    };

    // Bulk enroll functions
    const parseBulkStudentData = (data: string) => {
        const lines = data.trim().split('\n');
        const studentIds: string[] = [];
        
        // Check if there's any line that looks like concatenated student IDs
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                // Check if this line contains multiple student IDs concatenated together
                // Look for patterns like: 633020284-7633020339-8 (no spaces between IDs)
                const potentialConcatenated = trimmedLine.replace(/[-.\s]/g, '');
                
                // If the line is very long (more than 20 characters) and contains only numbers,
                // it might be concatenated student IDs
                if (potentialConcatenated.length > 20 && /^[0-9]+$/.test(potentialConcatenated)) {
                    return { error: true, message: "พบรหัสนักศึกษาที่ติดกัน กรุณาแยกรหัสนักศึกษาแต่ละคนด้วยช่องว่างหรือขึ้นบรรทัดใหม่" };
                }
                
                // Split by tab, comma, or multiple spaces
                const columns = trimmedLine.split(/[\t,]+/);
                
                // Process each column
                for (let i = 0; i < columns.length; i++) {
                    const column = columns[i].trim();
                    if (column) {
                        // Split by spaces within each column
                        const spaceSeparated = column.split(/\s+/);
                        
                        for (const potentialId of spaceSeparated) {
                            const trimmedId = potentialId.trim();
                            if (trimmedId) {
                                // More flexible validation for student ID - allow hyphens and dots
                                if (trimmedId.length >= 5) {
                                    // Remove hyphens, dots, and spaces, then check if it's mostly numbers
                                    const cleanId = trimmedId.replace(/[-.\s]/g, '');
                                    if (cleanId.length >= 5 && /^[0-9]+$/.test(cleanId)) {
                                        studentIds.push(trimmedId); // Keep original format
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Remove duplicates
        return { error: false, studentIds: Array.from(new Set(studentIds)) };
    };

    const handleBulkSearch = async () => {
        if (!idcouesr.idcouesr || !bulkStudentData.trim()) {
            toast.error("กรุณาใส่ข้อมูลรหัสนักศึกษา");
            setBulkStudentResults([]);
            return;
        }

        setIsProcessingBulk(true);
        try {
            const studentIds = parseBulkStudentData(bulkStudentData);
            
            if (studentIds.error) {
                toast.error(studentIds.message || "เกิดข้อผิดพลาดในการประมวลผลข้อมูล");
                setBulkStudentResults([]);
                return;
            }

            if (!studentIds.studentIds || studentIds.studentIds.length === 0) {
                toast.error("ไม่พบรหัสนักศึกษาที่ถูกต้องในข้อมูลที่วาง");
                setBulkStudentResults([]);
                return;
            }

            toast(`กำลังค้นหานักศึกษา ${studentIds.studentIds.length} คน...`, {
                icon: '🔍',
                duration: 3000
            });

            // Search for each student ID with better error handling
            const searchPromises = studentIds.studentIds.map(async (studentId) => {
                try {
                    const res = await fetch(`/api/v2/admin/course-offerings/${idcouesr.idcouesr}/enroll-student?search=${encodeURIComponent(studentId)}`, {
                        headers: {
                            "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                        }
                    });
                    
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}`);
                    }
                    
                    const data = await res.json();
                    
                    // Find exact match by student ID
                    const foundStudent = data.find((student: any) => student.stdid === studentId);
                    if (foundStudent) {
                        return { ...foundStudent, originalId: studentId };
                    }
                    
                    return { originalId: studentId, notFound: true };
                } catch (error) {
                    console.error(`Error searching for student ${studentId}:`, error);
                    return { originalId: studentId, error: true, errorMessage: error instanceof Error ? error.message : 'Unknown error' };
                }
            });

            const results = await Promise.all(searchPromises);
            
            const validResults = results.filter(result => !result.notFound && !result.error);
            const notFoundIds = results.filter(result => result.notFound).map(r => r.originalId);
            const errorIds = results.filter(result => result.error).map(r => r.originalId);
            
            setBulkStudentResults(validResults);
            
            // Initialize progress tracking
            const progress: { [key: string]: 'pending' | 'success' | 'error' } = {};
            validResults.forEach(student => {
                progress[student.stdid] = 'pending';
            });
            setBulkEnrollProgress(progress);
            
            if (validResults.length === 0) {
                toast.error("ไม่พบนักศึกษาที่ตรงกับรหัสที่ระบุ");
            } else {
                let message = `พบนักศึกษา ${validResults.length} คนจาก ${studentIds.studentIds?.length || 0} รหัส`;
                if (notFoundIds.length > 0) {
                    message += `\nไม่พบ: ${notFoundIds.join(', ')}`;
                }
                if (errorIds.length > 0) {
                    message += `\nเกิดข้อผิดพลาด: ${errorIds.join(', ')}`;
                }
                toast.success(message);
            }
        } catch (error) {
            console.error("Failed to process bulk data", error);
            toast.error("เกิดข้อผิดพลาดในการประมวลผลข้อมูล");
            setBulkStudentResults([]);
        } finally {
            setIsProcessingBulk(false);
        }
    };

    const handleBulkEnroll = async () => {
        if (!idcouesr.idcouesr || bulkStudentResults.length === 0) return;

        setIsBulkEnrolling(true);
        const progress = { ...bulkEnrollProgress };
        
        try {
            toast(`กำลังเพิ่มนักศึกษา ${bulkStudentResults.length} คน...`, {
                icon: '⏳',
                duration: 3000
            });
            
            let successCount = 0;
            let errorCount = 0;
            
            for (let i = 0; i < bulkStudentResults.length; i++) {
                const student = bulkStudentResults[i];
                
                try {
                    // Update progress to show current student
                    progress[student.stdid] = 'pending';
                    setBulkEnrollProgress({ ...progress });
                    
                    const res = await fetch(`/api/v2/admin/course-offerings/${idcouesr.idcouesr}/enroll-student`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
                        },
                        body: JSON.stringify({ studentId: student.stdid })
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok) {
                        progress[student.stdid] = 'success';
                        successCount++;
                        console.log(`Successfully enrolled ${student.name} (${student.stdid})`);
                    } else {
                        progress[student.stdid] = 'error';
                        errorCount++;
                        console.error(`Failed to enroll ${student.name} (${student.stdid}):`, data.message);
                    }
                    
                    setBulkEnrollProgress({ ...progress });
                    
                    // Small delay to show progress and avoid overwhelming the server
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                } catch (error: any) {
                    progress[student.stdid] = 'error';
                    errorCount++;
                    setBulkEnrollProgress({ ...progress });
                    console.error(`Error enrolling ${student.name} (${student.stdid}):`, error);
                }
            }

            // Show final results
            if (successCount > 0) {
                toast.success(`เพิ่มนักศึกษา ${successCount} คนเรียบร้อยแล้ว!`);
                // Refresh data
                getDataStudent();
            }

            if (errorCount > 0) {
                toast.error(`ไม่สามารถเพิ่มนักศึกษา ${errorCount} คน`);
            }

            // Clear bulk data after completion
            setTimeout(() => {
                setBulkStudentData("");
                setBulkStudentResults([]);
                setBulkEnrollProgress({});
            }, 3000);

        } catch (error: any) {
            toast.error(`เกิดข้อผิดพลาดในการเพิ่มนักศึกษา: ${error.message}`);
        } finally {
            setIsBulkEnrolling(false);
        }
    };

    // console.log("dataTeacher : ", dataTeacher);
    // console.log(idcouesr.idcouesr)
    // console.log("PersonTab props:", idcouesr);
    // console.log("Course ID:", idcouesr?.idcouesr);

    return (
        <div className={`container md:mx-auto w-full max-w-4xl pt-0 ${kanit.className}`}>
            <h2 className='text-2xl mt-3'>อาจารย์</h2>
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">จำนวนผู้สอน: {dataTeacher.length} คน</p>
                <Button 
                    size="sm" 
                    className='bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white'
                    variant="flat"
                    onPress={onAddTeacherOpen}
                >
                    เพิ่มผู้สอน
                </Button>
            </div>
            <Divider className="my-2" />
            <Table removeWrapper aria-label="Teacher">
                <TableHeader>
                    <TableColumn>ชื่อ - นามสกุล</TableColumn>
                    <TableColumn>อีเมลล์</TableColumn>
                </TableHeader>
                <TableBody
                    items={dataTeacher ?? []}
                    loadingContent={<Spinner />}
                    loadingState={statusLoadTeach ? "idle" : "loading"}
                    emptyContent={"ไม่พบอาจารย์ผู้สอน"}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.image }}
                                    description={`ผู้สอน`}
                                    name={item.name}
                                >
                                </User></TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm ">{item.email}</p>
                                    <p className="text-bold text-sm text-default-400">{item.track}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <h2 className='text-2xl mt-6'>นักศึกษา</h2>
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">จำนวนนักศึกษา: {dataStudent.length} คน</p>
                <Button 
                    size="sm" 
                    className='bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white'
                    variant="flat"
                    onPress={onAddStudentOpen}
                >
                    เพิ่มนักศึกษา
                </Button>
            </div>
            <Divider className="my-2" />
            <Table removeWrapper aria-label="Student">
                <TableHeader>
                    <TableColumn>ชื่อ - นามสกุล</TableColumn>
                    <TableColumn>อีเมลล์</TableColumn>
                </TableHeader>
                <TableBody
                    items={dataStudent ?? []}
                    loadingContent={<Spinner />}
                    loadingState={statusLoadStudent ? "idle" : "loading"}
                    emptyContent={"ไม่พบนักศึกษา"}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.image }}
                                    description={<Snippet size="sm" variant="bordered" hideSymbol={true}>{item.stdid}</Snippet>}
                                    name={item.name}
                                >
                                </User></TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm ">{item.email}</p>
                                    <p className="text-bold text-sm text-default-400">{item.track}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Add Teacher Modal */}
            <Modal isOpen={isAddTeacherOpen} onOpenChange={onAddTeacherOpenChange} placement="top-center" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center bg-gradient-to-tr from-[#FF1CF7]/20 to-[#b249f8]/20 rounded-t-2xl">
                                <span className="text-xl font-bold flex items-center gap-2">
                                    <span role="img" aria-label="add teacher">👨‍🏫</span> เพิ่มผู้สอน/ผู้ช่วยสอน
                                </span>
                            </ModalHeader>
                            <ModalBody className="bg-white dark:bg-gray-900 rounded-b-2xl">
                                <div className="flex flex-col gap-6">
                                    {/* Search Section */}
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                ค้นหาผู้สอน/ผู้ช่วยสอน
                                            </label>
                                            <Input
                                                placeholder="กรอกชื่อ, รหัส หรืออีเมล..."
                                                value={teacherSearchTerm}
                                                onChange={(e) => {
                                                    setTeacherSearchTerm(e.target.value);
                                                    if (e.target.value.trim()) {
                                                        // Debounce search
                                                        const timeoutId = setTimeout(() => {
                                                            handleSearchTeachers(e.target.value);
                                                        }, 300);
                                                        return () => clearTimeout(timeoutId);
                                                    } else {
                                                        setTeacherSearchResults([]);
                                                    }
                                                }}
                                                variant="bordered"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                ค้นหาด้วยชื่อ, รหัส หรืออีเมล (แสดงเฉพาะผู้สอน/ผู้ช่วยสอนที่ยังไม่ได้ถูกมอบหมายในวิชานี้)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Search Results */}
                                    {teacherSearchResults.length > 0 && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                                ผลการค้นหา ({teacherSearchResults.length} คน)
                                            </h3>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {teacherSearchResults.map((teacher) => (
                                                    <div key={teacher.stdid} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                src={teacher.image ? `${teacher.image}` : undefined}
                                                                className="w-10 h-10"
                                                                showFallback
                                                                name={teacher.name}
                                                            />
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {teacher.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {teacher.stdid}
                                                                </p>
                                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                                    {teacher.type === 1 ? 'อาจารย์' : teacher.type === 0 ? 'ผู้ช่วยสอน' : 'ผู้ดูแล'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            color="primary"
                                                            variant="flat"
                                                            onPress={() => handleAddTeacher(teacher.stdid)}
                                                            isLoading={isAddingTeacher}
                                                            disabled={isAddingTeacher}
                                                        >
                                                            เพิ่ม
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {teacherSearchTerm && !isSearchingTeachers && teacherSearchResults.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <span role="img" aria-label="no results" className="text-3xl mb-2 block">🔍</span>
                                            <p>ไม่พบผู้สอน/ผู้ช่วยสอนที่ตรงกับคำค้นหา</p>
                                            <p className="text-sm">หรือผู้สอน/ผู้ช่วยสอนอาจถูกมอบหมายในวิชานี้แล้ว</p>
                                        </div>
                                    )}

                                    {/* Instructions */}
                                    {!teacherSearchTerm && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <span role="img" aria-label="search" className="text-3xl mb-2 block">🔍</span>
                                            <p>กรอกคำค้นหาเพื่อหาผู้สอน/ผู้ช่วยสอนที่ต้องการเพิ่ม</p>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <Button color="danger" variant="flat" onPress={() => {
                                    // Clear all data when closing modal
                                    setBulkStudentData("");
                                    setBulkStudentResults([]);
                                    setBulkEnrollProgress({});
                                    onClose();
                                }}>
                                    ปิด
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Add Student Modal */}
            <Modal isOpen={isAddStudentOpen} onOpenChange={onAddStudentOpenChange} placement="top-center" size="3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center bg-gradient-to-tr from-[#FF1CF7]/20 to-[#b249f8]/20 rounded-t-2xl">
                                <span className="text-xl font-bold flex items-center gap-2">
                                    <span role="img" aria-label="add student">👨‍🎓</span> เพิ่มนักศึกษา
                                </span>
                            </ModalHeader>
                            <ModalBody className="bg-white dark:bg-gray-900 rounded-b-2xl">
                                <div className="flex flex-col gap-6">
                                    {/* Bulk Input Section */}
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                วางข้อมูลจาก Excel
                                            </label>
                                            <Textarea
                                                placeholder="วางข้อมูลจาก Excel ที่มีรหัสนักศึกษา...
ตัวอย่าง:
633020284-7
633020339-8
653380005-2"
                                                value={bulkStudentData}
                                                onChange={(e) => setBulkStudentData(e.target.value)}
                                                variant="bordered"
                                                minRows={4}
                                                maxRows={4}
                                            />
                                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                <p>• รองรับการวางข้อมูลจาก Excel (คอลัมน์แรก)</p>
                                                <p>• รองรับการคัดลอกหลายบรรทัด หรือใส่ในบรรทัดเดียว</p>
                                                <p>• รองรับรหัสนักศึกษาที่มีเครื่องหมาย - เท่านั้น (เช่น 633020284-7)</p>
                                                <p>• <span className="text-red-500 font-medium">ห้ามใส่รหัสนักศึกษาติดกันโดยไม่มีช่องว่าง</span></p>
                                                <p>• ระบบจะลบรหัสที่ซ้ำกันออกโดยอัตโนมัติ</p>
                                            </div>
                                        </div>
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            onPress={handleBulkSearch}
                                            isLoading={isProcessingBulk}
                                            disabled={!bulkStudentData.trim() || isProcessingBulk}
                                        >
                                            {isProcessingBulk ? 'กำลังค้นหา...' : 'ค้นหานักศึกษา'}
                                        </Button>
                                    </div>

                                    {/* Bulk Results */}
                                    {bulkStudentResults.length > 0 && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    นักศึกษาที่พบ ({bulkStudentResults.length} คน)
                                                </h3>
                                                <div className="flex gap-2">
                                                    <Button
                                                        color="success"
                                                        variant="flat"
                                                        onPress={handleBulkEnroll}
                                                        isLoading={isBulkEnrolling}
                                                        disabled={isBulkEnrolling}
                                                    >
                                                        {isBulkEnrolling ? 'กำลังเพิ่ม...' : 'เพิ่มทั้งหมด'}
                                                    </Button>
                                                    <Button
                                                        color="danger"
                                                        variant="flat"
                                                        onPress={() => {
                                                            setBulkStudentData("");
                                                            setBulkStudentResults([]);
                                                            setBulkEnrollProgress({});
                                                        }}
                                                        disabled={isBulkEnrolling}
                                                    >
                                                        ล้างข้อมูล
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {bulkStudentResults.map((student) => {
                                                    const status = bulkEnrollProgress[student.stdid];
                                                    let bgColor = 'bg-gray-50 dark:bg-gray-800';
                                                    let borderColor = 'border-gray-200 dark:border-gray-700';
                                                    let chipColor: any = 'default';
                                                    let chipText = 'พร้อมเพิ่ม';
                                                    let chipVariant: any = 'flat';
                                                    
                                                    if (status === 'pending') {
                                                        bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
                                                        borderColor = 'border-yellow-200 dark:border-yellow-700';
                                                        chipColor = 'warning';
                                                        chipText = 'กำลังเพิ่ม...';
                                                        chipVariant = 'solid';
                                                    } else if (status === 'success') {
                                                        bgColor = 'bg-green-50 dark:bg-green-900/20';
                                                        borderColor = 'border-green-200 dark:border-green-700';
                                                        chipColor = 'success';
                                                        chipText = 'เพิ่มสำเร็จ';
                                                        chipVariant = 'solid';
                                                    } else if (status === 'error') {
                                                        bgColor = 'bg-red-50 dark:bg-red-900/20';
                                                        borderColor = 'border-red-200 dark:border-red-700';
                                                        chipColor = 'danger';
                                                        chipText = 'เพิ่มล้มเหลว';
                                                        chipVariant = 'solid';
                                                    }
                                                    
                                                    return (
                                                        <div key={student.stdid} className={`flex items-center justify-between p-3 ${bgColor} rounded-lg border ${borderColor} transition-colors duration-200`}>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar
                                                                    src={student.image ? `${student.image}` : undefined}
                                                                    className="w-10 h-10"
                                                                    showFallback
                                                                    name={student.name}
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {student.name}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {student.stdid}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                        {student.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Chip color={chipColor} variant={chipVariant} size="sm">
                                                                {chipText}
                                                            </Chip>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bulk Progress Summary */}
                                    {Object.keys(bulkEnrollProgress).length > 0 && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                                สถานะการเพิ่มนักศึกษา
                                            </h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                                        {Object.values(bulkEnrollProgress).filter(status => status === 'pending').length}
                                                    </div>
                                                    <div className="text-sm text-gray-500">รอดำเนินการ</div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                        {Object.values(bulkEnrollProgress).filter(status => status === 'success').length}
                                                    </div>
                                                    <div className="text-sm text-green-500">สำเร็จ</div>
                                                </div>
                                                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                        {Object.values(bulkEnrollProgress).filter(status => status === 'error').length}
                                                    </div>
                                                    <div className="text-sm text-red-500">ล้มเหลว</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
                                <Button color="danger" variant="flat" onPress={() => {
                                    // Clear all data when closing modal
                                    setBulkStudentData("");
                                    setBulkStudentResults([]);
                                    setBulkEnrollProgress({});
                                    onClose();
                                }}>
                                    ปิด
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
