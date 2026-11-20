require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Scholarship = require('./models/Scholarship');
const Application = require('./models/Application');
const User = require('./models/User');

const scholarshipsData = [
    { scholarship_id: 1, scholarship_name: 'National Merit Scholarship', min_cgpa: 8.0, max_income: 300000, eligible_category: 'All', amount: 25000, funding_type: 'National', institution_type: 'All Universities', deadline: '2026-12-31' },
    { scholarship_id: 2, scholarship_name: 'Global Excellence Grant', min_cgpa: 9.0, max_income: 500000, eligible_category: 'All', amount: 75000, funding_type: 'International', institution_type: 'All Universities', deadline: '2026-12-15' },
    { scholarship_id: 3, scholarship_name: 'State Need Based Scholarship', min_cgpa: 7.0, max_income: 200000, eligible_category: 'All', amount: 20000, funding_type: 'State Government', institution_type: 'Government Colleges Only', deadline: '2026-11-30' },
    { scholarship_id: 4, scholarship_name: 'Private University Achievers Grant', min_cgpa: 7.5, max_income: 350000, eligible_category: 'All', amount: 30000, funding_type: 'Private', institution_type: 'Private Universities Only', deadline: '2026-12-25' },
    { scholarship_id: 5, scholarship_name: 'OBC Welfare Scholarship', min_cgpa: 6.0, max_income: 250000, eligible_category: 'OBC', amount: 15000, funding_type: 'National', institution_type: 'All Universities', deadline: '2026-12-15' },
    { scholarship_id: 6, scholarship_name: 'SC Dr. Ambedkar Scholarship', min_cgpa: 6.0, max_income: 250000, eligible_category: 'SC', amount: 18000, funding_type: 'National', institution_type: 'All Universities', deadline: '2026-12-20' },
    { scholarship_id: 7, scholarship_name: 'Corporate CSR Tech Scholarship', min_cgpa: 8.5, max_income: 300000, eligible_category: 'General', amount: 40000, funding_type: 'Corporate', institution_type: 'Private Universities Only', deadline: '2026-12-10' },
    { scholarship_id: 8, scholarship_name: 'International Research Fellowship', min_cgpa: 9.2, max_income: 600000, eligible_category: 'All', amount: 100000, funding_type: 'International', institution_type: 'All Universities', deadline: '2026-12-30' }
];

const studentsData = [
    { student_id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 180000, category: 'OBC', cgpa: 8.20, phone: '9811245610' },
    { student_id: 2, name: 'Priya Verma', email: 'priya.verma@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 120000, category: 'SC', cgpa: 9.10, phone: '9811245611' },
    { student_id: 3, name: 'Aman Singh', email: 'aman.singh@gmail.com', course: 'BTech CSE', year_of_study: 3, family_income: 350000, category: 'General', cgpa: 7.50, phone: '9811245612' },
    { student_id: 4, name: 'Neha Gupta', email: 'neha.gupta@outlook.com', course: 'BTech IT', year_of_study: 2, family_income: 200000, category: 'EWS', cgpa: 8.70, phone: '9811245613' },
    { student_id: 5, name: 'Karan Mehta', email: 'karan.mehta@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 150000, category: 'General', cgpa: 8.00, phone: '9811245614' },
    { student_id: 6, name: 'Sneha Roy', email: 'sneha.roy@gmail.com', course: 'BTech Civil', year_of_study: 2, family_income: 280000, category: 'OBC', cgpa: 6.90, phone: '9811245615' },
    { student_id: 7, name: 'Amit Kumar', email: 'amit.kumar@gmail.com', course: 'BTech ECE', year_of_study: 3, family_income: 95000, category: 'SC', cgpa: 8.50, phone: '9811245616' },
    { student_id: 8, name: 'Divya Nair', email: 'divya.nair@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 400000, category: 'General', cgpa: 9.40, phone: '9811245617' },
    { student_id: 9, name: 'Rohan Das', email: 'rohan.das@yahoo.com', course: 'BTech IT', year_of_study: 3, family_income: 220000, category: 'EWS', cgpa: 7.80, phone: '9811245618' },
    { student_id: 10, name: 'Pooja Patel', email: 'pooja.patel@gmail.com', course: 'BTech CSE', year_of_study: 4, family_income: 175000, category: 'OBC', cgpa: 8.90, phone: '9811245619' },
    { student_id: 11, name: 'Aditya Rao', email: 'aditya.rao@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 160000, category: 'General', cgpa: 8.10, phone: '9820114501' },
    { student_id: 12, name: 'Ananya Sen', email: 'ananya.sen@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 110000, category: 'SC', cgpa: 9.20, phone: '9820114502' },
    { student_id: 13, name: 'Vikram Malhotra', email: 'vikram.malhotra@gmail.com', course: 'BTech ECE', year_of_study: 3, family_income: 320000, category: 'General', cgpa: 7.40, phone: '9820114503' },
    { student_id: 14, name: 'Tanvi Joshi', email: 'tanvi.joshi@gmail.com', course: 'BTech AI ML', year_of_study: 2, family_income: 190000, category: 'OBC', cgpa: 8.30, phone: '9820114504' },
    { student_id: 15, name: 'Manish Pandey', email: 'manish.pandey@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 210000, category: 'EWS', cgpa: 7.10, phone: '9820114505' },
    { student_id: 16, name: 'Ritu Sharma', email: 'ritu.sharma@gmail.com', course: 'BTech Civil', year_of_study: 1, family_income: 130000, category: 'SC', cgpa: 8.80, phone: '9820114506' },
    { student_id: 17, name: 'Siddharth Kulkarni', email: 'siddharth.kulkarni@gmail.com', course: 'BTech CSE', year_of_study: 3, family_income: 290000, category: 'General', cgpa: 8.50, phone: '9820114507' },
    { student_id: 18, name: 'Megha Kapoor', email: 'megha.kapoor@outlook.com', course: 'BTech IT', year_of_study: 2, family_income: 240000, category: 'OBC', cgpa: 7.90, phone: '9820114508' },
    { student_id: 19, name: 'Tarun Bansal', email: 'tarun.bansal@gmail.com', course: 'BTech ECE', year_of_study: 4, family_income: 180000, category: 'EWS', cgpa: 8.20, phone: '9820114509' },
    { student_id: 20, name: 'Pallavi Reddy', email: 'pallavi.reddy@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 95000, category: 'SC', cgpa: 9.50, phone: '9820114510' },
    { student_id: 21, name: 'Abhishek Tiwari', email: 'abhishek.tiwari@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 310000, category: 'General', cgpa: 7.60, phone: '9830198201' },
    { student_id: 22, name: 'Komal Mishra', email: 'komal.mishra@gmail.com', course: 'BTech IT', year_of_study: 3, family_income: 220000, category: 'OBC', cgpa: 8.40, phone: '9830198202' },
    { student_id: 23, name: 'Nikhil Chauhan', email: 'nikhil.chauhan@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 140000, category: 'SC', cgpa: 6.80, phone: '9830198203' },
    { student_id: 24, name: 'Shruti Agarwal', email: 'shruti.agarwal@gmail.com', course: 'BTech Civil', year_of_study: 1, family_income: 195000, category: 'EWS', cgpa: 9.00, phone: '9830198204' },
    { student_id: 25, name: 'Harshvardhan Yadav', email: 'harshvardhan.yadav@gmail.com', course: 'BTech ECE', year_of_study: 2, family_income: 270000, category: 'General', cgpa: 8.10, phone: '9830198205' },
    { student_id: 26, name: 'Simran Kaur', email: 'simran.kaur@gmail.com', course: 'BTech AI ML', year_of_study: 3, family_income: 165000, category: 'OBC', cgpa: 8.70, phone: '9830198206' },
    { student_id: 27, name: 'Prashant Dubey', email: 'prashant.dubey@gmail.com', course: 'BTech CSE', year_of_study: 4, family_income: 330000, category: 'General', cgpa: 7.20, phone: '9830198207' },
    { student_id: 28, name: 'Ayesha Siddiqui', email: 'ayesha.siddiqui@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 105000, category: 'SC', cgpa: 9.30, phone: '9830198208' },
    { student_id: 29, name: 'Varun Saxena', email: 'varun.saxena@gmail.com', course: 'BTech Mech', year_of_study: 2, family_income: 250000, category: 'EWS', cgpa: 7.90, phone: '9830198209' },
    { student_id: 30, name: 'Nandini Chatterjee', email: 'nandini.chatterjee@gmail.com', course: 'BTech Civil', year_of_study: 3, family_income: 185000, category: 'OBC', cgpa: 8.60, phone: '9830198210' },
    { student_id: 31, name: 'Gaurav Bhardwaj', email: 'gaurav.bhardwaj@gmail.com', course: 'BTech ECE', year_of_study: 4, family_income: 200000, category: 'General', cgpa: 8.40, phone: '9840512301' },
    { student_id: 32, name: 'Swati Deshmukh', email: 'swati.deshmukh@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 115000, category: 'SC', cgpa: 8.90, phone: '9840512302' },
    { student_id: 33, name: 'Deepak Choudhary', email: 'deepak.choudhary@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 290000, category: 'OBC', cgpa: 7.70, phone: '9840512303' },
    { student_id: 34, name: 'Richa Trivedi', email: 'richa.trivedi@gmail.com', course: 'BTech IT', year_of_study: 3, family_income: 155000, category: 'EWS', cgpa: 8.20, phone: '9840512304' },
    { student_id: 35, name: 'Akash Mahajan', email: 'akash.mahajan@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 340000, category: 'General', cgpa: 7.10, phone: '9840512305' },
    { student_id: 36, name: 'Kriti Sethi', email: 'kriti.sethi@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 150000, category: 'General', cgpa: 8.50, phone: '9840512306' },
    { student_id: 37, name: 'Saurabh Rathore', email: 'saurabh.rathore@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 120000, category: 'SC', cgpa: 9.00, phone: '9840512307' },
    { student_id: 38, name: 'Bhavna Solanki', email: 'bhavna.solanki@gmail.com', course: 'BTech ECE', year_of_study: 3, family_income: 280000, category: 'OBC', cgpa: 7.40, phone: '9840512308' },
    { student_id: 39, name: 'Yashwant Gohil', email: 'yashwant.gohil@gmail.com', course: 'BTech AI ML', year_of_study: 2, family_income: 190000, category: 'EWS', cgpa: 8.30, phone: '9840512309' },
    { student_id: 40, name: 'Tanya Khanna', email: 'tanya.khanna@gmail.com', course: 'BTech Civil', year_of_study: 4, family_income: 210000, category: 'General', cgpa: 8.00, phone: '9840512310' },
    { student_id: 41, name: 'Farhan Qureshi', email: 'farhan.qureshi@gmail.com', course: 'BTech CSE', year_of_study: 1, family_income: 98000, category: 'SC', cgpa: 9.10, phone: '9850778801' },
    { student_id: 42, name: 'Mansi Bhatt', email: 'mansi.bhatt@gmail.com', course: 'BTech IT', year_of_study: 3, family_income: 310000, category: 'General', cgpa: 7.60, phone: '9850778802' },
    { student_id: 43, name: 'Chetan Kulkarni', email: 'chetan.kulkarni@gmail.com', course: 'BTech Mech', year_of_study: 2, family_income: 175000, category: 'OBC', cgpa: 8.40, phone: '9850778803' },
    { student_id: 44, name: 'Aishwarya Iyer', email: 'aishwarya.iyer@gmail.com', course: 'BTech ECE', year_of_study: 4, family_income: 220000, category: 'EWS', cgpa: 7.80, phone: '9850778804' },
    { student_id: 45, name: 'Devansh Gill', email: 'devansh.gill@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 135000, category: 'SC', cgpa: 8.90, phone: '9850778805' },
    { student_id: 46, name: 'Sakshi Jindal', email: 'sakshi.jindal@gmail.com', course: 'BTech Civil', year_of_study: 2, family_income: 260000, category: 'General', cgpa: 8.10, phone: '9850778806' },
    { student_id: 47, name: 'Prateek Hegde', email: 'prateek.hegde@gmail.com', course: 'BTech CSE', year_of_study: 3, family_income: 190000, category: 'OBC', cgpa: 8.70, phone: '9850778807' },
    { student_id: 48, name: 'Ishita Garg', email: 'ishita.garg@gmail.com', course: 'BTech IT', year_of_study: 4, family_income: 300000, category: 'General', cgpa: 7.30, phone: '9850778808' },
    { student_id: 49, name: 'Mohit Goel', email: 'mohit.goel@gmail.com', course: 'BTech ECE', year_of_study: 1, family_income: 110000, category: 'SC', cgpa: 9.40, phone: '9850778809' },
    { student_id: 50, name: 'Aditi Pawar', email: 'aditi.pawar@gmail.com', course: 'BTech AI ML', year_of_study: 2, family_income: 200000, category: 'EWS', cgpa: 8.00, phone: '9850778810' },
    { student_id: 51, name: 'Raghavendra Joshi', email: 'raghavendra.joshi@gmail.com', course: 'BTech CSE', year_of_study: 3, family_income: 140000, category: 'General', cgpa: 8.60, phone: '9860991101' },
    { student_id: 52, name: 'Payal Chawla', email: 'payal.chawla@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 125000, category: 'SC', cgpa: 9.00, phone: '9860991102' },
    { student_id: 53, name: 'Sandeep Yadav', email: 'sandeep.yadav@gmail.com', course: 'BTech Mech', year_of_study: 2, family_income: 270000, category: 'OBC', cgpa: 7.50, phone: '9860991103' },
    { student_id: 54, name: 'Ankita Rawat', email: 'ankita.rawat@gmail.com', course: 'BTech Civil', year_of_study: 4, family_income: 185000, category: 'EWS', cgpa: 8.20, phone: '9860991104' },
    { student_id: 55, name: 'Kunal Kapoor', email: 'kunal.kapoor@gmail.com', course: 'BTech ECE', year_of_study: 3, family_income: 230000, category: 'General', cgpa: 7.90, phone: '9860991105' },
    { student_id: 56, name: 'Shreya Menon', email: 'shreya.menon@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 95000, category: 'SC', cgpa: 9.20, phone: '9860991106' },
    { student_id: 57, name: 'Vivek Deshpande', email: 'vivek.deshpande@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 320000, category: 'General', cgpa: 7.40, phone: '9860991107' },
    { student_id: 58, name: 'Harpreet Kaur', email: 'harpreet.kaur@gmail.com', course: 'BTech IT', year_of_study: 4, family_income: 160000, category: 'OBC', cgpa: 8.80, phone: '9860991108' },
    { student_id: 59, name: 'Arjun Nair', email: 'arjun.nair@gmail.com', course: 'BTech Mech', year_of_study: 3, family_income: 210000, category: 'EWS', cgpa: 8.10, phone: '9860991109' },
    { student_id: 60, name: 'Sonali Kulkarni', email: 'sonali.kulkarni@gmail.com', course: 'BTech Civil', year_of_study: 1, family_income: 130000, category: 'SC', cgpa: 8.90, phone: '9860991110' },
    { student_id: 61, name: 'Rajat Sharma', email: 'rajat.sharma@gmail.com', course: 'BTech ECE', year_of_study: 2, family_income: 250000, category: 'General', cgpa: 8.30, phone: '9871223301' },
    { student_id: 62, name: 'Preeti Verma', email: 'preeti.verma@gmail.com', course: 'BTech AI ML', year_of_study: 3, family_income: 170000, category: 'OBC', cgpa: 8.50, phone: '9871223302' },
    { student_id: 63, name: 'Ritesh Deshmukh', email: 'ritesh.deshmukh@gmail.com', course: 'BTech CSE', year_of_study: 4, family_income: 290000, category: 'General', cgpa: 7.70, phone: '9871223303' },
    { student_id: 64, name: 'Karishma Sinha', email: 'karishma.sinha@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 105000, category: 'SC', cgpa: 9.50, phone: '9871223304' },
    { student_id: 65, name: 'Faizan Khan', email: 'faizan.khan@gmail.com', course: 'BTech Mech', year_of_study: 2, family_income: 195000, category: 'EWS', cgpa: 8.00, phone: '9871223305' },
    { student_id: 66, name: 'Esha Chatterjee', email: 'esha.chatterjee@gmail.com', course: 'BTech Civil', year_of_study: 3, family_income: 240000, category: 'OBC', cgpa: 7.80, phone: '9871223306' },
    { student_id: 67, name: 'Tushar Malhotra', email: 'tushar.malhotra@gmail.com', course: 'BTech ECE', year_of_study: 4, family_income: 310000, category: 'General', cgpa: 7.20, phone: '9871223307' },
    { student_id: 68, name: 'Amrita Rao', email: 'amrita.rao@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 115000, category: 'SC', cgpa: 9.10, phone: '9871223308' },
    { student_id: 69, name: 'Ankit Srivastava', email: 'ankit.srivastava@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 180000, category: 'EWS', cgpa: 8.40, phone: '9871223309' },
    { student_id: 70, name: 'Garima Singh', email: 'garima.singh@gmail.com', course: 'BTech IT', year_of_study: 3, family_income: 220000, category: 'OBC', cgpa: 8.20, phone: '9871223310' },
    { student_id: 71, name: 'Zaid Shaikh', email: 'zaid.shaikh@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 150000, category: 'General', cgpa: 8.60, phone: '9881445501' },
    { student_id: 72, name: 'Chaitali Joshi', email: 'chaitali.joshi@gmail.com', course: 'BTech Civil', year_of_study: 1, family_income: 125000, category: 'SC', cgpa: 8.90, phone: '9881445502' },
    { student_id: 73, name: 'Dinesh Menon', email: 'dinesh.menon@gmail.com', course: 'BTech ECE', year_of_study: 2, family_income: 280000, category: 'General', cgpa: 7.60, phone: '9881445503' },
    { student_id: 74, name: 'Bharti Patidar', email: 'bharti.patidar@gmail.com', course: 'BTech AI ML', year_of_study: 3, family_income: 160000, category: 'OBC', cgpa: 8.70, phone: '9881445504' },
    { student_id: 75, name: 'Aryan Vaidya', email: 'aryan.vaidya@gmail.com', course: 'BTech CSE', year_of_study: 4, family_income: 330000, category: 'General', cgpa: 7.10, phone: '9881445505' },
    { student_id: 76, name: 'Diya Mirza', email: 'diya.mirza@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 100000, category: 'SC', cgpa: 9.30, phone: '9881445506' },
    { student_id: 77, name: 'Kunal Khemu', email: 'kunal.khemu@gmail.com', course: 'BTech Mech', year_of_study: 2, family_income: 210000, category: 'EWS', cgpa: 8.00, phone: '9881445507' },
    { student_id: 78, name: 'Soha Ali', email: 'soha.ali@gmail.com', course: 'BTech Civil', year_of_study: 3, family_income: 190000, category: 'OBC', cgpa: 8.40, phone: '9881445508' },
    { student_id: 79, name: 'Pulkit Agrawal', email: 'pulkit.agrawal@gmail.com', course: 'BTech ECE', year_of_study: 4, family_income: 250000, category: 'General', cgpa: 7.90, phone: '9881445509' },
    { student_id: 80, name: 'Yamini Gautam', email: 'yamini.gautam@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 110000, category: 'SC', cgpa: 9.00, phone: '9881445510' },
    { student_id: 81, name: 'Siddharth Malhotra', email: 'siddharth.malhotra@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 175000, category: 'EWS', cgpa: 8.50, phone: '9891667701' },
    { student_id: 82, name: 'Parineeti Chopra', email: 'parineeti.chopra@gmail.com', course: 'BTech IT', year_of_study: 3, family_income: 290000, category: 'General', cgpa: 7.50, phone: '9891667702' },
    { student_id: 83, name: 'Aditi Rao', email: 'aditi.rao@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 140000, category: 'OBC', cgpa: 8.80, phone: '9891667703' },
    { student_id: 84, name: 'Tanmay Bhatt', email: 'tanmay.bhatt@gmail.com', course: 'BTech Civil', year_of_study: 1, family_income: 130000, category: 'SC', cgpa: 8.90, phone: '9891667704' },
    { student_id: 85, name: 'Vikrant Massey', email: 'vikrant.massey@gmail.com', course: 'BTech ECE', year_of_study: 2, family_income: 220000, category: 'General', cgpa: 8.10, phone: '9891667705' },
    { student_id: 86, name: 'Radhika Apte', email: 'radhika.apte@gmail.com', course: 'BTech AI ML', year_of_study: 3, family_income: 185000, category: 'OBC', cgpa: 8.60, phone: '9891667706' },
    { student_id: 87, name: 'Alok Nath', email: 'alok.nath@gmail.com', course: 'BTech CSE', year_of_study: 4, family_income: 310000, category: 'General', cgpa: 7.40, phone: '9891667707' },
    { student_id: 88, name: 'Richa Chadha', email: 'richa.chadha@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 95000, category: 'SC', cgpa: 9.40, phone: '9891667708' },
    { student_id: 89, name: 'Pankaj Tripathi', email: 'pankaj.tripathi@gmail.com', course: 'BTech Mech', year_of_study: 2, family_income: 200000, category: 'EWS', cgpa: 8.20, phone: '9891667709' },
    { student_id: 90, name: 'Komal Sen', email: 'komal.sen@gmail.com', course: 'BTech Civil', year_of_study: 3, family_income: 240000, category: 'OBC', cgpa: 7.90, phone: '9891667710' },
    { student_id: 91, name: 'Naveen Siddiqui', email: 'naveen.siddiqui@gmail.com', course: 'BTech ECE', year_of_study: 4, family_income: 300000, category: 'General', cgpa: 7.30, phone: '9901889901' },
    { student_id: 92, name: 'Swati Bhaskar', email: 'swati.bhaskar@gmail.com', course: 'BTech AI ML', year_of_study: 1, family_income: 115000, category: 'SC', cgpa: 9.10, phone: '9901889902' },
    { student_id: 93, name: 'Jatin Sarna', email: 'jatin.sarna@gmail.com', course: 'BTech CSE', year_of_study: 2, family_income: 160000, category: 'EWS', cgpa: 8.50, phone: '9901889903' },
    { student_id: 94, name: 'Shobhita Kulkarni', email: 'shobhita.kulkarni@gmail.com', course: 'BTech IT', year_of_study: 3, family_income: 270000, category: 'General', cgpa: 7.60, phone: '9901889904' },
    { student_id: 95, name: 'Vijay Varma', email: 'vijay.varma@gmail.com', course: 'BTech Mech', year_of_study: 4, family_income: 150000, category: 'OBC', cgpa: 8.70, phone: '9901889905' },
    { student_id: 96, name: 'Mrunal Thakur', email: 'mrunal.thakur@gmail.com', course: 'BTech Civil', year_of_study: 1, family_income: 120000, category: 'SC', cgpa: 9.00, phone: '9901889906' },
    { student_id: 97, name: 'Abhimanyu Das', email: 'abhimanyu.das@gmail.com', course: 'BTech ECE', year_of_study: 2, family_income: 230000, category: 'General', cgpa: 8.00, phone: '9901889907' },
    { student_id: 98, name: 'Sanya Malhotra', email: 'sanya.malhotra@gmail.com', course: 'BTech AI ML', year_of_study: 3, family_income: 190000, category: 'OBC', cgpa: 8.40, phone: '9901889908' },
    { student_id: 99, name: 'Junaid Khan', email: 'junaid.khan@gmail.com', course: 'BTech CSE', year_of_study: 4, family_income: 320000, category: 'General', cgpa: 7.20, phone: '9901889909' },
    { student_id: 100, name: 'Khushi Kapoor', email: 'khushi.kapoor@gmail.com', course: 'BTech IT', year_of_study: 1, family_income: 105000, category: 'SC', cgpa: 9.30, phone: '9901889910' }
];

const applicationsData = [
    { application_id: 1, student_id: 1, scholarship_id: 1, application_date: '2026-10-22', status: 'Approved', remarks: 'Eligible for scholarship' },
    { application_id: 2, student_id: 1, scholarship_id: 5, application_date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 3, student_id: 2, scholarship_id: 1, application_date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 4, student_id: 2, scholarship_id: 6, application_date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 5, student_id: 3, scholarship_id: 1, application_date: '2026-10-22', status: 'Rejected', remarks: 'Does not meet criteria' },
    { application_id: 6, student_id: 4, scholarship_id: 3, application_date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 7, student_id: 5, scholarship_id: 4, application_date: '2026-10-22', status: 'Approved', remarks: 'Eligible for private grant' },
    { application_id: 8, student_id: 6, scholarship_id: 5, application_date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 9, student_id: 7, scholarship_id: 6, application_date: '2026-10-22', status: 'Approved', remarks: 'Verified SC certificate' },
    { application_id: 10, student_id: 8, scholarship_id: 2, application_date: '2026-10-22', status: 'Pending', remarks: 'International grant review' },
    { application_id: 11, student_id: 9, scholarship_id: 3, application_date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 12, student_id: 10, scholarship_id: 7, application_date: '2026-10-22', status: 'Approved', remarks: 'Approved under CSR quota' },
    { application_id: 13, student_id: 12, scholarship_id: 2, application_date: '2026-10-23', status: 'Approved', remarks: 'High CGPA merit approved' },
    { application_id: 14, student_id: 15, scholarship_id: 4, application_date: '2026-10-23', status: 'Pending', remarks: 'Application submitted' },
    { application_id: 15, student_id: 20, scholarship_id: 8, application_date: '2026-10-24', status: 'Pending', remarks: 'Research proposal attached' }
];

async function seedData() {
    console.log('🌱 Starting MongoDB database seeding...');
    
    // Clear existing collections
    await Student.deleteMany({});
    await Scholarship.deleteMany({});
    await Application.deleteMany({});
    await User.deleteMany({});

    // Insert seeds
    await Student.insertMany(studentsData);
    await Scholarship.insertMany(scholarshipsData);
    await Application.insertMany(applicationsData);

    // Create Admin User
    await User.create({
        name: 'Dr. Rajeshwar Sharma',
        email: 'admin@scholarship.gov.in',
        password: 'admin123',
        role: 'admin'
    });

    // Create Officer User
    await User.create({
        name: 'Sanjay Verma',
        email: 'officer@scholarship.gov.in',
        password: 'officer123',
        role: 'officer'
    });

    // Create Demo Student Users
    await User.create({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        password: 'password123',
        role: 'student',
        student_id: 1
    });

    await User.create({
        name: 'Priya Verma',
        email: 'priya.verma@gmail.com',
        password: 'password123',
        role: 'student',
        student_id: 2
    });

    console.log(`✅ Seeded ${studentsData.length} students`);
    console.log(`✅ Seeded ${scholarshipsData.length} scholarships`);
    console.log(`✅ Seeded ${applicationsData.length} applications`);
    console.log(`✅ Seeded demo user accounts (Admin, Officer, Students)`);
    console.log('🎉 Seeding successfully completed!');
}

if (require.main === module) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scholarship_db';
    mongoose.connect(mongoUri)
        .then(async () => {
            console.log('Connected to MongoDB for seeding');
            await seedData();
            process.exit(0);
        })
        .catch(err => {
            console.error('Error seeding data:', err);
            process.exit(1);
        });
}

module.exports = seedData;
