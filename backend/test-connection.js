const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('🔄 Đang kết nối MongoDB...');
        console.log('URI:', process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Kết nối MongoDB thành công!');
        console.log('📦 Database:', mongoose.connection.name);

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        console.error('Chi tiết:', error);
        process.exit(1);
    }
};

testConnection();
