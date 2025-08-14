import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '../utils/api';
import type { ProductListItem, Category, ApiResponse } from '../types';

interface FilterState {
  category: string;
  subcategory: string;
  material: string;
  color: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

interface FilterOptions {
  categories: Category[];
  materials: { value: string; label: string }[];
  colors: { value: string; label: string }[];
  price_range: { min: number; max: number };
}

const ProductCard: React.FC<{ product: ProductListItem; viewMode: 'grid' | 'list' }> = ({ 
  product, 
  viewMode 
}) => {
  if (viewMode === 'list') {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex"
      >
        <div className="w-48 h-48 flex-shrink-0 overflow-hidden bg-neutral-100">
          {product.primary_image ? (
            <img
              src={product.primary_image.image}
              alt={product.primary_image.alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-400">No Image</span>
            </div>
          )}
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-xl text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
              {product.name}
            </h3>
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
          </div>
          <p className="text-neutral-600 mb-4">
            {product.short_description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-neutral-500">
              <span>Category: {product.category_name}</span>
              <span>Material: {product.materials}</span>
              <span>Color: {product.colors}</span>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${
              product.is_in_stock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square overflow-hidden bg-neutral-100">
        {product.primary_image ? (
          <img
            src={product.primary_image.image}
            alt={product.primary_image.alt_text || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-400">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {product.short_description}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary-600">
            ${product.price}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            product.is_in_stock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="text-xs text-neutral-500">
          {product.category_name} • {product.materials}
        </div>
      </div>
    </Link>
  );
};

const FilterSidebar: React.FC<{
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filterOptions: FilterOptions | undefined;
  isOpen: boolean;
  onClose: () => void;
}> = ({ filters, setFilters, filterOptions, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    material: false,
    color: false,
    price: false
  });

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      material: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Separate parent categories and subcategories
  const parentCategories = filterOptions?.categories?.filter(cat => !cat.parent_category) || [];
  const subcategories = filterOptions?.categories?.filter(cat => cat.parent_category) || [];

  const handleCategorySelect = (categoryId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: categoryId,
      subcategory: '' // Clear subcategory when parent category changes
    }));
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setFilters(prev => ({ ...prev, subcategory: subcategoryId }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-0
        w-80 lg:w-full h-screen lg:h-auto
        bg-white border-r lg:border-r-0 lg:border border-neutral-200
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto lg:overflow-visible
        p-6 lg:p-4 rounded-lg lg:rounded-lg
      `}>
        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full mb-4 px-3 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors duration-200"
          >
            Clear All Filters
          </button>
        )}

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter with Hierarchical Structure */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-sm font-medium mb-2"
          >
            Categories
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.category ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.category && (
            <div className="space-y-1">
              {/* All Categories Option */}
              <label className="flex items-center p-2 rounded hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm">All Categories</span>
              </label>

              {/* Parent Categories */}
              {parentCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center">
                    <label className="flex items-center p-2 rounded hover:bg-neutral-50 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="category"
                        value={category.id.toString()}
                        checked={filters.category === category.id.toString()}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </label>
                    
                    {/* Toggle button for subcategories */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <button
                        onClick={() => toggleCategory(category.id.toString())}
                        className="p-1 hover:bg-neutral-200 rounded"
                      >
                        {expandedCategories.has(category.id.toString()) ? (
                          <ChevronDown className="w-3 h-3 text-neutral-600" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-neutral-600" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(category.id.toString()) && category.subcategories && (
                    <div className="ml-6 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <label 
                          key={subcategory.id} 
                          className="flex items-center p-2 rounded hover:bg-neutral-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="subcategory"
                            value={subcategory.id.toString()}
                            checked={filters.subcategory === subcategory.id.toString()}
                            onChange={(e) => handleSubcategorySelect(e.target.value)}
                            className="mr-3"
                          />
                          <span className="text-sm text-neutral-700">{subcategory.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Material Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('material')}
            className="flex items-center justify-between w-full text-sm font-medium mb-2"
          >
            Material
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.material ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.material && (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="material"
                  value=""
                  checked={filters.material === ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm">All Materials</span>
              </label>
              {filterOptions?.materials.map((material) => (
                <label key={material.value} className="flex items-center">
                  <input
                    type="radio"
                    name="material"
                    value={material.value}
                    checked={filters.material === material.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-sm">{material.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('color')}
            className="flex items-center justify-between w-full text-sm font-medium mb-2"
          >
            Color
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.color ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.color && (
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="color"
                  value=""
                  checked={filters.color === ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                  className="mr-2"
                />
                <span className="text-sm">All Colors</span>
              </label>
              {filterOptions?.colors.map((color) => (
                <label key={color.value} className="flex items-center">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={filters.color === color.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                    className="mr-2"
                  />
                  <span className="text-sm">{color.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-sm font-medium mb-2"
          >
            Price Range
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.price ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="$0"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="$1000"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Catalogue: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    material: searchParams.get('material') || '',
    color: searchParams.get('color') || '',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    search: searchParams.get('search') || ''
  });

  // Fetch filter options
  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const response = await api.get(endpoints.filters);
      return response.data;
    }
  });

  // Build query params for API
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.material) params.append('materials', filters.material);
    if (filters.color) params.append('colors', filters.color);
    if (filters.minPrice) params.append('price__gte', filters.minPrice);
    if (filters.maxPrice) params.append('price__lte', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    if (sortBy) params.append('ordering', sortBy);
    params.append('page', currentPage.toString());
    return params.toString();
  };

  // Fetch products
  const { data: productsData, isLoading } = useQuery<ApiResponse<ProductListItem>>({
    queryKey: ['products', filters, sortBy, currentPage],
    queryFn: async () => {
      const queryString = buildQueryParams();
      const response = await api.get(`${endpoints.products}?${queryString}`);
      return response.data;
    }
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const paramName = key === 'minPrice' ? 'min_price' : 
                         key === 'maxPrice' ? 'max_price' : key;
        params.append(paramName, value);
      }
    });
    setSearchParams(params);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, setSearchParams]);

  const products = productsData?.results || [];
  const totalPages = productsData ? Math.ceil(productsData.count / 12) : 0;

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-4">
            Our Catalogue
          </h1>
          <p className="text-lg text-neutral-600">
            Discover our complete collection of handcrafted furniture pieces
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                isOpen={false}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-neutral-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">
                  {productsData ? `${productsData.count} products found` : 'Loading...'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="created_at">Newest First</option>
                  <option value="-created_at">Oldest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-name">Name: Z to A</option>
                </select>
                
                {/* View Mode */}
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className={`bg-neutral-200 rounded-lg mb-4 ${
                      viewMode === 'grid' ? 'aspect-square' : 'h-48'
                    }`}></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      {currentPage > 1 && (
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                        >
                          Previous
                        </button>
                      )}
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNum = currentPage <= 3 ? index + 1 : 
                                       currentPage >= totalPages - 2 ? totalPages - 4 + index :
                                       currentPage - 2 + index;
                        
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                              currentPage === pageNum
                                ? 'bg-primary-600 text-white'
                                : 'border border-neutral-300 hover:bg-neutral-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-neutral-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No products found
                </h3>
                <p className="text-neutral-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Sidebar - Only show when mobile menu is opened */}
      {filtersOpen && (
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
};

export default Catalogue;