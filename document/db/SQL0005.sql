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
        ALTER TABLE users
            ADD COLUMN type varchar(255) DEFAULT NULL,
            ADD COLUMN designation varchar(255) DEFAULT NULL,
            ADD COLUMN current_status varchar(255) DEFAULT NULL,
            ADD COLUMN end_of_contract date DEFAULT NULL,
            ADD COLUMN release_date date DEFAULT NULL,
            ADD COLUMN gross_salary varchar(255) DEFAULT NULL,
            ADD COLUMN department varchar(255) DEFAULT NULL,
            ADD COLUMN name_in_nid varchar(255) DEFAULT NULL,
            ADD COLUMN g_account varchar(255) DEFAULT NULL,
            ADD COLUMN joining_date date DEFAULT NULL,
            ADD COLUMN blood_group varchar(255) DEFAULT NULL,
            ADD COLUMN religion varchar(255) DEFAULT NULL,
            ADD COLUMN contact varchar(255) DEFAULT NULL,
            ADD COLUMN personal_email varchar(255) DEFAULT NULL,
            ADD COLUMN bank_account_number varchar(255) DEFAULT NULL,
            ADD COLUMN bank_account_name varchar(255) DEFAULT NULL,
            ADD COLUMN name_in_etin varchar(255) DEFAULT NULL,
            ADD COLUMN etin varchar(255) DEFAULT NULL,
            ADD COLUMN nid_number varchar(255) DEFAULT NULL,
            ADD COLUMN present_address varchar(255) DEFAULT NULL,
            ADD COLUMN permanent_address varchar(255) DEFAULT NULL,
            ADD COLUMN nid varchar(255) DEFAULT NULL,
            ADD COLUMN tin varchar(255) DEFAULT NULL,
            ADD COLUMN ssc_certificate varchar(255) DEFAULT NULL,
            ADD COLUMN hsc_certificate varchar(255) DEFAULT NULL,
            ADD COLUMN hons_certificate varchar(255) DEFAULT NULL,
            ADD COLUMN last_office_clearance varchar(255) DEFAULT NULL,
            ADD COLUMN last_office_salary_certificate varchar(255) DEFAULT NULL,
            ADD COLUMN tax_return_documents varchar(255) DEFAULT NULL,
            ADD COLUMN passport_size_photo varchar(255) DEFAULT NULL,
            ADD COLUMN passport varchar(255) DEFAULT NULL;
        /* Do not edit the line below */
        INSERT INTO scripts (script_name) VALUES (CONCAT('SQL', LPAD(version_number_new, 4, 0), '.sql'));
END IF;
END$
DELIMITER ;

/* Enter the new version number as the parameter vvvvvvvvvvvvvvv */
CALL UPDATE_PORTAL(5);
/* Enter the new version number as the parameter ^^^^^^^^^^^^^^^ */

/* Do not edit the line below */
DROP PROCEDURE UPDATE_PORTAL;

