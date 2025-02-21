const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HR = require('./models/HR');
const Volunteer = require('./models/Volunteer');
require('dotenv').config();

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    console.log('Clearing existing users...');
    await Promise.all([
      HR.deleteMany({}),
      Volunteer.deleteMany({})
    ]);

    // Create HR user with new credentials
    console.log('Creating HR user...');
    const hrPassword = await bcrypt.hash('hr1@123', 10);
    const hr = await HR.create({
      username: 'hr1@example.com',
      password: hrPassword
    });
    console.log('HR user created');

    // Create Volunteer user with new credentials
    console.log('Creating Volunteer user...');
    const volunteerPassword = await bcrypt.hash('vol1@123', 10);
    const volunteer = await Volunteer.create({
      username: 'vol1@example.com',
      password: volunteerPassword
    });
    console.log('Volunteer user created');

    console.log('\nNew Login Credentials:');
    console.log('\nHR Login:');
    console.log('Username:', 'hr1@example.com');
    console.log('Password:', 'hr1@123');
    console.log('\nVolunteer Login:');
    console.log('Username:', 'vol1@example.com');
    console.log('Password:', 'vol1@123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedUsers().catch(console.error);