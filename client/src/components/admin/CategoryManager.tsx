// client/src/components/admin/CategoryManager.tsx (Fixed)
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FolderPlus, Folder, ChevronRight, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_category: string | null;
  is_active: boolean;
  sort_order: number;
  subcategories: Category[];
  product_count: number;
  created_at: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_category: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/categories/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || data || []);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = editingCategory 
        ? `http://localhost:8000/api/admin/categories/${editingCategory.id}/`
        : 'http://localhost:8000/api/admin/categories/';
      
      const method = editingCategory ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchCategories();
        closeModal();
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        setError('Error saving category. Please check the form.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      parent_category: category.parent_category || '',
      is_active: category.is_active,
      sort_order: category.sort_order
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all subcategories.`)) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/categories/${id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchCategories();
        alert('Category deleted successfully!');
      } else {
        alert('Error deleting category. Make sure it has no products assigned.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parent_category: '',
      is_active: true,
      sort_order: 0
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <div 
          className={`flex items-center justify-between p-4 border-b border-neutral-200 hover:bg-neutral-50 ${
            level > 0 ? 'bg-neutral-25' : ''
          }`}
          style={{ paddingLeft: `${16 + (level * 24)}px` }}
        >
          <div className="flex items-center space-x-3">
            {category.subcategories.length > 0 && (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="p-1 hover:bg-neutral-200 rounded"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-primary-600" />
              <div>
                <h3 className="font-medium text-neutral-900">{category.name}</h3>
                <p className="text-sm text-neutral-600">
                  {category.product_count || 0} products
                  {category.description && ` • ${category.description.substring(0, 50)}${category.description.length > 50 ? '...' : ''}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.is_active ? 'Active' : 'Inactive'}
            </span>
            
            <button
              onClick={() => handleEdit(category)}
              className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleDelete(category.id, category.name)}
              className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Render subcategories */}
        {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
          <div>
            {renderCategoryTree(category.subcategories, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Get only parent categories for the tree view
  const parentCategories = categories.filter(cat => !cat.parent_category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Category Management</h2>
          <p className="text-neutral-600 mt-1">Manage product categories and subcategories</p>
        </div>
        <button
  onClick={() => setShowModal(true)}
  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
>
  <Plus className="w-4 h-4 mr-2" />
  Add Category
</button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="bg-primary-50 p-3 rounded-lg">
              <Folder className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">Total Categories</p>
              <p className="text-2xl font-bold text-neutral-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <FolderPlus className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">Parent Categories</p>
              <p className="text-2xl font-bold text-neutral-900">{parentCategories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">Subcategories</p>
              <p className="text-2xl font-bold text-neutral-900">
                {categories.filter(cat => cat.parent_category).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Folder className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-600">Active Categories</p>
              <p className="text-2xl font-bold text-neutral-900">
                {categories.filter(cat => cat.is_active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Category Hierarchy</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Click the arrows to expand/collapse subcategories
          </p>
        </div>
        
        {categories.length > 0 ? (
          <div>
            {parentCategories.length > 0 ? (
              renderCategoryTree(parentCategories)
            ) : (
              <div className="p-8 text-center">
                <Folder className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Only subcategories found</h3>
                <p className="text-neutral-600 mb-4">
                  Create some parent categories to organize your products.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Create Parent Category
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Folder className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No categories yet</h3>
            <p className="text-neutral-600 mb-4">
              Start by creating your first product category.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Create First Category
            </button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-neutral-100  rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Living Room, Bedroom, Office"
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    The URL slug will be automatically generated from the name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of this category..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Parent Category
                  </label>
                  <select
                    name="parent_category"
                    value={formData.parent_category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">None (Top Level Category)</option>
                    {parentCategories
                      .filter(cat => editingCategory ? cat.id !== editingCategory.id : true)
                      .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">
                    Leave empty to create a top-level category, or select a parent to create a subcategory
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Lower numbers appear first. Categories with the same order are sorted alphabetically.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="mr-3 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm text-neutral-700">
                    Active (visible to customers)
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-primary-700 disabled:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;