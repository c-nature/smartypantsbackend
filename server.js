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
            'https://smartypants-irig.onrender.com', // Your frontend deployed on Render (if still active)
            'https://c-nature.github.io',         // Your frontend deployed on GitHub Pages (if still active)
            'https://smartypants-nine.vercel.app', // <--- ADD YOUR VERCELL APP URL HERE
            // If you have custom domains on Vercel, add them here too: 'https://www.yourcustomdomain.com'
        ];

        const corsOptions = {
            origin: (origin, callback) => {
                if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error('This origin is not allowed by CORS policy.'));
                }
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204
        };

        // --- Middleware ---
        app.use(cors(corsOptions));
        app.use(express.json());

        // Add Cross-Origin-Resource-Policy header for backend responses
        // This is crucial when your frontend is cross-origin-isolated
        app.use((req, res, next) => {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            next();
        });

        // --- Routes ---
        app.use('/user', UserRouter);
        app.get('/', (req, res) => {
            res.send('SmartyPants Backend is running!');
        });

        // --- Start Server ---
        connectDB()
            .then(() => {
                app.listen(PORT, () => {
                    console.log(`Server is running on port: ${PORT}`);
                });
            })
            .catch(error => {
                console.error('Failed to start server due to MongoDB connection error:', error);
                process.exit(1);
            });
        