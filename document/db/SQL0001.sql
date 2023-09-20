/* Do not edit the line below */
USE dms_db;
DROP PROCEDURE IF EXISTS UPDATE_PORTAL;

DELIMITER $
CREATE PROCEDURE UPDATE_PORTAL(IN version_number_new INT)
BEGIN
    DECLARE version_number_old INT;
    SET version_number_old = (SELECT COALESCE(MAX(script_id), 0) FROM scripts);
    SELECT version_number_old;
    IF version_number_old = version_number_new - 1 THEN

        CREATE TABLE `admins` (
                                  `user_id` bigint(20) NOT NULL,
                                  `admin_id` int(11) NOT NULL,
                                  `name` varchar(255) NOT NULL,
                                  `email` varchar(255) NOT NULL,
                                  `gender` varchar(255) NOT NULL,
                                  `password` varchar(255) NOT NULL,
                                  `active` varchar(255) NOT NULL,
                                  `isSuperAdmin` varchar(255) NOT NULL,
                                  `createdAt` datetime DEFAULT NULL,
                                  `updatedAt` datetime DEFAULT NULL,
                                  `deletedAt` datetime DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE `menus` (
                                 `menu_id` int(11) NOT NULL,
                                 `date` datetime NOT NULL,
                                 `package_id` int(11) NOT NULL,
                                 `meal_type` varchar(255) NOT NULL,
                                 `deletedAt` datetime DEFAULT NULL,
                                 `createdAt` datetime NOT NULL,
                                 `updatedAt` datetime NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE `orders` (
                                  `user_id` bigint(20) NOT NULL,
                                  `menu_id` int(11) NOT NULL,
                                  `deleted_at` datetime DEFAULT NULL,
                                  `createdAt` datetime NOT NULL,
                                  `updatedAt` datetime NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE `packages` (
                                    `package_id` int(11) NOT NULL,
                                    `name` varchar(255) NOT NULL,
                                    `price` int(11) NOT NULL,
                                    `vendor` varchar(255) NOT NULL,
                                    `active` varchar(255) NOT NULL,
                                    `createdAt` datetime NOT NULL,
                                    `updatedAt` datetime NOT NULL,
                                    `deletedAt` datetime DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE `roles` (
                                 `role_id` int(11) NOT NULL,
                                 `role_name` varchar(255) NOT NULL,
                                 `createdAt` datetime NOT NULL,
                                 `updatedAt` datetime NOT NULL,
                                 `deletedAt` datetime NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE `settings` (
                                    `id` bigint(20) NOT NULL,
                                    `name` varchar(120) NOT NULL,
                                    `value` varchar(500) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        CREATE TABLE `users` (
                                 `user_id` bigint(20) NOT NULL,
                                 `employee_id` int(11) DEFAULT NULL,
                                 `name` varchar(255) DEFAULT NULL,
                                 `email` varchar(255) DEFAULT NULL,
                                 `date_of_birth` varchar(225) DEFAULT NULL,
                                 `gender` varchar(255) DEFAULT NULL,
                                 `password` varchar(255) DEFAULT NULL,
                                 `active` varchar(255) DEFAULT NULL,
                                 `createdAt` datetime DEFAULT NULL,
                                 `updatedAt` datetime DEFAULT NULL,
                                 `role` int(11) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

        ALTER TABLE `admins`
            ADD PRIMARY KEY (`user_id`);

        ALTER TABLE `menus`
            ADD PRIMARY KEY (`menu_id`);

        ALTER TABLE `orders`
            ADD PRIMARY KEY (`user_id`,`menu_id`);

        ALTER TABLE `packages`
            ADD PRIMARY KEY (`package_id`);

        ALTER TABLE `roles`
            ADD PRIMARY KEY (`role_id`);

        ALTER TABLE `settings`
            ADD PRIMARY KEY (`id`);

        ALTER TABLE `users`
            ADD PRIMARY KEY (`user_id`);

        ALTER TABLE `admins`
            MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

        ALTER TABLE `menus`
            MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

        ALTER TABLE `packages`
            MODIFY `package_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

        ALTER TABLE `roles`
            MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

        ALTER TABLE `settings`
            MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

        ALTER TABLE `users`
            MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
        COMMIT;
        /* ADD DDL & DML CODE HERE ^^^^^^^^^^^^^^^^^^^^^ */

        /* Do not edit the line below */
        INSERT INTO scripts (script_name) VALUES (CONCAT('SQL', LPAD(version_number_new, 4, 0), '.sql'));
    END IF;
END$
DELIMITER ;

/* Enter the new version number as the parameter vvvvvvvvvvvvvvv */
CALL UPDATE_PORTAL(1);
/* Enter the new version number as the parameter ^^^^^^^^^^^^^^^ */

/* Do not edit the line below */
DROP PROCEDURE UPDATE_PORTAL;
