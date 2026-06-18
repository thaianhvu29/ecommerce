import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI, cartAPI } from '../services/api';
import Loading from '../components/common/Loading';
import './Wishlist.css';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await wishlistAPI.get();
            setWishlist(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistAPI.toggle(productId);
            setWishlist(prev => prev.filter(p => p._id !== productId));
        } catch (error) {
            alert('Không thể xóa sản phẩm');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await cartAPI.addItem({
                productId: product._id,
                quantity: 1
            });
            alert('Đã thêm vào giỏ hàng!');
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="wishlist-page">
            <div className="container">
                <h1>Danh sách yêu thích ({wishlist.length})</h1>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <p>Danh sách yêu thích trống</p>
                        <Link to="/products" className="btn btn-primary">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map(product => (
                            <div key={product._id} className="wishlist-card">
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(product._id)}
                                >
                                    ×
                                </button>

                                <Link to={`/products/${product._id}`}>
                                    <img
                                        src={product.images?.[0] || '/placeholder.jpg'}
                                        alt={product.name}
                                    />
                                </Link>

                                <div className="product-info">
                                    <Link to={`/products/${product._id}`}>
                                        <h3>{product.name}</h3>
                                    </Link>

                                    <div className="product-price">
                                        <span className="current-price">
                                            {product.price.toLocaleString('vi-VN')}đ
                                        </span>
                                        {product.comparePrice && (
                                            <span className="original-price">
                                                {product.comparePrice.toLocaleString('vi-VN')}đ
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className="btn btn-primary btn-block"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
