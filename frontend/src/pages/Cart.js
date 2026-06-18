import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../services/api';
import Loading from '../components/common/Loading';
import './Cart.css';

/**
 * Cart Page - Giỏ hàng
 * Demonstrates: Context consumption, Array methods
 */
const Cart = () => {
    const { cart, dispatch, CART_ACTIONS, fetchCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchCart();
        }
    }, [token]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await cartAPI.updateItem(itemId, { quantity: newQuantity });
            dispatch({ type: CART_ACTIONS.SET_CART, payload: response.data });
        } catch (error) {
            alert(error.response?.data?.message || 'Không thể cập nhật');
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('Xóa sản phẩm khỏi giỏ hàng?')) return;

        try {
            const response = await cartAPI.removeItem(itemId);
            dispatch({ type: CART_ACTIONS.SET_CART, payload: response.data });
        } catch (error) {
            alert('Không thể xóa sản phẩm');
        }
    };

    const handleCheckout = () => {
        if (cart.items.length === 0) {
            alert('Giỏ hàng trống');
            return;
        }
        navigate('/checkout');
    };

    if (cart.loading) return <Loading />;

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Giỏ hàng ({cart.items.length})</h1>

                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <p>Giỏ hàng của bạn đang trống</p>
                        <Link to="/products" className="btn btn-primary">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="cart-grid">
                        <div className="cart-items">
                            {cart.items.map(item => (
                                <div key={item._id} className="cart-item">
                                    <img
                                        src={item.product.images?.[0] || '/placeholder.jpg'}
                                        alt={item.product.name}
                                    />

                                    <div className="item-info">
                                        <Link to={`/products/${item.product._id}`}>
                                            <h3>{item.product.name}</h3>
                                        </Link>
                                        <p className="item-price">
                                            {item.price.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>

                                    <div className="item-quantity">
                                        <button
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </div>

                                    <button
                                        className="item-remove"
                                        onClick={() => handleRemoveItem(item._id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Tóm tắt đơn hàng</h2>

                            <div className="summary-row">
                                <span>Tạm tính:</span>
                                <span>{cart.totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>{cart.totalPrice > 500000 ? 'Miễn phí' : '30.000đ'}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>
                                    {(cart.totalPrice + (cart.totalPrice > 500000 ? 0 : 30000)).toLocaleString('vi-VN')}đ
                                </span>
                            </div>

                            <button
                                className="btn btn-primary btn-block"
                                onClick={handleCheckout}
                            >
                                Tiến hành thanh toán
                            </button>

                            <Link to="/products" className="continue-shopping">
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
