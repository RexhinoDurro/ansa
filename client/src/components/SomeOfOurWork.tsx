'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  image: string;
  title?: string;
  description?: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

interface Project {
  id: number;
  title: string;
  slug: string;
  category_name: string;
  description: string;
  primary_image: GalleryImage | null;
  featured: boolean;
  image_count: number;
  location?: string;
  project_date?: string;
  created_at: string;
}

const SomeOfOurWork: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch featured projects from backend
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/gallery-projects/?featured=true');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        // API returns paginated response: {count, next, previous, results}
        const projectsList = data.results || data;
        setProjects(Array.isArray(projectsList) ? projectsList.slice(0, 6) : []); // Limit to 6 featured projects
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to get display image
  const getDisplayImage = (project: Project): string => {
    if (project.primary_image) {
      // Check if the image URL already contains the full URL or just the path
      const imageUrl = project.primary_image.image;
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      return `http://localhost:8000${imageUrl}`;
    }
    return ''; // Fallback - no placeholder
  };

  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header with Animations */}
        <div className="mb-12 md:mb-16">
          <h2
            className={`text-4xl md:text-5xl font-serif font-bold text-brown-900 mb-4 transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="inline-block animate-text-gradient bg-gradient-to-r from-brown-900 via-accent to-brown-900 bg-[length:200%_auto] bg-clip-text text-transparent">
              Some of our work
            </span>
          </h2>
          <p
            className={`text-lg md:text-xl text-brown-800 max-w-2xl transition-all duration-1000 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="inline-block">Explore our recent projects showcasing </span>
            <span className="inline-block font-semibold text-accent animate-pulse-slow">exceptional craftsmanship</span>
            <span className="inline-block"> and </span>
            <span className="inline-block font-semibold text-accent animate-pulse-slow animation-delay-300">innovative design solutions</span>
            <span className="inline-block"> for diverse spaces.</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-cream-100 rounded-card h-64 md:h-72 mb-4"></div>
                <div className="h-4 bg-cream-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-cream-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-brown-700 mb-4">{error}</p>
            <p className="text-brown-600">Please try again later or contact us directly.</p>
          </div>
        )}

        {/* Project Cards Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {projects.map((project, index) => {
              const imageUrl = getDisplayImage(project);
              return (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className={`group relative bg-white rounded-card border border-cream-200 overflow-hidden transition-all duration-500 hover:shadow-card-hover hover:-translate-y-3 hover:scale-102 cursor-pointer ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{
                    transitionDelay: `${300 + index * 100}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated border gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-accent-400 via-accent to-accent-400 opacity-0 transition-opacity duration-500 ${
                      hoveredCard === project.id ? 'opacity-100' : ''
                    }`}
                    style={{
                      background: hoveredCard === project.id
                        ? 'linear-gradient(90deg, #2D6B4F, #1F4D3A, #2D6B4F)'
                        : undefined,
                      backgroundSize: '200% 100%',
                      animation: hoveredCard === project.id ? 'gradient-shift 3s ease infinite' : 'none',
                    }}
                  />

                  <div className="relative bg-white m-[2px] rounded-card overflow-hidden">
                    {/* Image Container */}
                    <div className="relative w-full h-64 md:h-72 overflow-hidden bg-cream-100">
                      {/* Overlay gradient on hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-opacity duration-500 ${
                          hoveredCard === project.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      />

                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={project.title}
                          fill
                          className={`object-cover transition-all duration-700 ${
                            hoveredCard === project.id ? 'scale-110 rotate-2' : 'scale-100'
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}

                      {/* Animated corner accent */}
                      <div
                        className={`absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white transition-all duration-500 z-20 ${
                          hoveredCard === project.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                        }`}
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 relative">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold text-accent bg-accent-50 rounded-full mb-3 transition-all duration-300 ${
                          hoveredCard === project.id ? 'scale-110 bg-accent-100' : ''
                        }`}
                      >
                        {project.category_name}
                      </span>
                      <h3
                        className={`text-xl font-bold text-brown-900 mb-2 transition-all duration-300 ${
                          hoveredCard === project.id ? 'text-accent translate-x-2' : ''
                        }`}
                      >
                        {project.title}
                      </h3>

                      {/* Project Description */}
                      <p className="text-brown-700 text-sm line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      {/* Project Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-brown-600 mb-2">
                        {project.location && <span>{project.location}</span>}
                        {project.image_count > 0 && (
                          <span className="flex items-center">
                            <span className="mr-1">📷</span> {project.image_count} images
                          </span>
                        )}
                      </div>

                      {/* Animated arrow that appears on hover */}
                      <div
                        className={`absolute bottom-6 right-6 transition-all duration-300 ${
                          hoveredCard === project.id
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4'
                        }`}
                      >
                        <ArrowRight className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* No projects message */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brown-700 mb-4">No featured projects available at the moment.</p>
            <Link href="/portfolio" className="text-accent hover:underline">
              View all projects
            </Link>
          </div>
        )}

        {/* View Full Portfolio Link */}
        {!loading && !error && projects.length > 0 && (
          <div className="flex justify-center md:justify-end">
            <Link
              href="/portfolio"
              className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300 group"
            >
              <span>See Full Portfolio</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SomeOfOurWork;
