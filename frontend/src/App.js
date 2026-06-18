import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Loading from './components/common/Loading';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

/**
 * App Component - Main application entry
 * Demonstrates: 
 * - React.lazy & Suspense for code splitting
 * - React Router v6
 * - Context Providers composition
 * - Private Routes
 */

// Lazy loading - Code splitting for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app">
                        <Header />

                        <main className="main-content">
                            {/* Suspense - Show fallback while lazy components load */}
                            <Suspense fallback={<Loading />}>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/products/:id" element={<ProductDetail />} />

                                    {/* Private Routes - Require Authentication */}
                                    <Route
                                        path="/cart"
                                        element={
                                            <PrivateRoute>
                                                <Cart />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/checkout"
                                        element={
                                            <PrivateRoute>
                                                <Checkout />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders"
                                        element={
                                            <PrivateRoute>
                                                <Orders />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <PrivateRoute>
                                                <Profile />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/wishlist"
                                        element={
                                            <PrivateRoute>
                                                <Wishlist />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* Admin Routes */}
                                    <Route
                                        path="/admin/products"
                                        element={
                                            <PrivateRoute adminOnly={true}>
                                                <AdminProducts />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/categories"
                                        element={
                                            <PrivateRoute adminOnly={true}>
                                                <AdminCategories />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* 404 */}
                                    <Route
                                        path="*"
                                        element={
                                            <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
                                                <h1>404 - Không tìm thấy trang</h1>
                                                <a href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                                                    Về trang chủ
                                                </a>
                                            </div>
                                        }
                                    />
                                </Routes>
                            </Suspense>
                        </main>

                        <footer className="footer">
                            <div className="container">
                                <p>&copy; 2024 Ecommerce. All rights reserved.</p>
                            </div>
                        </footer>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
