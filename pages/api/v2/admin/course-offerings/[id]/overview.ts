import type { NextApiRequest, NextApiResponse } from 'next';
import { mysqlPool } from '../../../../../../utils/db';
import { authenticateApiKey } from '../../../../../../lib/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Course offering ID is required.' });
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        const promisePool = mysqlPool.promise();
        
        // Get course offering details
        const [offeringRows]: [any[], any] = await promisePool.query(
            `SELECT 
                co.id,
                s.subject_code,
                s.name as subject_name,
                co.year,
                co.semester
             FROM course_offerings co
             JOIN subjects s ON co.subject_id = s.id
             WHERE co.id = ?`,
            [id]
        );

        if (offeringRows.length === 0) {
            return res.status(404).json({ message: 'Course offering not found.' });
        }

        const offering = offeringRows[0];

        // Get total students and teachers
        const [studentCount]: [any[], any] = await promisePool.query(
            'SELECT COUNT(*) as count FROM enllo WHERE idcourse = ?',
            [offering.id]
        );

        const [teacherCount]: [any[], any] = await promisePool.query(
            'SELECT COUNT(*) as count FROM caretaker WHERE idcourse = ?',
            [offering.id]
        );

        // Get all assignments for this course
        const [assignments]: [any[], any] = await promisePool.query(
            'SELECT id, name, maxpoint FROM titelwork WHERE idcourse = ? AND delete_at IS NULL ORDER BY id ASC',
            [offering.id]
        );

        // Calculate statistics for each assignment
        const assignmentStats: any[] = [];
        let totalScore = 0;
        let totalSubmissions = 0;
        let totalPossibleSubmissions = 0;

        for (let i = 0; i < assignments.length; i++) {
            const assignment = assignments[i];
            
            // Get all students enrolled in this course
            const [enrolledStudents]: [any[], any] = await promisePool.query(
                'SELECT stdid FROM enllo WHERE idcourse = ?',
                [offering.id]
            );

            const totalStudents = enrolledStudents.length;
            
            // Get all points for this assignment (including 0 scores for non-submitted work)
            const [allPoints]: [any[], any] = await promisePool.query(
                'SELECT point FROM points WHERE idtitelwork = ? AND delete_at = "1998-12-31 17:00:00"',
                [assignment.id]
            );

            // Count actual submissions (students who have score > 0, meaning they submitted work)
            const submittedPoints = allPoints.filter(p => p.point > 0);
            const submittedCount = submittedPoints.length;
            const submissionRate = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;

            // Calculate average score (only for students who submitted work with score > 0)
            const avgScore = submittedCount > 0 ? submittedPoints.reduce((sum, p) => sum + p.point, 0) / submittedCount : 0;

            // Calculate mode (most frequent score) - only for submitted work
            const scoreCounts: { [key: number]: number } = {};
            submittedPoints.forEach(p => {
                scoreCounts[p.point] = (scoreCounts[p.point] || 0) + 1;
            });
            const modeScore = Object.keys(scoreCounts).length > 0 
                ? parseInt(Object.keys(scoreCounts).reduce((a, b) => scoreCounts[parseInt(a)] > scoreCounts[parseInt(b)] ? a : b))
                : 0;

            // Calculate median - only for submitted work
            const sortedScores = submittedPoints.map(p => p.point).sort((a, b) => a - b);
            const medianScore = sortedScores.length > 0 
                ? sortedScores.length % 2 === 0 
                    ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
                    : sortedScores[Math.floor(sortedScores.length / 2)]
                : 0;

            // Calculate improvement from previous assignment (avgScore)
            let improvementFromPrevious = null;
            if (i > 0 && assignmentStats[i - 1]) {
                improvementFromPrevious = avgScore - assignmentStats[i - 1].avgScore;
            }

            // Calculate submission trend from previous assignment (submissionRate)
            let submissionTrendFromPrevious = null;
            if (i > 0 && assignmentStats[i - 1]) {
                submissionTrendFromPrevious = submissionRate - assignmentStats[i - 1].submissionRate;
            }

            assignmentStats.push({
                id: assignment.id,
                name: assignment.name,
                maxpoint: assignment.maxpoint,
                avgScore,
                submittedCount,
                totalStudents,
                submissionRate,
                modeScore,
                medianScore,
                improvementFromPrevious,
                notSubmittedCount: totalStudents - submittedCount,
                submissionTrendFromPrevious
            });

            totalScore += avgScore * submittedCount;
            totalSubmissions += submittedCount;
            totalPossibleSubmissions += totalStudents;
        }

        // Calculate overall statistics
        const overallAvgScore = totalSubmissions > 0 ? totalScore / totalSubmissions : 0;
        const overallSubmissionRate = totalPossibleSubmissions > 0 ? (totalSubmissions / totalPossibleSubmissions) * 100 : 0;

        // Determine recent trend - improved calculation
        let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
        if (assignmentStats.length >= 3) {
            // Take the last 3 assignments for trend analysis
            const lastThree = assignmentStats.slice(-3);
            
            // Calculate trend based on both average scores and submission rates
            const scoreTrend = (lastThree[2].avgScore - lastThree[0].avgScore) / 2; // Average change per assignment
            const submissionTrend = (lastThree[2].submissionRate - lastThree[0].submissionRate) / 2;
            
            // Combined trend score (weighted: 70% score, 30% submission rate)
            const combinedTrend = (scoreTrend * 0.7) + (submissionTrend * 0.3);
            
            if (combinedTrend > 2) recentTrend = 'improving';
            else if (combinedTrend < -2) recentTrend = 'declining';
            else recentTrend = 'stable';
        } else if (assignmentStats.length === 2) {
            // If only 2 assignments, use simple comparison
            const scoreDiff = assignmentStats[1].avgScore - assignmentStats[0].avgScore;
            const submissionDiff = assignmentStats[1].submissionRate - assignmentStats[0].submissionRate;
            const combinedDiff = (scoreDiff * 0.7) + (submissionDiff * 0.3);
            
            if (combinedDiff > 1) recentTrend = 'improving';
            else if (combinedDiff < -1) recentTrend = 'declining';
            else recentTrend = 'stable';
        }

        // Get top performers (students with highest average scores) - only for students who submitted work
        const [topPerformers]: [any[], any] = await promisePool.query(
            `SELECT 
                u.stdid,
                u.name,
                AVG(p.point) as avgScore,
                COUNT(p.id) as submittedCount
             FROM users u
             JOIN enllo e ON u.stdid = e.stdid
             JOIN points p ON u.stdid = p.stdid
             JOIN titelwork t ON p.idtitelwork = t.id
             WHERE e.idcourse = ? 
             AND u.type = 2 
             AND t.idcourse = ?
             AND p.delete_at = "1998-12-31 17:00:00"
             AND p.point > 0
             GROUP BY u.stdid, u.name
             HAVING submittedCount >= 2
             ORDER BY avgScore DESC
             LIMIT 10`,
            [offering.id, offering.id]
        );

        // Convert avgScore to number for each top performer
        const processedTopPerformers = topPerformers.map(student => ({
            ...student,
            avgScore: parseFloat(student.avgScore) || 0
        }));

        // Get students needing attention (low submission rate)
        const [needsAttention]: [any[], any] = await promisePool.query(
            `SELECT 
                u.stdid,
                u.name,
                u.image,
                u.email,
                (COUNT(CASE WHEN p.point > 0 THEN 1 END) / COUNT(t.id)) * 100 as submissionRate,
                COUNT(CASE WHEN p.point > 0 THEN 1 END) as submittedCount,
                COUNT(t.id) as totalAssignments
             FROM users u
             JOIN enllo e ON u.stdid = e.stdid
             CROSS JOIN titelwork t
             LEFT JOIN points p ON u.stdid = p.stdid AND p.idtitelwork = t.id AND p.delete_at = "1998-12-31 17:00:00"
             WHERE e.idcourse = ? 
             AND u.type = 2 
             AND t.idcourse = ?
             AND t.delete_at IS NULL
             GROUP BY u.stdid, u.name
             HAVING submissionRate < 60
             ORDER BY submissionRate ASC
             LIMIT 10`,
            [offering.id, offering.id]
        );

        // Convert submissionRate to number for each student
        const processedNeedsAttention = needsAttention.map(student => ({
            ...student,
            submissionRate: parseFloat(student.submissionRate) || 0
        }));

        const courseStats = {
            subjectName: offering.subject_name,
            subjectCode: offering.subject_code,
            year: offering.year,
            semester: offering.semester,
            totalStudents: studentCount[0].count,
            totalTeachers: teacherCount[0].count,
            totalAssignments: assignments.length,
            overallAvgScore,
            overallSubmissionRate,
            assignments: assignmentStats,
            recentTrend,
            topPerformers: processedTopPerformers,
            needsAttention: processedNeedsAttention
        };

        res.status(200).json(courseStats);

    } catch (error) {
        console.error('Error fetching course overview:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default authenticateApiKey(handler); 