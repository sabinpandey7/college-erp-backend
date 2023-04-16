/*
  Warnings:

  - The primary key for the `submittedassignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lecture_id` on the `submittedassignment` table. All the data in the column will be lost.
  - Added the required column `assignment_id` to the `SubmittedAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `submittedassignment` DROP FOREIGN KEY `SubmittedAssignment_lecture_id_fkey`;

-- AlterTable
ALTER TABLE `submittedassignment` DROP PRIMARY KEY,
    DROP COLUMN `lecture_id`,
    ADD COLUMN `assignment_id` INTEGER NOT NULL,
    ADD COLUMN `lectureId` INTEGER NULL,
    ADD PRIMARY KEY (`assignment_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `SubmittedAssignment` ADD CONSTRAINT `SubmittedAssignment_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmittedAssignment` ADD CONSTRAINT `SubmittedAssignment_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
