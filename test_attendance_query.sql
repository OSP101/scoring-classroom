-- Test query to check attendance_sessions
SELECT 
    s.id,
    s.course_offering_id,
    s.session_name,
    s.pin_code,
    s.is_active,
    s.created_at,
    COUNT(DISTINCT r.id) as total_records
FROM attendance_sessions s
LEFT JOIN attendance_records r ON s.id = r.session_id
GROUP BY s.id
ORDER BY s.created_at DESC
LIMIT 10;
