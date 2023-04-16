/*
  Warnings:

  - Added the required column `subject_id` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lecture` ADD COLUMN `subject_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
