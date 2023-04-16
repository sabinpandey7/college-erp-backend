/*
  Warnings:

  - You are about to drop the `submittedassignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `submittedassignment` DROP FOREIGN KEY `SubmittedAssignment_assignment_id_fkey`;

-- DropForeignKey
ALTER TABLE `submittedassignment` DROP FOREIGN KEY `SubmittedAssignment_user_id_fkey`;

-- DropTable
DROP TABLE `submittedassignment`;

-- CreateTable
CREATE TABLE `AssignmentAssignTo` (
    `assignment_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`assignment_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssignmentAssignTo` ADD CONSTRAINT `AssignmentAssignTo_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentAssignTo` ADD CONSTRAINT `AssignmentAssignTo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
