import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '../utils/api';
import type { HomeSlider, ProductListItem } from '../types';

// Mock slider data (replace with API call)
const mockSliderData: HomeSlider[] = [
  {
    id: 1,
    title: "Modern Living",
    subtitle: "Discover Contemporary Furniture",
    description: "Transform your space with our carefully curated collection of modern furniture pieces",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    link_url: "/catalogue",
    link_text: "Shop Now",
    order: 1
  },
  {
    id: 2,
    title: "Comfort & Style",
    subtitle: "Premium Seating Collection",
    description: "Experience ultimate comfort with our luxury chairs and sofas designed for modern living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    link_url: "/catalogue?category=seating",
    link_text: "Explore",
    order: 2
  },
  {
    id: 3,
    title: "Handcrafted Excellence",
    subtitle: "Artisan Made Furniture",
    description: "Each piece tells a story of craftsmanship and attention to detail",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    link_url: "/about",
    link_text: "Learn More",
    order: 3
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Use mock data for now - replace with actual API call
  const sliderData = mockSliderData;

  useEffect(() => {
    if (!isAutoPlaying || sliderData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderData.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!sliderData.length) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 lg:px-8">
                  <div className="max-w-3xl text-white">
                    <h2 className="text-sm uppercase tracking-wide mb-4 opacity-90">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.link_url}
                      className="inline-flex items-center bg-white text-neutral-900 hover:bg-neutral-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 group"
                    >
                      {slide.link_text}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex space-x-3">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery<ProductListItem[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await api.get(endpoints.featuredProducts);
      return response.data.results || response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-neutral-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <Link
          key={product.id}
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
            <div className="flex items-center justify-between">
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
          </div>
        </Link>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Featured Products Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium furniture pieces that combine style, comfort, and craftsmanship.
            </p>
          </div>
          <FeaturedProducts />
          <div className="text-center mt-12">
            <Link
              to="/catalogue"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 group"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-neutral-900 mb-6">
                Crafting Beautiful Spaces Since 1990
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                At Furniture Co., we believe that great furniture should tell a story. Each piece in our collection is carefully crafted by skilled artisans who understand that furniture is more than just functional – it's an expression of your personal style.
              </p>
              <p className="text-lg text-neutral-600 mb-8">
                From sustainable materials to timeless designs, we're committed to creating furniture that not only looks beautiful but also stands the test of time.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
              >
                Learn More About Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Craftsman working on furniture"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;