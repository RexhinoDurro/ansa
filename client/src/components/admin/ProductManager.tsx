// client/src/components/admin/ProductManager.tsx (Fixed with Visible Buttons)
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  price: number;
  sale_price?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  materials: string;
  colors: string;
  stock_quantity: number;
  status: string;
  featured: boolean;
  images?: ProductImage[];
}

interface ProductImage {
  id: string;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    price: '',
    sale_price: '',
    category: '',
    subcategory: '',
    brand: '',
    materials: 'wood',
    colors: 'natural',
    stock_quantity: '0',
    status: 'active',
    featured: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/products/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data.results || data || []);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setProducts([]);
    }
  };

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
      setCategories([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('=== FRONTEND DEBUG ===');
    console.log('Form data:', formData);
    console.log('Editing product:', editingProduct);
    console.log('Selected images:', selectedImages);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields with validation
      const requiredFields = ['name', 'description', 'price', 'category'];
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        setError(`Please fill in required fields: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }
      
      // Add form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          console.log(`Adding field: ${key} = ${value}`);
          formDataToSend.append(key, value.toString());
        }
      });

      // Add images
      selectedImages.forEach((image, index) => {
        console.log(`Adding image ${index}:`, image.name);
        formDataToSend.append('images', image);
      });

      // Log what we're sending
      console.log('FormData contents:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const url = editingProduct && editingProduct.id
        ? `http://localhost:8000/api/admin/products/${editingProduct.id}/`
        : 'http://localhost:8000/api/admin/products/';
      
      const method = editingProduct && editingProduct.id ? 'PATCH' : 'POST';

      console.log('Making request to:', url);
      console.log('Method:', method);

      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
      });

      console.log('Response status:', response.status);

      const responseData = await response.text();
      console.log('Response data (raw):', responseData);

      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
        console.log('Response data (parsed):', parsedData);
      } catch (e) {
        console.log('Failed to parse response as JSON');
        parsedData = { error: 'Invalid response format' };
      }

      if (response.ok) {
        await fetchProducts();
        closeModal();
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        console.error('Server error:', parsedData);
        setError(parsedData.error || 'Error saving product. Please check the form.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      short_description: product.short_description || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      sale_price: product.sale_price?.toString() || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      materials: product.materials || 'wood',
      colors: product.colors || 'natural',
      stock_quantity: product.stock_quantity?.toString() || '0',
      status: product.status || 'active',
      featured: product.featured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('Error: Product ID is missing');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/products/${id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Error deleting product.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      short_description: '',
      description: '',
      price: '',
      sale_price: '',
      category: '',
      subcategory: '',
      brand: '',
      materials: 'wood',
      colors: 'natural',
      stock_quantity: '0',
      status: 'active',
      featured: false,
    });
    setSelectedImages([]);
    setPreviewImages([]);
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

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Product Management</h2>
          <p className="text-neutral-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-primary-600 hover:bg-primary-700 bg-blue-500 hover:bg-blue-600 font-medium rounded-lg transition-colors duration-200  px-6 py-3 rounded-lg transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No products yet</h3>
            <p className="text-neutral-600 mb-4">
              Start by creating your first product. Make sure you have categories created first.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.open('/admin/categories', '_self')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
              >
                Manage Categories First
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
              >
                Create First Product
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Product</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Price</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Stock</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0].image}
                            alt={product.images[0].alt_text || product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center mr-4">
                            <ImageIcon className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-neutral-900">{product.name}</p>
                          <p className="text-sm text-neutral-600">SKU: {product.sku || 'N/A'}</p>
                          <p className="text-xs text-neutral-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">${product.price}</p>
                        {product.sale_price && (
                          <p className="text-sm text-green-600">${product.sale_price} (Sale)</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                        product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                      {product.featured && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
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

              {categories.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">
                    <strong>Warning:</strong> No categories found. You need to create categories first before adding products.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.open('/admin/categories', '_self')}
                    className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold"
                  >
                    Go to Category Management
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    maxLength={300}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={!selectedCategory?.subcategories?.length}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory?.subcategories?.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Material
                  </label>
                  <select
                    name="materials"
                    value={formData.materials}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="wood">Wood</option>
                    <option value="metal">Metal</option>
                    <option value="fabric">Fabric</option>
                    <option value="leather">Leather</option>
                    <option value="glass">Glass</option>
                    <option value="plastic">Plastic</option>
                    <option value="rattan">Rattan</option>
                    <option value="marble">Marble</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Color
                  </label>
                  <select
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="natural">Natural</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="brown">Brown</option>
                    <option value="gray">Gray</option>
                    <option value="beige">Beige</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-neutral-700">Featured Product</span>
                  </label>
                </div>

                {/* Images */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-neutral-900 mb-4">Product Images</h4>
                  
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-neutral-400 mb-4" />
                      <p className="text-neutral-600 text-center">
                        Click to upload images or drag and drop<br />
                        <span className="text-sm text-neutral-500">PNG, JPG, GIF up to 10MB each</span>
                      </p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || categories.length === 0}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;