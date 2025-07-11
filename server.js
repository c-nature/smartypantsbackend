// Use dotenv for environment variables in local development
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Your DB connection function
const UserRouter = require('./api/User'); // Your user routes

const app = express();

// Set port from environment variable for Render, or 3000 for local dev
const PORT = process.env.PORT || 3000;

// --- CORS Configuration (FINAL FIX) ---
// We will explicitly define the allowed origins to be as direct as possible.
const allowedOrigins = [
    'http://localhost:5500', 
    'http://127.0.0.1:5500', 
    'https://smartypants-irig.onrender.com' // Your deployed frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the site making the request (your frontend)
    // We check if the incoming origin is in our list of allowed sites.
    // The '!origin' part allows for tools like Postman or mobile apps to access the API.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // If it is, allow the request.
    } else {
      callback(new Error('This origin is not allowed by CORS policy.')); // If not, block it.
    }
  }
};

// --- Middleware ---
// IMPORTANT: Apply CORS middleware before your routes
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

// --- Routes ---
app.use('/user', UserRouter); // Your user API routes
app.get('/', (req, res) => { // A root route for health checks
    res.send('SmartyPants Backend is running!');
});


// --- Start Server ---
// First, connect to the database. Then, start the web server.
// This prevents the server from running if the DB connection fails.
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to start server due to MongoDB connection error:', error);
        process.exit(1); // Exit the process with a failure code
    });
