const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            product,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này' });
        }

        // Check if user purchased the product
        const order = await Order.findOne({
            user: req.user._id,
            'items.product': product,
            status: 'delivered'
        });

        const review = await Review.create({
            product,
            user: req.user._id,
            rating,
            comment,
            isVerifiedPurchase: !!order
        });

        await review.populate('user', 'name avatar');
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
