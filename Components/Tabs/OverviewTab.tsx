import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Progress, Chip, Divider, Spinner, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import {
    ChartBarIcon, 
    UserGroupIcon, 
    AcademicCapIcon, 
    DocumentTextIcon,
    ArrowTrendingUpIcon as TrendingUpIcon,
    ArrowTrendingDownIcon as TrendingDownIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Image from "next/image";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface OverviewTabProps {
    idcouesr: string;
}

interface AssignmentStats {
    id: number;
    name: string;
    maxpoint: number;
    avgScore: number;
    submittedCount: number;
    totalStudents: number;
    submissionRate: number;
    modeScore: number;
    medianScore: number;
    improvementFromPrevious: number | null;
    notSubmittedCount: number;
    submissionTrendFromPrevious: number | null;
}

interface CourseStats {
    totalStudents: number;
    totalTeachers: number;
    totalAssignments: number;
    overallAvgScore: number;
    overallSubmissionRate: number;
    assignments: AssignmentStats[];
    recentTrend: 'improving' | 'declining' | 'stable';
    topPerformers: Array<{ stdid: string; name: string; avgScore: number }>;
    needsAttention: Array<{ stdid: string; name: string; submissionRate: number }>;
    subjectName: string;
    subjectCode: string;
    year: number;
    semester: string;
}

export default function OverviewTab({ idcouesr }: OverviewTabProps) {
    const [stats, setStats] = useState<CourseStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [studentDetail, setStudentDetail] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    useEffect(() => {
        if (idcouesr) {
            fetchCourseStats();
        }
    }, [idcouesr]);

    const fetchCourseStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v2/admin/course-offerings/${idcouesr}/overview`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch course statistics');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving':
                return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
            case 'declining':
                return <TrendingDownIcon className="w-5 h-5 text-red-500" />;
            default:
                return <ChartBarIcon className="w-5 h-5 text-blue-500" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'improving':
                return 'text-green-600';
            case 'declining':
                return 'text-red-600';
            default:
                return 'text-blue-600';
        }
    };

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const openStudentModal = async (student: any) => {
        setSelectedStudent(student);
        setModalOpen(true);
        setModalLoading(true);
        setModalError(null);
        try {
            const response = await fetch(`/api/v2/admin/user-details/${student.stdid}?idcourse=${idcouesr}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });
            if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลนักศึกษาได้');
            const data = await response.json();
            setStudentDetail(data);
        } catch (err) {
            setModalError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        } finally {
            setModalLoading(false);
        }
    };

    const closeStudentModal = () => {
        setModalOpen(false);
        setStudentDetail(null);
        setSelectedStudent(null);
        setModalError(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" variant="wave" label="Loading..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button color="primary" onPress={fetchCourseStats}>
                    ลองใหม่
                </Button>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">ไม่พบข้อมูล</p>
            </div>
        );
    }

    const { subjectName, subjectCode, year, semester } = stats;

    return (
        <div className="relative w-full">
            {/* Gradient Header with white text, responsive */}
            <div className="w-full h-[220px] bg-gradient-to-r from-[#6a11cb] to-[#2575fc] flex items-end">
                <div className="max-w-5xl mx-auto px-4 pb-4 md:pb-8 w-full flex justify-between items-end">
                    <div>
                        <div className="text-xs font-bold text-white mb-2 tracking-widest">COURSE</div>
                        <h2 className="text-2xl md:text-4xl font-extrabold mb-2 text-white drop-shadow-lg break-words">{subjectName}</h2>
                        <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-6 mt-1">
                            <span className="text-base md:text-lg text-white font-medium">รหัสวิชา: <span className="font-bold">{subjectCode}</span></span>
                            <span className="text-base md:text-lg text-white font-medium">ปีการศึกษา: <span className="font-bold">{year}</span></span>
                            <span className="text-base md:text-lg text-white font-medium">ภาคเรียน: <span className="font-bold">{semester}</span></span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img
                            src="/header_gradient.svg"
                            alt="Decoration"
                            className="h-32 w-auto object-contain drop-shadow-xl"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {/* ส่วนอื่น ๆ (summary, stats, table) */}
            <div className="max-w-5xl mx-auto px-4 space-y-6 mt-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">นักศึกษาทั้งหมด</p>
                                    <p className="text-2xl font-bold text-blue-800">{stats.totalStudents ? stats.totalStudents : 'ไม่พบข้อมูล'}</p>
                                </div>
                                <UserGroupIcon className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">อาจารย์ผู้สอน</p>
                                    <p className="text-2xl font-bold text-purple-800">{stats.totalTeachers ? stats.totalTeachers : 'ไม่พบข้อมูล'}</p>
                                </div>
                                <AcademicCapIcon className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardBody>
                    </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">งานทั้งหมด</p>
                                <p className="text-2xl font-bold text-green-800">{stats.totalAssignments}</p>
                            </div>
                            <DocumentTextIcon className="w-8 h-8 text-green-500" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 font-medium">คะแนนเฉลี่ย</p>
                                <p className="text-2xl font-bold text-orange-800">
                                    {stats.overallAvgScore.toFixed(1)}
                                </p>
                                <p className="text-xs text-orange-600">
                                    จากงานที่ส่งแล้ว (คะแนน &gt; 0)
                                </p>
                            </div>
                            <ChartBarIcon className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardBody>
                </Card>
            </div>

                {/* Overall Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5" />
                                ประสิทธิภาพโดยรวม
                            </h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium">อัตราการส่งงาน</span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {stats.overallSubmissionRate.toFixed(1)}%
                                    </span>
                                </div>
                                <Progress 
                                    value={stats.overallSubmissionRate} 
                                    color="primary"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">แนวโน้ม:</span>
                                {getTrendIcon(stats.recentTrend)}
                                <span className={`text-sm font-medium ${getTrendColor(stats.recentTrend)}`}>
                                    {stats.recentTrend === 'improving' ? 'ดีขึ้น' : 
                                    stats.recentTrend === 'declining' ? 'ลดลง' : 'คงที่'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    (จากงาน {stats.assignments.length >= 3 ? '3 ชิ้นล่าสุด' : 
                                            stats.assignments.length === 2 ? '2 ชิ้นล่าสุด' : 'งานเดียว'})
                                </span>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5" />
                                นักศึกษาที่โดดเด่น
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {stats.topPerformers && stats.topPerformers.length > 0 ? (
                                    stats.topPerformers.slice(0, 5).map((student, index) => {
                                        const avgScore = typeof student.avgScore === 'number' 
                                            ? student.avgScore 
                                            : parseFloat(student.avgScore as string) || 0;
                                        
                                        return (
                                            <div key={student.stdid} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Chip size="sm" color="success" variant="flat">
                                                        #{index + 1}
                                                    </Chip>
                                                    <div>
                                                        <p className="text-sm font-medium">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.stdid}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-green-600">
                                                    {avgScore.toFixed(1)}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-gray-400 py-4">ไม่พบข้อมูล</div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Students Needing Attention */}
                {stats.needsAttention.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                                นักศึกษาที่ต้องการความสนใจ
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.needsAttention.map((student) => {
                                    const submissionRate = typeof student.submissionRate === 'number' 
                                        ? student.submissionRate 
                                        : parseFloat(student.submissionRate as string) || 0;
                                    return (
                                        <div
                                            key={student.stdid}
                                            className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:shadow-lg transition"
                                            onClick={() => openStudentModal(student)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-medium text-sm">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.stdid}</p>
                                                </div>
                                                <Chip size="sm" color="warning" variant="flat">
                                                    {submissionRate.toFixed(1)}%
                                                </Chip>
                                            </div>
                                            <Progress 
                                                value={submissionRate} 
                                                color="warning"
                                                className="w-full"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                )}

                {/* Assignment Analysis */}
                <Card>
                    <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold">การวิเคราะห์งานแต่ละชิ้น</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3 font-medium">งาน</th>
                                        <th className="text-center p-3 font-medium">คะแนนเฉลี่ย</th>
                                        <th className="text-center p-3 font-medium">ฐานนิยม</th>
                                        <th className="text-center p-3 font-medium">ส่งงานแล้ว</th>
                                        <th className="text-center p-3 font-medium">ยังไม่ส่ง</th>
                                        <th className="text-center p-3 font-medium">อัตราการส่ง</th>
                                        <th className="text-center p-3 font-medium">แนวโน้ม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.assignments && stats.assignments.length > 0 ? (
                                        stats.assignments.map((assignment) => (
                                            <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{assignment.name}</p>
                                                        <p className="text-xs text-gray-500">คะแนนเต็ม: {assignment.maxpoint}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`font-bold ${getScoreColor(assignment.avgScore, assignment.maxpoint)}`}>
                                                        {assignment.avgScore.toFixed(1)}
                                                    </span>
                                                    {assignment.submittedCount > 0 && (
                                                        <p className="text-xs text-gray-500">
                                                            จาก {assignment.submittedCount} คนที่ส่งงาน
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className="font-medium">{assignment.modeScore}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium text-green-600">
                                                            {assignment.submittedCount}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            คน
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium text-red-600">
                                                            {assignment.totalStudents - assignment.submittedCount}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            คน
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Progress 
                                                        value={assignment.submissionRate} 
                                                        color={assignment.submissionRate >= 80 ? "success" : 
                                                            assignment.submissionRate >= 60 ? "warning" : "danger"}
                                                        className="w-16 mx-auto"
                                                    />
                                                    <span className="text-xs text-gray-500">
                                                        {assignment.submissionRate.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {assignment.submissionTrendFromPrevious !== null ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            {assignment.submissionTrendFromPrevious > 0 ? (
                                                                <TrendingUpIcon className="w-4 h-4 text-green-500" />
                                                            ) : assignment.submissionTrendFromPrevious < 0 ? (
                                                                <TrendingDownIcon className="w-4 h-4 text-red-500" />
                                                            ) : (
                                                                <ChartBarIcon className="w-4 h-4 text-blue-500" />
                                                            )}
                                                            <span className={`text-xs font-medium ${
                                                                assignment.submissionTrendFromPrevious > 0 ? 'text-green-600' :
                                                                assignment.submissionTrendFromPrevious < 0 ? 'text-red-600' : 'text-blue-600'
                                                            }`}>
                                                                {assignment.submissionTrendFromPrevious > 0 ? '+' : ''}
                                                                {assignment.submissionTrendFromPrevious.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center text-gray-400 py-6">ไม่พบข้อมูล</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </div>
            {/* Student Detail Modal */}
            <Modal isOpen={modalOpen} onOpenChange={setModalOpen} size="2xl">
                <ModalContent>
                    <ModalHeader className={`${kanit.className} border-b`}>
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-bold">รายละเอียดนักศึกษา</span>
                        </div>
                    </ModalHeader>
                    <ModalBody className={`${kanit.className}`}>
                        {modalLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <Spinner size="lg" variant="wave" label="Loading..." />
                            </div>
                        ) : modalError ? (
                            <div className="flex flex-col items-center justify-center h-32">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mb-2" />
                                <p className="text-red-600 mb-2">{modalError}</p>
                                <Button color="primary" onPress={() => openStudentModal(selectedStudent)}>
                                    ลองใหม่
                                </Button>
                            </div>
                        ) : studentDetail ? (
                            <div className="space-y-4">
                                {/* Profile */}
                                <div className="flex items-center gap-4 m-1">
                                    {studentDetail.profile?.image && (
                                        <Image src={studentDetail.profile.image} height={64} width={64} alt="profile" className="rounded-full object-cover border" />
                                    )}
                                    <div>
                                        <div className="font-bold text-lg">{studentDetail.profile?.name}</div>
                                        <div className="text-sm text-gray-500">{studentDetail.profile?.stdid}</div>
                                        <div className="text-sm text-gray-400">{studentDetail.profile?.email}</div>
                                    </div>
                                </div>
                                {/* Assignment Scores */}
                                <div>
                                        <Table aria-label="score table" isHeaderSticky className="h-[300px] overflow-y-auto p-0">
                                            <TableHeader >
                                                    <TableColumn className="text-left ">งาน</TableColumn>
                                                    <TableColumn className="text-center ">คะแนนที่ได้</TableColumn>
                                                    <TableColumn className="text-center ">คะแนนเต็ม</TableColumn>
                                                    <TableColumn className="text-center ">สถานะ</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {stats.assignments.map((assignment) => {
                                                    // ใช้ studentDetail.assignments จาก backend (assignmentId, score)
                                                    const studentScore = studentDetail.assignments?.find((a: any) => a.assignmentId === assignment.id);
                                                    const score = studentScore ? studentScore.score : 0;
                                                    return (
                                                        <TableRow key={assignment.id}>
                                                            <TableCell className="">{assignment.name}</TableCell>
                                                            <TableCell className=" text-center font-bold">{score}</TableCell>
                                                            <TableCell className=" text-center">{assignment.maxpoint}</TableCell>
                                                            <TableCell className=" text-center">
                                                                {score > 0 ? (
                                                                    <span className="text-green-600 font-medium">ส่งแล้ว</span>
                                                                ) : (
                                                                    <span className="text-red-500 font-medium">ยังไม่ส่ง</span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                </div>
                            </div>
                        ) : null}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" variant="flat" onPress={closeStudentModal}>ปิด</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
