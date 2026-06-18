import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { productsAPI, categoriesAPI, wishlistAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/common/Loading';
import useDebounce from '../hooks/useDebounce';
import './Products.css';

/**
 * Products Page - Trang danh sách sản phẩm
 * Demonstrates: Multiple Hooks, Search & Filter, Pagination
 */
const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0
    });

    const { isAuthenticated } = useAuth();

    // useDebounce - delay search until user stops typing
    const debouncedSearch = useDebounce(filters.search, 500);

    // Fetch data when filters change
    useEffect(() => {
        fetchProducts();
    }, [filters.category, filters.sort, filters.minPrice, filters.maxPrice, debouncedSearch, pagination.page]);

    useEffect(() => {
        fetchCategories();
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll({
                page: pagination.page,
                limit: 12,
                search: debouncedSearch,
                category: filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                sort: filters.sort
            });

            setProducts(response.data.products);
            setPagination({
                page: response.data.page,
                pages: response.data.pages,
                total: response.data.total
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const response = await wishlistAPI.get();
            setWishlist(response.data.map(p => p._id));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
    }, []);

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
            alert('Vui lòng đăng nhập');
            return;
        }

        try {
            const response = await wishlistAPI.toggle(productId);
            setWishlist(response.data.map(p => p._id));
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    }, [isAuthenticated]);

    // useMemo - tránh tính toán lại pagination buttons mỗi render
    const paginationButtons = useMemo(() => {
        const buttons = [];
        for (let i = 1; i <= pagination.pages; i++) {
            buttons.push(i);
        }
        return buttons;
    }, [pagination.pages]);

    return (
        <div className="products-page">
            <div className="container">
                <h1>Sản phẩm</h1>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-group">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="form-control"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <select
                            className="form-control"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <select
                            className="form-control"
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá: Thấp → Cao</option>
                            <option value="price_desc">Giá: Cao → Thấp</option>
                            <option value="rating">Đánh giá cao</option>
                            <option value="popular">Bán chạy</option>
                        </select>
                    </div>

                    <div className="filter-group price-filter">
                        <input
                            type="number"
                            placeholder="Giá từ"
                            className="form-control"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Giá đến"
                            className="form-control"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="results-info">
                    Tìm thấy <strong>{pagination.total}</strong> sản phẩm
                </div>

                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onToggleWishlist={handleToggleWishlist}
                                    isInWishlist={wishlist.includes(product._id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    className="btn btn-outline"
                                >
                                    ← Trước
                                </button>

                                {paginationButtons.map(page => (
                                    <button
                                        key={page}
                                        className={`btn ${page === pagination.page ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    className="btn btn-outline"
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
