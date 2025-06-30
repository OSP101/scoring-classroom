-- Step 1: Rename the existing 'course' table to 'subjects'
ALTER TABLE `course` RENAME TO `subjects`;

-- Step 2: Modify the 'subjects' table structure
-- First, add the new 'subject_code' column
ALTER TABLE `subjects` ADD `subject_code` VARCHAR(20) NOT NULL AFTER `idcourse`;
-- Let's populate the subject_code from the existing idcourse for now. You can update it later.
UPDATE `subjects` SET `subject_code` = `idcourse`;
-- Now, drop unnecessary columns from the subjects table
ALTER TABLE `subjects`
  DROP COLUMN `numOpened`,
  DROP COLUMN `teacher`,
  DROP COLUMN `track`,
  DROP COLUMN `status`,
  DROP COLUMN `image`,
  DROP COLUMN `detail`,
  DROP COLUMN `invitecode`,
  DROP COLUMN `Co Ces`,
  CHANGE `idcourse` `id` VARCHAR(10) NOT NULL;


-- Step 3: Create the new 'course_offerings' table
CREATE TABLE `course_offerings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `subject_id` VARCHAR(10) NOT NULL,
  `year` INT NOT NULL,
  `semester` INT NOT NULL,
  `status` ENUM('o', 'c') NOT NULL DEFAULT 'o',
  `image` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_course_offerings_subjects_idx` (`subject_id` ASC) VISIBLE,
  CONSTRAINT `fk_course_offerings_subjects`
    FOREIGN KEY (`subject_id`)
    REFERENCES `subjects` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- Step 4: Populate 'course_offerings' with data from the original 'course' table as a starting point
-- This is a sample migration. We'll assume existing courses are for a default year/semester, e.g., 2567/1.
-- You might need to adjust this logic based on your actual data.
INSERT INTO `course_offerings` (`subject_id`, `year`, `semester`, `status`, `image`)
SELECT `id`, 2567, 1, 'o', 'sc363204.png' FROM `subjects` WHERE `id` = 'SC363204';

INSERT INTO `course_offerings` (`subject_id`, `year`, `semester`, `status`, `image`)
SELECT `id`, 2567, 1, 'o', 'cp421024.png' FROM `subjects` WHERE `id` = 'CP421024';

-- You can add more INSERT statements for other existing courses here.

-- Step 5: Altering related tables ('enllo', 'titelwork', 'points')
-- WARNING: The following steps require careful execution.
-- It's best to do this after verifying the above steps and backing up your data.
-- We will need to add a 'course_offering_id' column and then migrate the data.

/*
-- For 'enllo' table:
ALTER TABLE `enllo` ADD `course_offering_id` INT NULL AFTER `idcourse`;
-- You would then need a script to populate this new column based on the user and the old idcourse.
-- For example, find the default offering we created and link it:
-- UPDATE `enllo` e
-- JOIN `course_offerings` co ON e.idcourse = co.subject_id
-- SET e.course_offering_id = co.id
-- WHERE co.year = 2567 AND co.semester = 1;

-- After migration, you can make the column NOT NULL and eventually drop 'idcourse'.
-- ALTER TABLE `enllo` DROP FOREIGN KEY `fk_enllo_course`; -- Drop old constraint if exists
-- ALTER TABLE `enllo` DROP INDEX `fk_enllo_course_idx` ; -- Drop old index if exists
-- ALTER TABLE `enllo` DROP COLUMN `idcourse`;
-- ALTER TABLE `enllo` ADD CONSTRAINT `fk_enllo_course_offering`
--   FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings`(`id`);


-- Similar steps would be required for 'titelwork' and 'points' tables.
*/

-- For now, focus on applying the first 4 steps. The 5th step is a guideline for the next phase. 