'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/services/');
      const data = await response.json();
      setServices(data.results || data);
    } catch (error) {
      console.error('Error fetching services:', error);
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
              Our Services
            </h1>
            <p className="text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed">
              From concept to installation, we offer comprehensive custom furniture
              solutions tailored to your space, style, and needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-brown-800 mt-4">Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-cream-50 rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'fadeInUp 0.6s ease-out backwards'
                  }}
                >
                  {/* Image */}
                  {service.image && (
                    <div className="relative h-64 overflow-hidden bg-cream-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="font-serif text-subsection text-brown-900 mb-4">
                      {service.title}
                    </h2>

                    <p className="text-brown-800 leading-relaxed mb-4 text-lg">
                      {service.short_description}
                    </p>

                    <p className="text-brown-800 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-brown-800">
                No services available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-section text-brown-900 mb-4">
              How We Work
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              Every project follows our proven process, ensuring exceptional results
              from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-brown-900 mb-2">
                Consultation
              </h3>
              <p className="text-brown-800">
                We discuss your vision, needs, and budget
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-brown-900 mb-2">
                Design
              </h3>
              <p className="text-brown-800">
                3D renderings and precise measurements
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-brown-900 mb-2">
                Crafting
              </h3>
              <p className="text-brown-800">
                Expert craftsmen build your furniture
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-semibold text-brown-900 mb-2">
                Installation
              </h3>
              <p className="text-brown-800">
                Professional delivery and setup
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/custom-request-page"
              className="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-accent to-accent-dark rounded-card p-12 text-center text-white shadow-card">
            <h2 className="font-serif text-section mb-4">
              See Our Work
            </h2>
            <p className="text-lg mb-8 text-cream-100 max-w-2xl mx-auto">
              Explore our portfolio of completed projects to see the quality and
              craftsmanship we bring to every piece.
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-white hover:bg-cream-50 text-accent font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              View Portfolio
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
