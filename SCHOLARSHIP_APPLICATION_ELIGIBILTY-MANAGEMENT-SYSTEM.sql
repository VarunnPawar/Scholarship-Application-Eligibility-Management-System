CREATE DATABASE IF NOT EXISTS ScholarshipDB;
USE ScholarshipDB;

DROP TABLE IF EXISTS Applications;
DROP TABLE IF EXISTS Scholarships;
DROP TABLE IF EXISTS Students;

CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    course VARCHAR(100),
    year_of_study INT,
    family_income DECIMAL(10,2),
    category VARCHAR(30),
    cgpa DECIMAL(3,2),
    phone VARCHAR(15)
);

CREATE TABLE Scholarships (
    scholarship_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_name VARCHAR(150) NOT NULL,
    min_cgpa DECIMAL(3,2),
    max_income DECIMAL(10,2),
    eligible_category VARCHAR(30),
    amount DECIMAL(10,2),
    funding_type VARCHAR(50),
    institution_type VARCHAR(50),
    deadline DATE
);

CREATE TABLE Applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    scholarship_id INT,
    application_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    remarks VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES Scholarships(scholarship_id) ON DELETE CASCADE,
    UNIQUE (student_id, scholarship_id)
);

INSERT INTO Students (name, email, course, year_of_study, family_income, category, cgpa, phone) VALUES
('Rahul Sharma', 'rahul.sharma@gmail.com', 'BTech CSE', 2, 180000, 'OBC', 8.20, '9811245610'),
('Priya Verma', 'priya.verma@gmail.com', 'BTech AI ML', 1, 120000, 'SC', 9.10, '9811245611'),
('Aman Singh', 'aman.singh@gmail.com', 'BTech CSE', 3, 350000, 'General', 7.50, '9811245612'),
('Neha Gupta', 'neha.gupta@outlook.com', 'BTech IT', 2, 200000, 'EWS', 8.70, '9811245613'),
('Karan Mehta', 'karan.mehta@gmail.com', 'BTech Mech', 4, 150000, 'General', 8.00, '9811245614'),
('Sneha Roy', 'sneha.roy@gmail.com', 'BTech Civil', 2, 280000, 'OBC', 6.90, '9811245615'),
('Amit Kumar', 'amit.kumar@gmail.com', 'BTech ECE', 3, 95000, 'SC', 8.50, '9811245616'),
('Divya Nair', 'divya.nair@gmail.com', 'BTech AI ML', 1, 400000, 'General', 9.40, '9811245617'),
('Rohan Das', 'rohan.das@yahoo.com', 'BTech IT', 3, 220000, 'EWS', 7.80, '9811245618'),
('Pooja Patel', 'pooja.patel@gmail.com', 'BTech CSE', 4, 175000, 'OBC', 8.90, '9811245619'),
('Aditya Rao', 'aditya.rao@gmail.com', 'BTech CSE', 2, 160000, 'General', 8.10, '9820114501'),
('Ananya Sen', 'ananya.sen@gmail.com', 'BTech IT', 1, 110000, 'SC', 9.20, '9820114502'),
('Vikram Malhotra', 'vikram.malhotra@gmail.com', 'BTech ECE', 3, 320000, 'General', 7.40, '9820114503'),
('Tanvi Joshi', 'tanvi.joshi@gmail.com', 'BTech AI ML', 2, 190000, 'OBC', 8.30, '9820114504'),
('Manish Pandey', 'manish.pandey@gmail.com', 'BTech Mech', 4, 210000, 'EWS', 7.10, '9820114505'),
('Ritu Sharma', 'ritu.sharma@gmail.com', 'BTech Civil', 1, 130000, 'SC', 8.80, '9820114506'),
('Siddharth Kulkarni', 'siddharth.kulkarni@gmail.com', 'BTech CSE', 3, 290000, 'General', 8.50, '9820114507'),
('Megha Kapoor', 'megha.kapoor@outlook.com', 'BTech IT', 2, 240000, 'OBC', 7.90, '9820114508'),
('Tarun Bansal', 'tarun.bansal@gmail.com', 'BTech ECE', 4, 180000, 'EWS', 8.20, '9820114509'),
('Pallavi Reddy', 'pallavi.reddy@gmail.com', 'BTech AI ML', 1, 95000, 'SC', 9.50, '9820114510'),
('Abhishek Tiwari', 'abhishek.tiwari@gmail.com', 'BTech CSE', 2, 310000, 'General', 7.60, '9830198201'),
('Komal Mishra', 'komal.mishra@gmail.com', 'BTech IT', 3, 220000, 'OBC', 8.40, '9830198202'),
('Nikhil Chauhan', 'nikhil.chauhan@gmail.com', 'BTech Mech', 4, 140000, 'SC', 6.80, '9830198203'),
('Shruti Agarwal', 'shruti.agarwal@gmail.com', 'BTech Civil', 1, 195000, 'EWS', 9.00, '9830198204'),
('Harshvardhan Yadav', 'harshvardhan.yadav@gmail.com', 'BTech ECE', 2, 270000, 'General', 8.10, '9830198205'),
('Simran Kaur', 'simran.kaur@gmail.com', 'BTech AI ML', 3, 165000, 'OBC', 8.70, '9830198206'),
('Prashant Dubey', 'prashant.dubey@gmail.com', 'BTech CSE', 4, 330000, 'General', 7.20, '9830198207'),
('Ayesha Siddiqui', 'ayesha.siddiqui@gmail.com', 'BTech IT', 1, 105000, 'SC', 9.30, '9830198208'),
('Varun Saxena', 'varun.saxena@gmail.com', 'BTech Mech', 2, 250000, 'EWS', 7.90, '9830198209'),
('Nandini Chatterjee', 'nandini.chatterjee@gmail.com', 'BTech Civil', 3, 185000, 'OBC', 8.60, '9830198210'),
('Gaurav Bhardwaj', 'gaurav.bhardwaj@gmail.com', 'BTech ECE', 4, 200000, 'General', 8.40, '9840512301'),
('Swati Deshmukh', 'swati.deshmukh@gmail.com', 'BTech AI ML', 1, 115000, 'SC', 8.90, '9840512302'),
('Deepak Choudhary', 'deepak.choudhary@gmail.com', 'BTech CSE', 2, 290000, 'OBC', 7.70, '9840512303'),
('Richa Trivedi', 'richa.trivedi@gmail.com', 'BTech IT', 3, 155000, 'EWS', 8.20, '9840512304'),
('Akash Mahajan', 'akash.mahajan@gmail.com', 'BTech Mech', 4, 340000, 'General', 7.10, '9840512305'),
('Kriti Sethi', 'kriti.sethi@gmail.com', 'BTech CSE', 2, 150000, 'General', 8.50, '9840512306'),
('Saurabh Rathore', 'saurabh.rathore@gmail.com', 'BTech IT', 1, 120000, 'SC', 9.00, '9840512307'),
('Bhavna Solanki', 'bhavna.solanki@gmail.com', 'BTech ECE', 3, 280000, 'OBC', 7.40, '9840512308'),
('Yashwant Gohil', 'yashwant.gohil@gmail.com', 'BTech AI ML', 2, 190000, 'EWS', 8.30, '9840512309'),
('Tanya Khanna', 'tanya.khanna@gmail.com', 'BTech Civil', 4, 210000, 'General', 8.00, '9840512310'),
('Farhan Qureshi', 'farhan.qureshi@gmail.com', 'BTech CSE', 1, 98000, 'SC', 9.10, '9850778801'),
('Mansi Bhatt', 'mansi.bhatt@gmail.com', 'BTech IT', 3, 310000, 'General', 7.60, '9850778802'),
('Chetan Kulkarni', 'chetan.kulkarni@gmail.com', 'BTech Mech', 2, 175000, 'OBC', 8.40, '9850778803'),
('Aishwarya Iyer', 'aishwarya.iyer@gmail.com', 'BTech ECE', 4, 220000, 'EWS', 7.80, '9850778804'),
('Devansh Gill', 'devansh.gill@gmail.com', 'BTech AI ML', 1, 135000, 'SC', 8.90, '9850778805'),
('Sakshi Jindal', 'sakshi.jindal@gmail.com', 'BTech Civil', 2, 260000, 'General', 8.10, '9850778806'),
('Prateek Hegde', 'prateek.hegde@gmail.com', 'BTech CSE', 3, 190000, 'OBC', 8.70, '9850778807'),
('Ishita Garg', 'ishita.garg@gmail.com', 'BTech IT', 4, 300000, 'General', 7.30, '9850778808'),
('Mohit Goel', 'mohit.goel@gmail.com', 'BTech ECE', 1, 110000, 'SC', 9.40, '9850778809'),
('Aditi Pawar', 'aditi.pawar@gmail.com', 'BTech AI ML', 2, 200000, 'EWS', 8.00, '9850778810'),
('Raghavendra Joshi', 'raghavendra.joshi@gmail.com', 'BTech CSE', 3, 140000, 'General', 8.60, '9860991101'),
('Payal Chawla', 'payal.chawla@gmail.com', 'BTech IT', 1, 125000, 'SC', 9.00, '9860991102'),
('Sandeep Yadav', 'sandeep.yadav@gmail.com', 'BTech Mech', 2, 270000, 'OBC', 7.50, '9860991103'),
('Ankita Rawat', 'ankita.rawat@gmail.com', 'BTech Civil', 4, 185000, 'EWS', 8.20, '9860991104'),
('Kunal Kapoor', 'kunal.kapoor@gmail.com', 'BTech ECE', 3, 230000, 'General', 7.90, '9860991105'),
('Shreya Menon', 'shreya.menon@gmail.com', 'BTech AI ML', 1, 95000, 'SC', 9.20, '9860991106'),
('Vivek Deshpande', 'vivek.deshpande@gmail.com', 'BTech CSE', 2, 320000, 'General', 7.40, '9860991107'),
('Harpreet Kaur', 'harpreet.kaur@gmail.com', 'BTech IT', 4, 160000, 'OBC', 8.80, '9860991108'),
('Arjun Nair', 'arjun.nair@gmail.com', 'BTech Mech', 3, 210000, 'EWS', 8.10, '9860991109'),
('Sonali Kulkarni', 'sonali.kulkarni@gmail.com', 'BTech Civil', 1, 130000, 'SC', 8.90, '9860991110'),
('Rajat Sharma', 'rajat.sharma@gmail.com', 'BTech ECE', 2, 250000, 'General', 8.30, '9871223301'),
('Preeti Verma', 'preeti.verma@gmail.com', 'BTech AI ML', 3, 170000, 'OBC', 8.50, '9871223302'),
('Ritesh Deshmukh', 'ritesh.deshmukh@gmail.com', 'BTech CSE', 4, 290000, 'General', 7.70, '9871223303'),
('Karishma Sinha', 'karishma.sinha@gmail.com', 'BTech IT', 1, 105000, 'SC', 9.50, '9871223304'),
('Faizan Khan', 'faizan.khan@gmail.com', 'BTech Mech', 2, 195000, 'EWS', 8.00, '9871223305'),
('Esha Chatterjee', 'esha.chatterjee@gmail.com', 'BTech Civil', 3, 240000, 'OBC', 7.80, '9871223306'),
('Tushar Malhotra', 'tushar.malhotra@gmail.com', 'BTech ECE', 4, 310000, 'General', 7.20, '9871223307'),
('Amrita Rao', 'amrita.rao@gmail.com', 'BTech AI ML', 1, 115000, 'SC', 9.10, '9871223308'),
('Ankit Srivastava', 'ankit.srivastava@gmail.com', 'BTech CSE', 2, 180000, 'EWS', 8.40, '9871223309'),
('Garima Singh', 'garima.singh@gmail.com', 'BTech IT', 3, 220000, 'OBC', 8.20, '9871223310'),
('Zaid Shaikh', 'zaid.shaikh@gmail.com', 'BTech Mech', 4, 150000, 'General', 8.60, '9881445501'),
('Chaitali Joshi', 'chaitali.joshi@gmail.com', 'BTech Civil', 1, 125000, 'SC', 8.90, '9881445502'),
('Dinesh Menon', 'dinesh.menon@gmail.com', 'BTech ECE', 2, 280000, 'General', 7.60, '9881445503'),
('Bharti Patidar', 'bharti.patidar@gmail.com', 'BTech AI ML', 3, 160000, 'OBC', 8.70, '9881445504'),
('Aryan Vaidya', 'aryan.vaidya@gmail.com', 'BTech CSE', 4, 330000, 'General', 7.10, '9881445505'),
('Diya Mirza', 'diya.mirza@gmail.com', 'BTech IT', 1, 100000, 'SC', 9.30, '9881445506'),
('Kunal Khemu', 'kunal.khemu@gmail.com', 'BTech Mech', 2, 210000, 'EWS', 8.00, '9881445507'),
('Soha Ali', 'soha.ali@gmail.com', 'BTech Civil', 3, 190000, 'OBC', 8.40, '9881445508'),
('Pulkit Agrawal', 'pulkit.agrawal@gmail.com', 'BTech ECE', 4, 250000, 'General', 7.90, '9881445509'),
('Yamini Gautam', 'yamini.gautam@gmail.com', 'BTech AI ML', 1, 110000, 'SC', 9.00, '9881445510'),
('Siddharth Malhotra', 'siddharth.malhotra@gmail.com', 'BTech CSE', 2, 175000, 'EWS', 8.50, '9891667701'),
('Parineeti Chopra', 'parineeti.chopra@gmail.com', 'BTech IT', 3, 290000, 'General', 7.50, '9891667702'),
('Aditi Rao', 'aditi.rao@gmail.com', 'BTech Mech', 4, 140000, 'OBC', 8.80, '9891667703'),
('Tanmay Bhatt', 'tanmay.bhatt@gmail.com', 'BTech Civil', 1, 130000, 'SC', 8.90, '9891667704'),
('Vikrant Massey', 'vikrant.massey@gmail.com', 'BTech ECE', 2, 220000, 'General', 8.10, '9891667705'),
('Radhika Apte', 'radhika.apte@gmail.com', 'BTech AI ML', 3, 185000, 'OBC', 8.60, '9891667706'),
('Alok Nath', 'alok.nath@gmail.com', 'BTech CSE', 4, 310000, 'General', 7.40, '9891667707'),
('Richa Chadha', 'richa.chadha@gmail.com', 'BTech IT', 1, 95000, 'SC', 9.40, '9891667708'),
('Pankaj Tripathi', 'pankaj.tripathi@gmail.com', 'BTech Mech', 2, 200000, 'EWS', 8.20, '9891667709'),
('Komal Sen', 'komal.sen@gmail.com', 'BTech Civil', 3, 240000, 'OBC', 7.90, '9891667710'),
('Naveen Siddiqui', 'naveen.siddiqui@gmail.com', 'BTech ECE', 4, 300000, 'General', 7.30, '9901889901'),
('Swati Bhaskar', 'swati.bhaskar@gmail.com', 'BTech AI ML', 1, 115000, 'SC', 9.10, '9901889902'),
('Jatin Sarna', 'jatin.sarna@gmail.com', 'BTech CSE', 2, 160000, 'EWS', 8.50, '9901889903'),
('Shobhita Kulkarni', 'shobhita.kulkarni@gmail.com', 'BTech IT', 3, 270000, 'General', 7.60, '9901889904'),
('Vijay Varma', 'vijay.varma@gmail.com', 'BTech Mech', 4, 150000, 'OBC', 8.70, '9901889905'),
('Mrunal Thakur', 'mrunal.thakur@gmail.com', 'BTech Civil', 1, 120000, 'SC', 9.00, '9901889906'),
('Abhimanyu Das', 'abhimanyu.das@gmail.com', 'BTech ECE', 2, 230000, 'General', 8.00, '9901889907'),
('Sanya Malhotra', 'sanya.malhotra@gmail.com', 'BTech AI ML', 3, 190000, 'OBC', 8.40, '9901889908'),
('Junaid Khan', 'junaid.khan@gmail.com', 'BTech CSE', 4, 320000, 'General', 7.20, '9901889909'),
('Khushi Kapoor', 'khushi.kapoor@gmail.com', 'BTech IT', 1, 105000, 'SC', 9.30, '9901889910');

INSERT INTO Scholarships (scholarship_name, min_cgpa, max_income, eligible_category, amount, funding_type, institution_type, deadline) VALUES
('National Merit Scholarship', 8.00, 300000, 'All', 25000, 'National', 'All Universities', '2026-12-31'),
('Global Excellence Grant', 9.00, 500000, 'All', 75000, 'International', 'All Universities', '2026-12-15'),
('State Need Based Scholarship', 7.00, 200000, 'All', 20000, 'State Government', 'Government Colleges Only', '2026-11-30'),
('Private University Achievers Grant', 7.50, 350000, 'All', 30000, 'Private', 'Private Universities Only', '2026-12-25'),
('OBC Welfare Scholarship', 6.00, 250000, 'OBC', 15000, 'National', 'All Universities', '2026-12-15'),
('SC Dr. Ambedkar Scholarship', 6.00, 250000, 'SC', 18000, 'National', 'All Universities', '2026-12-20'),
('Corporate CSR Tech Scholarship', 8.50, 300000, 'General', 40000, 'Corporate', 'Private Universities Only', '2026-12-10'),
('International Research Fellowship', 9.20, 600000, 'All', 100000, 'International', 'All Universities', '2026-12-30');

INSERT INTO Applications (student_id, scholarship_id, remarks, status) VALUES
(1, 1, 'Eligible for scholarship', 'Approved'),
(1, 5, 'Application submitted', 'Pending'),
(2, 1, 'Application submitted', 'Pending'),
(2, 6, 'Application submitted', 'Pending'),
(3, 1, 'Does not meet criteria', 'Rejected'),
(4, 3, 'Application submitted', 'Pending'),
(5, 4, 'Eligible for private grant', 'Approved'),
(6, 5, 'Application submitted', 'Pending'),
(7, 6, 'Verified SC certificate', 'Approved'),
(8, 2, 'International grant review', 'Pending'),
(9, 3, 'Application submitted', 'Pending'),
(10, 7, 'Approved under CSR quota', 'Approved'),
(12, 2, 'High CGPA merit approved', 'Approved'),
(15, 4, 'Application submitted', 'Pending'),
(20, 8, 'Research proposal attached', 'Pending');

SELECT * FROM Students;

SELECT scholarship_id, scholarship_name, funding_type, institution_type, amount, deadline FROM Scholarships;

SELECT * FROM Applications;

SELECT s.student_id, s.name, s.cgpa, s.family_income,
       sc.scholarship_name, sc.funding_type, sc.institution_type, sc.amount
FROM Students s
CROSS JOIN Scholarships sc
WHERE s.cgpa >= sc.min_cgpa
AND s.family_income <= sc.max_income
AND (sc.eligible_category = 'All'
     OR s.category = sc.eligible_category)
AND (sc.deadline IS NULL OR sc.deadline >= CURRENT_DATE);

SELECT a.application_id, s.name, sc.scholarship_name, sc.funding_type,
       sc.amount, a.application_date, a.status, a.remarks
FROM Applications a
JOIN Students s ON a.student_id = s.student_id
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id;

UPDATE Applications
SET status = 'Approved', remarks = 'Eligible for scholarship'
WHERE application_id = 2;

UPDATE Applications
SET status = 'Rejected', remarks = 'Does not meet criteria'
WHERE application_id = 5;

SELECT status, COUNT(*) AS total_applications
FROM Applications
GROUP BY status;

SELECT sc.scholarship_name, COUNT(a.application_id) AS total_applications
FROM Scholarships sc
LEFT JOIN Applications a
ON sc.scholarship_id = a.scholarship_id
GROUP BY sc.scholarship_id, sc.scholarship_name;

SELECT * FROM Students
WHERE cgpa > 8.0;

SELECT * FROM Students
WHERE family_income < 200000;

SELECT * FROM Scholarships
ORDER BY amount DESC;

SELECT * FROM Students
WHERE name LIKE '%Rahul%';

SELECT COUNT(*) AS total_students
FROM Students;

SELECT s.name, sc.scholarship_name, sc.funding_type, sc.amount
FROM Applications a
JOIN Students s ON a.student_id = s.student_id
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id
WHERE a.status = 'Approved';

SELECT SUM(sc.amount) AS total_approved_amount
FROM Applications a
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id
WHERE a.status = 'Approved';

SELECT * FROM Scholarships
WHERE funding_type = 'International' OR institution_type = 'Private Universities Only';

CREATE OR REPLACE VIEW PendingApplications AS
SELECT a.application_id, s.name, sc.scholarship_name, sc.funding_type,
       a.application_date, a.status
FROM Applications a
JOIN Students s ON a.student_id = s.student_id
JOIN Scholarships sc ON a.scholarship_id = sc.scholarship_id
WHERE a.status = 'Pending';

SELECT * FROM PendingApplications;

SELECT s.student_id, s.name
FROM Students s
LEFT JOIN Applications a ON s.student_id = a.student_id
WHERE a.application_id IS NULL;

SELECT AVG(cgpa) AS average_cgpa
FROM Students;

SHOW TABLES;
