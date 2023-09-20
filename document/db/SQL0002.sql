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
        ALTER TABLE users ADD UNIQUE (employee_id);
        ALTER TABLE users ADD UNIQUE (email);
        /* Do not edit the line below */
        INSERT INTO scripts (script_name) VALUES (CONCAT('SQL', LPAD(version_number_new, 4, 0), '.sql'));
    END IF;
END$
DELIMITER ;

/* Enter the new version number as the parameter vvvvvvvvvvvvvvv */
CALL UPDATE_PORTAL(2);
/* Enter the new version number as the parameter ^^^^^^^^^^^^^^^ */

/* Do not edit the line below */
DROP PROCEDURE UPDATE_PORTAL;