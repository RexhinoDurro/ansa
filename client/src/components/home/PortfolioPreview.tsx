'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';

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

const PortfolioPreview: React.FC = () => {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/gallery-projects/?featured=true');
      const data = await response.json();
      // Take only first 8 projects for better grid
      setProjects(data.results.slice(0, 8));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-cream-50 to-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent mx-auto"></div>
            <p className="text-brown-800 mt-6 font-medium animate-pulse">Loading our finest work...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-cream-50 via-white to-cream-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-parallax-float"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-terracotta/20 rounded-full blur-3xl animate-parallax-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20 scroll-fade-in">
          {/* Small badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-5 py-2.5 rounded-full text-sm font-semibold mb-6 animate-slide-in-bottom">
            <Eye className="w-4 h-4" />
            <span>Featured Projects</span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brown-900 mb-6 animate-luxury-fade-in">
            Craftsmanship in Action
          </h2>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8"></div>

          {/* Description */}
          <p className="text-lg md:text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed font-light">
            Explore our portfolio of bespoke furniture projects. Each piece is uniquely crafted,
            designed specifically for our clients' spaces and needs with meticulous attention to detail.
          </p>
        </div>

        {/* Premium Vertical Cards Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="scroll-fade-in group"
                style={{
                  animationDelay: `${index * 100}ms`,
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
          <div className="text-center text-brown-800 py-20 scroll-fade-in">
            <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-card">
              <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-accent" />
              </div>
              <p className="text-xl font-medium">No featured projects yet.</p>
              <p className="text-brown-700 mt-2">Check back soon to see our latest work!</p>
            </div>
          </div>
        )}

        {/* Enhanced View All Button */}
        {projects.length > 0 && (
          <div className="text-center scroll-fade-in">
            <div className="inline-flex flex-col items-center">
              <Link
                href="/portfolio"
                className="group inline-flex items-center bg-accent hover:bg-accent-dark text-white font-bold px-12 py-5 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 text-lg relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                <span className="relative">Explore Full Portfolio</span>
                <ArrowRight className="relative w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>

              {/* Subtext */}
              <p className="text-brown-700 mt-4 text-sm">
                Discover our complete collection of handcrafted furniture
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioPreview;
