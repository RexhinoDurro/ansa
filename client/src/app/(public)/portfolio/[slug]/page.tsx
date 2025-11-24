'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/gallery-projects/${slug}/`);
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

  // Keyboard navigation
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-brown-800 mt-4">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-brown-900 mb-4">Project not found</h1>
          <Link href="/portfolio" className="text-accent hover:underline">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-cream-50 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-brown-800 hover:text-accent transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Project Header */}
      <section className="py-12 md:py-16 bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Category Badge */}
            {project.gallery_category && (
              <div className="inline-flex items-center bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Tag className="w-4 h-4 mr-2" />
                {project.gallery_category}
              </div>
            )}

            {/* Project Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brown-900 mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-brown-700 mb-8">
              {project.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-accent" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.project_date && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent" />
                  <span>{project.project_date}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-brown-800 leading-relaxed max-w-3xl mx-auto">
              {project.description}
            </p>

            {/* Materials Used */}
            {project.materials_used && (
              <div className="mt-8 p-6 bg-cream-50 rounded-lg border border-cream-200 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-brown-900 mb-2 text-sm uppercase tracking-wide">Materials Used</h3>
                <p className="text-brown-800">{project.materials_used}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="font-serif text-3xl md:text-4xl text-brown-900 mb-12 text-center">
              Project Gallery
              <span className="block text-lg text-brown-700 font-sans mt-2 font-normal">
                {project.images.length} {project.images.length === 1 ? 'Image' : 'Images'}
              </span>
            </h2>

            {/* Masonry Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {project.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-cream-100 cursor-pointer group ${
                    index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  onClick={() => openLightbox(index)}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={image.image}
                      alt={image.alt_text || `${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-brown-900/0 group-hover:bg-brown-900/40 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300" />
                    </div>

                    {/* Image Title/Caption */}
                    {(image.title || image.description) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown-900/90 via-brown-900/60 to-transparent p-4 md:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {image.title && (
                          <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-sm text-cream-100">{image.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Below Gallery */}
            <div className="mt-16 text-center">
              <p className="text-brown-800 mb-6 text-lg">
                Love this project? Let's create something similar for you.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Request a Custom Design
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Lightbox Modal */}
      {lightboxOpen && project.images[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 md:top-8 right-4 md:right-8 text-white/80 hover:text-white transition-all duration-300 z-20 bg-brown-900/50 hover:bg-brown-900/70 rounded-full p-3 backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Previous Button */}
          {project.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 md:left-8 text-white/80 hover:text-white transition-all duration-300 z-20 bg-brown-900/50 hover:bg-brown-900/70 rounded-full p-3 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={project.images[lightboxIndex].image}
              alt={project.images[lightboxIndex].alt_text || project.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-fade-in"
            />
          </div>

          {/* Next Button */}
          {project.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 md:right-8 text-white/80 hover:text-white transition-all duration-300 z-20 bg-brown-900/50 hover:bg-brown-900/70 rounded-full p-3 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          )}

          {/* Image Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 z-10">
            <div className="max-w-7xl mx-auto">
              {/* Counter */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-white/90 text-sm md:text-base font-medium">
                  {lightboxIndex + 1} / {project.images.length}
                </div>
                <div className="text-white/70 text-xs md:text-sm">
                  Use arrow keys or swipe to navigate
                </div>
              </div>

              {/* Caption/Title */}
              {(project.images[lightboxIndex].title || project.images[lightboxIndex].description) && (
                <div className="text-white max-w-3xl">
                  {project.images[lightboxIndex].title && (
                    <h3 className="font-semibold text-lg md:text-xl mb-2">
                      {project.images[lightboxIndex].title}
                    </h3>
                  )}
                  {project.images[lightboxIndex].description && (
                    <p className="text-white/80 text-sm md:text-base">
                      {project.images[lightboxIndex].description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
