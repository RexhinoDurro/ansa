'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Filter } from 'lucide-react';

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

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/gallery-categories/');
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
        ? 'http://localhost:8000/api/gallery-projects/'
        : `http://localhost:8000/api/gallery-projects/?category=${selectedCategory}`;

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
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative py-20 bg-cream-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="font-serif text-hero text-brown-900 mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed">
              Explore our collection of custom furniture projects. Each piece is unique,
              designed and crafted specifically for our clients' spaces and needs.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-cream-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-accent mr-2" />

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-cream-100 text-brown-800 hover:bg-cream-200'
              }`}
            >
              All Projects
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-cream-100 text-brown-800 hover:bg-cream-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-brown-800 mt-4">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <div className="relative h-72 overflow-hidden bg-cream-100">
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
                      <div className="absolute top-4 left-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        {project.category_name}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-brown-900 mb-2 group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>

                      {(project.location || project.project_date) && (
                        <div className="flex items-center gap-3 text-sm text-brown-700 mb-3">
                          {project.location && <span>{project.location}</span>}
                          {project.location && project.project_date && (
                            <span className="text-cream-400">•</span>
                          )}
                          {project.project_date && <span>{project.project_date}</span>}
                        </div>
                      )}

                      <p className="text-brown-800 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mt-4 text-accent font-medium group-hover:translate-x-1 transition-transform duration-300 inline-block">
                        View Project →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-brown-800">
                No projects found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-6 text-accent font-medium hover:underline"
              >
                View all projects
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
