'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Tag, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ProjectImage {
  id: number;
  image: string;
  title?: string;
  description?: string;
  alt_text: string;
  order?: number;
}

interface GalleryProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  gallery_category?: string;
  images: ProjectImage[];
  location?: string;
  project_date?: string;
  materials_used?: string;
  client_name?: string;
  featured: boolean;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<GalleryProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

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
  }, [project]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/gallery-projects/${slug}/`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (project) {
      setLightboxIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project) {
      setLightboxIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  // Carousel navigation
  const nextSlide = () => {
    if (project) {
      setCurrentSlide((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevSlide = () => {
    if (project) {
      setCurrentSlide((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent mx-auto"></div>
          <p className="text-brown-800 mt-6 text-lg font-medium animate-pulse">Loading your masterpiece...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl font-serif font-semibold text-brown-900 mb-4">Project not found</h1>
          <p className="text-brown-700 mb-8">We couldn't find the project you're looking for.</p>
          <Link
            href="/portfolio"
            className="inline-flex items-center text-accent hover:text-accent-dark transition-colors duration-300 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-cream-50 to-white">
      {/* Enhanced Back Button */}
      <div className="bg-white/80 backdrop-blur-md border-b border-cream-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-brown-800 hover:text-accent transition-all duration-300 group font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Hero Section - Professional Design */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden border-b border-cream-100">
        {/* Subtle Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cream-100 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center">
            {/* Category Badge - Minimal Design */}
            {project.gallery_category && (
              <div className="inline-flex items-center bg-cream-50 text-brown-800 px-5 py-2 rounded-full text-sm font-medium mb-6 border border-cream-200">
                <Tag className="w-3.5 h-3.5 mr-2 text-accent" />
                {project.gallery_category}
              </div>
            )}

            {/* Project Title - Clean Typography */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-brown-900 mb-6 leading-tight tracking-tight">
              {project.title}
            </h1>

            {/* Meta Information - Clean Layout */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-brown-600 mb-8 text-sm md:text-base">
              {project.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-accent" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.project_date && (
                <>
                  {project.location && <span className="text-cream-300">|</span>}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-accent" />
                    <span>{project.project_date}</span>
                  </div>
                </>
              )}
            </div>

            {/* Description - Professional Spacing */}
            <p className="text-lg md:text-xl text-brown-700 leading-relaxed max-w-3xl mx-auto">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Premium Carousel Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="py-20 md:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 scroll-fade-in">
              <h2 className="font-serif text-4xl md:text-5xl text-brown-900 mb-4">
                Project Gallery
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-brown-700 font-light">
                {project.images.length} {project.images.length === 1 ? 'Image' : 'Images'}
              </p>
            </div>

            {/* Main Carousel */}
            <div className="scroll-fade-in relative">
              {/* Main Image Display */}
              <div className="relative bg-cream-50 rounded-3xl overflow-hidden shadow-2xl mb-8">
                <div className="relative h-[400px] md:h-[600px] lg:h-[700px]">
                  <img
                    src={project.images[currentSlide].image}
                    alt={project.images[currentSlide].alt_text || `${project.title} - Image ${currentSlide + 1}`}
                    className="w-full h-full object-contain cursor-pointer transition-opacity duration-500"
                    onClick={() => openLightbox(currentSlide)}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [project.images[currentSlide].id]: true }))}
                  />

                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center group cursor-pointer" onClick={() => openLightbox(currentSlide)}>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
                        <ZoomIn className="w-5 h-5 text-accent" />
                        <span className="text-brown-900 font-semibold">Click to view full size</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brown-900 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-10 group"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brown-900 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-10 group"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-brown-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-xl">
                    <span className="font-semibold">{currentSlide + 1} / {project.images.length}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {project.images.length > 1 && (
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" ref={carouselRef}>
                    {project.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => goToSlide(index)}
                        className={`flex-shrink-0 snap-start rounded-xl overflow-hidden transition-all duration-300 ${
                          currentSlide === index
                            ? 'ring-4 ring-accent scale-105 shadow-xl'
                            : 'ring-2 ring-cream-200 hover:ring-accent/50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="w-24 h-24 md:w-32 md:h-32">
                          <img
                            src={image.image}
                            alt={image.alt_text || `Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Scroll hint for thumbnails */}
                  {project.images.length > 5 && (
                    <div className="text-center mt-4">
                      <p className="text-sm text-brown-700">← Scroll to see more images →</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced CTA Section */}
            <div className="mt-24 text-center scroll-fade-in">
              <div className="max-w-2xl mx-auto bg-gradient-to-br from-accent/5 to-terracotta/5 rounded-3xl p-12 border border-accent/10">
                <h3 className="font-serif text-3xl text-brown-900 mb-4">Love This Project?</h3>
                <p className="text-brown-800 mb-8 text-lg leading-relaxed">
                  Let's collaborate to create something beautiful and unique for your space.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-12 py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                >
                  Request a Custom Design
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Lightbox Modal with backdrop blur */}
      {lightboxOpen && project.images[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/96 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close Button - Enhanced */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 md:top-10 right-6 md:right-10 text-white/70 hover:text-white transition-all duration-300 z-20 bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-sm group"
            aria-label="Close modal"
          >
            <X className="w-7 h-7 md:w-9 md:h-9 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Navigation Buttons - Enhanced */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-all duration-300 z-20 bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-sm group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10 md:w-14 md:h-14 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-all duration-300 z-20 bg-white/10 hover:bg-white/20 rounded-full p-4 backdrop-blur-sm group"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10 md:w-14 md:h-14 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={project.images[lightboxIndex].image}
              alt={project.images[lightboxIndex].alt_text || project.title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in"
            />
          </div>

          {/* Image Info Overlay - Enhanced */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 md:p-12 z-10">
            <div className="max-w-7xl mx-auto">
              {/* Counter with better styling */}
              <div className="flex items-center justify-between mb-6">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-white font-semibold text-lg">
                    {lightboxIndex + 1} / {project.images.length}
                  </span>
                </div>
                <div className="text-white/70 text-sm hidden md:block">
                  Use arrow keys to navigate • Press ESC to close
                </div>
              </div>

              {/* Caption/Description - Only show meaningful descriptions */}
              {project.images[lightboxIndex].description && (
                <div className="text-white max-w-3xl bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">
                    {project.images[lightboxIndex].description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
