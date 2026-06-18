const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Thay "fdgdg" bằng name hoặc email của bạn
        const user = await User.findOne({ name: "fdgdg" });

        if (!user) {
            console.log('❌ Không tìm thấy user. Thử tìm theo email:');
            const allUsers = await User.find();
            console.log('Danh sách users:', allUsers.map(u => ({ name: u.name, email: u.email })));
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log('✅ Đã set role admin cho user:', user.name, '/', user.email);
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

setAdmin();
