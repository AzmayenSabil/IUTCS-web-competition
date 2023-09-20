USE dms_db;
CREATE TABLE `scripts` (
                           script_id BIGINT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
                           script_name VARCHAR(15) NOT NULL,
                           createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           PRIMARY KEY (`script_id`)
);