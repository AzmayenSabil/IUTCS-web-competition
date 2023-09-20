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
        /* ADD DDL & DML CODE HERE ^^^^^^^^^^^^^^^^^^^^^ */
        CREATE TABLE holidayCalender (
                                         holiday_id SERIAL PRIMARY KEY,
                                         date DATE NOT NULL UNIQUE,
                                         holiday_name VARCHAR(255) NOT NULL,
                                         createdAt datetime DEFAULT NULL,
                                         updatedAt datetime DEFAULT NULL
        );


        ALTER TABLE `holidayCalender` RENAME `holidays`;
        /* Do not edit the line below */
        INSERT INTO scripts (script_name) VALUES (CONCAT('SQL', LPAD(version_number_new, 4, 0), '.sql'));
END IF;
END$
DELIMITER ;

/* Enter the new version number as the parameter vvvvvvvvvvvvvvv */
CALL UPDATE_PORTAL(4);
/* Enter the new version number as the parameter ^^^^^^^^^^^^^^^ */

/* Do not edit the line below */
DROP PROCEDURE UPDATE_PORTAL;
