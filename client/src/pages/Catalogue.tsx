import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext'; // Import language context
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
  const { t } = useI18nTranslation();

  // Use localized fields from backend
  const productName = product.localized_name || product.name;
  const productDescription = product.localized_short_description || product.short_description;

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
              alt={product.primary_image.alt_text || productName}
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
              {productName}
            </h3>
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
          </div>
          <p className="text-neutral-600 mb-4">
            {productDescription}
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
              {product.is_in_stock ? t('product.inStock') : t('product.outOfStock')}
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
            alt={product.primary_image.alt_text || productName}
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
          {productName}
        </h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {productDescription}
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
            {product.is_in_stock ? t('product.inStock') : t('product.outOfStock')}
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
  const { t } = useI18nTranslation();
  const { currentLanguage } = useLanguage();
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

  // Helper function to get localized category name
  const getCategoryName = (category: Category) => {
    if (currentLanguage === 'en') return category.name;
    return category.localized_name || category.name;
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
          <h3 className="text-xl font-bold text-neutral-900">{t('catalogue.filters')}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-neutral-600" />
          </button>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="mb-6">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t('catalogue.clearFilters')}
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder={t('catalogue.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-0 rounded-xl text-sm placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200 shadow-sm"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter with Hierarchical Structure */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full p-3 text-sm font-semibold bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
          >
            <span className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              {t('catalogue.categories')}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.category ? 'rotate-180' : ''
            }`} />
          </button>
          
          {expandedSections.category && (
            <div className="mt-3 space-y-1 pl-2">
              {/* All Categories Option */}
              <label className="flex items-center p-3 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors duration-150 group">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">{t('catalogue.allCategories')}</span>
              </label>

              {/* Parent Categories */}
              {parentCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center">
                    <label className="flex items-center p-3 rounded-lg hover:bg-primary-50 cursor-pointer flex-1 transition-colors duration-150 group">
                      <input
                        type="radio"
                        name="category"
                        value={category.id.toString()}
                        checked={filters.category === category.id.toString()}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500 focus:ring-2"
                      />
                      <span className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700">
                        {getCategoryName(category)}
                      </span>
                    </label>
                    
                    {/* Toggle button for subcategories */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <button
                        onClick={() => toggleCategory(category.id.toString())}
                        className="p-2 hover:bg-neutral-200 rounded-lg transition-colors duration-150"
                      >
                        {expandedCategories.has(category.id.toString()) ? (
                          <ChevronDown className="w-4 h-4 text-neutral-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-neutral-600" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(category.id.toString()) && category.subcategories && (
                    <div className="ml-6 space-y-1 border-l-2 border-neutral-100 pl-4">
                      {category.subcategories.map((subcategory) => (
                        <label 
                          key={subcategory.id} 
                          className="flex items-center p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-150 group"
                        >
                          <input
                            type="radio"
                            name="subcategory"
                            value={subcategory.id.toString()}
                            checked={filters.subcategory === subcategory.id.toString()}
                            onChange={(e) => handleSubcategorySelect(e.target.value)}
                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-neutral-600 group-hover:text-blue-700">
                            {getCategoryName(subcategory)}
                          </span>
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
            className="flex items-center justify-between w-full p-3 text-sm font-semibold bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
          >
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Material
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.material ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.material && (
            <div className="mt-3 space-y-2 pl-2">
              <label className="flex items-center p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors duration-150 group">
                <input
                  type="radio"
                  name="material"
                  value=""
                  checked={filters.material === ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
                  className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-neutral-700 group-hover:text-green-700">All Materials</span>
              </label>
              {filterOptions?.materials.map((material) => (
                <label key={material.value} className="flex items-center p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors duration-150 group">
                  <input
                    type="radio"
                    name="material"
                    value={material.value}
                    checked={filters.material === material.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
                    className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-green-700">{material.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('color')}
            className="flex items-center justify-between w-full p-3 text-sm font-semibold bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
          >
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Color
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.color ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.color && (
            <div className="mt-3 space-y-2 pl-2">
              <label className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-150 group">
                <input
                  type="radio"
                  name="color"
                  value=""
                  checked={filters.color === ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-neutral-700 group-hover:text-blue-700">All Colors</span>
              </label>
              {filterOptions?.colors.map((color) => (
                <label key={color.value} className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-150 group">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={filters.color === color.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                    className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-neutral-700 group-hover:text-blue-700">{color.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full p-3 text-sm font-semibold bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
          >
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Price Range
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              expandedSections.price ? 'rotate-180' : ''
            }`} />
          </button>
          {expandedSections.price && (
            <div className="mt-3 space-y-4 pl-2">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-neutral-50 border-0 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">$</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    placeholder="1000"
                    className="w-full pl-8 pr-4 py-3 bg-neutral-50 border-0 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Catalogue: React.FC = () => {
  const { t } = useI18nTranslation();
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
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

  // Listen for language changes and invalidate queries
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed, invalidating queries...');
      // Invalidate all queries to refetch with new language
      queryClient.invalidateQueries();
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [queryClient]);

  // Fetch filter options
  const { data: filterOptions } = useQuery<FilterOptions>({
    queryKey: ['filter-options', currentLanguage],
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
    // Language is automatically added by the axios interceptor
    return params.toString();
  };

  // Fetch products
  const { data: productsData, isLoading } = useQuery<ApiResponse<ProductListItem>>({
    queryKey: ['products', filters, sortBy, currentPage, currentLanguage],
    queryFn: async () => {
      const queryString = buildQueryParams();
      console.log('Fetching products with query:', queryString);
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
            {t('catalogue.title')}
          </h1>
          <p className="text-lg text-neutral-600">
            {t('catalogue.subtitle')}
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
                {t('catalogue.filters')}
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
                  {productsData ? `${productsData.count} ${t('catalogue.productsFound')}` : t('common.loading')}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="created_at">{t('catalogue.newestFirst')}</option>
                  <option value="-created_at">{t('catalogue.oldestFirst')}</option>
                  <option value="price">{t('catalogue.priceLowHigh')}</option>
                  <option value="-price">{t('catalogue.priceHighLow')}</option>
                  <option value="name">{t('catalogue.nameAZ')}</option>
                  <option value="-name">{t('catalogue.nameZA')}</option>
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
                          {t('common.previous')}
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
                          {t('common.next')}
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
                  {t('catalogue.noProductsFound')}
                </h3>
                <p className="text-neutral-600">
                  {t('catalogue.adjustFilters')}
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