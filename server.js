const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./model/item.js');
const SignIn = require('./model/signin.js');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000 })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Create a new item
app.post('/api/items', async (req, res) => {
    const { title, description, image } = req.body;
    const newItem = new Item({ title, description, image });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create a new signin
app.post('/api/signin', async (req, res) => {
    try {
        const { name, password, email, college, roll, dob } = req.body;
        const newUser  = new SignIn({ name, password, email, college, roll, dob });
        await newUser .save();
        res.status(201).json({ message: 'User  signed in successfully', user: newUser  });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route connection
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await SignIn.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords (direct comparison, not secure)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Send response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                college: user.college,
                roll: user.roll,
                dob: user.dob
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});