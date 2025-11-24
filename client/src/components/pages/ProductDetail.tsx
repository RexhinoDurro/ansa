import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../contexts/LanguageContext'; // Import language context
import { api, endpoints } from '../../utils/api';
import type { Product, ProductListItem } from '../../types';

const ImageCarousel: React.FC<{ images: Product['images'] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-square bg-neutral-200 rounded-lg flex items-center justify-center">
        <span className="text-neutral-400 text-lg">No images available</span>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goToPrevious();
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'Escape') setIsZoomed(false);
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={images[currentIndex].image}
            alt={images[currentIndex].alt_text || 'Product image'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <img
                src={image.image}
                alt={image.alt_text || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-neutral-300 text-xl z-10"
            aria-label="Close zoom"
          >
            ×
          </button>
          
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[currentIndex].image}
              alt={images[currentIndex].alt_text || 'Product image'}
              className="max-w-full max-h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const RelatedProducts: React.FC<{ category: string; currentProductId: string }> = ({ 
  category, 
  currentProductId 
}) => {
  const { currentLanguage } = useLanguage(); // Add language context
  
  const { data: relatedProducts } = useQuery<ProductListItem[]>({
    queryKey: ['related-products', category, currentProductId, currentLanguage], // Include language in query key
    queryFn: async () => {
      const response = await api.get(`${endpoints.products}?category=${category}&limit=4`);
      const products = response.data.results || response.data;
      return products.filter((product: ProductListItem) => product.id !== currentProductId);
    }
  });

  if (!relatedProducts?.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-serif font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, 4).map((product) => {
          // Use localized fields from backend
          const productName = product.localized_name || product.name;
          
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
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
                <p className="text-lg font-bold text-primary-600">
                  ${product.price}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

const ProductDetail: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { currentLanguage } = useLanguage(); // Add language context
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Listen for language changes and invalidate queries
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('=== PRODUCT DETAIL LANGUAGE CHANGE ===');
      console.log('Event received:', event.detail);
      console.log('Invalidating product detail queries...');
      
      // Invalidate all queries to refetch with new language
      queryClient.invalidateQueries();
      
      // Force a small delay to ensure localStorage is updated
      setTimeout(() => {
        console.log('Refetching product detail after language change...');
      }, 100);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, [queryClient]);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', slug, currentLanguage], // Include language in query key
    queryFn: async () => {
      if (!slug) throw new Error('Product slug is required');
      console.log('Fetching product detail with language:', currentLanguage);
      const response = await api.get(`${endpoints.products}${slug}/`);
      console.log('Product detail response:', response.data);
      return response.data;
    },
    enabled: !!slug
  });

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        // Use localized fields for sharing
        const productName = product.localized_name || product.name;
        const productDescription = product.localized_short_description || product.short_description;
        
        await navigator.share({
          title: productName,
          text: productDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-neutral-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-neutral-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
            <p className="text-neutral-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link
              href="/catalogue"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use localized fields from backend
  const productName = product.localized_name || product.name;
  const productDescription = product.localized_description || product.description;
  const productShortDescription = product.localized_short_description || product.short_description;
  const productSpecifications = product.localized_specifications || product.specifications;
  const productCareInstructions = product.localized_care_instructions || product.care_instructions;
  
  // Use localized category name
  const categoryName = product.category.localized_name || product.category.name;

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-primary-600">Catalogue</Link>
            <span>/</span>
            <Link href={`/catalogue?category=${product.category.id}`} className="hover:text-primary-600">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-neutral-900">{productName}</span>
          </div>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-neutral-600 hover:text-primary-600 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Carousel */}
          <div>
            <ImageCarousel images={product.images} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-2">
                {productName}
              </h1>
              <p className="text-xl text-neutral-600">
                {productShortDescription}
              </p>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary-600">
              ${product.price}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.is_in_stock
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.is_in_stock ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
              {product.is_in_stock && (
                <span className="text-sm text-neutral-600">
                  {product.stock_quantity} available
                </span>
              )}
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-neutral-200">
              <div>
                <span className="text-sm text-neutral-600">Category</span>
                <p className="font-medium">{categoryName}</p>
              </div>
              <div>
                <span className="text-sm text-neutral-600">Material</span>
                <p className="font-medium capitalize">{product.materials}</p>
              </div>
              <div>
                <span className="text-sm text-neutral-600">Color</span>
                <p className="font-medium capitalize">{product.colors}</p>
              </div>
              <div>
                <span className="text-sm text-neutral-600">Dimensions</span>
                <p className="font-medium">{product.dimensions_display}</p>
              </div>
              {product.weight && (
                <div>
                  <span className="text-sm text-neutral-600">Weight</span>
                  <p className="font-medium">{product.weight} kg</p>
                </div>
              )}
            </div>

            {/* Quantity Selector & Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-neutral-50 transition-colors duration-200"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-neutral-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 hover:bg-neutral-50 transition-colors duration-200"
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  disabled={!product.is_in_stock}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 border rounded-lg transition-colors duration-200 ${
                    isFavorite
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-neutral-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
                  }`}
                  aria-label="Add to favorites"
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 border border-neutral-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                  aria-label="Share product"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="w-5 h-5 text-primary-600" />
                <span>Free shipping on orders over $500</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>2-year warranty included</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RotateCcw className="w-5 h-5 text-primary-600" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description and Specifications Tabs */}
        <div className="mb-16">
          <div className="border-b border-neutral-200 mb-6">
            <nav className="flex space-x-8">
              <button className="border-b-2 border-primary-600 text-primary-600 py-2 px-1 text-sm font-medium">
                Description
              </button>
              {productSpecifications && (
                <button className="border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 py-2 px-1 text-sm font-medium">
                  Specifications
                </button>
              )}
              {productCareInstructions && (
                <button className="border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 py-2 px-1 text-sm font-medium">
                  Care Instructions
                </button>
              )}
            </nav>
          </div>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-serif font-bold mb-6">Product Description</h2>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
              {productDescription}
            </p>
            
            {productSpecifications && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {productSpecifications}
                </p>
              </div>
            )}
            
            {productCareInstructions && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Care Instructions</h3>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {productCareInstructions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          category={product.category.id.toString()} 
          currentProductId={product.id} 
        />
      </div>
    </div>
  );
};

export default ProductDetail;