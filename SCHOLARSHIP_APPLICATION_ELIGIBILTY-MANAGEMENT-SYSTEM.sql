
-- CAPSTONE PROJECT: SCHOLARSHIP APPLICATION ELIGIBILITY MANAGEMENT SYSTEM

-- 1. CREATE DATABASE
CREATE DATABASE ScholarshipDB;
USE ScholarshipDB;

-- 2. STUDENT TABLE
CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    course VARCHAR(100),
    year_of_study INT,
    family_income DECIMAL(10,2),
    category VARCHAR(30),
    cgpa DECIMAL(3,2)
);

-- 3. SCHOLARSHIP TABLE
CREATE TABLE Scholarships (
    scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_name VARCHAR(150) NOT NULL,
    min_cgpa DECIMAL(3,2),
    max_income DECIMAL(10,2),
    eligible_category VARCHAR(30),
    amount DECIMAL(10,2),
    deadline DATE
);

-- 4. APPLICATION TABLE
CREATE TABLE Applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    scholarship_id INT,
    application_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    remarks VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (scholarship_id) REFERENCES Scholarships(scholarship_id),
    UNIQUE (student_id, scholarship_id)
);

-- 5. INSERT SAMPLE STUDENTS
INSERT INTO Students
(name, email, course, year_of_study, family_income, category, cgpa)
VALUES
('Rahul Sharma','rahul@gmail.com','BTech CSE',2,180000,'OBC',8.2),
('Priya Verma','priya@gmail.com','BTech AI ML',1,120000,'SC',9.1),
('Aman Singh','aman@gmail.com','BTech CSE',3,350000,'General',7.5),
('Neha Gupta','neha@gmail.com','BTech IT',2,200000,'EWS',8.7);

-- 6. INSERT SCHOLARSHIPS
INSERT INTO Scholarships
(scholarship_name, min_cgpa, max_income, eligible_category, amount, deadline)
VALUES
('Merit Scholarship',8.0,300000,'All',25000,'2026-12-31'),
('Need Based Scholarship',7.0,200000,'All',20000,'2026-11-30'),
('OBC Scholarship',6.0,250000,'OBC',15000,'2026-12-15'),
('SC Scholarship',6.0,250000,'SC',18000,'2026-12-20');

-- 7. APPLY FOR SCHOLARSHIP
INSERT INTO Applications (student_id, scholarship_id, remarks)
VALUES
(1,1,'Application submitted'),
(1,3,'Application submitted'),
(2,1,'Application submitted'),
(2,4,'Application submitted'),
(3,1,'Application submitted'),
(4,2,'Application submitted');

-- 8. DISPLAY ALL STUDENTS
SELECT * FROM Students;

-- 9. DISPLAY ALL SCHOLARSHIPS
SELECT * FROM Scholarships;

-- 10. DISPLAY ALL APPLICATIONS
SELECT * FROM Applications;

-- 11. CHECK SCHOLARSHIP ELIGIBILITY
SELECT s.student_id, s.name, s.cgpa, s.family_income,
       sc.scholarship_name, sc.amount
FROM Students s
CROSS JOIN Scholarships sc
WHERE s.cgpa >= sc.min_cgpa
AND s.family_income <= sc.max_income
AND (sc.eligible_category = 'All'
     OR s.category = sc.eligible_category)
AND (sc.deadline IS NULL OR sc.deadline >= CURRENT_DATE);

-- 12. VIEW APPLICATION DETAILS
SELECT a.application_id, s.name, sc.scholarship_name,
       sc.amount, a.application_date, a.status, a.remarks
FROM Applications a
JOIN Students s ON a.student_id = s.student_id
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id;

-- 13. UPDATE APPLICATION STATUS
UPDATE Applications
SET status = 'Approved', remarks = 'Eligible for scholarship'
WHERE application_id = 1;

-- 14. REJECT AN APPLICATION
UPDATE Applications
SET status = 'Rejected', remarks = 'Does not meet criteria'
WHERE application_id = 5;

-- 15. COUNT APPLICATIONS BY STATUS
SELECT status, COUNT(*) AS total_applications
FROM Applications
GROUP BY status;

-- 16. TOTAL APPLICATIONS PER SCHOLARSHIP
SELECT sc.scholarship_name, COUNT(a.application_id) AS total_applications
FROM Scholarships sc
LEFT JOIN Applications a
ON sc.scholarship_id = a.scholarship_id
GROUP BY sc.scholarship_id, sc.scholarship_name;

-- 17. FIND STUDENTS WITH CGPA ABOVE 8
SELECT * FROM Students
WHERE cgpa > 8.0;

-- 18. FIND STUDENTS WITH FAMILY INCOME BELOW 200000
SELECT * FROM Students
WHERE family_income < 200000;

-- 19. SORT SCHOLARSHIPS BY AMOUNT
SELECT * FROM Scholarships
ORDER BY amount DESC;

-- 20. SEARCH STUDENT BY NAME
SELECT * FROM Students
WHERE name LIKE '%Rahul%';

-- 21. COUNT TOTAL STUDENTS
SELECT COUNT(*) AS total_students
FROM Students;

-- 22. SHOW APPROVED APPLICATIONS
SELECT s.name, sc.scholarship_name, sc.amount
FROM Applications a
JOIN Students s ON a.student_id = s.student_id
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id
WHERE a.status = 'Approved';

-- 23. TOTAL APPROVED SCHOLARSHIP AMOUNT
SELECT SUM(sc.amount) AS total_approved_amount
FROM Applications a
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id
WHERE a.status = 'Approved';

-- 24. DELETE AN APPLICATION
-- Replace 6 with the application ID you want to delete.
DELETE FROM Applications
WHERE application_id = 6;

-- 25. ADD A NEW COLUMN
ALTER TABLE Students
ADD phone VARCHAR(15);

-- 26. CREATE A VIEW FOR PENDING APPLICATIONS
CREATE VIEW PendingApplications AS
SELECT a.application_id, s.name, sc.scholarship_name,
       a.application_date, a.status
FROM Applications a
JOIN Students s ON a.student_id = s.student_id
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id
WHERE a.status = 'Pending';

-- 27. DISPLAY PENDING APPLICATIONS
SELECT * FROM PendingApplications;

-- 28. FIND STUDENTS WHO HAVE NOT APPLIED
SELECT s.student_id, s.name
FROM Students s
LEFT JOIN Applications a ON s.student_id = a.student_id
WHERE a.application_id IS NULL;

-- 29. AVERAGE CGPA OF STUDENTS
SELECT AVG(cgpa) AS average_cgpa
FROM Students;

-- 30. END: VERIFY DATABASE TABLES
SHOW TABLES;
