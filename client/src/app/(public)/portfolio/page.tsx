'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, Sparkles } from 'lucide-react';
import ansa5Image from '@/assets/ansa5.png';

interface GalleryProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  category_name: string;
  primary_image: {
    image: string;
    alt_text: string;
  } | null;
  location?: string;
  project_date?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-fade-in');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projects]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/gallery-categories/');
      const data = await response.json();
      setCategories(data.results || data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all'
        ? '/api/gallery-projects/'
        : `/api/gallery-projects/?category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      setProjects(data.results || data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream-50 to-white">
      {/* Premium Hero Header with Background Image */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={ansa5Image}
            alt="Ansa Furniture Portfolio Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-brown-900/85 via-brown-900/75 to-black/70"></div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Decorative light accents */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-parallax-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cream-50/20 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 max-w-container mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 animate-slide-in-bottom shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Handcrafted Excellence</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight animate-luxury-fade-in drop-shadow-2xl">
              Our Portfolio
            </h1>

            {/* Decorative line */}
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}></div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-cream-50 leading-relaxed font-light animate-blur-fade-in drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
              Explore our collection of bespoke furniture projects. Each piece tells a story of
              craftsmanship, attention to detail, and dedication to bringing our clients' visions to life.
            </p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Enhanced Category Filter - Sticky */}
      <section className="py-6 bg-white/90 backdrop-blur-lg border-b border-cream-200 sticky top-0 z-30 shadow-soft">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-accent mr-2 animate-smooth-bounce" />

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-accent text-white shadow-lg scale-105'
                  : 'bg-cream-100 text-brown-800 hover:bg-cream-200 hover:shadow-md'
              }`}
            >
              All Projects
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.slug
                    ? 'bg-accent text-white shadow-lg scale-105'
                    : 'bg-cream-100 text-brown-800 hover:bg-cream-200 hover:shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Projects Grid - Vertical Cards */}
      <section className="py-20 md:py-28 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-32">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-accent border-t-transparent mx-auto mb-6"></div>
              <p className="text-brown-800 text-lg font-medium animate-pulse">Curating beautiful pieces for you...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {projects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="scroll-fade-in group"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Vertical Card */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    {/* Image - Vertical Aspect Ratio */}
                    <div className="portfolio-image-wrapper relative overflow-hidden bg-cream-100 aspect-[3/4]">
                      {project.primary_image ? (
                        <img
                          src={project.primary_image.image}
                          alt={project.primary_image.alt_text || project.title}
                          className={`w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 ${
                            imageLoaded[project.id] ? 'loaded' : 'loading'
                          }`}
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [project.id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brown-800 font-medium">
                          No image available
                        </div>
                      )}

                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Category Badge - Minimal */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brown-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        {project.category_name}
                      </div>
                    </div>

                    {/* Content - Clean and Minimal */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-serif text-xl font-semibold text-brown-900 mb-2 group-hover:text-accent transition-colors duration-300 leading-tight line-clamp-2">
                        {project.title}
                      </h3>

                      {/* Meta - Simplified */}
                      {project.location && (
                        <p className="text-sm text-brown-600 mb-3 font-medium">
                          {project.location}
                        </p>
                      )}

                      {/* Description - Limited to 2 lines */}
                      <p className="text-brown-700 text-sm leading-relaxed flex-1 line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      {/* View Link - Minimal */}
                      <div className="flex items-center text-accent font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                        <span>View Project</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 animate-fade-in-up">
              <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-card">
                <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-10 h-10 text-accent" />
                </div>
                <h3 className="font-serif text-2xl text-brown-900 mb-4">No projects found</h3>
                <p className="text-brown-800 mb-8 leading-relaxed">
                  We couldn't find any projects in this category. Try exploring our other collections.
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-accent hover:bg-accent-dark text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  View All Projects
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      {projects.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-br from-accent/5 to-terracotta/5">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center scroll-fade-in">
            <h2 className="font-serif text-4xl md:text-5xl text-brown-900 mb-6">
              Ready to Create Your Own Masterpiece?
            </h2>
            <p className="text-xl text-brown-800 leading-relaxed mb-10 max-w-2xl mx-auto">
              Let's collaborate to design and craft custom furniture that perfectly complements your space and lifestyle.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-accent hover:bg-accent-dark text-white font-bold px-14 py-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 text-lg"
            >
              Start Your Project Today
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
