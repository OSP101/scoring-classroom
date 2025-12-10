import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, CardBody, CardHeader, Input, Button, Chip, Spinner } from '@heroui/react';
import { Prompt } from 'next/font/google';
import { BsClock, BsGeoAlt, BsCheckCircle, BsXCircle, BsPinMap, BsPerson, BsKey, BsCalendar } from 'react-icons/bs';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Link from 'next/link';

const kanit = Prompt({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface AttendanceSession {
    id: number;
    course_offering_id: number;
    session_name: string;
    pin_code: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    start_time: string;
    end_time: string;
    is_active: number;
}

interface AttendanceRecord {
    id: number;
    stdid: string;
    status: string;
    submitted_at: string;
}

export default function StudentCheckIn() {
    const router = useRouter();
    const { sessionId } = router.query;
    const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
    const [existingRecord, setExistingRecord] = useState<AttendanceRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // ดึงข้อมูล session
    const fetchSessionData = async () => {
        if (!sessionId) return;

        setLoading(true);
        try {
            // ดึงข้อมูล session
            const sessionResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/session/${sessionId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                }
            );

            if (!sessionResponse.ok) {
                const errorData = await sessionResponse.json();
                showSnackbar(errorData.error || 'ไม่พบข้อมูลการเช็คชื่อ', 'error');
                setLoading(false);
                return;
            }

            const sessionData = await sessionResponse.json();
            setAttendanceSession(sessionData);
        } catch (error) {
            console.error('Error fetching session data:', error);
            showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
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
            const startTime = new Date(attendanceSession.start_time);
            const diff = endTime.getTime() - now.getTime();
            const startDiff = startTime.getTime() - now.getTime();

            if (startDiff > 0) {
                // ยังไม่ถึงเวลาเริ่มต้น
                const hours = Math.floor(startDiff / (1000 * 60 * 60));
                const minutes = Math.floor((startDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((startDiff % (1000 * 60)) / 1000);
                setTimeRemaining({ hours, minutes, seconds });
            } else if (diff <= 0) {
                // หมดเวลาแล้ว
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                // กำลังเปิดอยู่
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeRemaining({ hours, minutes, seconds });
            }
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

    // ตรวจสอบว่าเคยเช็คชื่อแล้วหรือยัง (เมื่อมีการกรอกรหัสนักศึกษา)
    const checkExistingRecord = async () => {
        if (!sessionId || !studentId.trim()) {
            setExistingRecord(null);
            return;
        }

        try {
            const recordsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/attendance/records?session_id=${sessionId}&stdid=${studentId.trim()}&user_type=2`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                }
            );

            if (recordsResponse.ok) {
                const recordsData = await recordsResponse.json();
                if (Array.isArray(recordsData) && recordsData.length > 0) {
                    setExistingRecord(recordsData[0]);
                } else {
                    setExistingRecord(null);
                }
            }
        } catch (error) {
            console.error('Error checking existing record:', error);
        }
    };

    // ตรวจสอบเมื่อมีการเปลี่ยนรหัสนักศึกษา
    useEffect(() => {
        if (studentId.trim()) {
            const timeoutId = setTimeout(() => {
                checkExistingRecord();
            }, 500); // Debounce 500ms
            return () => clearTimeout(timeoutId);
        } else {
            setExistingRecord(null);
        }
    }, [studentId, sessionId]);

    // รับตำแหน่ง GPS
    const getGPSLocation = () => {
        if (!navigator.geolocation) {
            setGpsError('เบราว์เซอร์ของคุณไม่รองรับการเข้าถึงตำแหน่ง GPS');
            return;
        }

        setGpsError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGpsLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                let errorMessage = 'ไม่สามารถรับตำแหน่ง GPS ได้';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'คุณไม่อนุญาตให้เข้าถึงตำแหน่ง GPS';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'หมดเวลารอการรับตำแหน่ง GPS';
                        break;
                }
                setGpsError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // ส่งการเช็คชื่อ
    const handleSubmit = async () => {
        if (!pinCode.trim()) {
            showSnackbar('กรุณากรอก PIN Code', 'error');
            return;
        }

        if (!studentId.trim()) {
            showSnackbar('กรุณากรอกรหัสนักศึกษา', 'error');
            return;
        }

        if (!attendanceSession) {
            showSnackbar('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
            return;
        }

        setSubmitting(true);

        try {
            // รับตำแหน่ง GPS (ถ้ายังไม่มี)
            let finalLat = gpsLocation?.lat || null;
            let finalLng = gpsLocation?.lng || null;

            if (!finalLat || !finalLng) {
                // ถ้ายังไม่มี GPS ให้ลองรับอีกครั้ง
                if (navigator.geolocation) {
                    await new Promise<void>((resolve) => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                finalLat = position.coords.latitude;
                                finalLng = position.coords.longitude;
                                resolve();
                            },
                            () => {
                                // ถ้าไม่สามารถรับได้ ให้ส่งโดยไม่มี GPS
                                resolve();
                            },
                            { enableHighAccuracy: true, timeout: 5000 }
                        );
                    });
                }
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({
                    session_id: attendanceSession.id,
                    stdid: studentId.trim(),
                    pin_code: pinCode.trim(),
                    latitude: finalLat,
                    longitude: finalLng
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === 'present') {
                    showSnackbar('เช็คชื่อสำเร็จ!', 'success');
                    // อัปเดตข้อมูล
                    setTimeout(() => {
                        checkExistingRecord();
                    }, 1000);
                } else {
                    const validation = data.validation || {};
                    let errorMsg = 'เช็คชื่อแล้ว แต่มีปัญหา: ';
                    const issues = [];
                    if (!validation.pin) issues.push('PIN Code ไม่ถูกต้อง');
                    if (!validation.time) issues.push('ไม่อยู่ในช่วงเวลาเช็คชื่อ');
                    if (!validation.location) issues.push('ตำแหน่งไม่ถูกต้อง');
                    showSnackbar(errorMsg + issues.join(', '), 'error');
                }
            } else {
                showSnackbar(data.error || 'เกิดข้อผิดพลาดในการเช็คชื่อ', 'error');
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            showSnackbar('เกิดข้อผิดพลาดในการเช็คชื่อ', 'error');
        } finally {
            setSubmitting(false);
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

    const isSessionOpen = () => {
        if (!attendanceSession) return false;
        const now = new Date();
        const start = new Date(attendanceSession.start_time);
        const end = new Date(attendanceSession.end_time);
        return attendanceSession.is_active === 1 && now >= start && now <= end;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <CircularProgress />
                    <p className="mt-4 text-gray-500">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (!attendanceSession) {
        return (
            <div className={`flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 ${kanit.className}`}>
                <Card className="max-w-md shadow-xl border-2 border-dashed">
                    <CardBody className="text-center py-12">
                        <BsXCircle className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-lg text-gray-600 mb-2">ไม่พบข้อมูลการเช็คชื่อ</p>
                        <p className="text-sm text-gray-400 mb-6">กรุณาตรวจสอบลิงก์อีกครั้ง</p>
                        <Link href="/">
                            <Button className="w-full bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg">
                                กลับหน้าหลัก
                            </Button>
                        </Link>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const sessionOpen = isSessionOpen();
    const now = new Date();
    const startTime = new Date(attendanceSession.start_time);
    const endTime = new Date(attendanceSession.end_time);
    const notStarted = now < startTime;
    const expired = now > endTime;

    return (
        <>
            <Head>
                <title>เช็คชื่อ - {attendanceSession.session_name}</title>
            </Head>
            <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 ${kanit.className}`}>
                <div className="max-w-3xl mx-auto p-4 py-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
                            <BsCalendar className="text-white text-4xl" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            {attendanceSession.session_name}
                        </h1>
                        <p className="text-gray-500">ระบบเช็คชื่อออนไลน์</p>
                    </div>

                    {/* Session Info Card */}
                    <Card className="mb-6 shadow-xl border-0 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                            <h2 className="text-2xl font-bold mb-1">ข้อมูลการเช็คชื่อ</h2>
                            <p className="text-purple-100 text-sm">รายละเอียดรอบเช็คชื่อ</p>
                        </div>
                        <CardBody className="p-6 space-y-4">
                            {/* Time Info */}
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <BsClock className="text-white text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">ช่วงเวลาเช็คชื่อ</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {formatDateTime(attendanceSession.start_time)}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            ถึง {formatDateTime(attendanceSession.end_time)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            {attendanceSession.latitude && attendanceSession.longitude ? (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-green-500 rounded-lg">
                                            <BsPinMap className="text-white text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">ตำแหน่ง GPS</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                ต้องเช็คชื่อในตำแหน่งที่กำหนด
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                รัศมี: {attendanceSession.radius}m
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-400 rounded-lg">
                                            <BsGeoAlt className="text-white text-lg" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">ตำแหน่ง GPS</p>
                                            <p className="text-sm font-semibold text-gray-600">ไม่กำหนดตำแหน่ง</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div className="flex items-center justify-center gap-3 pt-2">
                                <Chip
                                    color={
                                        existingRecord
                                            ? existingRecord.status === 'present'
                                                ? 'success'
                                                : 'warning'
                                            : sessionOpen
                                            ? 'success'
                                            : notStarted
                                            ? 'warning'
                                            : 'default'
                                    }
                                    size="lg"
                                    variant="flat"
                                    className="font-bold text-base px-4 py-2"
                                >
                                    {existingRecord
                                        ? existingRecord.status === 'present'
                                            ? '✓ เช็คชื่อแล้ว'
                                            : '⚠ เช็คชื่อแล้ว (มีปัญหา)'
                                        : sessionOpen
                                        ? '● เปิดอยู่'
                                        : notStarted
                                        ? '⏳ ยังไม่เปิด'
                                        : '✗ หมดเวลาแล้ว'}
                                </Chip>
                            </div>

                            {/* Countdown */}
                            {timeRemaining && (
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-xl text-white shadow-lg">
                                    <p className="text-sm text-blue-100 mb-2 text-center">
                                        {notStarted ? '⏰ จะเปิดในอีก' : '⏱️ เวลาที่เหลือ'}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                                            <p className="text-3xl font-bold">{String(timeRemaining.hours).padStart(2, '0')}</p>
                                            <p className="text-xs text-blue-100">ชั่วโมง</p>
                                        </div>
                                        <span className="text-2xl font-bold">:</span>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                                            <p className="text-3xl font-bold">{String(timeRemaining.minutes).padStart(2, '0')}</p>
                                            <p className="text-xs text-blue-100">นาที</p>
                                        </div>
                                        <span className="text-2xl font-bold">:</span>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                                            <p className="text-3xl font-bold">{String(timeRemaining.seconds).padStart(2, '0')}</p>
                                            <p className="text-xs text-blue-100">วินาที</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Check-in Form */}
                    {existingRecord ? (
                        <Card className="shadow-xl border-0 overflow-hidden">
                            <div className={`p-6 text-white ${
                                existingRecord.status === 'present' 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                    : 'bg-gradient-to-r from-orange-500 to-amber-500'
                            }`}>
                                <div className="text-center">
                                    {existingRecord.status === 'present' ? (
                                        <BsCheckCircle className="text-7xl mx-auto mb-4 drop-shadow-lg" />
                                    ) : (
                                        <BsXCircle className="text-7xl mx-auto mb-4 drop-shadow-lg" />
                                    )}
                                    <h3 className="text-2xl font-bold mb-2">
                                        {existingRecord.status === 'present'
                                            ? 'เช็คชื่อสำเร็จ!'
                                            : 'เช็คชื่อแล้ว แต่มีปัญหา'}
                                    </h3>
                                </div>
                            </div>
                            <CardBody className="p-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">รหัสนักศึกษา</p>
                                        <p className="text-lg font-semibold text-gray-800">{existingRecord.stdid}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">เวลาที่เช็คชื่อ</p>
                                        <p className="text-lg font-semibold text-gray-800">{formatDateTime(existingRecord.submitted_at)}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <Card className="shadow-xl border-0 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                                <h2 className="text-2xl font-bold mb-1">เช็คชื่อ</h2>
                                <p className="text-purple-100 text-sm">กรอกข้อมูลเพื่อเช็คชื่อ</p>
                            </div>
                            <CardBody className="p-6 space-y-5">
                                {!sessionOpen && (
                                    <Alert 
                                        severity={notStarted ? 'info' : 'error'} 
                                        className="mb-4 rounded-xl"
                                    >
                                        {notStarted
                                            ? '⏳ การเช็คชื่อยังไม่เปิด กรุณารอจนกว่าจะถึงเวลาเริ่มต้น'
                                            : '✗ การเช็คชื่อหมดเวลาแล้ว'}
                                    </Alert>
                                )}

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <BsPerson className="text-purple-500" />
                                        รหัสนักศึกษา
                                    </label>
                                    <Input
                                        placeholder="กรุณากรอกรหัสนักศึกษา"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        isRequired
                                        isDisabled={!sessionOpen || submitting}
                                        size="lg"
                                        classNames={{
                                            input: "text-lg",
                                            inputWrapper: "border-2 border-gray-200 hover:border-purple-300 focus-within:border-purple-500"
                                        }}
                                    />
                                    <p className="text-xs text-gray-500 ml-1">กรุณากรอกรหัสนักศึกษาของคุณ</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <BsKey className="text-pink-500" />
                                        PIN Code
                                    </label>
                                    <Input
                                        placeholder="กรุณากรอก PIN Code"
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                        isRequired
                                        isDisabled={!sessionOpen || submitting}
                                        size="lg"
                                        classNames={{
                                            input: "text-lg font-mono",
                                            inputWrapper: "border-2 border-gray-200 hover:border-purple-300 focus-within:border-purple-500"
                                        }}
                                    />
                                    <p className="text-xs text-gray-500 ml-1">กรุณากรอก PIN Code ที่ได้รับจากอาจารย์</p>
                                </div>

                                {/* GPS Location */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <BsPinMap className="text-green-500" />
                                            ตำแหน่ง GPS
                                        </label>
                                        <Button
                                            size="md"
                                            variant="flat"
                                            color="success"
                                            onClick={getGPSLocation}
                                            isDisabled={submitting}
                                            startContent={<BsGeoAlt />}
                                            className="font-semibold"
                                        >
                                            รับตำแหน่ง
                                        </Button>
                                    </div>
                                    {gpsLocation ? (
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-500 rounded-lg">
                                                    <BsCheckCircle className="text-white text-xl" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">ตำแหน่งปัจจุบัน</p>
                                                    <p className="text-sm font-mono font-semibold text-gray-800">
                                                        Lat: {gpsLocation.lat.toFixed(6)}
                                                    </p>
                                                    <p className="text-sm font-mono font-semibold text-gray-800">
                                                        Lng: {gpsLocation.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : gpsError ? (
                                        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-500 rounded-lg">
                                                    <BsXCircle className="text-white text-xl" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-red-700">{gpsError}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="text-sm text-gray-600 text-center">
                                                {attendanceSession.latitude && attendanceSession.longitude
                                                    ? '📍 กรุณากดปุ่ม "รับตำแหน่ง" เพื่อระบุตำแหน่งของคุณ'
                                                    : '🌍 ไม่จำเป็นต้องระบุตำแหน่ง GPS'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-bold"
                                        onClick={handleSubmit}
                                        isDisabled={!sessionOpen || submitting || !pinCode.trim() || !studentId.trim()}
                                        isLoading={submitting}
                                    >
                                        {submitting ? 'กำลังส่ง...' : '✓ เช็คชื่อ'}
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        💡 ระบบจะขออนุญาตเข้าถึงตำแหน่ง GPS ของคุณอัตโนมัติเมื่อส่งการเช็คชื่อ
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    )}

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
            </div>
        </>
    );
}
