-- Fix collation issues between tables
-- This script will standardize all collations to utf8mb4_unicode_ci

-- 1. Fix caretaker table
ALTER TABLE `caretaker` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 2. Fix enllo table  
ALTER TABLE `enllo` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 3. Fix edit_point table
ALTER TABLE `edit_point` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 4. Fix extra_point table
ALTER TABLE `extra_point` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 5. Fix kahoot_point table
ALTER TABLE `kahoot_point` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 6. Fix opencourse table
ALTER TABLE `opencourse` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 7. Fix titelwork table
ALTER TABLE `titelwork` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 8. Fix topic_create table (if it has idcourse column)
-- ALTER TABLE `topic_create` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- 9. Fix points table (if it has idcourse column)
-- ALTER TABLE `points` MODIFY `idcourse` VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- Verify the changes
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CHARACTER_SET_NAME,
    COLLATION_NAME
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'scoring_classroom' 
    AND COLUMN_NAME IN ('idcourse', 'subject_id', 'id')
    AND TABLE_NAME IN ('caretaker', 'enllo', 'edit_point', 'extra_point', 'kahoot_point', 'opencourse', 'titelwork', 'course_offerings', 'subjects')
ORDER BY TABLE_NAME, COLUMN_NAME; 