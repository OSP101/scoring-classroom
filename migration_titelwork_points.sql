-- Migration script for titelwork and points tables to work with new database structure
-- This script will update the foreign key references from old course structure to new course_offerings structure

-- Step 1: Add new columns to titelwork table
ALTER TABLE `titelwork` ADD `course_offering_id` INT NULL AFTER `idcourse`;

-- Step 2: Update titelwork table to link with course_offerings
-- This assumes that existing titelwork entries should be linked to the default offering (year 2567, semester 1)
UPDATE `titelwork` tw
JOIN `course_offerings` co ON tw.idcourse = co.subject_id
SET tw.course_offering_id = co.id
WHERE co.year = 2567 AND co.semester = 1;

-- Step 3: Add new columns to points table (if it exists)
-- First, let's check if points table exists and has the structure we expect
-- This is a placeholder - you may need to adjust based on your actual points table structure
-- ALTER TABLE `points` ADD `course_offering_id` INT NULL AFTER `idcourse`;

-- Step 4: Update points table to link with course_offerings
-- UPDATE `points` p
-- JOIN `course_offerings` co ON p.idcourse = co.subject_id
-- SET p.course_offering_id = co.id
-- WHERE co.year = 2567 AND co.semester = 1;

-- Step 5: Update extra_point table (if it exists)
-- ALTER TABLE `extra_point` ADD `course_offering_id` INT NULL AFTER `idcourse`;
-- UPDATE `extra_point` ep
-- JOIN `course_offerings` co ON ep.idcourse = co.subject_id
-- SET ep.course_offering_id = co.id
-- WHERE co.year = 2567 AND co.semester = 1;

-- Step 6: Update kahoot_point table (if it exists)
-- ALTER TABLE `kahoot_point` ADD `course_offering_id` INT NULL AFTER `idcourse`;
-- UPDATE `kahoot_point` kp
-- JOIN `course_offerings` co ON kp.idcourse = co.subject_id
-- SET kp.course_offering_id = co.id
-- WHERE co.year = 2567 AND co.semester = 1;

-- Note: After running this migration, you should:
-- 1. Verify that all records have been properly linked
-- 2. Test the application to ensure everything works
-- 3. Once confirmed working, you can optionally drop the old idcourse columns
-- 4. Add proper foreign key constraints to the new course_offering_id columns

-- Optional: Add foreign key constraints after migration is complete
-- ALTER TABLE `titelwork` ADD CONSTRAINT `fk_titelwork_course_offering`
--   FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings`(`id`);

-- ALTER TABLE `points` ADD CONSTRAINT `fk_points_course_offering`
--   FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings`(`id`);

-- ALTER TABLE `extra_point` ADD CONSTRAINT `fk_extra_point_course_offering`
--   FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings`(`id`);

-- ALTER TABLE `kahoot_point` ADD CONSTRAINT `fk_kahoot_point_course_offering`
--   FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings`(`id`); 