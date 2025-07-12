'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Chip, Tooltip, Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, Navbar, NavbarBrand, NavbarContent, Divider, Button, Spinner, useDisclosure, NavbarItem, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Accordion, AccordionItem, CardBody, Card, CardHeader, Progress, Badge } from "@heroui/react";
import { Prompt } from "next/font/google";
import { useSession } from "next-auth/react"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Head from 'next/head'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import { useTheme } from "next-themes";
import { ThemeSwitcher } from '@/Components/Theme';
import Footer from '@/Components/Footer';
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography';
import Snowfall from 'react-snowfall';
import AnimatedCharacters from '../../Components/AnimatedCharacters';
import Image from 'next/image';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  PointElement, 
  LineElement, 
  RadialLinearScale, 
  Title, 
  ChartTooltip, 
  Legend, 
  Filler
);

export default function index() {
    const copyrightStyle = css`
        font-size: 12px;
        color: #666;
        margin-bottom: 3px;
        margin-top: 15px;
        margin-left: 15px;
        margin-right: 15px;
        text-align: center;
        a {
            color: #666;
            text-decoration: underline;
            &:hover {
                color: #b249f8;
            }
        }
    `;

    interface Assignment {
        id: number;
        name: string;
        maxpoint: number;
        score: number;
        teachid: string | null;
        update_at: string | null;
        type: string | null;
    }

    interface Course {
        offering_id: number;
        idcourse: string;
        course_name: string;
        year: number;
        semester: number;
        image: string;
        assignments: Assignment[];
        extra_point: number;
        kahoot_point: number;
        total_score: number;
        max_score: number;
    }

    interface Profile {
        stdid: string;
        name: string;
        email: string;
        image: string;
        track: string;
        section: number;
    }

    interface StudentScore {
        profile: Profile;
        courses: Course[];
    }

    const [pointInput, setPointInput] = useState("");
    const [stdInput, setStdInput] = useState("");
    const [dataUser, setDataUser] = useState<StudentScore | null>(null);
    const { data: session, status } = useSession();
    const [number, setNumber] = useState(0)
    const [statusUpdate, setStatusUpdate] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const refTurnstile = useRef<TurnstileInstance>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [bannerModalOpen, setBannerModalOpen] = useState(false);
    const [banners, setBanners] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async () => {
        refTurnstile.current?.reset();
        console.log('submitted!');
    }

    const statusButton = canSubmit && pointInput.length > 0;

    const submutations = async () => {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'x-requested-enter': process.env.NEXT_PUBLIC_API_HEAS || ''
        });
        setStatusUpdate(true)
        // console.log("[myscore] pointInput:", pointInput);
        // console.log("[myscore] API URL:", `${process.env.NEXT_PUBLIC_API_URL}/student/score/${pointInput}`);
        
        const getData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/score/${pointInput}`, {
            method: 'GET',
            headers: headers
        })
        
        if (getData.status === 404) {
            setNumber(1)
            setStatusUpdate(false)
            setStdInput(pointInput);
        } else if (getData.status === 200) {
            const dataCourses = await getData.json();
            setDataUser(dataCourses);
            setNumber(2)
            setStatusUpdate(false)
        }
    }

    // ปรับ formatDate ให้แสดงเป็น dd/MM/yyyy HH:mm:ss
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = (date.getFullYear() + 543).toString(); // พ.ศ.
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    // Calculate overall statistics
    const calculateOverallStats = () => {
        if (!dataUser) return null;
        
        const totalScore = dataUser.courses.reduce((sum, course) => sum + course.total_score, 0);
        const totalMaxScore = dataUser.courses.reduce((sum, course) => sum + course.max_score, 0);
        const avgScore = totalScore / dataUser.courses.length;
        const avgPercentage = (totalScore / totalMaxScore) * 100;
        
        return {
            totalScore,
            totalMaxScore,
            avgScore,
            avgPercentage,
            coursesCount: dataUser.courses.length
        };
    };

    // Get assignment completion status
    const getAssignmentStats = () => {
        if (!dataUser) return null;
        
        const allAssignments = dataUser.courses.flatMap(course => course.assignments);
        const completedAssignments = allAssignments.filter(a => a.score > 0);
        const totalAssignments = allAssignments.length;
        
        return {
            completed: completedAssignments.length,
            total: totalAssignments,
            percentage: (completedAssignments.length / totalAssignments) * 100
        };
    };

    // Get grade distribution
    const getGradeDistribution = () => {
        if (!dataUser) return null;
        
        const grades = dataUser.courses.map(course => {
            const percentage = (course.total_score / course.max_score) * 100;
            if (percentage >= 80) return 'A';
            if (percentage >= 70) return 'B';
            if (percentage >= 60) return 'C';
            if (percentage >= 50) return 'D';
            return 'F';
        });
        
        const distribution = grades.reduce((acc, grade) => {
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return distribution;
    };

    // Chart configurations
    const getOverallScoreChart = () => {
        if (!dataUser) return null;
        
        return {
            labels: dataUser.courses.map(course => course.idcourse),
            datasets: [
                {
                    label: 'คะแนนที่ได้',
                    data: dataUser.courses.map(course => course.total_score),
                    backgroundColor: 'rgba(178, 73, 248, 0.8)',
                    borderColor: 'rgba(178, 73, 248, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                },
                {
                    label: 'คะแนนเต็ม',
                    data: dataUser.courses.map(course => course.max_score),
                    backgroundColor: 'rgba(229, 231, 235, 0.6)',
                    borderColor: 'rgba(156, 163, 175, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                }
            ]
        };
    };

    const getPercentageChart = () => {
        if (!dataUser) return null;
        
        const percentages = dataUser.courses.map(course => 
            ((course.total_score / course.max_score) * 100).toFixed(1)
        );
        
        return {
            labels: dataUser.courses.map(course => course.idcourse),
            datasets: [{
                label: 'เปอร์เซ็นต์คะแนน',
                data: percentages,
                backgroundColor: 'rgba(255, 28, 247, 0.1)',
                borderColor: 'rgba(255, 28, 247, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(178, 73, 248, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
            }]
        };
    };

    const getGradeChart = () => {
        const distribution = getGradeDistribution();
        if (!distribution) return null;
        
        return {
            labels: Object.keys(distribution),
            datasets: [{
                data: Object.values(distribution),
                backgroundColor: [
                    '#10B981', // A - Green
                    '#3B82F6', // B - Blue  
                    '#F59E0B', // C - Yellow
                    '#EF4444', // D - Red
                    '#6B7280', // F - Gray
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
            }]
        };
    };

    const getAssignmentTypeChart = () => {
        if (!dataUser) return null;
        
        const allAssignments = dataUser.courses.flatMap(course => course.assignments);
        const types = allAssignments.reduce((acc, assignment) => {
            const type = assignment.type || 'normal';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return {
            labels: Object.keys(types),
            datasets: [{
                data: Object.values(types),
                backgroundColor: [
                    'rgba(178, 73, 248, 0.8)',
                    'rgba(255, 28, 247, 0.8)',
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
            }]
        };
    };

    // Fetch banners from API
    useEffect(() => {
        if (!isClient) return;

        const seen = localStorage.getItem('seenBannerModal');
        
        if (!seen) {
            fetch('/api/v2/admin/announcement', {
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log('Banner API data:', data);
                if (data && data.length > 0) {
                    setBanners(data);
                    setBannerModalOpen(true);
                } else {
                    setBannerModalOpen(true);
                }
            })
            .catch(error => {
                console.error('Error fetching banners:', error);
                setBannerModalOpen(true);
            });
        }
    }, [isClient]);

    const handleCloseBannerModal = () => {
        setBannerModalOpen(false);
        if (isClient) {
            localStorage.setItem('seenBannerModal', '1');
        }
    };

    const resetBannerModal = () => {
        if (isClient) {
            localStorage.removeItem('seenBannerModal');
        }
        setBannerModalOpen(false);
        window.location.reload();
    };

    useEffect(() => {
        if (isClient) {
            (window as any).resetBannerModal = resetBannerModal;
        }
    }, [isClient]);

    useEffect(() => {
        if (isClient) {
            try {
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427071385649225';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);

                script.onload = () => {
                    try {
                        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                        (window as any).adsbygoogle.push({});
                    } catch (error) {
                        console.warn('AdSense initialization error:', error);
                    }
                };

                script.onerror = () => {
                    console.warn('Failed to load AdSense script');
                };
            } catch (error) {
                console.warn('Error setting up AdSense:', error);
            }
        }
    }, [isClient]);

    const overallStats = calculateOverallStats();
    const assignmentStats = getAssignmentStats();
    const gradeDistribution = getGradeDistribution();

    return (
        <div className={kanit.className + " bg-[#f7f7f8] min-h-screen w-full"}>
            <Head>
                <title>Myscore - Scoring Classroom</title>
                <meta name="robots" content="index,follow"></meta>
                <meta name="description" content="Myscore เว็บไซต์สำหรับตรวจสอบคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101"></meta>
                <meta property="og:title" content="Scoring Classroom" />
                <meta property="og:description" content="Scoring Classroom เว็บไซต์สำหรับบันทึกคะแนน คะแนนพิเศษในชั้นเรียน สำหรับนักศึกษาวิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น พัฒนาโดย OSP101" />
                <meta property="og:url" content="https://sc.osp101.dev" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Scoring Classroom" />
                <meta property="og:image" content="https://sc.osp101.dev/SA.png" />
                <script type="text/javascript" src="https://cookiecdn.com/cwc.js"></script>
                <script id="cookieWow" type="text/javascript" src="https://cookiecdn.com/configs/SKduo3rfyASeQCFhHQZYzrgK" data-cwcid="SKduo3rfyASeQCFhHQZYzrgK"></script>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7427071385649225" crossOrigin="anonymous"></script>
            </Head>

            {!session ? (
                <Navbar isBordered maxWidth="2xl" isBlurred={false}>
                    <NavbarContent justify="start">
                        <NavbarBrand className="mr-4">
                            <p className={`sm:block font-bold text-inherit ${kanit.className}`}>
                                Scoring <span className='from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline'>Classroom</span>
                            </p>
                            <Chip isDisabled size="sm" variant="flat">{process.env.NEXT_PUBLIC_VER || 'v2.7.10'}</Chip>
                        </NavbarBrand>
                    </NavbarContent>
                    <NavbarContent as="div" className="items-center" justify="end">
                        <ThemeSwitcher />
                    </NavbarContent>
                </Navbar>
            ) : null}

            <div className={`container mx-auto w-full max-w-7xl ${kanit.className}`}>
                <div className={`px-4 pb-4 pt-3 ${kanit.className}`}>


                    {/* Search Section */}
                    <div className="mb-8 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-3xl shadow-lg border border-purple-100 p-4 sm:p-8 md:p-12 mx-auto">
                        <div className="text-center mb-4 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">ค้นหาคะแนนรายบุคคล</h2>
                            <p className="text-sm sm:text-base md:text-lg text-gray-600">ตรวจสอบคะแนนและความคืบหน้าการเรียนของคุณ</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-white/50">
                            <div className="w-full flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
                                <div className="relative flex-1 w-full">
                                    <Input 
                                        type="text" 
                                        label="รหัสนักศึกษา" 
                                        size='md' 
                                        variant="bordered" 
                                        color="secondary" 
                                        value={pointInput} 
                                        onValueChange={setPointInput} 
                                        isRequired 
                                        className='w-full' 
                                        placeholder="เช่น 633020xxx-x"
                                    />
                                </div>
                                <Button 
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-md transform hover:scale-105 w-full md:w-auto" 
                                    onClick={submutations}
                                    size="lg"
                                    isDisabled={statusUpdate || pointInput.length === 0 || !canSubmit}
                                    startContent={statusUpdate ? <Spinner color="white" size="sm" /> : <span className="text-lg sm:text-xl">🔍</span>}
                                >
                                    {statusUpdate ? "กำลังค้นหา..." : "ค้นหาคะแนน"}
                                </Button>
                            </div>
                            <div className="w-full flex justify-center mt-3 sm:mt-4">
                                <Turnstile
                                    id='turnstile-1'
                                    ref={refTurnstile}
                                    siteKey={process.env.NEXT_PUBLIC_CLOUD || ''}
                                    onSuccess={() => setCanSubmit(true)}
                                    options={{ theme: "auto" }}
                                />
                            </div>
                        </div>
                    </div>

                    {statusUpdate ? (
                        // <Card className="mb-6">
                        //     <CardBody className="text-center py-12">
                        //         <CircularProgress color="inherit" size={60} />
                        //         <p className="mt-4 text-lg">กำลังดึงข้อมูล...</p>
                        //     </CardBody>
                        // </Card>
                        <></>
                    ) : (
                        <>
                            {dataUser && number === 2 ? (
                                <>
                                    {/* Profile Section */}
                                    <Card className="mb-8 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 rounded-3xl shadow-xl border border-purple-100/50 p-6 sm:p-8 md:p-12">
                                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                            {/* Profile Image */}
                                            <div className="relative">
                                                <div className="relative">
                                                    <Avatar 
                                                        src={dataUser.profile.image} 
                                                        alt={dataUser.profile.name}
                                                        isBordered
                                                        radius="full"
                                                        color="secondary"
                                                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40" 
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Profile Info */}
                                            <div className="flex-1 text-center md:text-left">
                                                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                    {dataUser.profile.name}
                                                </h2>
                                                
                                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start mb-4">
                                                    <span className="rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-3 py-1 text-xs sm:text-sm font-semibold border border-purple-200 shadow-sm">
                                                        📚 {dataUser.profile.stdid}
                                                    </span>
                                                    <span className="rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 text-xs sm:text-sm font-semibold border border-blue-200 shadow-sm">
                                                        🎯 กลุ่ม {dataUser.profile.section}
                                                    </span>
                                                    <span className="rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1 text-xs sm:text-sm font-semibold border border-green-200 shadow-sm">
                                                        🚀 {dataUser.profile.track}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 text-sm sm:text-base">
                                                    <span className="text-purple-500">📧</span>
                                                    <span className="font-medium">{dataUser.profile.email}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Stats Summary */}
                                            <div className="hidden lg:flex flex-col gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">{dataUser.courses.length}</div>
                                                    <div className="text-xs text-gray-600">วิชาที่ลงทะเบียน</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {dataUser.courses.reduce((sum, course) => sum + course.assignments.filter(a => a.score > 0).length, 0)}
                                                    </div>
                                                    <div className="text-xs text-gray-600">งานที่ส่งแล้ว</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Courses Detail */}
                                    <div className="mb-10">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">รายวิชาที่ลงทะเบียน</h3>
                                        <div className="border-b border-gray-200 mb-6"></div>
                                        <Accordion variant="splitted" className='px-2 pb-4' selectionMode="multiple" defaultExpandedKeys={[dataUser.courses[0]?.offering_id?.toString() || "1"]}>
                                            {dataUser.courses.map((course) => {
                                                const coursePercentage = (course.total_score / course.max_score) * 100;
                                                const getGradeColor = (percentage: number) => {
                                                    if (percentage >= 80) return 'text-green-500';
                                                    if (percentage >= 70) return 'text-blue-500';
                                                    if (percentage >= 60) return 'text-yellow-500';
                                                    if (percentage >= 50) return 'text-orange-500';
                                                    return 'text-red-500';
                                                };
                                                // คำนวณคะแนนรวม (ไม่รวมคะแนนพิเศษ)
                                                const total_score = course.assignments.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
                                                const max_score = course.assignments.reduce((sum, a) => sum + (Number(a.maxpoint) || 0), 0);
                                                // คะแนนรวมทั้งหมด (รวมคะแนนพิเศษ)
                                                const total_score_with_bonus = total_score + Number(course.extra_point || 0) + Number(course.kahoot_point || 0);
                                                const max_score_with_bonus = max_score + Number(course.extra_point || 0) + Number(course.kahoot_point || 0);
                                                // เปอร์เซ็นต์การส่งงาน
                                                const submitted_assignments = course.assignments.filter(a => a.score > 0).length;
                                                const total_assignments = course.assignments.length;
                                                const submission_percentage = total_assignments > 0 ? (submitted_assignments / total_assignments) * 100 : 0;
                                                
                                                // ฟังก์ชันสำหรับ Chip แจ้งเตือน
                                                const getSubmissionWarning = (percentage: number) => {
                                                    if (percentage < 30) {
                                                        return { text: "อันตราย", color: "danger", icon: "🚨", bg: "bg-red-100", textColor: "text-red-700", border: "border-red-200" };
                                                    } else if (percentage < 50) {
                                                        return { text: "เสี่ยง", color: "warning", icon: "⚠️", bg: "bg-orange-100", textColor: "text-orange-700", border: "border-orange-200" };
                                                    } else if (percentage < 80) {
                                                        return { text: "ระวัง", color: "warning", icon: "⚡", bg: "bg-yellow-100", textColor: "text-yellow-700", border: "border-yellow-200" };
                                                    } else {
                                                        return { text: "ดี", color: "success", icon: "✅", bg: "bg-green-100", textColor: "text-green-700", border: "border-green-200" };
                                                    }
                                                };
                                                
                                                const warning = getSubmissionWarning(submission_percentage);
                                                
                                                return (
                                                    <AccordionItem
                                                        key={course.offering_id}
                                                        aria-label={`คะแนนวิชา ${course.course_name}`}
                                                        title={
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
                                                                <div className="flex-1">
                                                                    <div className="font-semibold text-base sm:text-lg text-gray-900">{course.course_name} ({course.idcourse})</div>
                                                                    <div className="text-xs sm:text-sm text-gray-500">ปี {course.year} เทอม {course.semester}</div>
                                                                </div>
                                                                <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-3">
                                                                    {/* Warning Chip */}
                                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${warning.bg} ${warning.textColor} ${warning.border} shadow-sm`}>
                                                                        <span>{warning.icon}</span>
                                                                        <span>{warning.text}</span>
                                                                    </div>
                                                                    
                                                                    {/* Score Info */}
                                                                    <div className="flex items-start sm:items-center gap-2">
                                                                        <div className="text-right">
                                                                            <div className="text-sm sm:text-lg font-bold text-blue-600">{submission_percentage.toFixed(1)}%</div>
                                                                            <div className="text-xs text-gray-500">ส่งงาน</div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${coursePercentage>=80?'bg-green-100 text-green-700':coursePercentage>=60?'bg-blue-100 text-blue-700':'bg-red-100 text-red-700'}`}>
                                                                        {course.total_score}/{course.max_score}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        }
                                                        className="shadow-sm bg-white border border-gray-200 rounded-xl mb-4 hover:shadow-md transition-shadow duration-200"
                                                    >
                                                        <div className="space-y-4 sm:space-y-6">
                                                            {/* Course Header Stats */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                                                <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                                                                    <CardBody className="text-center py-3 sm:py-4">
                                                                        <div className="text-lg sm:text-2xl font-bold text-[#b249f8]">{course.total_score}</div>
                                                                        <div className="text-xs sm:text-sm text-gray-600">คะแนนรวม</div>
                                                                    </CardBody>
                                                                </Card>
                                                                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                                                    <CardBody className="text-center py-3 sm:py-4">
                                                                        <div className="text-lg sm:text-2xl font-bold text-blue-600">{submission_percentage.toFixed(1)}%</div>
                                                                        <div className="text-xs sm:text-sm text-gray-600">ส่งงาน</div>
                                                                    </CardBody>
                                                                </Card>
                                                                <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                                                                    <CardBody className="text-center py-3 sm:py-4">
                                                                        <div className="text-lg sm:text-2xl font-bold text-green-500">{course.extra_point}</div>
                                                                        <div className="text-xs sm:text-sm text-gray-600">คะแนนพิเศษ</div>
                                                                    </CardBody>
                                                                </Card>
                                                                <Card className="bg-gradient-to-r from-orange-50 to-red-50">
                                                                    <CardBody className="text-center py-3 sm:py-4">
                                                                        <div className="text-lg sm:text-2xl font-bold text-orange-500">{course.kahoot_point}</div>
                                                                        <div className="text-xs sm:text-sm text-gray-600">คะแนน Kahoot!</div>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                            
                                                            {/* Progress Bar */}
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs sm:text-sm font-medium">ความคืบหน้า</span>
                                                                    <span className="text-xs sm:text-sm text-gray-600">{course.total_score}/{course.max_score} ({coursePercentage.toFixed(1)}%)</span>
                                                                </div>
                                                                <Progress value={coursePercentage} color={coursePercentage>=80?'success':coursePercentage>=60?'warning':'danger'} size="lg" className="mb-4" />
                                                            </div>
                                                            
                                                            <div className="">
                                                                {/* Assignment Table */}
                                                                <div className="space-y-3 sm:space-y-4">
                                                                    <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2"><span className="text-lg sm:text-xl">📋</span>รายการงาน</h4>
                                                                    <div className="overflow-x-auto">
                                                                        <table className="w-full text-xs sm:text-sm rounded-xl overflow-hidden">
                                                                            <thead className="bg-gray-50">
                                                                                <tr>
                                                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">งาน</th>
                                                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">คะแนน</th>
                                                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">เต็ม</th>
                                                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">%</th>
                                                                                    <th className='px-2 sm:px-4 py-2 sm:py-3 text-center'>ผู้ตรวจ</th>
                                                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">สถานะ</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-gray-200">
                                                                                {course.assignments.map((assignment) => {
                                                                                    const assignmentPercentage = (assignment.score / assignment.maxpoint) * 100;
                                                                                    // console.log(assignment.teachid)
                                                                                    return (
                                                                                        <tr key={assignment.id} className="hover:bg-gray-50">
                                                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium">{assignment.name}</td>
                                                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-[#b249f8]">{assignment.score}</td>
                                                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">{assignment.maxpoint}</td>
                                                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center"><span className={getGradeColor(assignmentPercentage)}>{assignmentPercentage.toFixed(1)}%</span></td>
                                                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">{assignment.teachid == null ? '-' : assignment.teachid}</td>
                                                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                                                <Chip color={assignment.score > 0 ? 'success' : 'default'} variant="flat" size="sm">{assignment.score > 0 ? '✓ ส่งแล้ว' : '⏳ ยังไม่ส่ง'}</Chip>
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                })}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Assignment Chart */}
                                                                {/* <div className="space-y-3 sm:space-y-4">
                                                                    <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2"><span className="text-lg sm:text-xl">📊</span>กราฟคะแนน</h4>
                                                                    <div className="h-60 sm:h-80">
                                                                        <Bar
                                                                            data={{
                                                                                labels: course.assignments.map(a => a.name),
                                                                                datasets: [
                                                                                    {
                                                                                        label: 'คะแนนที่ได้',
                                                                                        data: course.assignments.map(a => a.score),
                                                                                        backgroundColor: 'rgba(178, 73, 248, 0.8)',
                                                                                        borderColor: 'rgba(178, 73, 248, 1)',
                                                                                        borderWidth: 2,
                                                                                        borderRadius: 6,
                                                                                    },
                                                                                    {
                                                                                        label: 'คะแนนเต็ม',
                                                                                        data: course.assignments.map(a => a.maxpoint),
                                                                                        backgroundColor: 'rgba(229, 231, 235, 0.6)',
                                                                                        borderColor: 'rgba(156, 163, 175, 1)',
                                                                                        borderWidth: 2,
                                                                                        borderRadius: 6,
                                                                                    },
                                                                                ],
                                                                            }}
                                                                            options={{
                                                                                responsive: true,
                                                                                maintainAspectRatio: false,
                                                                                plugins: {
                                                                                    legend: { position: 'top' },
                                                                                    tooltip: {
                                                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                                                        titleColor: '#fff',
                                                                                        bodyColor: '#fff',
                                                                                        borderColor: '#b249f8',
                                                                                        borderWidth: 1,
                                                                                    }
                                                                                },
                                                                                scales: {
                                                                                    y: { beginAtZero: true }
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div> */}
                                                            </div>
                                                            
                                                            {/* Assignment Details */}
                                                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                                                <h5 className="font-semibold mb-2 flex items-center gap-2"><span className="text-base sm:text-lg">ℹ️</span>ข้อมูลเพิ่มเติม</h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                                                    <div><span className="font-medium">จำนวนงานทั้งหมด:</span><span className="ml-2">{course.assignments.length} งาน</span></div>
                                                                    <div><span className="font-medium">งานที่ส่งแล้ว:</span><span className="ml-2 text-green-600">{course.assignments.filter(a => a.score > 0).length} งาน</span></div>
                                                                    <div><span className="font-medium">งานที่ยังไม่ส่ง:</span><span className="ml-2 text-orange-600">{course.assignments.filter(a => a.score === 0).length} งาน</span></div>
                                                                    <div><span className="font-medium">คะแนนเฉลี่ย:</span><span className="ml-2 font-bold text-[#b249f8]">{(course.assignments.reduce((sum, a) => sum + a.score, 0) / course.assignments.length).toFixed(1)} คะแนน</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionItem>
                                                );
                                            })}
                                        </Accordion>
                                    </div>
                                </>
                            ) : (
                                number === 1 && (
                                    <Card className="mb-6 shadow-lg">
                                        <CardBody className="text-center py-12">
                                            <div className="text-6xl mb-4">😔</div>
                                            <h3 className="text-xl font-semibold mb-2">ไม่พบข้อมูล</h3>
                                            <p className="text-gray-600">
                                                ไม่พบข้อมูลของรหัสนักศึกษา <span className="font-bold text-[#b249f8]">{stdInput}</span>
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                กรุณาตรวจสอบรหัสนักศึกษาและลองใหม่อีกครั้ง
                                            </p>
                                        </CardBody>
                                    </Card>
                                )
                            )}
                        </>
                    )}

                    <Footer />


                </div>

                {/* Modals */}
                <Modal
                    backdrop="opaque"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    radius="lg"
                    size='3xl'
                    placement="center"
                    classNames={{
                        body: "py-6",
                        backdrop: "bg-[#FBDBA7]/50 backdrop-opacity-40",
                        base: "border-[#FBDBA7] bg-[#FBDBA7] dark:bg-[#FBDBA7] text-[#FBDBA7]",
                        header: "border-b-[1px] border-[#FBDBA7]",
                        footer: "border-t-[1px] border-[#FBDBA7]",
                        closeButton: "hover:bg-white/5 active:bg-white/10",
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <ModalBody>
                                <img src={`/670111-671231_banner.jpeg`} alt='banner' width={700} height={500} />
                            </ModalBody>
                        )}
                    </ModalContent>
                </Modal>

                {/* Banner Modal */}
                <Modal 
                    isOpen={bannerModalOpen} 
                    onClose={handleCloseBannerModal} 
                    size="3xl" 
                    placement="center" 
                    className={kanit.className} 
                    isDismissable={true}
                    backdrop="blur"
                >
                    <ModalContent>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                {banners.length > 0 ? (
                                    banners.map((banner, idx) => (
                                        <div key={banner.id || idx} className="flex flex-col items-center gap-2">
                                            {banner.type === 'image' ? (
                                                <Image 
                                                    src={banner.content} 
                                                    alt={banner.filename || 'banner'} 
                                                    className="w-full max-w-2xl rounded-lg shadow-md" 
                                                    width={1200} 
                                                    height={1000} 
                                                />
                                            ) : (
                                                <div className="bg-gradient-to-r from-[#FF1CF7]/10 to-[#b249f8]/10 px-4 py-2 rounded text-base text-center font-medium text-[#b249f8]">
                                                    {banner.content}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="bg-gradient-to-r from-[#FF1CF7]/10 to-[#b249f8]/10 px-4 py-2 rounded text-base text-center font-medium text-[#b249f8]">
                                            🎉 ยินดีต้อนรับสู่ Scoring Classroom! ขอให้ทุกคนโชคดีในภาคการศึกษานี้
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}
