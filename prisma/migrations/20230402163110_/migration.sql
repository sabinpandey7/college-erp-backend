/*
  Warnings:

  - Added the required column `question` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignment` ADD COLUMN `question` VARCHAR(191) NOT NULL;
