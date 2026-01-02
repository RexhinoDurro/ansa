'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ansaImage from '@/assets/ansa3.png';

interface TextPartProps {
  children: React.ReactNode;
  animationClass: string;
  delay: number;
  className?: string;
}

const TextPart: React.FC<TextPartProps> = ({ children, animationClass, delay, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const partRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (partRef.current) {
      observer.observe(partRef.current);
    }

    return () => {
      if (partRef.current) {
        observer.unobserve(partRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={partRef}
      className={`transition-all duration-1000 ease-out ${className} ${
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${animationClass}`
      }`}
    >
      {children}
    </div>
  );
};

const OurStorySection: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Decorative Top Separator - Mobile Optimized */}
      <div className="relative bg-white py-8 sm:py-12 md:py-16">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-accent to-accent"></div>
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent/60"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent/30"></div>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-accent to-accent"></div>
          </div>
        </div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 top-[80px] sm:top-[100px] md:top-[120px] z-0">
        <Image
          src={ansaImage}
          alt="Our Story Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900/85 via-brown-900/75 to-black/80"></div>
      </div>

      {/* Content Container - Mobile Optimized */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24 md:pb-32">
        {/* Badge - Fade in from top */}
        <TextPart animationClass="-translate-y-10" delay={0} className="mb-4 sm:mb-6">
          <span className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-accent/90 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-xl backdrop-blur-sm">
            {t('home.ourJourney')}
          </span>
        </TextPart>

        {/* Main Title Line 1 - Slide from left - Mobile Optimized */}
        <TextPart animationClass="-translate-x-10 sm:-translate-x-20" delay={200}>
          <h2 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-2 leading-tight drop-shadow-2xl">
            {t('home.craftingDreams')}
          </h2>
        </TextPart>

        {/* Main Title Line 2 - Slide from right - Mobile Optimized */}
        <TextPart animationClass="translate-x-10 sm:translate-x-20" delay={400} className="mb-8 sm:mb-12">
          <h2 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-accent leading-tight drop-shadow-2xl">
            {t('home.reality')}
          </h2>
        </TextPart>

        {/* Story Paragraph 1 - Slide from left - Mobile Optimized */}
        <TextPart animationClass="-translate-x-8 sm:-translate-x-16" delay={600} className="mb-6 sm:mb-8">
          <div className="backdrop-blur-sm bg-white/5 border-l-4 border-accent p-4 sm:p-6 rounded-r-2xl">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed drop-shadow-lg">
              {t('home.storyParagraph1')}
            </p>
          </div>
        </TextPart>

        {/* Story Paragraph 2 - Slide from right - Mobile Optimized */}
        <TextPart animationClass="translate-x-8 sm:translate-x-16" delay={800} className="mb-6 sm:mb-8">
          <div className="backdrop-blur-sm bg-white/5 p-4 sm:p-6 rounded-2xl">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed drop-shadow-lg">
              {t('home.storyParagraph2')}
            </p>
          </div>
        </TextPart>

        {/* Story Paragraph 3 - Slide from left - Mobile Optimized */}
        <TextPart animationClass="-translate-x-8 sm:-translate-x-16" delay={1000} className="mb-8 sm:mb-12">
          <div className="backdrop-blur-sm bg-white/5 p-4 sm:p-6 rounded-2xl">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed drop-shadow-lg">
              {t('home.storyParagraph3')}
            </p>
          </div>
        </TextPart>

        {/* Quote Section - Fade in from bottom - Mobile Optimized */}
        <TextPart animationClass="translate-y-10 sm:translate-y-16" delay={1200}>
          <div className="backdrop-blur-md bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 italic leading-relaxed drop-shadow-lg mb-3 sm:mb-4">
              "{t('home.quote')}"
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-accent rounded-full"></div>
              <p className="text-white font-semibold text-sm sm:text-base md:text-lg">
                {t('home.quoteAuthor')}
              </p>
            </div>
          </div>
        </TextPart>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
};

export default OurStorySection;
