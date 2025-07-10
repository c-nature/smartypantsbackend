// Use dotenv for environment variables in local development
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Your DB connection function
const UserRouter = require('./api/User'); // Your user routes

const app = express();

// Set port from environment variable for Render, or 3000 for local dev
const PORT = process.env.PORT || 3000;

// --- CORS Configuration ---
// This is crucial for security in production!
// Replace with your actual deployed frontend URL after you deploy it.
const deployedFrontendUrl = 'https://your-frontend-app-name.onrender.com'; 
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
if (process.env.NODE_ENV === 'production') {
    allowedOrigins.push(deployedFrontendUrl);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

// --- Middleware ---
app.use(cors(corsOptions)); // Use the secure CORS options
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
