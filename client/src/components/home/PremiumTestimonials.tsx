'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

interface Testimonial {
  nameKey: string;
  projectKey: string;
  quoteKey: string;
  rating: number;
}

const PremiumTestimonials: React.FC = () => {
  const { t } = useTranslation('common');
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);

  const testimonials: Testimonial[] = [
    {
      nameKey: 'home.testimonials.client1.name',
      projectKey: 'home.testimonials.client1.project',
      quoteKey: 'home.testimonials.client1.quote',
      rating: 5
    },
    {
      nameKey: 'home.testimonials.client2.name',
      projectKey: 'home.testimonials.client2.project',
      quoteKey: 'home.testimonials.client2.quote',
      rating: 5
    },
    {
      nameKey: 'home.testimonials.client3.name',
      projectKey: 'home.testimonials.client3.project',
      quoteKey: 'home.testimonials.client3.quote',
      rating: 5
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            testimonials.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-cream-50/30 to-white"
    >
      {/* Layered Background Elements - Mobile Optimized */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Organic blur shapes */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-radial from-accent/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-radial from-brown-900/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl"></div>

        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Trust Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brown-600 font-medium mb-2">
            Real homes. Real craftsmanship.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-brown-500 px-4">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              100+ custom projects
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-brown-300"></span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              10+ years experience
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-brown-300"></span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              5★ rated
            </span>
          </div>
        </div>

        {/* Main Title - Mobile Optimized */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brown-900 mb-4 sm:mb-6 leading-tight px-4">
            {t('home.testimonials.subtitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brown-600 max-w-2xl mx-auto font-light px-4">
            {t('home.testimonials.description')}
          </p>
        </div>

        {/* Testimonial Cards - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
              isVisible={visibleCards[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isVisible: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index, isVisible }) => {
  const { t } = useTranslation('common');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Radial glow on hover */}
      <div
        className={`absolute inset-0 -z-10 rounded-3xl bg-gradient-radial from-accent/20 to-transparent blur-2xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>

      {/* Card - Mobile Optimized */}
      <div
        className={`relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-brown-100/50 transition-all duration-400 ease-out ${
          isHovered
            ? 'shadow-2xl shadow-brown-900/10 scale-[1.02] -translate-y-2 border-accent/30'
            : 'shadow-xl shadow-brown-900/5'
        }`}
      >
        {/* Giant decorative quote mark - Adjusted for mobile */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[80px] sm:text-[120px] font-serif text-accent/[0.04] leading-none pointer-events-none select-none">
          "
        </div>

        {/* Stars with stagger animation - Mobile Optimized */}
        <div className="flex gap-1 sm:gap-1.5 mb-4 sm:mb-6 relative z-10">
          {[...Array(testimonial.rating)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{
                transitionDelay: `${index * 200 + i * 80}ms`,
                fill: 'url(#starGradient)'
              }}
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Verified Badge - Glass pill - Mobile Optimized */}
        <div className="mb-6 sm:mb-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm border border-emerald-200/50 text-emerald-700 text-xs font-semibold rounded-full shadow-inner">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Verified Client
          </span>
        </div>

        {/* Quote Text - Premium typography - Mobile Optimized */}
        <p className="text-base sm:text-lg md:text-xl text-brown-800 leading-relaxed mb-6 sm:mb-8 italic font-serif relative z-10">
          "{t(testimonial.quoteKey)}"
        </p>

        {/* Client Info - Mobile Optimized */}
        <div className="relative z-10">
          <p className="font-bold text-brown-900 text-lg sm:text-xl mb-1">
            {t(testimonial.nameKey)}
          </p>
          <p className="text-xs sm:text-sm text-brown-500 font-light tracking-wide">
            {t(testimonial.projectKey)}
          </p>
        </div>

        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent rounded-b-2xl sm:rounded-b-3xl"></div>
      </div>
    </div>
  );
};

export default PremiumTestimonials;
