import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';
import { Prompt } from 'next/font/google';
import dynamic from 'next/dynamic';
import {
    BsClock,
    BsCheckCircle,
    BsXCircle,
    BsPeople,
    BsKey,
    BsListCheck,
    BsArrowRepeat,
} from 'react-icons/bs';
import CircularProgress from '@mui/material/CircularProgress';

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-[160px] h-[160px] bg-gray-100 rounded-xl shadow-inner border border-gray-200">
            <CircularProgress size={30} className="text-gray-400" />
        </div>
    ),
});

const kanit = Prompt({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

interface AttendanceRecord {
    id: number;
    stdid: string;
    student_name?: string;
    student_email?: string;
    status: 'present' | 'absent';
    submitted_at: string;
    is_valid_pin: number;
    is_valid_location: number;
}

interface AttendanceSession {
    id: number;
    session_name: string;
    pin_code: string;
    start_time: string;
    end_time: string;
    is_active: number;
    course_offering_id: string | number;
}

interface TimeRemaining {
    hours: number;
    minutes: number;
    seconds: number;
}

interface CourseStats {
    totalStudents: number;
    totalTeachers: number;
    totalAssignments: number;
    overallAvgScore: number;
    overallSubmissionRate: number;
    recentTrend: 'improving' | 'declining' | 'stable';
    topPerformers: Array<{ stdid: string; name: string; avgScore: number }>;
    needsAttention: Array<{ stdid: string; name: string; submissionRate: number }>;
    subjectName: string;
    subjectCode: string;
    year: number;
    semester: string;
}

const formatTime = (value: number) => String(value).padStart(2, '0');

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    colorClass: string;
    description: string;
}> = ({ icon, title, value, colorClass, description }) => (
    <Card className="shadow-lg hover:shadow-xl transition duration-300">
        <CardBody className="p-4">
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>
                    {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${colorClass}` })}
                </div>
                <p className="text-xs font-medium text-gray-500">{title}</p>
            </div>
            <div className="mt-1">
                <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{description}</p>
            </div>
        </CardBody>
    </Card>
);

const ValidationCheck: React.FC<{ title: string; isValid: boolean }> = ({ title, isValid }) => (
    <div className="flex flex-col items-center w-5/12 md:w-full">
        <span className="text-xs text-gray-500 mb-1 hidden md:block">{title}</span>
        {isValid ? (
            <BsCheckCircle className="text-green-500 text-xl" title={`${title} ถูกต้อง`} />
        ) : (
            <BsXCircle className="text-red-500 text-xl" title={`${title} ไม่ถูกต้อง`} />
        )}
    </div>
);


// Main Component
export default function AttendanceDisplay() {
    const router = useRouter();
    const { sessionId } = router.query;
    const { data: session } = useSession();
    const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [isRecordsLoading, setIsRecordsLoading] = useState(false);
    const [statsC, setStatsC] = useState<CourseStats | null>(null);
        const [error, setError] = useState<string | null>(null);
    
    

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

    // --- Data Fetching Functions ---

    const fetchSession = async () => {
        if (!sessionId) return;
        try {
            const response = await fetch(`${apiUrl}/attendance/session/${sessionId}`, {
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
            });
            if (response.ok) {
                const sessionData: AttendanceSession = await response.json();
                setAttendanceSession(sessionData);
                if (sessionData.course_offering_id) {
                    await fetchTotalStudents(sessionData.course_offering_id);
                    await fetchCourseStats(sessionData.course_offering_id);
                }
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    const fetchCourseStats = async (courseId: string | number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v2/admin/course-offerings/${courseId}/overview`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch course statistics');
            }

            const data = await response.json();
            setStatsC(data);
            console.log('Course Stats:', data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async () => {
        if (!sessionId) return;
        setIsRecordsLoading(true);
        try {
            const response = await fetch(
                `${apiUrl}/attendance/records?session_id=${sessionId}&stdid=${session?.user?.stdid || ''}&user_type=0`,
                {
                    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                }
            );
            if (response.ok) {
                const recordsData = await response.json();
                const sortedRecords: AttendanceRecord[] = Array.isArray(recordsData)
                    ? recordsData.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                    : [];
                setRecords(sortedRecords);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setIsRecordsLoading(false);
        }
    };

    const fetchTotalStudents = async (courseId: string | number) => {
        try {
            const headers = new Headers({ 'Content-Type': 'application/json', 'x-api-key': apiKey });
            const response = await fetch(`${apiUrl}/enllo/person/${courseId}`, { method: 'GET', headers });

            if (response.ok) {
                const data = await response.json();
                const studentCount = Array.isArray(data)
                    ? data.filter((person: any) => person.type === 2).length
                    : 0;
                setTotalStudents(studentCount);
            }
        } catch (error) {
            console.error('Error fetching total students:', error);
        }
    };

    const fetchSessionData = async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            await Promise.all([fetchSession(), fetchRecords()]);
        } catch (error) {
            console.error('Error fetching session data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Effects ---

    useEffect(() => {
        if (!attendanceSession) return;
        const updateCountdown = () => {
            const now = new Date();
            const endTime = new Date(attendanceSession.end_time);
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining({ hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [attendanceSession]);

    useEffect(() => {
        if (sessionId) {
            fetchSessionData();
        }
    }, [sessionId]);

    useEffect(() => {
        if (!sessionId || !attendanceSession || attendanceSession.is_active === 0) return;

        const interval = setInterval(() => {
            fetchRecords();
        }, 2000);

        return () => clearInterval(interval);
    }, [sessionId, attendanceSession]);

    // --- Loading & Calculated Data ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" variant="wave" label="Loading..." />
            </div>
        );
    }

    if (!attendanceSession) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${kanit.className}`}>
                <Card className="w-96 shadow-lg">
                    <CardBody>
                        <p className="text-center text-xl text-red-500 font-medium">❌ ไม่พบข้อมูลการเช็คชื่อ</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const presentCount = records.filter(r => r.status === 'present').length;
    const totalAttendanceCount = records.length;
    const isSessionActive = attendanceSession.is_active === 1 && (timeRemaining?.hours !== 0 || timeRemaining?.minutes !== 0 || timeRemaining?.seconds !== 0);

    const countdownColor = !isSessionActive
        ? 'bg-gray-400'
        : timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes < 5
            ? 'bg-red-500'
            : timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes < 15
                ? 'bg-orange-500'
                : 'bg-blue-500';

    // --- Render ---
    return (
        <>
            <Head>
                <title>{attendanceSession.session_name} - การเช็คชื่อ - Scoring Classroom</title>
            </Head>
            
            <div className={`min-h-screen bg-gray-50 p-4 sm:p-6 ${kanit.className}`}>
                <div className="max-w-7xl mx-auto space-y-6">
                    
                    {/* 1. Header Section (เต็มความกว้าง) */}
                    <Card className="bg-white shadow-xl border-t-4 border-purple-500">
                        <CardHeader className="p-6 pt-8 rounded-t-xl bg-purple-50 border-b-2 border-purple-300 relative overflow-hidden">
                            {/* Background Effect */}
                            <div className="absolute top-0 right-0 h-full w-1/3 bg-purple-100 opacity-50 transform skew-x-12 origin-top-right"></div>

                            <div className="w-full relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                {/* === ฝั่งซ้าย: ชื่อเซสชัน === */}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
                                        {attendanceSession.session_name}
                                    </h1>
                                    {/* แสดงรหัสวิชา ชื่อวิชา ปีการศึกษา ภาคเรียน จาก statsC */}
                                    {statsC && (
                                        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
                                            {statsC.subjectCode && <span className="font-medium">รหัสวิชา: {statsC.subjectCode}</span>}
                                            {statsC.subjectName && <span>ชื่อวิชา: {statsC.subjectName}</span>}
                                            {statsC.year && <span>ปีการศึกษา: {statsC.year}</span>}
                                            {statsC.semester && <span>ภาคเรียน: {statsC.semester}</span>}
                                        </div>
                                    )}
                                </div>
                                {/* === ฝั่งขวา: สถานะ, วันที่/เวลา === */}
                                <div className="flex-shrink-0 flex flex-col items-start lg:items-end space-y-3">
                                    <Chip
                                        color={isSessionActive ? 'success' : 'default'}
                                        size="lg"
                                        className="font-bold text-base shadow-md px-4 py-2 border border-gray-100"
                                    >
                                        {isSessionActive ? (
                                            <div className="flex items-center"><span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mr-2"></span>LIVE</div>
                                        ) : (
                                            <div className="flex items-center"><BsXCircle className="mr-2" />ปิดรับการเช็คชื่อ</div>
                                        )}
                                    </Chip>
                                    <div className="text-sm text-gray-700 pt-1 lg:pl-4 border-l-4 border-purple-200 lg:border-l-0 flex flex-col gap-1">
                                        <div className="flex items-center"><BsClock className="mr-2 text-purple-600 flex-shrink-0" /><span className="font-medium text-purple-700 w-16">เริ่ม:</span><span>{new Date(attendanceSession.start_time).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
                                        <div className="flex items-center"><BsClock className="mr-2 text-purple-600 flex-shrink-0" /><span className="font-medium text-purple-700 w-16">สิ้นสุด:</span><span>{new Date(attendanceSession.end_time).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* 2. Main Content Grid: ซ้าย (1/3) - ขวา (2/3) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* === ฝั่งซ้าย (Col Span 4/12): PIN, QR Code, Countdown (ข้อมูลรายละเอียด) === */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* A. PIN, QR Code, Countdown (รวมอยู่ใน Card เดียว) */}
                            <Card className="bg-white shadow-xl h-full">
                                <CardHeader className="text-xl font-semibold p-4 border-b">
                                    <BsKey className="inline mr-2 text-purple-500" /> รหัสและช่องทางการเช็คชื่อ
                                </CardHeader>
                                <CardBody className="p-6 space-y-6 flex flex-col justify-between h-full">
                                    
                                    {/* กลุ่ม PIN และ QR */}
                                    <div className="space-y-6">
                                        {/* PIN Code */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500">PIN CODE</p>
                                            <p className="text-5xl font-extrabold text-purple-600 tracking-wider mt-1">
                                                {attendanceSession.pin_code}
                                            </p>
                                        </div>

                                        {/* QR Code */}
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-2">QR CODE</p>
                                            <div className="bg-white p-2 rounded-xl shadow-lg inline-block border-4 border-gray-100">
                                                <QRCodeSVG
                                                    value={`http://localhost:3000/attendance/check-in/${attendanceSession.id}`}
                                                    size={160}
                                                    level="H"
                                                    includeMargin={false}
                                                    fgColor="#4C1D95"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Countdown (ติดด้านล่าง) */}
                                    <div className="text-center pt-4 border-t border-gray-100 mt-auto">
                                        <BsClock className="text-blue-500 text-3xl mx-auto mb-1" />
                                        <p className="text-sm text-gray-500">เวลาที่เหลือ</p>
                                        {timeRemaining ? (
                                            <div className={`mt-2 px-4 py-2 rounded-xl text-white ${countdownColor} shadow-lg inline-block`}>
                                                <p className="text-2xl font-bold tracking-wider">
                                                    {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:
                                                    {formatTime(timeRemaining.seconds)}
                                                </p>
                                            </div>
                                        ) : (
                                            <Chip color="default" size="lg" className="mt-2 text-base">
                                                <BsClock className="mr-1" /> หมดเวลาแล้ว
                                            </Chip>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* === ฝั่งขวา (Col Span 8/12): สถิติ + Real-time List === */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* A. Statistics Grid (Stat Cards) */}
                            <Card className="bg-white shadow-xl">
                                <CardHeader className="text-xl font-semibold p-4 border-b">
                                    <BsPeople className="inline mr-2 text-green-500" /> สถิติภาพรวมการเช็คชื่อ
                                </CardHeader>
                                <CardBody className="p-4">
                                    {/* จัด StatCard เป็น Grid 4 คอลัมน์ บน Desktop */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> 
                                        <StatCard
                                            icon={<BsPeople />}
                                            title="นักศึกษาทั้งหมด"
                                            value={totalStudents > 0 ? totalStudents : 'N/A'}
                                            colorClass="text-purple-600"
                                            description="ทั้งหมดในรายวิชา"
                                        />
                                        <StatCard
                                            icon={<BsCheckCircle />}
                                            title="มาเรียน (Present)"
                                            value={presentCount}
                                            colorClass="text-green-600"
                                            description={`${totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0}%`}
                                        />
                                        <StatCard
                                            icon={<BsListCheck />}
                                            title="เช็คชื่อทั้งหมด"
                                            value={totalAttendanceCount}
                                            colorClass="text-blue-600"
                                            description={`รวมทุกสถานะ`}
                                        />
                                        <StatCard
                                            icon={<BsXCircle />}
                                            title="ยังไม่เช็คชื่อ"
                                            value={totalStudents > 0 ? totalStudents - presentCount : 'N/A'}
                                            colorClass="text-red-600"
                                            description="นักศึกษาที่เหลือ"
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            {/* B. Real-time Attendance List */}
                            <Card className="bg-white shadow-xl border-t-4 border-blue-500/80">
                                <CardHeader className="flex items-center justify-between p-5 border-b border-gray-200 bg-blue-50/50">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <BsListCheck className="text-blue-600 mr-3 text-2xl" />
                                        รายชื่อผู้เช็คชื่อ
                                    </h2>
                                    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 text-sm shadow-inner border border-green-200">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-600 font-medium tracking-wider">LIVE REFRESH (2s)</span>
                                    </div>
                                </CardHeader>

                                <CardBody className="p-0">
                                    {records.length === 0 ? (
                                        <p className="text-center text-gray-400 py-12 text-lg">
                                            <BsListCheck className="text-5xl mx-auto mb-3 text-gray-300" />
                                            ยังไม่มีการส่งข้อมูลการเช็คชื่อเข้ามาในขณะนี้
                                        </p>
                                    ) : (
                                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100"> 
                                            {/* Table Header (Sticky): ปรับสัดส่วนให้ใช้พื้นที่ 2/3 อย่างเต็มที่ */}
                                            <div className="sticky top-0 bg-gray-100 p-4 hidden md:flex text-xs font-bold uppercase text-gray-600 shadow-sm z-10 border-b border-gray-200">
                                                <div className="w-1/12">สถานะ</div>
                                                <div className="w-5/12">ชื่อนักศึกษา / รหัส</div>
                                                <div className="w-2/12 text-center">PIN Code</div>
                                                <div className="w-2/12 text-center">Location</div>
                                                <div className="w-2/12 text-right">เวลาที่บันทึก</div>
                                            </div>

                                            {records.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="flex flex-wrap md:flex-nowrap items-center p-4 hover:bg-purple-50/50 transition duration-150 border-l-4 border-transparent hover:border-blue-500"
                                                >
                                                    {/* 1. Status Badge */}
                                                    <div className="w-full md:w-1/12 flex items-center mb-2 md:mb-0">
                                                        <Chip
                                                            size="sm"
                                                            color={record.status === 'present' ? 'success' : 'danger'}
                                                            className="font-semibold px-2 py-0.5"
                                                        >
                                                            {record.status === 'present' ? 'มา' : 'ขาด/ไม่สมบูรณ์'}
                                                        </Chip>
                                                    </div>

                                                    {/* 2. Name / Student ID */}
                                                    <div className="w-full md:w-5/12 flex-1 min-w-0 mb-2 md:mb-0 pr-2">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {record.student_name || 'ไม่ระบุชื่อ'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">ID: {record.stdid}</p>
                                                    </div>

                                                    {/* 3. PIN Validation Check */}
                                                    <div className="flex w-1/2 md:w-2/12 justify-start md:justify-center text-center mb-2 md:mb-0 text-sm">
                                                        <ValidationCheck title="PIN" isValid={record.is_valid_pin === 1} />
                                                    </div>
                                                    
                                                    {/* 4. Location Validation Check */}
                                                    <div className="flex w-1/2 md:w-2/12 justify-start md:justify-center text-center mb-2 md:mb-0 text-sm">
                                                        <ValidationCheck title="Location" isValid={record.is_valid_location === 1} />
                                                    </div>

                                                    {/* 5. Submitted Time */}
                                                    <div className="w-full md:w-2/12 text-left md:text-right text-xs text-gray-500 font-medium">
                                                        <span className="md:hidden font-medium text-gray-600">เวลาที่บันทึก: </span>
                                                        {new Date(record.submitted_at).toLocaleTimeString('th-TH', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}