'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[80vh] w-full overflow-hidden bg-brown-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=2000&q=80"
          alt="Custom kitchen design by Ansa Furniture"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brown-900/80 via-brown-900/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-container mx-auto px-4 md:px-8 flex items-center">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="font-serif text-hero text-cream-50 mb-6 leading-tight">
            Custom Furniture, Built for Your Space
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 mb-8 leading-relaxed">
            From idea to installation, we design and build furniture tailored to your home and lifestyle.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/custom-request-page"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Request a Custom Design
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center bg-transparent border-2 border-cream-100 hover:bg-cream-100/10 text-cream-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream-100/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-cream-100/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
