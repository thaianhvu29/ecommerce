import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * ProductCard Component
 * Demonstrates: Props, Conditional Rendering, useMemo, Event Handlers
 */
const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist }) => {
    // useMemo - tránh tính toán lại mỗi render
    const displayPrice = useMemo(() => {
        return product.price.toLocaleString('vi-VN');
    }, [product.price]);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        onAddToCart && onAddToCart(product);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleWishlist && onToggleWishlist(product._id);
    };

    return (
        <Link to={`/products/${product._id}`} className="product-card">
            <div className="product-image">
                <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    loading="lazy"
                />

                {/* Conditional Rendering - Show badge if discount */}
                {product.discountPercent > 0 && (
                    <span className="discount-badge">-{product.discountPercent}%</span>
                )}

                <button
                    className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={handleWishlist}
                    aria-label="Add to wishlist"
                >
                    ♥
                </button>
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                <div className="product-rating">
                    <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
                    <span className="review-count">({product.numReviews})</span>
                </div>

                <div className="product-price">
                    <span className="current-price">{displayPrice}đ</span>
                    {product.comparePrice && (
                        <span className="original-price">
                            {product.comparePrice.toLocaleString('vi-VN')}đ
                        </span>
                    )}
                </div>

                <div className="product-footer">
                    <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                        {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                    </span>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </Link>
    );
};

// React.memo - Only re-render if props change
export default React.memo(ProductCard);
