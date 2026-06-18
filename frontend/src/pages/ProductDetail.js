import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, reviewsAPI, cartAPI, wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import './ProductDetail.css';

/**
 * Product Detail Page
 * Demonstrates: URL params, Complex state, Image gallery
 */
const ProductDetail = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewsAPI.getByProduct(id);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await cartAPI.addItem({
                productId: product._id,
                quantity
            });
            alert('Đã thêm vào giỏ hàng!');
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/cart');
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await wishlistAPI.toggle(product._id);
            setIsInWishlist(!isInWishlist);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    if (loading) return <Loading />;
    if (!product) return <div className="container">Sản phẩm không tồn tại</div>;

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="product-detail-grid">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={product.images[selectedImage] || '/placeholder.jpg'}
                                alt={product.name}
                            />
                        </div>
                        <div className="thumbnail-list">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className={selectedImage === index ? 'active' : ''}
                                    onClick={() => setSelectedImage(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-detail">
                        <h1>{product.name}</h1>

                        <div className="rating-section">
                            <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
                            <span className="review-count">({product.numReviews} đánh giá)</span>
                            <span className="sold-count">{product.sold} đã bán</span>
                        </div>

                        <div className="price-section">
                            <span className="current-price">
                                {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            {product.comparePrice && (
                                <>
                                    <span className="original-price">
                                        {product.comparePrice.toLocaleString('vi-VN')}đ
                                    </span>
                                    <span className="discount-badge">
                                        -{product.discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="stock-section">
                            <strong>Tình trạng:</strong>
                            <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                            </span>
                        </div>

                        <div className="quantity-section">
                            <strong>Số lượng:</strong>
                            <div className="quantity-control">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max={product.stock}
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                className="btn btn-outline"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                🛒 Thêm vào giỏ
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                            >
                                Mua ngay
                            </button>
                            <button
                                className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
                                onClick={handleToggleWishlist}
                            >
                                ♥
                            </button>
                        </div>

                        <div className="description-section">
                            <h3>Mô tả sản phẩm</h3>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Đánh giá sản phẩm ({reviews.length})</h2>
                    {reviews.length > 0 ? (
                        <div className="reviews-list">
                            {reviews.map(review => (
                                <div key={review._id} className="review-item">
                                    <div className="review-header">
                                        <strong>{review.user.name}</strong>
                                        <span className="review-rating">
                                            {'⭐'.repeat(review.rating)}
                                        </span>
                                    </div>
                                    <p>{review.comment}</p>
                                    <small>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</small>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Chưa có đánh giá nào</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
