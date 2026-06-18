import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import './AdminCategories.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory._id, formData);
                alert('Cập nhật danh mục thành công!');
            } else {
                await categoriesAPI.create(formData);
                alert('Thêm danh mục thành công!');
            }

            setShowForm(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa danh mục này?')) return;

        try {
            await categoriesAPI.delete(id);
            alert('Đã xóa danh mục');
            fetchCategories();
        } catch (error) {
            alert('Không thể xóa danh mục');
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="admin-categories">
            <div className="page-header">
                <h1>Quản lý danh mục</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setShowForm(true);
                        setEditingCategory(null);
                        setFormData({ name: '', description: '' });
                    }}
                >
                    + Thêm danh mục
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên danh mục *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="VD: Điện thoại, Laptop, Quần áo..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Mô tả về danh mục..."
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingCategory ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="categories-grid">
                {categories.length === 0 ? (
                    <div className="empty-state">
                        <p>Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</p>
                    </div>
                ) : (
                    categories.map(category => (
                        <div key={category._id} className="category-card">
                            <h3>{category.name}</h3>
                            <p>{category.description || 'Chưa có mô tả'}</p>
                            <div className="card-actions">
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleEdit(category)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(category._id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
