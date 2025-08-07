
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const connectDb = async () => {
    try {
        const mongoURL = "mongodb://127.0.0.1:27017/foodWebBackend";

        // Set up MongoDB connection
        mongoose.connect(mongoURL)

        // Get the default connection
        // Mongoose maintains a default connection object representing the MongoDB connection.
        const db = mongoose.connection;

        // Define event listeners for database connection

        db.on('connected', () => {
            console.log('Connected to MongoDB server');
        });

        db.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        db.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
    } catch (error) {
        
    }
}
// Define the MongoDB connection URL


// Export the database connection
export default connectDb;
