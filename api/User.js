const express = require('express');
const router = express.Router();

// MongoDB user model
const User = require('../models/User'); // Ensure this path is correct

// Password hashing
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (username === "" || email === "" || password === "") {
        return res.json({
            status: "Error",
            message: "Please fill all the fields"
        });
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return res.json({
            status: "Error",
            message: "Invalid username. Only alphanumeric characters are allowed."
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-\]]{2,4}$/.test(email)) {
        return res.json({
            status: "Error",
            message: "Invalid email entered."
        });
    } else if (password.length < 8) {
        return res.json({
            status: "Error",
            message: "Password must be at least 8 characters long."
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                status: "Error",
                message: "A user with this email already exists."
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.json({
                status: "Error",
                message: "This username is already taken. Please choose another."
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            // New users start with has_created_avatar: false and empty config
            has_created_avatar: false, 
            avatar_config: {},
            avatar_url: ''
        });

        const result = await newUser.save();

        res.json({
            status: "Success",
            message: "User registered successfully",
            data: {
                _id: result._id,
                username: result.username,
                email: result.email,
                has_created_avatar: result.has_created_avatar, // Include new fields
                avatar_url: result.avatar_url // Include new fields
            }
        });

    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({
            status: "Error",
            message: "An error occurred during registration. Please try again."
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    username = username.trim();
    password = password.trim();

    if (username === "" || password === "") {
        return res.json({
            status: "Error",
            message: "Please enter both username and password."
        });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({
                status: "Error",
                message: "Invalid username or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                status: "Success",
                message: "Login successful",
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    has_created_avatar: user.has_created_avatar, // Include new fields
                    avatar_url: user.avatar_url // Include new fields
                }
            });
        } else {
            return res.json({
                status: "Error",
                message: "Invalid username or password."
            });
        }

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({
            status: "Error",
            message: "An unexpected error occurred during login. Please try again."
        });
    }
});

// NEW: Endpoint to save avatar configuration
router.post('/avatar/:userId', async (req, res) => {
    const { userId } = req.params;
    const avatarConfig = req.body; // This should be the JSON object of avatar features

    // You might want to add authentication/authorization here later (e.g., check JWT token)
    // to ensure only the authenticated user can update their own avatar.

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "User not found."
            });
        }

        user.avatar_config = avatarConfig;
        user.has_created_avatar = true;
        // If you were generating and saving the image on the backend, you'd set avatar_url here.
        // For now, we'll assume frontend will handle image generation/display.
        
        await user.save();

        res.json({
            status: "Success",
            message: "Avatar saved successfully!",
            data: {
                userId: user._id,
                avatar_config: user.avatar_config,
                avatar_url: user.avatar_url, // This might be empty for now
                has_created_avatar: user.has_created_avatar
            }
        });

    } catch (err) {
        console.error("Error saving avatar:", err);
        res.status(500).json({
            status: "Error",
            message: "An unexpected error occurred while saving avatar. Please try again."
        });
    }
});

module.exports = router;

        