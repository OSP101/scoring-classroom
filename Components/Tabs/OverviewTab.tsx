import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Progress, Chip, Divider, Spinner, Button } from "@heroui/react";
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
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

    // @ts-ignore: Add type for subjectName, subjectCode, year, semester
    const { subjectName, subjectCode, year, semester } = stats as any;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Course Overview */}
            <Card className="mb-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{subjectName}</h2>
                            <div className="flex flex-wrap gap-4 mt-1">
                                <span className="text-sm text-gray-600 font-medium">รหัสวิชา: <span className="font-bold">{subjectCode}</span></span>
                                <span className="text-sm text-gray-600 font-medium">ปีการศึกษา: <span className="font-bold">{year}</span></span>
                                <span className="text-sm text-gray-600 font-medium">ภาคเรียน: <span className="font-bold">{semester}</span></span>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">นักศึกษาทั้งหมด</p>
                                <p className="text-2xl font-bold text-blue-800">{stats.totalStudents}</p>
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
                                <p className="text-2xl font-bold text-purple-800">{stats.totalTeachers}</p>
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

            {/* Submission Summary */}
            {/* <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardBody className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-indigo-500" />
                        <h3 className="text-lg font-semibold text-indigo-800">สรุปการส่งงาน</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-indigo-800">{stats.overallSubmissionRate.toFixed(1)}%</p>
                            <p className="text-sm text-indigo-600">อัตราการส่งงานโดยรวม</p>
                            <p className="text-xs text-indigo-500">(งานที่ส่งแล้ว / งานทั้งหมด)</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">
                                {stats.assignments.reduce((sum, assignment) => sum + assignment.submittedCount, 0)}
                            </p>
                            <p className="text-sm text-green-600">งานที่ส่งแล้วทั้งหมด</p>
                            <p className="text-xs text-green-500">(คะแนน &gt; 0)</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-red-600">
                                {stats.assignments.reduce((sum, assignment) => sum + assignment.notSubmittedCount, 0)}
                            </p>
                            <p className="text-sm text-red-600">งานที่ยังไม่ส่ง</p>
                            <p className="text-xs text-red-500">(คะแนน = 0)</p>
                        </div>
                    </div>
                </CardBody>
            </Card> */}

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
                            {stats.topPerformers.slice(0, 5).map((student, index) => {
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
                            })}
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
                                    <div key={student.stdid} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
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
                                {stats.assignments.map((assignment) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
