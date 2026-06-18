import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const { cart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        country: 'Vietnam',
        paymentMethod: 'cod'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                shippingAddress: formData,
                paymentMethod: formData.paymentMethod
            };

            await ordersAPI.create(orderData);
            alert('Đặt hàng thành công!');
            navigate('/orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Đặt hàng thất bại');
        } finally {
            setLoading(false);
        }
    };

    const shippingPrice = cart.totalPrice > 500000 ? 0 : 30000;
    const totalPrice = cart.totalPrice + shippingPrice;

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Thanh toán</h1>

                <div className="checkout-grid">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-section">
                            <h2>Thông tin giao hàng</h2>

                            <div className="form-group">
                                <label>Họ tên *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ *</label>
                                <input
                                    type="text"
                                    name="street"
                                    className="form-control"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Thành phố *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Quốc gia *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className="form-control"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Phương thức thanh toán</h2>

                            <div className="payment-methods">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                    />
                                    <span>💵 Thanh toán khi nhận hàng (COD)</span>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={handleChange}
                                    />
                                    <span>💳 Thẻ tín dụng / Ghi nợ</span>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank_transfer"
                                        checked={formData.paymentMethod === 'bank_transfer'}
                                        onChange={handleChange}
                                    />
                                    <span>🏦 Chuyển khoản ngân hàng</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading || cart.items.length === 0}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </form>

                    <div className="order-summary">
                        <h2>Đơn hàng của bạn</h2>

                        <div className="summary-items">
                            {cart.items.map(item => (
                                <div key={item._id} className="summary-item">
                                    <span>{item.product.name} × {item.quantity}</span>
                                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Tạm tính:</span>
                                <span>{cart.totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>{shippingPrice === 0 ? 'Miễn phí' : shippingPrice.toLocaleString('vi-VN') + 'đ'}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
