'use client';

import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  client_name: string;
  text: string;
  rating: number;
  location?: string;
  project_title?: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials/?featured=true');
      const data = await response.json();
      // Take first 4 testimonials
      setTestimonials(data.results.slice(0, 4));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Use fallback data if API fails
      setTestimonials([
        {
          id: 1,
          client_name: 'Maria & Andrea',
          text: 'Ansa Furniture transformed our kitchen into exactly what we dreamed of. The attention to detail and quality of craftsmanship is outstanding.',
          rating: 5,
          location: 'Tirana'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < rating
                ? 'fill-accent text-accent'
                : 'text-cream-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-cream-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-section text-brown-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from clients who have transformed
            their spaces with our custom furniture.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={`grid grid-cols-1 ${
          testimonials.length === 1 ? 'max-w-2xl mx-auto' :
          testimonials.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
          'md:grid-cols-2 lg:grid-cols-' + Math.min(testimonials.length, 4)
        } gap-8`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-card p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 relative"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out backwards'
              }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-accent/10">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Text */}
              <p className="text-brown-800 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Client Info */}
              <div className="border-t border-cream-200 pt-4">
                <p className="font-semibold text-brown-900">
                  {testimonial.client_name}
                </p>
                {testimonial.location && (
                  <p className="text-sm text-brown-700">
                    {testimonial.location}
                  </p>
                )}
                {testimonial.project_title && (
                  <p className="text-sm text-accent mt-1">
                    {testimonial.project_title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
