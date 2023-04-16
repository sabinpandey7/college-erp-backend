/*
  Warnings:

  - You are about to drop the column `lectureId` on the `submittedassignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `submittedassignment` DROP FOREIGN KEY `SubmittedAssignment_lectureId_fkey`;

-- AlterTable
ALTER TABLE `submittedassignment` DROP COLUMN `lectureId`;
