'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/gallery-projects/?featured=true');
      const data = await response.json();
      // Take only first 6 projects
      setProjects(data.results.slice(0, 6));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-section text-brown-900 mb-4">
            Some of Our Work
          </h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            Explore our portfolio of custom furniture projects. Each piece is unique,
            crafted specifically for our clients' spaces and needs.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out backwards'
                }}
              >
                <div className="bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-cream-100">
                    {project.primary_image ? (
                      <img
                        src={project.primary_image.image}
                        alt={project.primary_image.alt_text || project.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brown-800">
                        No image
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.category_name}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-brown-900 mb-2 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-brown-700 mb-3">
                        {project.location}
                      </p>
                    )}
                    <p className="text-brown-800 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-brown-800 py-12">
            <p>No featured projects yet. Check back soon!</p>
          </div>
        )}

        {/* View All Button */}
        {projects.length > 0 && (
          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              See Full Portfolio
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioPreview;
