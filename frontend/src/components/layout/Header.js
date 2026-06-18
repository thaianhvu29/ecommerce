import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

/**
 * Header Component
 * Demonstrates: useContext, Conditional Rendering, Event Handling
 */
const Header = () => {
    const { user, isAuthenticated, isAdmin, dispatch, AUTH_ACTIONS } = useAuth();
    const { cartItemsCount } = useCart();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <h1>🛒 Ecommerce</h1>
                    </Link>

                    <nav className="nav">
                        <Link to="/">Trang chủ</Link>
                        <Link to="/products">Sản phẩm</Link>
                        <Link to="/categories">Danh mục</Link>
                    </nav>

                    <div className="header-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="cart-icon">
                                    🛒
                                    {cartItemsCount > 0 && (
                                        <span className="cart-badge">{cartItemsCount}</span>
                                    )}
                                </Link>

                                <div className="user-menu">
                                    <button
                                        className="user-button"
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                    >
                                        👤 {user?.name}
                                    </button>

                                    {showUserMenu && (
                                        <div className="dropdown-menu">
                                            <Link to="/profile">Tài khoản</Link>
                                            <Link to="/orders">Đơn hàng</Link>
                                            <Link to="/wishlist">Yêu thích</Link>
                                            {isAdmin && (
                                                <>
                                                    <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
                                                    <Link to="/admin/categories">📁 Danh mục</Link>
                                                    <Link to="/admin/products">📦 Sản phẩm</Link>
                                                </>
                                            )}
                                            <button onClick={handleLogout}>Đăng xuất</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// React.memo to prevent unnecessary re-renders
export default React.memo(Header);
