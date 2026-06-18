import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, wishlistAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import './Home.css';

/**
 * Home Page - Trang chủ
 * Demonstrates: useEffect for data fetching, useCallback, Conditional Rendering
 */
const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsRes = await productsAPI.getFeatured();
            setFeaturedProducts(productsRes.data);

            if (isAuthenticated) {
                const wishlistRes = await wishlistAPI.get();
                setWishlist(wishlistRes.data.map(p => p._id));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // useCallback - memoize function to avoid recreating on each render
    const handleAddToCart = useCallback(async (product) => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        try {
            await cartAPI.addItem({
                productId: product._id,
                quantity: 1
            });
            alert('Đã thêm vào giỏ hàng!');
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    }, [isAuthenticated]);

    const handleToggleWishlist = useCallback(async (productId) => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
            return;
        }

        try {
            const response = await wishlistAPI.toggle(productId);
            setWishlist(response.data.map(p => p._id));
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    }, [isAuthenticated]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Chào mừng đến với Ecommerce</h1>
                        <p>Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Mua sắm ngay
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Sản phẩm nổi bật</h2>
                        <Link to="/products">Xem tất cả →</Link>
                    </div>

                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                onToggleWishlist={handleToggleWishlist}
                                isInWishlist={wishlist.includes(product._id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Miễn phí vận chuyển</h3>
                            <p>Cho đơn hàng trên 500.000đ</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Thanh toán an toàn</h3>
                            <p>Bảo mật thông tin 100%</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">↩️</div>
                            <h3>Đổi trả dễ dàng</h3>
                            <p>Trong vòng 30 ngày</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3>Hỗ trợ 24/7</h3>
                            <p>Tư vấn nhiệt tình</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
