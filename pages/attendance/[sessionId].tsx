import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';
import { Prompt } from 'next/font/google';
import dynamic from 'next/dynamic';
import { BsClock, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import CircularProgress from '@mui/material/CircularProgress';

// Dynamic import สำหรับ QRCodeSVG เพื่อหลีกเลี่ยง SSR issues
const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
    ssr: false,
    loading: () => <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg animate-pulse" />
});

const kanit = Prompt({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface AttendanceRecord {
    id: number;
    stdid: string;
    student_name?: string;
    student_email?: string;
    status: string;
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
}

export default function AttendanceDisplay() {
    const router = useRouter();
    const { sessionId } = router.query;
    const { data: session } = useSession();
    const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    // ดึงข้อมูล session
    const fetchSession = async () => {
        if (!sessionId) return;

        try {
            const sessionResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/session/${sessionId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                }
            );
            
            if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();
                setAttendanceSession(sessionData);
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    };

    // ดึงข้อมูล records
    const fetchRecords = async () => {
        if (!sessionId) return;

        try {
            const recordsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/records?session_id=${sessionId}&stdid=${session?.user?.stdid || ''}&user_type=0`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                }
            );
            
            if (recordsResponse.ok) {
                const recordsData = await recordsResponse.json();
                // เรียงลำดับตามเวลาที่เช็คชื่อ (ใหม่สุดก่อน)
                const sortedRecords = Array.isArray(recordsData) 
                    ? recordsData.sort((a: AttendanceRecord, b: AttendanceRecord) => {
                        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
                    })
                    : [];
                setRecords(sortedRecords);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    // ดึงข้อมูลทั้งหมด
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

    // นับเวลาถอยหลัง
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

    // ดึงข้อมูลครั้งแรก
    useEffect(() => {
        if (sessionId) {
            fetchSessionData();
        }
    }, [sessionId]);

    // Auto-refresh records ทุก 2 วินาที (ไม่ต้อง refresh session)
    useEffect(() => {
        if (!sessionId) return;

        // ดึง records ครั้งแรก
        fetchRecords();

        // Auto-refresh records ทุก 2 วินาที
        const interval = setInterval(() => {
            fetchRecords();
        }, 2000); // Refresh ทุก 2 วินาที

        return () => clearInterval(interval);
    }, [sessionId, session]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!attendanceSession) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${kanit.className}`}>
                <Card>
                    <CardBody>
                        <p className="text-center text-gray-400">ไม่พบข้อมูลการเช็คชื่อ</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const presentCount = records.filter(r => r.status === 'present').length;
    const totalCount = records.length;

    return (
        <>
            <Head>
                <title>{attendanceSession.session_name} - การเช็คชื่อ</title>
            </Head>
            <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 ${kanit.className}`}>
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <Card className="bg-white shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <h1 className="text-3xl font-bold text-gray-800">{attendanceSession.session_name}</h1>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="flex flex-wrap justify-center gap-4 items-center">
                                {/* PIN Code */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">PIN Code</p>
                                    <p className="text-4xl font-bold text-purple-600">{attendanceSession.pin_code}</p>
                                </div>

                                {/* QR Code */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">QR Code</p>
                                    <div className="bg-white p-3 rounded-lg shadow-md inline-block">
                                        <QRCodeSVG
                                            value={attendanceSession.pin_code}
                                            size={150}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                </div>

                                {/* Countdown */}
                                {timeRemaining ? (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">เวลาที่เหลือ</p>
                                        <div className="flex gap-2 items-center justify-center">
                                            <div className={`px-4 py-2 rounded-lg ${
                                                timeRemaining.hours === 0 && timeRemaining.minutes < 5
                                                    ? 'bg-red-500 text-white'
                                                    : timeRemaining.hours === 0 && timeRemaining.minutes < 15
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-blue-500 text-white'
                                            }`}>
                                                <p className="text-2xl font-bold">
                                                    {String(timeRemaining.hours).padStart(2, '0')}:
                                                    {String(timeRemaining.minutes).padStart(2, '0')}:
                                                    {String(timeRemaining.seconds).padStart(2, '0')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                                        <Chip color="default" size="lg">
                                            หมดเวลาแล้ว
                                        </Chip>
                                    </div>
                                )}

                                {/* Statistics */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-1">จำนวนผู้เช็คชื่อ</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {presentCount} / {totalCount}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Real-time Attendance List */}
                    <Card className="bg-white shadow-lg">
                        <CardHeader className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">รายชื่อผู้เช็คชื่อ (Real-time)</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500">อัปเดตอัตโนมัติ</span>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {records.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">ยังไม่มีผู้เช็คชื่อ</p>
                            ) : (
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {records.map((record) => (
                                        <div
                                            key={record.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                    record.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                    {record.status === 'present' ? (
                                                        <BsCheckCircle className="text-green-600 text-xl" />
                                                    ) : (
                                                        <BsXCircle className="text-red-600 text-xl" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {record.student_name || record.stdid}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{record.stdid}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    {record.is_valid_pin === 1 ? (
                                                        <BsCheckCircle className="text-green-500" title="PIN ถูกต้อง" />
                                                    ) : (
                                                        <BsXCircle className="text-red-500" title="PIN ไม่ถูกต้อง" />
                                                    )}
                                                    {record.is_valid_location === 1 ? (
                                                        <BsCheckCircle className="text-green-500" title="ตำแหน่งถูกต้อง" />
                                                    ) : (
                                                        <BsXCircle className="text-red-500" title="ตำแหน่งไม่ถูกต้อง" />
                                                    )}
                                                </div>
                                                <Chip
                                                    size="sm"
                                                    color={record.status === 'present' ? 'success' : 'danger'}
                                                >
                                                    {record.status === 'present' ? 'มา' : 'ไม่มา'}
                                                </Chip>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(record.submitted_at).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}
