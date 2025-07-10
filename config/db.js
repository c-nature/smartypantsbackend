// backend/config/db.js - CORRECTED
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Removed deprecated options: useNewUrlParser and useUnifiedTopology
      // They have no effect in Node.js Driver version 4.0.0 and later.
    });

    console.log('Successfully connected to MongoDB!'); // This line ensures the specific message you want
    console.log(`MongoDB Connected: ${conn.connection.host}`); // This line confirms the host connected to
    return conn; // Return the connection object for server.js to use
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`); // More specific error message
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
