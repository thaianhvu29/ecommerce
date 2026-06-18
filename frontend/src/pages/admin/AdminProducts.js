import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        stock: '',
        tags: '',
        isFeatured: false,
        imageUrl: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll({ limit: 100 });
            setProducts(response.data.products);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh!');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước ảnh không được vượt quá 5MB!');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({
                    ...formData,
                    imageUrl: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                stock: parseInt(formData.stock),
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
                images: formData.imageUrl ? [formData.imageUrl] : ['https://via.placeholder.com/400']
            };

            if (editingProduct) {
                await productsAPI.update(editingProduct._id, productData);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await productsAPI.create(productData);
                alert('Thêm sản phẩm thành công!');
            }

            setShowForm(false);
            setEditingProduct(null);
            setImagePreview(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                comparePrice: '',
                category: '',
                stock: '',
                tags: '',
                isFeatured: false,
                imageUrl: ''
            });
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            comparePrice: product.comparePrice || '',
            category: product.category._id || product.category,
            stock: product.stock,
            tags: product.tags?.join(', ') || '',
            isFeatured: product.isFeatured,
            imageUrl: product.images?.[0] || ''
        });
        setImagePreview(product.images?.[0] || null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa sản phẩm này?')) return;

        try {
            await productsAPI.delete(id);
            alert('Đã xóa sản phẩm');
            fetchProducts();
        } catch (error) {
            alert('Không thể xóa sản phẩm');
        }
    };

    const resetForm = () => {
        setShowForm(true);
        setEditingProduct(null);
        setImagePreview(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            comparePrice: '',
            category: '',
            stock: '',
            tags: '',
            isFeatured: false,
            imageUrl: ''
        });
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="admin-products">
            <div className="page-header">
                <h1>Quản lý sản phẩm</h1>
                <button
                    className="btn btn-primary"
                    onClick={resetForm}
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>

                        <form onSubmit={handleSubmit}>
                            {/* Upload ảnh */}
                            <div className="form-group">
                                <label>Ảnh sản phẩm</label>
                                <div className="image-upload-container">
                                    {imagePreview ? (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData({ ...formData, imageUrl: '' });
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="image-upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                            <div className="upload-placeholder">
                                                <span className="upload-icon">📷</span>
                                                <span>Click để chọn ảnh</span>
                                                <small>(JPEG, PNG, GIF - Tối đa 5MB)</small>
                                            </div>
                                        </label>
                                    )}
                                </div>
                                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                    Hoặc nhập URL ảnh bên dưới
                                </small>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    className="form-control"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.imageUrl}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setImagePreview(e.target.value);
                                    }}
                                    style={{ marginTop: '10px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Tên sản phẩm *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mô tả *</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Giá bán *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Giá gốc (nếu có)</label>
                                    <input
                                        type="number"
                                        name="comparePrice"
                                        className="form-control"
                                        value={formData.comparePrice}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Danh mục *</label>
                                    <select
                                        name="category"
                                        className="form-control"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Số lượng *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        className="form-control"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Tags (phân cách bằng dấu phẩy)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    className="form-control"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="VD: mới, bán chạy, giảm giá"
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                    />
                                    <span>Sản phẩm nổi bật</span>
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Đã bán</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                    Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
                                </td>
                            </tr>
                        ) : (
                            products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-cell">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                                alt={product.name}
                                            />
                                            <span>{product.name}</span>
                                        </div>
                                    </td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>{product.price.toLocaleString('vi-VN')}đ</td>
                                    <td>{product.stock}</td>
                                    <td>{product.sold || 0}</td>
                                    <td>
                                        <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                                            {product.isActive ? 'Hoạt động' : 'Ẩn'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => handleEdit(product)}
                                            title="Sửa"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => handleDelete(product._id)}
                                            title="Xóa"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
