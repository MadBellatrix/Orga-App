import mongoose from "mongoose";

mongoose.connection.on('error', (error) => {
    console.log('DB after initial connection:', error);
});

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MongoDB URI nicht gesetzt');

        await mongoose.connect(uri, {
            dbName: process.env.DATABASE
        });
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Connection error:', error);
    }
};

export default connectDB;
