require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const connectDB = require('../config/db');

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Complaint.deleteMany();

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      phone: '0000000000',
      password: 'Swachh@2026',
      role: 'admin',
    });

    // 2. Create Workers
    const worker1 = await User.create({
      name: 'Ramesh Kadam',
      phone: '1111111111',
      password: 'password123',
      role: 'worker',
      workerId: 'W-1001',
    });

    const worker2 = await User.create({
      name: 'Suresh Pawar',
      phone: '2222222222',
      password: 'password123',
      role: 'worker',
      workerId: 'W-1002',
    });

    // 3. Create a Citizen
    const citizen = await User.create({
      name: 'Prathamesh Deshmukh',
      phone: '9999999999',
      password: 'password123',
      role: 'citizen',
    });

    // 4. Create sample Complaints
    await Complaint.create([
      {
        complaintId: 'SS-10001',
        citizen: citizen._id,
        citizenName: citizen.name,
        issueType: 'Overflowing Bin',
        location: 'FC Road, Pune',
        description: 'Bin is completely full and garbage is spilling on the road.',
        beforePhoto: 'data:image/jpeg;base64,...', // Provide valid mock or actual base64
        status: 'pending',
      },
      {
        complaintId: 'SS-10002',
        citizen: citizen._id,
        citizenName: citizen.name,
        issueType: 'Garbage Dump',
        location: 'JM Road, Pune',
        description: 'Illegal dumping spot near the bridge.',
        beforePhoto: 'data:image/jpeg;base64,...',
        assignedWorker: worker1._id,
        status: 'assigned',
      }
    ]);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
