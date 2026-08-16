const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
    console.error('Usage: node set-admin.js <email>');
    process.exit(1);
}

async function setAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User not found: ${email}`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log('Admin role granted successfully');
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('Role:', user.role);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setAdmin();
