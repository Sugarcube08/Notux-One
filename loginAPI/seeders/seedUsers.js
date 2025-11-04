const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config(); 

const mongoose = require('mongoose');
const User = require('../models/Users'); 


const seedData = [
  {
    username: 'jdoe',
    password: 'password@123',
    email: 'jane.doe@example.com',
    name: 'Jane Doe'
  },
  {
    username: 'asmith',
    password: 'password@123',
    email: 'alex.smith@example.com',
    name: 'Alex Smith'
  },
  {
    username: 'm_jones',
    password: 'password@123',
    email: 'mike.jones@test.net',
    name: 'Michael Jones'
  },
  {
    username: 'linda.k',
    password: 'password@123',
    email: 'linda.k@webmail.org',
    name: 'Linda Kim'
  },
  {
    username: 'user_500',
    password: 'password@123',
    email: 'fifthuser@demo.co',
    name: 'User Five'
  }
];

async function seed() {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
        
        await mongoose.connect(mongoURI);
        console.log('MongoDB connection successful.');
        
        await User.deleteMany({});
        console.log('Existing users cleared.');

    } catch (error) {
        console.error('Initial MongoDB connection error:', error);
        // Exit if connection fails
        process.exit(1); 
    }

    try {
        const saltRounds = 10;
        const usersToInsert = [];
        
        for (const user of seedData) {
            const hashPassword = await bcrypt.hash(user.password, saltRounds);
            usersToInsert.push({
                ...user,
                password: hashPassword
            });
        }
        console.log('Passwords successfully hashed.');

        await User.insertMany(usersToInsert);
        console.log(`Successfully inserted ${usersToInsert.length} users.`);
        
    } catch (error) {
        console.error('Error during seeding process:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

seed();