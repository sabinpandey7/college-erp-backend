-- DropForeignKey
ALTER TABLE `lecture` DROP FOREIGN KEY `Lecture_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `lecture` DROP FOREIGN KEY `Lecture_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `lecture_students` DROP FOREIGN KEY `Lecture_Students_lecture_id_fkey`;

-- DropForeignKey
ALTER TABLE `lecture_students` DROP FOREIGN KEY `Lecture_Students_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `membersofchat` DROP FOREIGN KEY `MembersOfChat_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `membersofchat` DROP FOREIGN KEY `MembersOfChat_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_author_id_fkey`;

-- AlterTable
ALTER TABLE `lecture` MODIFY `teacher_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Period` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lecture_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendence` (
    `periods_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`periods_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lecture_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubmittedAssignment` (
    `lecture_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`lecture_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture_Students` ADD CONSTRAINT `Lecture_Students_lecture_id_fkey` FOREIGN KEY (`lecture_id`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecture_Students` ADD CONSTRAINT `Lecture_Students_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Period` ADD CONSTRAINT `Period_lecture_id_fkey` FOREIGN KEY (`lecture_id`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendence` ADD CONSTRAINT `Attendence_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendence` ADD CONSTRAINT `Attendence_periods_id_fkey` FOREIGN KEY (`periods_id`) REFERENCES `Period`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_lecture_id_fkey` FOREIGN KEY (`lecture_id`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmittedAssignment` ADD CONSTRAINT `SubmittedAssignment_lecture_id_fkey` FOREIGN KEY (`lecture_id`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmittedAssignment` ADD CONSTRAINT `SubmittedAssignment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembersOfChat` ADD CONSTRAINT `MembersOfChat_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MembersOfChat` ADD CONSTRAINT `MembersOfChat_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
