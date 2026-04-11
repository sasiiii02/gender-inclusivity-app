import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CaseStatus from './models/CaseStatus.js';

dotenv.config();

const syncStatuses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const statuses = [
            'Pending', 
            'Under Review', 
            'In Progress', 
            'Investigating', 
            'Resolved', 
            'Rejected', 
            'Closed'
        ];

        for (const name of statuses) {
            await CaseStatus.findOneAndUpdate(
                { name }, 
                { name }, 
                { upsert: true, new: true }
            );
            console.log(`Synced status: ${name}`);
        }

        console.log("All statuses synchronized successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing statuses:", error);
        process.exit(1);
    }
};

syncStatuses();
