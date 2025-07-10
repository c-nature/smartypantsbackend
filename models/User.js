// models/User.js - FINAL FIX
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: { // <-- THIS IS THE MISSING FIELD!
        type: String,
        required: true,
    },
    has_created_avatar: {
        type: Boolean,
        default: false
    },
    avatar_config: { // Stores the JSON configuration of the avatar
        type: Schema.Types.Mixed, // Allows flexible schema-less object storage
        default: {}
    },
    avatar_url: { // Stores the URL to the generated avatar image (if we serve it from backend)
        type: String,
        default: ''
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
