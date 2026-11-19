let scholarships = [
    { id: 1, name: 'National Merit Scholarship', min_cgpa: 8.0, max_income: 300000, category: 'All', amount: 25000, funding_type: 'National', institution_type: 'All Universities', deadline: '2026-12-31' },
    { id: 2, name: 'Global Excellence Grant', min_cgpa: 9.0, max_income: 500000, category: 'All', amount: 75000, funding_type: 'International', institution_type: 'All Universities', deadline: '2026-12-15' },
    { id: 3, name: 'State Need Based Scholarship', min_cgpa: 7.0, max_income: 200000, category: 'All', amount: 20000, funding_type: 'State Government', institution_type: 'Government Colleges Only', deadline: '2026-11-30' },
    { id: 4, name: 'Private University Achievers Grant', min_cgpa: 7.5, max_income: 350000, category: 'All', amount: 30000, funding_type: 'Private', institution_type: 'Private Universities Only', deadline: '2026-12-25' },
    { id: 5, name: 'OBC Welfare Scholarship', min_cgpa: 6.0, max_income: 250000, category: 'OBC', amount: 15000, funding_type: 'National', institution_type: 'All Universities', deadline: '2026-12-15' },
    { id: 6, name: 'SC Dr. Ambedkar Scholarship', min_cgpa: 6.0, max_income: 250000, category: 'SC', amount: 18000, funding_type: 'National', institution_type: 'All Universities', deadline: '2026-12-20' },
    { id: 7, name: 'Corporate CSR Tech Scholarship', min_cgpa: 8.5, max_income: 300000, category: 'General', amount: 40000, funding_type: 'Corporate', institution_type: 'Private Universities Only', deadline: '2026-12-10' },
    { id: 8, name: 'International Research Fellowship', min_cgpa: 9.2, max_income: 600000, category: 'All', amount: 100000, funding_type: 'International', institution_type: 'All Universities', deadline: '2026-12-30' }
];

let students = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', course: 'BTech CSE', year: 2, income: 180000, category: 'OBC', cgpa: 8.20 },
    { id: 2, name: 'Priya Verma', email: 'priya.verma@gmail.com', course: 'BTech AI ML', year: 1, income: 120000, category: 'SC', cgpa: 9.10 },
    { id: 3, name: 'Aman Singh', email: 'aman.singh@gmail.com', course: 'BTech CSE', year: 3, income: 350000, category: 'General', cgpa: 7.50 },
    { id: 4, name: 'Neha Gupta', email: 'neha.gupta@outlook.com', course: 'BTech IT', year: 2, income: 200000, category: 'EWS', cgpa: 8.70 },
    { id: 5, name: 'Karan Mehta', email: 'karan.mehta@gmail.com', course: 'BTech Mech', year: 4, income: 150000, category: 'General', cgpa: 8.00 },
    { id: 6, name: 'Sneha Roy', email: 'sneha.roy@gmail.com', course: 'BTech Civil', year: 2, income: 280000, category: 'OBC', cgpa: 6.90 },
    { id: 7, name: 'Amit Kumar', email: 'amit.kumar@gmail.com', course: 'BTech ECE', year: 3, income: 95000, category: 'SC', cgpa: 8.50 },
    { id: 8, name: 'Divya Nair', email: 'divya.nair@gmail.com', course: 'BTech AI ML', year: 1, income: 400000, category: 'General', cgpa: 9.40 },
    { id: 9, name: 'Rohan Das', email: 'rohan.das@yahoo.com', course: 'BTech IT', year: 3, income: 220000, category: 'EWS', cgpa: 7.80 },
    { id: 10, name: 'Pooja Patel', email: 'pooja.patel@gmail.com', course: 'BTech CSE', year: 4, income: 175000, category: 'OBC', cgpa: 8.90 },
    { id: 11, name: 'Aditya Rao', email: 'aditya.rao@gmail.com', course: 'BTech CSE', year: 2, income: 160000, category: 'General', cgpa: 8.10 },
    { id: 12, name: 'Ananya Sen', email: 'ananya.sen@gmail.com', course: 'BTech IT', year: 1, income: 110000, category: 'SC', cgpa: 9.20 },
    { id: 13, name: 'Vikram Malhotra', email: 'vikram.malhotra@gmail.com', course: 'BTech ECE', year: 3, income: 320000, category: 'General', cgpa: 7.40 },
    { id: 14, name: 'Tanvi Joshi', email: 'tanvi.joshi@gmail.com', course: 'BTech AI ML', year: 2, income: 190000, category: 'OBC', cgpa: 8.30 },
    { id: 15, name: 'Manish Pandey', email: 'manish.pandey@gmail.com', course: 'BTech Mech', year: 4, income: 210000, category: 'EWS', cgpa: 7.10 },
    { id: 16, name: 'Ritu Sharma', email: 'ritu.sharma@gmail.com', course: 'BTech Civil', year: 1, income: 130000, category: 'SC', cgpa: 8.80 },
    { id: 17, name: 'Siddharth Kulkarni', email: 'siddharth.kulkarni@gmail.com', course: 'BTech CSE', year: 3, income: 290000, category: 'General', cgpa: 8.50 },
    { id: 18, name: 'Megha Kapoor', email: 'megha.kapoor@outlook.com', course: 'BTech IT', year: 2, income: 240000, category: 'OBC', cgpa: 7.90 },
    { id: 19, name: 'Tarun Bansal', email: 'tarun.bansal@gmail.com', course: 'BTech ECE', year: 4, income: 180000, category: 'EWS', cgpa: 8.20 },
    { id: 20, name: 'Pallavi Reddy', email: 'pallavi.reddy@gmail.com', course: 'BTech AI ML', year: 1, income: 95000, category: 'SC', cgpa: 9.50 },
    { id: 21, name: 'Abhishek Tiwari', email: 'abhishek.tiwari@gmail.com', course: 'BTech CSE', year: 2, income: 310000, category: 'General', cgpa: 7.60 },
    { id: 22, name: 'Komal Mishra', email: 'komal.mishra@gmail.com', course: 'BTech IT', year: 3, income: 220000, category: 'OBC', cgpa: 8.40 },
    { id: 23, name: 'Nikhil Chauhan', email: 'nikhil.chauhan@gmail.com', course: 'BTech Mech', year: 4, income: 140000, category: 'SC', cgpa: 6.80 },
    { id: 24, name: 'Shruti Agarwal', email: 'shruti.agarwal@gmail.com', course: 'BTech Civil', year: 1, income: 195000, category: 'EWS', cgpa: 9.00 },
    { id: 25, name: 'Harshvardhan Yadav', email: 'harshvardhan.yadav@gmail.com', course: 'BTech ECE', year: 2, income: 270000, category: 'General', cgpa: 8.10 },
    { id: 26, name: 'Simran Kaur', email: 'simran.kaur@gmail.com', course: 'BTech AI ML', year: 3, income: 165000, category: 'OBC', cgpa: 8.70 },
    { id: 27, name: 'Prashant Dubey', email: 'prashant.dubey@gmail.com', course: 'BTech CSE', year: 4, income: 330000, category: 'General', cgpa: 7.20 },
    { id: 28, name: 'Ayesha Siddiqui', email: 'ayesha.siddiqui@gmail.com', course: 'BTech IT', year: 1, income: 105000, category: 'SC', cgpa: 9.30 },
    { id: 29, name: 'Varun Saxena', email: 'varun.saxena@gmail.com', course: 'BTech Mech', year: 2, income: 250000, category: 'EWS', cgpa: 7.90 },
    { id: 30, name: 'Nandini Chatterjee', email: 'nandini.chatterjee@gmail.com', course: 'BTech Civil', year: 3, income: 185000, category: 'OBC', cgpa: 8.60 },
    { id: 31, name: 'Gaurav Bhardwaj', email: 'gaurav.bhardwaj@gmail.com', course: 'BTech ECE', year: 4, income: 200000, category: 'General', cgpa: 8.40 },
    { id: 32, name: 'Swati Deshmukh', email: 'swati.deshmukh@gmail.com', course: 'BTech AI ML', year: 1, income: 115000, category: 'SC', cgpa: 8.90 },
    { id: 33, name: 'Deepak Choudhary', email: 'deepak.choudhary@gmail.com', course: 'BTech CSE', year: 2, income: 290000, category: 'OBC', cgpa: 7.70 },
    { id: 34, name: 'Richa Trivedi', email: 'richa.trivedi@gmail.com', course: 'BTech IT', year: 3, income: 155000, category: 'EWS', cgpa: 8.20 },
    { id: 35, name: 'Akash Mahajan', email: 'akash.mahajan@gmail.com', course: 'BTech Mech', year: 4, income: 340000, category: 'General', cgpa: 7.10 },
    { id: 36, name: 'Kriti Sethi', email: 'kriti.sethi@gmail.com', course: 'BTech CSE', year: 2, income: 150000, category: 'General', cgpa: 8.50 },
    { id: 37, name: 'Saurabh Rathore', email: 'saurabh.rathore@gmail.com', course: 'BTech IT', year: 1, income: 120000, category: 'SC', cgpa: 9.00 },
    { id: 38, name: 'Bhavna Solanki', email: 'bhavna.solanki@gmail.com', course: 'BTech ECE', year: 3, income: 280000, category: 'OBC', cgpa: 7.40 },
    { id: 39, name: 'Yashwant Gohil', email: 'yashwant.gohil@gmail.com', course: 'BTech AI ML', year: 2, income: 190000, category: 'EWS', cgpa: 8.30 },
    { id: 40, name: 'Tanya Khanna', email: 'tanya.khanna@gmail.com', course: 'BTech Civil', year: 4, income: 210000, category: 'General', cgpa: 8.00 },
    { id: 41, name: 'Farhan Qureshi', email: 'farhan.qureshi@gmail.com', course: 'BTech CSE', year: 1, income: 98000, category: 'SC', cgpa: 9.10 },
    { id: 42, name: 'Mansi Bhatt', email: 'mansi.bhatt@gmail.com', course: 'BTech IT', year: 3, income: 310000, category: 'General', cgpa: 7.60 },
    { id: 43, name: 'Chetan Kulkarni', email: 'chetan.kulkarni@gmail.com', course: 'BTech Mech', year: 2, income: 175000, category: 'OBC', cgpa: 8.40 },
    { id: 44, name: 'Aishwarya Iyer', email: 'aishwarya.iyer@gmail.com', course: 'BTech ECE', year: 4, income: 220000, category: 'EWS', cgpa: 7.80 },
    { id: 45, name: 'Devansh Gill', email: 'devansh.gill@gmail.com', course: 'BTech AI ML', year: 1, income: 135000, category: 'SC', cgpa: 8.90 },
    { id: 46, name: 'Sakshi Jindal', email: 'sakshi.jindal@gmail.com', course: 'BTech Civil', year: 2, income: 260000, category: 'General', cgpa: 8.10 },
    { id: 47, name: 'Prateek Hegde', email: 'prateek.hegde@gmail.com', course: 'BTech CSE', year: 3, income: 190000, category: 'OBC', cgpa: 8.70 },
    { id: 48, name: 'Ishita Garg', email: 'ishita.garg@gmail.com', course: 'BTech IT', year: 4, income: 300000, category: 'General', cgpa: 7.30 },
    { id: 49, name: 'Mohit Goel', email: 'mohit.goel@gmail.com', course: 'BTech ECE', year: 1, income: 110000, category: 'SC', cgpa: 9.40 },
    { id: 50, name: 'Aditi Pawar', email: 'aditi.pawar@gmail.com', course: 'BTech AI ML', year: 2, income: 200000, category: 'EWS', cgpa: 8.00 },
    { id: 51, name: 'Raghavendra Joshi', email: 'raghavendra.joshi@gmail.com', course: 'BTech CSE', year: 3, income: 140000, category: 'General', cgpa: 8.60 },
    { id: 52, name: 'Payal Chawla', email: 'payal.chawla@gmail.com', course: 'BTech IT', year: 1, income: 125000, category: 'SC', cgpa: 9.00 },
    { id: 53, name: 'Sandeep Yadav', email: 'sandeep.yadav@gmail.com', course: 'BTech Mech', year: 2, income: 270000, category: 'OBC', cgpa: 7.50 },
    { id: 54, name: 'Ankita Rawat', email: 'ankita.rawat@gmail.com', course: 'BTech Civil', year: 4, income: 185000, category: 'EWS', cgpa: 8.20 },
    { id: 55, name: 'Kunal Kapoor', email: 'kunal.kapoor@gmail.com', course: 'BTech ECE', year: 3, income: 230000, category: 'General', cgpa: 7.90 },
    { id: 56, name: 'Shreya Menon', email: 'shreya.menon@gmail.com', course: 'BTech AI ML', year: 1, income: 95000, category: 'SC', cgpa: 9.20 },
    { id: 57, name: 'Vivek Deshpande', email: 'vivek.deshpande@gmail.com', course: 'BTech CSE', year: 2, income: 320000, category: 'General', cgpa: 7.40 },
    { id: 58, name: 'Harpreet Kaur', email: 'harpreet.kaur@gmail.com', course: 'BTech IT', year: 4, income: 160000, category: 'OBC', cgpa: 8.80 },
    { id: 59, name: 'Arjun Nair', email: 'arjun.nair@gmail.com', course: 'BTech Mech', year: 3, income: 210000, category: 'EWS', cgpa: 8.10 },
    { id: 60, name: 'Sonali Kulkarni', email: 'sonali.kulkarni@gmail.com', course: 'BTech Civil', year: 1, income: 130000, category: 'SC', cgpa: 8.90 },
    { id: 61, name: 'Rajat Sharma', email: 'rajat.sharma@gmail.com', course: 'BTech ECE', year: 2, income: 250000, category: 'General', cgpa: 8.30 },
    { id: 62, name: 'Preeti Verma', email: 'preeti.verma@gmail.com', course: 'BTech AI ML', year: 3, income: 170000, category: 'OBC', cgpa: 8.50 },
    { id: 63, name: 'Ritesh Deshmukh', email: 'ritesh.deshmukh@gmail.com', course: 'BTech CSE', year: 4, income: 290000, category: 'General', cgpa: 7.70 },
    { id: 64, name: 'Karishma Sinha', email: 'karishma.sinha@gmail.com', course: 'BTech IT', year: 1, income: 105000, category: 'SC', cgpa: 9.50 },
    { id: 65, name: 'Faizan Khan', email: 'faizan.khan@gmail.com', course: 'BTech Mech', year: 2, income: 195000, category: 'EWS', cgpa: 8.00 },
    { id: 66, name: 'Esha Chatterjee', email: 'esha.chatterjee@gmail.com', course: 'BTech Civil', year: 3, income: 240000, category: 'OBC', cgpa: 7.80 },
    { id: 67, name: 'Tushar Malhotra', email: 'tushar.malhotra@gmail.com', course: 'BTech ECE', year: 4, income: 310000, category: 'General', cgpa: 7.20 },
    { id: 68, name: 'Amrita Rao', email: 'amrita.rao@gmail.com', course: 'BTech AI ML', year: 1, income: 115000, category: 'SC', cgpa: 9.10 },
    { id: 69, name: 'Ankit Srivastava', email: 'ankit.srivastava@gmail.com', course: 'BTech CSE', year: 2, income: 180000, category: 'EWS', cgpa: 8.40 },
    { id: 70, name: 'Garima Singh', email: 'garima.singh@gmail.com', course: 'BTech IT', year: 3, income: 220000, category: 'OBC', cgpa: 8.20 },
    { id: 71, name: 'Zaid Shaikh', email: 'zaid.shaikh@gmail.com', course: 'BTech Mech', year: 4, income: 150000, category: 'General', cgpa: 8.60 },
    { id: 72, name: 'Chaitali Joshi', email: 'chaitali.joshi@gmail.com', course: 'BTech Civil', year: 1, income: 125000, category: 'SC', cgpa: 8.90 },
    { id: 73, name: 'Dinesh Menon', email: 'dinesh.menon@gmail.com', course: 'BTech ECE', year: 2, income: 280000, category: 'General', cgpa: 7.60 },
    { id: 74, name: 'Bharti Patidar', email: 'bharti.patidar@gmail.com', course: 'BTech AI ML', year: 3, income: 160000, category: 'OBC', cgpa: 8.70 },
    { id: 75, name: 'Aryan Vaidya', email: 'aryan.vaidya@gmail.com', course: 'BTech CSE', year: 4, income: 330000, category: 'General', cgpa: 7.10 },
    { id: 76, name: 'Diya Mirza', email: 'diya.mirza@gmail.com', course: 'BTech IT', year: 1, income: 100000, category: 'SC', cgpa: 9.30 },
    { id: 77, name: 'Kunal Khemu', email: 'kunal.khemu@gmail.com', course: 'BTech Mech', year: 2, income: 210000, category: 'EWS', cgpa: 8.00 },
    { id: 78, name: 'Soha Ali', email: 'soha.ali@gmail.com', course: 'BTech Civil', year: 3, income: 190000, category: 'OBC', cgpa: 8.40 },
    { id: 79, name: 'Pulkit Agrawal', email: 'pulkit.agrawal@gmail.com', course: 'BTech ECE', year: 4, income: 250000, category: 'General', cgpa: 7.90 },
    { id: 80, name: 'Yamini Gautam', email: 'yamini.gautam@gmail.com', course: 'BTech AI ML', year: 1, income: 110000, category: 'SC', cgpa: 9.00 },
    { id: 81, name: 'Siddharth Malhotra', email: 'siddharth.malhotra@gmail.com', course: 'BTech CSE', year: 2, income: 175000, category: 'EWS', cgpa: 8.50 },
    { id: 82, name: 'Parineeti Chopra', email: 'parineeti.chopra@gmail.com', course: 'BTech IT', year: 3, income: 290000, category: 'General', cgpa: 7.50 },
    { id: 83, name: 'Aditi Rao', email: 'aditi.rao@gmail.com', course: 'BTech Mech', year: 4, income: 140000, category: 'OBC', cgpa: 8.80 },
    { id: 84, name: 'Tanmay Bhatt', email: 'tanmay.bhatt@gmail.com', course: 'BTech Civil', year: 1, income: 130000, category: 'SC', cgpa: 8.90 },
    { id: 85, name: 'Vikrant Massey', email: 'vikrant.massey@gmail.com', course: 'BTech ECE', year: 2, income: 220000, category: 'General', cgpa: 8.10 },
    { id: 86, name: 'Radhika Apte', email: 'radhika.apte@gmail.com', course: 'BTech AI ML', year: 3, income: 185000, category: 'OBC', cgpa: 8.60 },
    { id: 87, name: 'Alok Nath', email: 'alok.nath@gmail.com', course: 'BTech CSE', year: 4, income: 310000, category: 'General', cgpa: 7.40 },
    { id: 88, name: 'Richa Chadha', email: 'richa.chadha@gmail.com', course: 'BTech IT', year: 1, income: 95000, category: 'SC', cgpa: 9.40 },
    { id: 89, name: 'Pankaj Tripathi', email: 'pankaj.tripathi@gmail.com', course: 'BTech Mech', year: 2, income: 200000, category: 'EWS', cgpa: 8.20 },
    { id: 90, name: 'Komal Sen', email: 'komal.sen@gmail.com', course: 'BTech Civil', year: 3, income: 240000, category: 'OBC', cgpa: 7.90 },
    { id: 91, name: 'Naveen Siddiqui', email: 'naveen.siddiqui@gmail.com', course: 'BTech ECE', year: 4, income: 300000, category: 'General', cgpa: 7.30 },
    { id: 92, name: 'Swati Bhaskar', email: 'swati.bhaskar@gmail.com', course: 'BTech AI ML', year: 1, income: 115000, category: 'SC', cgpa: 9.10 },
    { id: 93, name: 'Jatin Sarna', email: 'jatin.sarna@gmail.com', course: 'BTech CSE', year: 2, income: 160000, category: 'EWS', cgpa: 8.50 },
    { id: 94, name: 'Shobhita Kulkarni', email: 'shobhita.kulkarni@gmail.com', course: 'BTech IT', year: 3, income: 270000, category: 'General', cgpa: 7.60 },
    { id: 95, name: 'Vijay Varma', email: 'vijay.varma@gmail.com', course: 'BTech Mech', year: 4, income: 150000, category: 'OBC', cgpa: 8.70 },
    { id: 96, name: 'Mrunal Thakur', email: 'mrunal.thakur@gmail.com', course: 'BTech Civil', year: 1, income: 120000, category: 'SC', cgpa: 9.00 },
    { id: 97, name: 'Abhimanyu Das', email: 'abhimanyu.das@gmail.com', course: 'BTech ECE', year: 2, income: 230000, category: 'General', cgpa: 8.00 },
    { id: 98, name: 'Sanya Malhotra', email: 'sanya.malhotra@gmail.com', course: 'BTech AI ML', year: 3, income: 190000, category: 'OBC', cgpa: 8.40 },
    { id: 99, name: 'Junaid Khan', email: 'junaid.khan@gmail.com', course: 'BTech CSE', year: 4, income: 320000, category: 'General', cgpa: 7.20 },
    { id: 100, name: 'Khushi Kapoor', email: 'khushi.kapoor@gmail.com', course: 'BTech IT', year: 1, income: 105000, category: 'SC', cgpa: 9.30 }
];

let applications = [
    { id: 1, student_id: 1, scholarship_id: 1, date: '2026-10-22', status: 'Approved', remarks: 'Eligible for scholarship' },
    { id: 2, student_id: 1, scholarship_id: 5, date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { id: 3, student_id: 2, scholarship_id: 1, date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { id: 4, student_id: 2, scholarship_id: 6, date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { id: 5, student_id: 3, scholarship_id: 1, date: '2026-10-22', status: 'Rejected', remarks: 'Does not meet criteria' },
    { id: 6, student_id: 4, scholarship_id: 3, date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { id: 7, student_id: 5, scholarship_id: 4, date: '2026-10-22', status: 'Approved', remarks: 'Eligible for private grant' },
    { id: 8, student_id: 6, scholarship_id: 5, date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { id: 9, student_id: 7, scholarship_id: 6, date: '2026-10-22', status: 'Approved', remarks: 'Verified SC certificate' },
    { id: 10, student_id: 8, scholarship_id: 2, date: '2026-10-22', status: 'Pending', remarks: 'International grant review' },
    { id: 11, student_id: 9, scholarship_id: 3, date: '2026-10-22', status: 'Pending', remarks: 'Application submitted' },
    { id: 12, student_id: 10, scholarship_id: 7, date: '2026-10-22', status: 'Approved', remarks: 'Approved under CSR quota' },
    { id: 13, student_id: 12, scholarship_id: 2, date: '2026-10-23', status: 'Approved', remarks: 'High CGPA merit approved' },
    { id: 14, student_id: 15, scholarship_id: 4, date: '2026-10-23', status: 'Pending', remarks: 'Application submitted' },
    { id: 15, student_id: 20, scholarship_id: 8, date: '2026-10-24', status: 'Pending', remarks: 'Research proposal attached' }
];

let appFilter = 'All';
let studentPage = 1;
const studentsPerPage = 15;

function formatINR(num) {
    return '₹' + Number(num).toLocaleString('en-IN');
}

function getFundingBadgeClass(type) {
    if (type === 'International') return 'badge-purple';
    if (type === 'National') return 'badge-blue';
    if (type === 'Private' || type === 'Corporate') return 'badge-yellow';
    return 'badge-green';
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (btn) btn.classList.add('active');
    refreshAll();
}

function refreshAll() {
    renderOverview();
    populateEligibilityDropdown();
    renderEligibility();
    renderStudents();
    renderScholarships();
    renderApplications();
}

function renderOverview() {
    const avgCgpa = (students.reduce((acc, s) => acc + s.cgpa, 0) / students.length).toFixed(2);
    const pendingCount = applications.filter(a => a.status === 'Pending').length;
    const approvedApps = applications.filter(a => a.status === 'Approved');
    const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
    const totalApprovedAmt = approvedApps.reduce((acc, a) => {
        const sc = scholarships.find(s => s.id === a.scholarship_id);
        return acc + (sc ? sc.amount : 0);
    }, 0);

    document.getElementById('overview-stats').innerHTML = `
        <div class="stat-card"><div class="stat-value">${students.length}</div><div class="stat-label">Students</div></div>
        <div class="stat-card"><div class="stat-value">${avgCgpa}</div><div class="stat-label">Average CGPA</div></div>
        <div class="stat-card"><div class="stat-value">${pendingCount}</div><div class="stat-label">Pending</div></div>
        <div class="stat-card"><div class="stat-value">${approvedApps.length}</div><div class="stat-label">Approved</div></div>
        <div class="stat-card"><div class="stat-value">${rejectedCount}</div><div class="stat-label">Rejected</div></div>
        <div class="stat-card highlight"><div class="stat-value">${formatINR(totalApprovedAmt)}</div><div class="stat-label">Total approved amount</div></div>
    `;

    document.getElementById('apps-per-scholarship').innerHTML = scholarships.map(sc => {
        const count = applications.filter(a => a.scholarship_id === sc.id).length;
        return `<div class="list-row">
            <span>${sc.name} <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span></span>
            <strong>${count}</strong>
        </div>`;
    }).join('');

    const appliedIds = new Set(applications.map(a => a.student_id));
    const unapplied = students.filter(s => !appliedIds.has(s.id));
    const unappliedDiv = document.getElementById('unapplied-students');
    if (unapplied.length === 0) {
        unappliedDiv.innerHTML = `<p class="subtitle">Every student has applied for at least one scholarship.</p>`;
    } else {
        unappliedDiv.innerHTML = `<p class="subtitle" style="margin-bottom:0.75rem;">${unapplied.length} students have not applied yet. Showing first 6:</p>` +
            unapplied.slice(0, 6).map(s => `
                <div class="list-row">
                    <span>${s.name} (${s.course})</span>
                    <button class="btn-outline btn-sm" onclick="jumpToEligibility(${s.id})">Check eligibility</button>
                </div>
            `).join('');
    }
}

function populateEligibilityDropdown() {
    const select = document.getElementById('eligibility-student-select');
    const currentVal = select.value;
    select.innerHTML = students.map(s => `<option value="${s.id}">${s.id}. ${s.name}</option>`).join('');
    if (currentVal && students.some(s => s.id == currentVal)) {
        select.value = currentVal;
    }
}

function jumpToEligibility(studentId) {
    const btn = document.querySelectorAll('nav button')[1];
    switchTab('eligibility', btn);
    document.getElementById('eligibility-student-select').value = studentId;
    renderEligibility();
}

function renderEligibility() {
    const studentId = Number(document.getElementById('eligibility-student-select').value) || students[0].id;
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('eligibility-student-meta').textContent =
        `${student.course}, year ${student.year} · CGPA ${student.cgpa.toFixed(2)} · income ${formatINR(student.income)} · ${student.category}`;

    let qualifiedCount = 0;
    let maxWorth = 0;

    const cardsHtml = scholarships.map(sc => {
        const reasons = [];
        if (student.cgpa < sc.min_cgpa) reasons.push(`Requires CGPA ${sc.min_cgpa.toFixed(2)}+`);
        if (student.income > sc.max_income) reasons.push(`Income exceeds ${formatINR(sc.max_income)}`);
        if (sc.category !== 'All' && student.category !== sc.category) reasons.push(`Only for ${sc.category} category`);

        const isEligible = reasons.length === 0;
        if (isEligible) {
            qualifiedCount++;
            maxWorth += sc.amount;
        }

        const existingApp = applications.find(a => a.student_id === student.id && a.scholarship_id === sc.id);

        let actionHtml = '';
        if (!isEligible) {
            actionHtml = `<span class="badge badge-red">Not eligible</span>`;
        } else if (existingApp) {
            const statusBadge = existingApp.status === 'Approved' ? 'badge-green' : existingApp.status === 'Rejected' ? 'badge-red' : 'badge-yellow';
            actionHtml = `
                <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span class="badge badge-green">Eligible</span>
                    <span class="badge ${statusBadge}">${existingApp.status}</span>
                    <span class="subtitle" style="font-size:0.8rem;">Already applied</span>
                </div>`;
        } else {
            actionHtml = `
                <div style="display:flex; gap:0.5rem; align-items:center;">
                    <span class="badge badge-green">Eligible</span>
                    <button class="btn btn-sm" onclick="applyScholarship(${student.id}, ${sc.id})">Apply now</button>
                </div>`;
        }

        return `
            <div class="scholarship-card ${isEligible ? 'eligible-border' : ''}">
                <div>
                    <div class="card-top">
                        <div class="card-title">${sc.name}</div>
                        <div class="card-amount">${formatINR(sc.amount)}</div>
                    </div>
                    <div class="tags-row">
                        <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                        <span class="badge badge-gray">${sc.institution_type}</span>
                    </div>
                    <div class="card-meta">
                        Needs CGPA ${sc.min_cgpa.toFixed(2)}+ and income up to ${formatINR(sc.max_income)} · ${sc.category} · due ${sc.deadline}
                        ${reasons.length ? `<ul style="margin-top:0.5rem; padding-left:1.2rem; color:var(--text-secondary);"><li>${reasons.join('</li><li>')}</li></ul>` : ''}
                    </div>
                </div>
                <div class="card-footer">
                    ${actionHtml}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('eligibility-summary').innerHTML =
        `<strong>${student.name}</strong> qualifies for <strong>${qualifiedCount} of ${scholarships.length}</strong> scholarships, worth up to <strong>${formatINR(maxWorth)}</strong>.`;
    document.getElementById('eligibility-cards').innerHTML = cardsHtml;
}

function applyScholarship(studentId, scholarshipId) {
    const newId = applications.length ? Math.max(...applications.map(a => a.id)) + 1 : 1;
    applications.unshift({
        id: newId,
        student_id: studentId,
        scholarship_id: scholarshipId,
        date: '2026-11-19',
        status: 'Pending',
        remarks: 'Application submitted'
    });
    refreshAll();
}

function renderStudents() {
    const query = document.getElementById('student-search').value.toLowerCase();
    const catFilter = document.getElementById('student-category-filter').value;

    const filtered = students.filter(s => {
        const matchesText = s.name.toLowerCase().includes(query) || s.course.toLowerCase().includes(query) || s.email.toLowerCase().includes(query) || s.category.toLowerCase().includes(query);
        const matchesCat = catFilter === 'All' || s.category === catFilter;
        return matchesText && matchesCat;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / studentsPerPage));
    if (studentPage > totalPages) studentPage = totalPages;
    const start = (studentPage - 1) * studentsPerPage;
    const pageItems = filtered.slice(start, start + studentsPerPage);

    document.getElementById('students-tbody').innerHTML = pageItems.length ? pageItems.map(s => `
        <tr>
            <td>#${s.id}</td>
            <td><strong>${s.name}</strong><span class="sub-text">${s.email}</span></td>
            <td>${s.course}</td>
            <td>${s.year}</td>
            <td>${s.cgpa.toFixed(2)}</td>
            <td>${formatINR(s.income)}</td>
            <td><span class="badge badge-gray">${s.category}</span></td>
            <td><button class="btn-outline btn-sm" onclick="jumpToEligibility(${s.id})">Check eligibility</button></td>
        </tr>
    `).join('') : `<tr><td colspan="8" class="subtitle" style="text-align:center;">No matching students found.</td></tr>`;

    document.getElementById('students-pagination').innerHTML = `
        <span>Showing ${filtered.length ? start + 1 : 0}–${Math.min(start + studentsPerPage, filtered.length)} of ${filtered.length} students</span>
        <div style="display:flex; gap:0.5rem; align-items:center;">
            <button class="btn-outline btn-sm" ${studentPage <= 1 ? 'disabled' : ''} onclick="studentPage--; renderStudents()">Previous</button>
            <span style="padding: 0.3rem 0.6rem;">Page ${studentPage} of ${totalPages}</span>
            <button class="btn-outline btn-sm" ${studentPage >= totalPages ? 'disabled' : ''} onclick="studentPage++; renderStudents()">Next</button>
        </div>
    `;
}

function renderScholarships() {
    const fundFilter = document.getElementById('filter-funding').value;
    const instFilter = document.getElementById('filter-institution').value;

    const sorted = [...scholarships]
        .filter(sc => (fundFilter === 'All' || sc.funding_type === fundFilter) && (instFilter === 'All' || sc.institution_type === instFilter))
        .sort((a, b) => b.amount - a.amount);

    document.getElementById('scholarships-grid').innerHTML = sorted.map(sc => {
        const appCount = applications.filter(a => a.scholarship_id === sc.id).length;
        return `
            <div class="scholarship-card">
                <div>
                    <div class="card-top">
                        <div class="card-title">${sc.name}</div>
                        <div class="card-amount">${formatINR(sc.amount)}</div>
                    </div>
                    <div class="tags-row">
                        <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                        <span class="badge badge-gray">${sc.institution_type}</span>
                    </div>
                    <div class="card-meta">
                        Minimum CGPA ${sc.min_cgpa.toFixed(2)} · income up to ${formatINR(sc.max_income)}<br>
                        Category: <strong>${sc.category}</strong>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="badge badge-gray">Due ${sc.deadline}</span>
                    <span class="subtitle">${appCount} applications</span>
                </div>
            </div>
        `;
    }).join('');
}

function setAppFilter(status, btn) {
    appFilter = status;
    document.querySelectorAll('#app-status-pills .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    renderApplications();
}

function renderApplications() {
    const filtered = applications.filter(a => appFilter === 'All' || a.status === appFilter);
    document.getElementById('applications-tbody').innerHTML = filtered.map(a => {
        const student = students.find(s => s.id === a.student_id) || { name: 'Unknown' };
        const sc = scholarships.find(s => s.id === a.scholarship_id) || { name: 'Unknown', amount: 0, funding_type: '', institution_type: '' };
        const statusClass = a.status === 'Approved' ? 'badge-green' : a.status === 'Rejected' ? 'badge-red' : 'badge-yellow';

        return `
            <tr>
                <td><strong>${student.name}</strong></td>
                <td>
                    <strong>${sc.name}</strong> <span class="badge ${getFundingBadgeClass(sc.funding_type)}">${sc.funding_type}</span>
                    <span class="sub-text">${formatINR(sc.amount)} · ${sc.institution_type}</span>
                </td>
                <td>${a.date}</td>
                <td><span class="badge ${statusClass}">${a.status}</span></td>
                <td>${a.remarks}</td>
                <td>
                    <div style="display:flex; gap:0.4rem;">
                        ${a.status === 'Pending' ? `
                            <button class="btn btn-sm" onclick="updateAppStatus(${a.id}, 'Approved')">Approve</button>
                            <button class="btn-outline btn-sm" onclick="updateAppStatus(${a.id}, 'Rejected')">Reject</button>
                        ` : ''}
                        <button class="btn-danger btn-sm" onclick="deleteApp(${a.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateAppStatus(id, status) {
    const app = applications.find(a => a.id === id);
    if (app) {
        app.status = status;
        app.remarks = status === 'Approved' ? 'Eligible for scholarship' : 'Does not meet criteria';
        refreshAll();
    }
}

function deleteApp(id) {
    applications = applications.filter(a => a.id !== id);
    refreshAll();
}

function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function addStudent(e) {
    e.preventDefault();
    const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.unshift({
        id: newId,
        name: document.getElementById('st-name').value,
        email: document.getElementById('st-email').value,
        course: document.getElementById('st-course').value,
        year: Number(document.getElementById('st-year').value),
        cgpa: Number(document.getElementById('st-cgpa').value),
        income: Number(document.getElementById('st-income').value),
        category: document.getElementById('st-category').value
    });
    e.target.reset();
    closeModal('student-modal');
    refreshAll();
}

function addScholarship(e) {
    e.preventDefault();
    const newId = scholarships.length ? Math.max(...scholarships.map(s => s.id)) + 1 : 1;
    scholarships.push({
        id: newId,
        name: document.getElementById('sc-name').value,
        amount: Number(document.getElementById('sc-amount').value),
        funding_type: document.getElementById('sc-funding').value,
        institution_type: document.getElementById('sc-institution').value,
        min_cgpa: Number(document.getElementById('sc-cgpa').value),
        max_income: Number(document.getElementById('sc-income').value),
        category: document.getElementById('sc-category').value,
        deadline: document.getElementById('sc-deadline').value
    });
    e.target.reset();
    closeModal('scholarship-modal');
    refreshAll();
}

refreshAll();
