// client/src/components/admin/ProductManager.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';

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
  images: ProductImage[];
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
  subcategories: Category[];
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    specifications: '',
    care_instructions: '',
    price: '',
    sale_price: '',
    category: '',
    subcategory: '',
    brand: '',
    materials: 'wood',
    colors: 'natural',
    condition: 'new',
    dimensions_length: '',
    dimensions_width: '',
    dimensions_height: '',
    weight: '',
    stock_quantity: '0',
    min_stock_level: '5',
    status: 'active',
    featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    requires_assembly: false,
    assembly_time_minutes: '',
    free_shipping: false,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/products/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/categories/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add images
      selectedImages.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const url = editingProduct 
        ? `http://localhost:8000/api/admin/products/${editingProduct.id}/`
        : 'http://localhost:8000/api/admin/products/';
      
      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
      });

      if (response.ok) {
        await fetchProducts();
        closeModal();
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Error saving product. Please check the form.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      short_description: product.short_description,
      description: product.description,
      specifications: '',
      care_instructions: '',
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      materials: product.materials,
      colors: product.colors,
      condition: 'new',
      dimensions_length: '',
      dimensions_width: '',
      dimensions_height: '',
      weight: '',
      stock_quantity: product.stock_quantity.toString(),
      min_stock_level: '5',
      status: product.status,
      featured: product.featured,
      is_bestseller: false,
      is_new_arrival: false,
      requires_assembly: false,
      assembly_time_minutes: '',
      free_shipping: false,
      meta_title: '',
      meta_description: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
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
      specifications: '',
      care_instructions: '',
      price: '',
      sale_price: '',
      category: '',
      subcategory: '',
      brand: '',
      materials: 'wood',
      colors: 'natural',
      condition: 'new',
      dimensions_length: '',
      dimensions_width: '',
      dimensions_height: '',
      weight: '',
      stock_quantity: '0',
      min_stock_level: '5',
      status: 'active',
      featured: false,
      is_bestseller: false,
      is_new_arrival: false,
      requires_assembly: false,
      assembly_time_minutes: '',
      free_shipping: false,
      meta_title: '',
      meta_description: ''
    });
    setSelectedImages([]);
    setPreviewImages([]);
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
        <h2 className="text-2xl font-bold text-neutral-900">Product Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
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
                      {product.images[0] ? (
                        <img
                          src={product.images[0].image}
                          alt={product.images[0].alt_text}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center mr-4">
                          <ImageIcon className="w-6 h-6 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-600">SKU: {product.sku}</p>
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h4>
                </div>

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

                {/* Categorization */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-neutral-900 mb-4">Categorization</h4>
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
                    disabled={!selectedCategory?.subcategories.length}
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory?.subcategories.map((subcategory) => (
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

                {/* Status and Options */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-neutral-900 mb-4">Status & Options</h4>
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
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_bestseller"
                      checked={formData.is_bestseller}
                      onChange={handleInputChange}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-neutral-700">Bestseller</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_new_arrival"
                      checked={formData.is_new_arrival}
                      onChange={handleInputChange}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-neutral-700">New Arrival</span>
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
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
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