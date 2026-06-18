const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const fixProductImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Lấy tất cả sản phẩm
        const products = await Product.find();
        console.log(`Tìm thấy ${products.length} sản phẩm`);

        // Sample images từ Unsplash (miễn phí)
        const sampleImages = [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400'
        ];

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            // Nếu ảnh là data:image (Base64) hoặc placeholder, thay thế
            if (!product.images ||
                product.images.length === 0 ||
                product.images[0].startsWith('data:image') ||
                product.images[0].includes('placeholder')) {

                // Gán ảnh mẫu ngẫu nhiên
                const randomImage = sampleImages[i % sampleImages.length];
                product.images = [randomImage];
                await product.save();

                console.log(`✅ Đã fix ảnh cho: ${product.name}`);
            } else {
                console.log(`⏭️  Bỏ qua: ${product.name} (đã có ảnh hợp lệ)`);
            }
        }

        console.log('\n🎉 Hoàn thành! Tất cả sản phẩm đã có ảnh.');
        console.log('Refresh trang web để xem kết quả.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

fixProductImages();
