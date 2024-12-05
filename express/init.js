const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection String from .env
const MONGO_URI = process.env.MONGO_URI;

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Email format is invalid'],
    },
    password: { type: String, required: true, minlength: 6 },
});

const User = mongoose.model('User', userSchema);

// Seed Data (Optional)
const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany();

        // Create new users
        const users = [
            { username: 'admin', email: 'admin@example.com', password: 'admin123' },
            { username: 'testuser', email: 'test@example.com', password: 'test123' },
        ];

        await User.insertMany(users);
        console.log('Seeded users successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

// Initialize Database
const initDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Optionally seed data
        await seedUsers();

        mongoose.connection.close();
        console.log('Database initialization complete');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Run the script
initDatabase();
