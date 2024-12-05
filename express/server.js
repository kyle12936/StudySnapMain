const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/decks');

dotenv.config();

const hostname = 'https://ec2-54-145-157-50.compute-1.amazonaws.com/'
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow only specific domain
    credentials: true, // Allow cookies and authorization headers
}));

app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes); // Use deck routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, hostname, () => console.log(`Server running on port ${PORT}`));
