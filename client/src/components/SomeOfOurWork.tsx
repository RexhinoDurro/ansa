'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Import images
import project1 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.28.jpeg';
import project2 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.40.jpeg';
import project3 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.54.jpeg';
import project4 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.08.jpeg';
import project5 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.17.jpeg';
import project6 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.28.jpeg';
import project7 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.41.jpeg';

interface Project {
  id: number;
  title: string;
  category: string;
  image: any;
}

const SomeOfOurWork: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'Interior Design',
      image: project1,
    },
    {
      id: 2,
      title: 'Contemporary Office Space',
      category: 'Commercial',
      image: project2,
    },
    {
      id: 3,
      title: 'Minimalist Bedroom',
      category: 'Residential',
      image: project3,
    },
    {
      id: 4,
      title: 'Luxury Dining Setup',
      category: 'Hospitality',
      image: project4,
    },
    {
      id: 5,
      title: 'Custom Kitchen Design',
      category: 'Interior Design',
      image: project5,
    },
    {
      id: 6,
      title: 'Boutique Store Layout',
      category: 'Commercial',
      image: project6,
    },
    {
      id: 7,
      title: 'Elegant Lounge Area',
      category: 'Hospitality',
      image: project7,
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header with Animations */}
        <div className="mb-12 md:mb-16">
          <h2
            className={`text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4 transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="inline-block animate-text-gradient bg-gradient-to-r from-neutral-900 via-primary-600 to-neutral-900 bg-[length:200%_auto] bg-clip-text text-transparent">
              Some of our work
            </span>
          </h2>
          <p
            className={`text-lg md:text-xl text-neutral-600 max-w-2xl transition-all duration-1000 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="inline-block">Explore our recent projects showcasing </span>
            <span className="inline-block font-semibold text-primary-600 animate-pulse-slow">exceptional craftsmanship</span>
            <span className="inline-block"> and </span>
            <span className="inline-block font-semibold text-primary-600 animate-pulse-slow animation-delay-300">innovative design solutions</span>
            <span className="inline-block"> for diverse spaces.</span>
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 cursor-pointer ${
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
                className={`absolute inset-0 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 opacity-0 transition-opacity duration-500 ${
                  hoveredCard === project.id ? 'opacity-100' : ''
                }`}
                style={{
                  background: hoveredCard === project.id
                    ? 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)'
                    : undefined,
                  backgroundSize: '200% 100%',
                  animation: hoveredCard === project.id ? 'gradient-shift 3s ease infinite' : 'none',
                }}
              />

              <div className="relative bg-white m-[2px] rounded-lg overflow-hidden">
                {/* Image Container */}
                <div className="relative w-full h-64 md:h-72 overflow-hidden bg-neutral-100">
                  {/* Overlay gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-opacity duration-500 ${
                      hoveredCard === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredCard === project.id ? 'scale-125 rotate-2' : 'scale-100'
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

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
                    className={`inline-block px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full mb-3 transition-all duration-300 ${
                      hoveredCard === project.id ? 'scale-110 bg-primary-100' : ''
                    }`}
                  >
                    {project.category}
                  </span>
                  <h3
                    className={`text-xl font-bold text-neutral-900 transition-all duration-300 ${
                      hoveredCard === project.id ? 'text-primary-600 translate-x-2' : ''
                    }`}
                  >
                    {project.title}
                  </h3>

                  {/* Animated arrow that appears on hover */}
                  <div
                    className={`absolute bottom-6 right-6 transition-all duration-300 ${
                      hoveredCard === project.id
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-4'
                    }`}
                  >
                    <ArrowRight className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Gallery Link */}
        <div className="flex justify-center md:justify-end">
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-6 py-3 text-base font-semibold text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300 group"
          >
            <span>View full gallery</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SomeOfOurWork;
