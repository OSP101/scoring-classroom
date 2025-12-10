import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import {
    Button, Card, CardBody, CardHeader, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Chip, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    DatePicker, Select, SelectItem, Tabs, Tab
} from "@heroui/react";
import { BsPlusLg, BsCheckCircle, BsXCircle, BsClock, BsGeoAlt } from "react-icons/bs";
import { Prompt } from "next/font/google";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { parseDate, DateValue, today, getLocalTimeZone } from "@internationalized/date";
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';

// Dynamic import สำหรับ Leaflet (เพื่อหลีกเลี่ยง SSR issues)
const MapComponent = dynamic(() => import('./MapPicker'), { 
    ssr: false,
    loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg"><Spinner /></div>
});

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface AttendanceSession {
    id: number;
    course_offering_id: number;
    created_by: string;
    session_name: string;
    pin_code: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    start_time: string;
    end_time: string;
    section_filter?: string;
    is_active: number;
    created_at: string;
    total_records?: number;
    present_count?: number;
}

interface AttendanceRecord {
    id: number;
    session_id: number;
    stdid: string;
    pin_code: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
    is_valid_location: number;
    is_valid_pin: number;
    is_valid_time: number;
    status: string;
    submitted_at: string;
    student_name?: string;
    student_email?: string;
    student_section?: string;
}

export default function AttendanceTab({ idcourse }: { idcourse: string | string[] | undefined }) {
    const { data: session } = useSession();
    const [sessions, setSessions] = useState<AttendanceSession[]>([]);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInstructor, setIsInstructor] = useState(false);
    const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Modal states
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
    const { isOpen: isOpenView, onOpen: onOpenView, onClose: onCloseView } = useDisclosure();
    const { isOpen: isOpenSubmit, onOpen: onOpenSubmit, onClose: onCloseSubmit } = useDisclosure();

    // Form states
    const [createForm, setCreateForm] = useState({
        session_name: '',
        pin_code: '',
        latitude: null as number | null,
        longitude: null as number | null,
        radius: '',
        start_date: today(getLocalTimeZone()),
        start_time: '09:00',
        end_date: today(getLocalTimeZone()),
        end_time: '10:00'
    });

    const [mapModalOpen, setMapModalOpen] = useState(false);

    const [submitForm, setSubmitForm] = useState({
        session_id: 0,
        pin_code: '',
        latitude: '',
        longitude: ''
    });

    // สร้าง PIN Code อัตโนมัติ (6 หลัก)
    const generatePinCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    useEffect(() => {
        if (idcourse && session?.user?.stdid) {
            checkUserRole();
            fetchSessions();
        }
    }, [idcourse, session]);

    // สร้าง PIN Code เมื่อเปิด modal
    useEffect(() => {
        if (isOpenCreate) {
            setCreateForm(prev => ({
                ...prev,
                pin_code: generatePinCode()
            }));
        }
    }, [isOpenCreate]);


    const checkUserRole = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/checkuser/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    idcourse: idcourse,
                    email: session?.user?.email || null
                })
            });
            const data = await response.json();
            setIsInstructor(data.menubar);
        } catch (error) {
            console.error('Error checking user role:', error);
        }
    };

    console.log('usertype:', session?.user.usertype);

    const fetchSessions = async () => {
        if (!idcourse) return;
        
        setLoading(true);
        try {
            const userType = session?.user?.usertype;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/list?course_offering_id=${idcourse}&stdid=${session?.user?.stdid || ''}&user_type=${userType}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showSnackbar(errorData.error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
                setSessions([]);
                return;
            }
            
            const data = await response.json();
            console.log('Fetched sessions:', data); // Debug log
            setSessions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async (sessionId: number) => {
        try {
            const userType = session?.user?.usertype || 2;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/records?session_id=${sessionId}&stdid=${session?.user?.stdid || ''}&user_type=${userType}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                }
            );
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
            showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
        }
    };

    const handleCreateSession = async () => {
        if (!createForm.session_name || !createForm.pin_code) {
            showSnackbar('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            return;
        }

        const startDateTime = `${createForm.start_date.year}-${String(createForm.start_date.month).padStart(2, '0')}-${String(createForm.start_date.day).padStart(2, '0')} ${createForm.start_time}:00`;
        const endDateTime = `${createForm.end_date.year}-${String(createForm.end_date.month).padStart(2, '0')}-${String(createForm.end_date.day).padStart(2, '0')} ${createForm.end_time}:00`;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    course_offering_id: idcourse,
                    created_by: session?.user?.stdid,
                    session_name: createForm.session_name,
                    pin_code: createForm.pin_code,
                    latitude: createForm.latitude,
                    longitude: createForm.longitude,
                    radius: createForm.radius ? parseFloat(createForm.radius) : null,
                    start_time: startDateTime,
                    end_time: endDateTime,
                    section_filter: null
                })
            });

            if (response.ok) {
                showSnackbar('สร้างรอบเช็คชื่อสำเร็จ', 'success');
                onCloseCreate();
                setMapModalOpen(false);
                setCreateForm({
                    session_name: '',
                    pin_code: generatePinCode(),
                    latitude: null,
                    longitude: null,
                    radius: '',
                    start_date: today(getLocalTimeZone()),
                    start_time: '09:00',
                    end_date: today(getLocalTimeZone()),
                    end_time: '10:00'
                });
                fetchSessions();
            } else {
                const error = await response.json();
                showSnackbar(error.error || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error creating session:', error);
            showSnackbar('เกิดข้อผิดพลาดในการสร้างรอบเช็คชื่อ', 'error');
        }
    };

    const handleSubmitAttendance = async () => {
        if (!submitForm.pin_code) {
            showSnackbar('กรุณากรอก PIN Code', 'error');
            return;
        }

        // รับตำแหน่ง GPS (ถ้ามี)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    await submitWithLocation(position.coords.latitude, position.coords.longitude);
                },
                async () => {
                    // ถ้าไม่สามารถรับตำแหน่งได้ ให้ส่งโดยไม่มี GPS
                    await submitWithLocation(null, null);
                }
            );
        } else {
            await submitWithLocation(null, null);
        }
    };

    const submitWithLocation = async (lat: number | null, lng: number | null) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    session_id: submitForm.session_id,
                    stdid: session?.user?.stdid,
                    pin_code: submitForm.pin_code,
                    latitude: lat,
                    longitude: lng
                })
            });

            const data = await response.json();
            if (response.ok) {
                if (data.status === 'present') {
                    showSnackbar('เช็คชื่อสำเร็จ', 'success');
                } else {
                    showSnackbar(`เช็คชื่อแล้ว แต่มีปัญหา: ${JSON.stringify(data.validation)}`, 'error');
                }
                onCloseSubmit();
                setSubmitForm({ session_id: 0, pin_code: '', latitude: '', longitude: '' });
                fetchSessions();
            } else {
                showSnackbar(data.error || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            showSnackbar('เกิดข้อผิดพลาดในการเช็คชื่อ', 'error');
        }
    };

    const handleToggleSession = async (sessionId: number, currentStatus: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/update-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    created_by: session?.user?.stdid,
                    is_active: currentStatus === 1 ? 0 : 1
                })
            });

            if (response.ok) {
                showSnackbar('อัปเดตสถานะสำเร็จ', 'success');
                fetchSessions();
            } else {
                const error = await response.json();
                showSnackbar(error.error || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            console.error('Error updating session:', error);
            showSnackbar('เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isSessionOpen = (session: AttendanceSession) => {
        const now = new Date();
        const start = new Date(session.start_time);
        const end = new Date(session.end_time);
        return session.is_active === 1 && now >= start && now <= end;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen bg-gray-50 pb-24 ${kanit.className}`}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">ระบบเช็คชื่อ</h1>
                {isInstructor && (
                    <Button
                        onClick={onOpenCreate}
                        className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg"
                    >
                        <BsPlusLg className="mr-2" />
                        สร้างรอบเช็คชื่อ
                    </Button>
                )}
            </div>

            {/* Sessions List */}
            <div className="px-4 py-4 space-y-4">
                {sessions.length === 0 ? (
                    <Card>
                        <CardBody>
                            <p className="text-center text-gray-400">ยังไม่มีรอบเช็คชื่อ</p>
                        </CardBody>
                    </Card>
                ) : (
                    sessions.map((session) => (
                        <Card key={session.id} className="hover:shadow-lg transition">
                            <CardHeader className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{session.session_name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Chip
                                            size="sm"
                                            color={isSessionOpen(session) ? 'success' : session.is_active === 1 ? 'warning' : 'default'}
                                        >
                                            {isSessionOpen(session) ? 'เปิดอยู่' : session.is_active === 1 ? 'รอเปิด' : 'ปิดแล้ว'}
                                        </Chip>
                                    </div>
                                </div>
                                {isInstructor && (
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onClick={() => handleToggleSession(session.id, session.is_active)}
                                    >
                                        {session.is_active === 1 ? 'ปิด' : 'เปิด'}
                                    </Button>
                                )}
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <BsClock />
                                        <span>{formatDateTime(session.start_time)} - {formatDateTime(session.end_time)}</span>
                                    </div>
                                    {session.latitude && session.longitude && (
                                        <div className="flex items-center gap-2">
                                            <BsGeoAlt />
                                            <span>GPS: {session.latitude}, {session.longitude} (รัศมี: {session.radius}m)</span>
                                        </div>
                                    )}
                                    {isInstructor && (
                                        <>
                                            <div>PIN Code: <strong>{session.pin_code}</strong></div>
                                            <div>จำนวนผู้เช็คชื่อ: {session.present_count || 0} / {session.total_records || 0}</div>
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {isInstructor ? (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSession(session);
                                                    fetchRecords(session.id);
                                                    onOpenView();
                                                }}
                                            >
                                                ดูรายชื่อ
                                            </Button>
                                            {isSessionOpen(session) && (
                                                <Button
                                                    size="sm"
                                                    color="secondary"
                                                    onClick={() => {
                                                        window.open(`/attendance/${session.id}`, '_blank');
                                                    }}
                                                >
                                                    เปิดหน้าจอแสดง
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        isSessionOpen(session) && (
                                            <Button
                                                size="sm"
                                                color="primary"
                                                onClick={() => {
                                                    setSubmitForm({ ...submitForm, session_id: session.id });
                                                    onOpenSubmit();
                                                }}
                                            >
                                                เช็คชื่อ
                                            </Button>
                                        )
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            {/* Create Session Modal */}
            <Modal isOpen={isOpenCreate} onClose={onCloseCreate} size="2xl" className={kanit.className}>
                <ModalContent>
                    <ModalHeader>สร้างรอบเช็คชื่อ</ModalHeader>
                    <ModalBody>
                        <Input
                            label="ชื่อรอบเช็คชื่อ"
                            placeholder="เช่น เช็คชื่อครั้งที่ 1"
                            value={createForm.session_name}
                            onChange={(e) => setCreateForm({ ...createForm, session_name: e.target.value })}
                            isRequired
                        />
                        <div className="flex items-end gap-2">
                            <Input
                                label="PIN Code"
                                placeholder="รหัส PIN สำหรับเช็คชื่อ"
                                value={createForm.pin_code}
                                onChange={(e) => setCreateForm({ ...createForm, pin_code: e.target.value })}
                                isRequired
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                size="md"
                                variant="flat"
                                onClick={() => setCreateForm({ ...createForm, pin_code: generatePinCode() })}
                            >
                                สร้างใหม่
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <DatePicker
                                label="วันเริ่มต้น"
                                value={createForm.start_date}
                                onChange={(date) => setCreateForm({ ...createForm, start_date: date as DateValue })}
                            />
                            <Input
                                label="เวลาเริ่มต้น"
                                type="time"
                                value={createForm.start_time}
                                onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <DatePicker
                                label="วันสิ้นสุด"
                                value={createForm.end_date}
                                onChange={(date) => setCreateForm({ ...createForm, end_date: date as DateValue })}
                            />
                            <Input
                                label="เวลาสิ้นสุด"
                                type="time"
                                value={createForm.end_time}
                                onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">ตำแหน่ง GPS (ไม่บังคับ)</label>
                                <Button
                                    size="sm"
                                    variant="flat"
                                    onClick={() => setMapModalOpen(true)}
                                >
                                    <BsGeoAlt className="mr-1" />
                                    เลือกตำแหน่งบนแผนที่
                                </Button>
                            </div>
                            {createForm.latitude && createForm.longitude && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    <p>Latitude: {createForm.latitude.toFixed(6)}</p>
                                    <p>Longitude: {createForm.longitude.toFixed(6)}</p>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onClick={() => setCreateForm({ ...createForm, latitude: null, longitude: null })}
                                        className="mt-2"
                                    >
                                        ลบตำแหน่ง
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Input
                            label="Radius (เมตร) (ไม่บังคับ)"
                            placeholder="เช่น 100"
                            type="number"
                            value={createForm.radius}
                            onChange={(e) => setCreateForm({ ...createForm, radius: e.target.value })}
                            description="รัศมีสำหรับตรวจสอบตำแหน่ง (ต้องระบุตำแหน่ง GPS ก่อน)"
                            isDisabled={!createForm.latitude || !createForm.longitude}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onCloseCreate}>ยกเลิก</Button>
                        <Button
                            className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white"
                            onPress={handleCreateSession}
                        >
                            สร้าง
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* View Records Modal (Instructor) */}
            <Modal isOpen={isOpenView} onClose={onCloseView} size="4xl" className={kanit.className}>
                <ModalContent>
                    <ModalHeader>
                        รายชื่อผู้เช็คชื่อ: {selectedSession?.session_name}
                    </ModalHeader>
                    <ModalBody>
                        <Table aria-label="Attendance records">
                            <TableHeader>
                                <TableColumn>รหัสนักศึกษา</TableColumn>
                                <TableColumn>ชื่อ</TableColumn>
                                <TableColumn>สถานะ</TableColumn>
                                <TableColumn>PIN</TableColumn>
                                <TableColumn>ตำแหน่ง</TableColumn>
                                <TableColumn>เวลา</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.stdid}</TableCell>
                                        <TableCell>{record.student_name || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                color={record.status === 'present' ? 'success' : 'danger'}
                                            >
                                                {record.status === 'present' ? 'มา' : 'ไม่มา'}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {record.is_valid_pin === 1 ? (
                                                <BsCheckCircle className="text-green-500" />
                                            ) : (
                                                <BsXCircle className="text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {record.is_valid_location === 1 ? (
                                                <BsCheckCircle className="text-green-500" />
                                            ) : (
                                                <BsXCircle className="text-red-500" />
                                            )}
                                            {record.distance && ` (${record.distance.toFixed(2)}m)`}
                                        </TableCell>
                                        <TableCell>{formatDateTime(record.submitted_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onCloseView}>ปิด</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Submit Attendance Modal (Student) */}
            <Modal isOpen={isOpenSubmit} onClose={onCloseSubmit} className={kanit.className}>
                <ModalContent>
                    <ModalHeader>เช็คชื่อ</ModalHeader>
                    <ModalBody>
                        <Input
                            label="PIN Code"
                            placeholder="กรุณากรอก PIN Code"
                            value={submitForm.pin_code}
                            onChange={(e) => setSubmitForm({ ...submitForm, pin_code: e.target.value })}
                            isRequired
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            ระบบจะขออนุญาตเข้าถึงตำแหน่ง GPS ของคุณอัตโนมัติ
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onCloseSubmit}>ยกเลิก</Button>
                        <Button
                            className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white"
                            onPress={handleSubmitAttendance}
                        >
                            ส่ง
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Map Modal */}
            <Modal isOpen={mapModalOpen} onClose={() => setMapModalOpen(false)} size="3xl" className={kanit.className}>
                <ModalContent>
                    <ModalHeader>เลือกตำแหน่งบนแผนที่</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                คลิกบนแผนที่เพื่อปักหมุด หรือลาก marker เพื่อย้ายตำแหน่ง
                            </p>
                            <MapComponent
                                latitude={createForm.latitude}
                                longitude={createForm.longitude}
                                onLocationChange={(lat, lng) => {
                                    setCreateForm(prev => ({
                                        ...prev,
                                        latitude: lat,
                                        longitude: lng
                                    }));
                                }}
                            />
                            {createForm.latitude && createForm.longitude && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium">ตำแหน่งที่เลือก:</p>
                                    <p className="text-sm">Latitude: {createForm.latitude.toFixed(6)}</p>
                                    <p className="text-sm">Longitude: {createForm.longitude.toFixed(6)}</p>
                                </div>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setMapModalOpen(false)}>
                            ยืนยัน
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

