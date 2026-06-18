import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Loading from '../components/common/Loading';
import './Orders.css';

/**
 * Orders Page - Danh sách đơn hàng
 * Demonstrates: Lists, Status rendering, Date formatting
 */
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getAll();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            processing: 'Đang xử lý',
            shipped: 'Đang giao',
            delivered: 'Đã giao',
            cancelled: 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        const classMap = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            processing: 'status-processing',
            shipped: 'status-shipped',
            delivered: 'status-delivered',
            cancelled: 'status-cancelled'
        };
        return classMap[status] || '';
    };

    if (loading) return <Loading />;

    return (
        <div className="orders-page">
            <div className="container">
                <h1>Đơn hàng của tôi</h1>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <p>Bạn chưa có đơn hàng nào</p>
                        <Link to="/products" className="btn btn-primary">
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Đơn hàng #{order.orderNumber}</h3>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map(item => (
                                        <div key={item._id} className="order-item">
                                            <img
                                                src={item.image || '/placeholder.jpg'}
                                                alt={item.name}
                                            />
                                            <div className="item-details">
                                                <p className="item-name">{item.name}</p>
                                                <p className="item-quantity">Số lượng: {item.quantity}</p>
                                            </div>
                                            <div className="item-price">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <span>Tổng cộng:</span>
                                        <strong>{order.totalPrice.toLocaleString('vi-VN')}đ</strong>
                                    </div>
                                    <Link to={`/orders/${order._id}`} className="btn btn-outline">
                                        Chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
