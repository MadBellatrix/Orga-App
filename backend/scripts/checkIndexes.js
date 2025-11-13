import connectDB from '../libs/dbConnect.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Task from '../models/task.model.js';
import Event from '../models/event.model.js';
import Invitation from '../models/invitation.model.js';

async function checkIndexes() {
  try {
    // ensure DB connection
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Failed to connect to MongoDB');
    }
    console.log('📊 Checking Indexes...\n');

    const userIndexes = await User.collection.getIndexes();
    console.log('User Indexes:', Object.keys(userIndexes));

    const taskIndexes = await Task.collection.getIndexes();
    console.log('Task Indexes:', Object.keys(taskIndexes));

    const eventIndexes = await Event.collection.getIndexes();
    console.log('Event Indexes:', Object.keys(eventIndexes));

    const invitationIndexes = await Invitation.collection.getIndexes();
    console.log('Invitation Indexes:', Object.keys(invitationIndexes));

    await mongoose.connection.close();
    console.log('\n✅ Index check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking indexes:', error);
    process.exit(1);
  }
}

checkIndexes();
