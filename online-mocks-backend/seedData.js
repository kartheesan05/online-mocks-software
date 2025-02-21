const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/onlinemocks', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Schemas
const volunteerSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  assignedHRs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HR' }] // Add this field
});

const hrSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  company: String,
  email: String,
  allocatedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }]
});

const studentSchema = new mongoose.Schema({
  registerNumber: String,
  name: String,
  department: String,
  aptitudeScore: Number,
  gdScore: Number,
  allocatedHR: { type: mongoose.Schema.Types.ObjectId, ref: 'HR' }
});

// Create models
const Volunteer = mongoose.model('Volunteer', volunteerSchema);
const HR = mongoose.model('HR', hrSchema);
const Student = mongoose.model('Student', studentSchema);

// Function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await Volunteer.deleteMany({});
    await HR.deleteMany({});
    await Student.deleteMany({});

    // Add Volunteers
    const volunteers = await Volunteer.insertMany([
      {
        name: "John Doe",
        username: "john",
        password: await hashPassword("john123"),
        email: "john@example.com",
        assignedHRs: [] // Will be updated after HRs are created
      },
      {
        name: "Sarah Smith",
        username: "sarah",
        password: await hashPassword("sarah123"),
        email: "sarah@example.com",
        assignedHRs: []
      },
      {
        name: "Mike Johnson",
        username: "mike",
        password: await hashPassword("mike123"),
        email: "mike@example.com",
        assignedHRs: []
      }
    ]);

    // Add HRs
    const hrs = await HR.insertMany([
      {
        name: "Alex Thompson",
        username: "alex",
        password: await hashPassword("alex123"),
        company: "Google",
        email: "alex@google.com",
        allocatedVolunteers: [volunteers[0]._id, volunteers[1]._id] // Assigned to John and Sarah
      },
      {
        name: "Maria Garcia",
        username: "maria",
        password: await hashPassword("maria123"),
        company: "Microsoft",
        email: "maria@microsoft.com",
        allocatedVolunteers: [volunteers[1]._id, volunteers[2]._id] // Assigned to Sarah and Mike
      },
      {
        name: "James Wilson",
        username: "james",
        password: await hashPassword("james123"),
        company: "Amazon",
        email: "james@amazon.com",
        allocatedVolunteers: [volunteers[0]._id, volunteers[2]._id] // Assigned to John and Mike
      },
      {
        name: "Lisa Chen",
        username: "lisa",
        password: await hashPassword("lisa123"),
        company: "Apple",
        email: "lisa@apple.com",
        allocatedVolunteers: [volunteers[1]._id] // Assigned to Sarah only
      }
    ]);

    // Update volunteers with their assigned HRs
    await Volunteer.findByIdAndUpdate(volunteers[0]._id, {
      assignedHRs: [hrs[0]._id, hrs[2]._id] // John is assigned to Alex and James
    });

    await Volunteer.findByIdAndUpdate(volunteers[1]._id, {
      assignedHRs: [hrs[0]._id, hrs[1]._id, hrs[3]._id] // Sarah is assigned to Alex, Maria, and Lisa
    });

    await Volunteer.findByIdAndUpdate(volunteers[2]._id, {
      assignedHRs: [hrs[1]._id, hrs[2]._id] // Mike is assigned to Maria and James
    });

    // Add Students with HR allocations
    await Student.insertMany([
      {
        registerNumber: "2024001",
        name: "Priya Sharma",
        department: "Computer Science",
        aptitudeScore: 85,
        gdScore: 92,
        allocatedHR: hrs[0]._id // Allocated to Alex
      },
      {
        registerNumber: "2024002",
        name: "Rahul Kumar",
        department: "Information Technology",
        aptitudeScore: 78,
        gdScore: 88,
        allocatedHR: hrs[1]._id // Allocated to Maria
      },
      {
        registerNumber: "2024003",
        name: "Aisha Patel",
        department: "Electronics",
        aptitudeScore: 90,
        gdScore: 85,
        allocatedHR: hrs[2]._id // Allocated to James
      },
      {
        registerNumber: "2024004",
        name: "Arjun Singh",
        department: "Computer Science",
        aptitudeScore: 95,
        gdScore: 89,
        allocatedHR: null // Not allocated yet
      },
      {
        registerNumber: "2024005",
        name: "Zara Khan",
        department: "Information Technology",
        aptitudeScore: 88,
        gdScore: 94,
        allocatedHR: null // Not allocated yet
      }
    ]);

    console.log('Data seeded successfully!');

    // Print assignments
    console.log('\nHR-Volunteer Assignments:');
    hrs.forEach(hr => {
      console.log(`\n${hr.name} (${hr.company}):`);
      const assignedVolunteers = volunteers.filter(v => 
        hr.allocatedVolunteers.includes(v._id)
      );
      assignedVolunteers.forEach(v => {
        console.log(`- ${v.name} (${v.username})`);
      });
    });

    console.log('\nVolunteer-HR Assignments:');
    volunteers.forEach(volunteer => {
      console.log(`\n${volunteer.name}:`);
      const assignedHRs = hrs.filter(hr => 
        volunteer.assignedHRs.includes(hr._id)
      );
      assignedHRs.forEach(hr => {
        console.log(`- ${hr.name} (${hr.company})`);
      });
    });

    console.log('\nLogin Credentials:');
    console.log('\nVolunteers:');
    volunteers.forEach(v => {
      console.log(`Username: ${v.username}, Password: ${v.username}123`);
    });
    console.log('\nHRs:');
    hrs.forEach(hr => {
      console.log(`Username: ${hr.username}, Password: ${hr.username}123`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();