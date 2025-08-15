import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api, endpoints } from '../utils/api';
import type { HomeSlider, ProductListItem } from '../types';

// Update the HeroSlider component
const HeroSlider: React.FC = () => {
  const { t } = useTranslation('common');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([false, false, false]);

  // Updated slider data with translation keys and fallback images
  const sliderData: HomeSlider[] = [
    {
      id: 1,
      title: t('hero.modernLiving'),
      subtitle: t('hero.discoverContemporary'),
      description: t('hero.transformSpace'),
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      link_url: "/catalogue",
      link_text: t('hero.shopNow'),
      order: 1
    },
    {
      id: 2,
      title: t('hero.comfortStyle'),
      subtitle: t('hero.premiumSeating'),
      description: t('hero.experienceComfort'),
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      link_url: "/catalogue?category=seating",
      link_text: t('hero.explore'),
      order: 2
    },
    {
      id: 3,
      title: t('hero.handcraftedExcellence'),
      subtitle: t('hero.artisanMade'),
      description: t('hero.craftmanshipStory'),
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      link_url: "/about",
      link_text: t('hero.learnMore'),
      order: 3
    }
  ];

  // Handle image loading
  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderData.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  return (
    <section className="hero-slider">
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Preload all images */}
        {sliderData.map((slide, index) => (
          <img
            key={`preload-${slide.id}`}
            src={slide.image}
            alt=""
            className="hidden"
            onLoad={() => handleImageLoad(index)}
            onError={(e) => {
              console.warn(`Failed to load image ${index}:`, slide.image);
              // Fallback to a solid color background
              e.currentTarget.style.display = 'none';
            }}
          />
        ))}

        {/* Current slide */}
        <div className="relative w-full h-full">
          <img
            src={sliderData[currentSlide].image}
            alt={sliderData[currentSlide].title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded[currentSlide] ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundColor: '#f3f4f6' // Fallback background color
            }}
          />
          
          {/* Loading placeholder */}
          {!imageLoaded[currentSlide] && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 bg-gradient-to-r from-black/60 to-black/20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 animate-fade-in">
              {sliderData[currentSlide].title}
            </h2>
            <h3 className="text-xl md:text-2xl lg:text-3xl text-white mb-4 animate-fade-in">
              {sliderData[currentSlide].subtitle}
            </h3>
            <p className="text-base md:text-lg text-white mb-6 max-w-lg animate-fade-in">
              {sliderData[currentSlide].description}
            </p>
            <Link
              to={sliderData[currentSlide].link_url}
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 group shadow-lg hover:shadow-xl animate-fade-in"
            >
              {sliderData[currentSlide].link_text}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-primary-600" />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-primary-600" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation('common');
  
  // Example implementation with placeholder images
  const featuredProducts = [
    {
      id: 1,
      name: "Modern Sofa",
      price: "$1,299",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      inStock: true
    },
    {
      id: 2,
      name: "Dining Chair Set",
      price: "$599",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      inStock: false
    },
    {
      id: 3,
      name: "Coffee Table",
      price: "$399",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      inStock: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
              style={{ backgroundColor: '#f3f4f6' }}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY5NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
              }}
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {t('product.outOfStock')}
                </span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-primary-600 mb-4">{product.price}</p>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? t('product.inStock') : t('product.outOfStock')}
              </span>
              <button 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  product.inStock 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <HeroSlider />
      
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
              {t('product.featuredCollection')}
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              {t('product.featuredDescription')}
            </p>
          </div>
          <FeaturedProducts />
          <div className="text-center mt-12">
            <Link
              to="/catalogue"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 group"
            >
              {t('product.viewAllProducts')}
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
                {t('about.passionSince')}
              </h2>
             
              <Link
                to="/about"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
              >
                {t('hero.learnMore')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Craftsman working on furniture"
                className="rounded-lg shadow-lg w-full h-auto"
                style={{ backgroundColor: '#f3f4f6' }}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY5NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;