-- CreateTable
CREATE TABLE `Routine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `branch` ENUM('CSE', 'ME', 'CIVIL', 'EEE', 'ECE') NOT NULL DEFAULT 'CSE',
    `session` INTEGER NOT NULL,
    `sem` INTEGER NOT NULL,
    `batch` INTEGER NOT NULL,

    UNIQUE INDEX `Routine_batch_key`(`batch`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routine_id` INTEGER NOT NULL,
    `day` ENUM('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT') NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_routine_id_fkey` FOREIGN KEY (`routine_id`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
