'use client';

import React, { useState, useEffect, useRef } from 'react';

const AboutUs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
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
      id="about-us"
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 lg:py-32 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          {/* Section Title */}
          <div className="mb-12 md:mb-16">
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-900 mb-4 transition-all duration-1000 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              About Us
            </h2>
            <div
              className={`h-1 w-24 bg-primary-600 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          {/* Subtitle */}
          <h3
            className={`text-2xl md:text-3xl lg:text-4xl font-light text-neutral-800 mb-10 md:mb-12 leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
          >
            Crafting spaces you'll love to live in
          </h3>

          {/* Content Paragraphs */}
          <div className="space-y-6 md:space-y-8">
            <p
              className={`text-lg md:text-xl text-neutral-700 leading-relaxed transition-all duration-1000 delay-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              Ansa Furniture is a modern furniture brand dedicated to creating pieces that
              seamlessly blend comfort with contemporary style. We believe that your home
              should be a reflection of who you are—a space where design meets functionality,
              and where every piece tells a story of thoughtful craftsmanship.
            </p>

            <p
              className={`text-lg md:text-xl text-neutral-700 leading-relaxed transition-all duration-1000 delay-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              Our commitment to quality is unwavering. We source only premium materials and
              work with skilled artisans who share our passion for excellence. Every piece
              is crafted with meticulous attention to detail, ensuring durability that stands
              the test of time. From the initial sketch to the final polish, we pour our
              expertise into creating furniture that's built to last generations.
            </p>

            <p
              className={`text-lg md:text-xl text-neutral-700 leading-relaxed transition-all duration-1000 delay-900 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              What truly sets us apart is our customer-first approach. We don't just sell
              furniture—we create tailored solutions that fit your unique lifestyle and space.
              Our team works closely with you to understand your vision, offering personalized
              guidance every step of the way. With reliable delivery and long-term support,
              we're here to ensure your satisfaction doesn't end at purchase. Your comfort
              and happiness are our ultimate goals.
            </p>
          </div>

          {/* Bottom accent line */}
          <div
            className={`mt-12 md:mt-16 h-px bg-gradient-to-r from-neutral-300 via-neutral-400 to-transparent transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
