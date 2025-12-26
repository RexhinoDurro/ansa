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
      {/* Decorative Top Separator */}
      <div className="relative bg-white py-16">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-accent to-accent"></div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <div className="w-3 h-3 rounded-full bg-accent/60"></div>
              <div className="w-3 h-3 rounded-full bg-accent/30"></div>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-accent to-accent"></div>
          </div>
        </div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 top-[120px] z-0">
        <Image
          src={ansaImage}
          alt="Our Story Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900/80 via-brown-900/70 to-black/75"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-16 pb-32">
        {/* Badge - Fade in from top */}
        <TextPart animationClass="-translate-y-10" delay={0} className="mb-6">
          <span className="inline-block px-6 py-3 bg-accent/90 text-white font-semibold text-sm uppercase tracking-wider rounded-full shadow-xl backdrop-blur-sm">
            {t('home.ourJourney')}
          </span>
        </TextPart>

        {/* Main Title Line 1 - Slide from left */}
        <TextPart animationClass="-translate-x-20" delay={200}>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-2 leading-tight drop-shadow-2xl">
            {t('home.craftingDreams')}
          </h2>
        </TextPart>

        {/* Main Title Line 2 - Slide from right */}
        <TextPart animationClass="translate-x-20" delay={400} className="mb-12">
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-accent leading-tight drop-shadow-2xl">
            {t('home.reality')}
          </h2>
        </TextPart>

        {/* Story Paragraph 1 - Slide from left */}
        <TextPart animationClass="-translate-x-16" delay={600} className="mb-8">
          <div className="backdrop-blur-sm bg-white/5 border-l-4 border-accent p-6 rounded-r-2xl">
            <p className="text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-lg">
              {t('home.storyParagraph1')}
            </p>
          </div>
        </TextPart>

        {/* Story Paragraph 2 - Slide from right */}
        <TextPart animationClass="translate-x-16" delay={800} className="mb-8">
          <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg">
              {t('home.storyParagraph2')}
            </p>
          </div>
        </TextPart>

        {/* Story Paragraph 3 - Slide from left */}
        <TextPart animationClass="-translate-x-16" delay={1000} className="mb-12">
          <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-lg">
              {t('home.storyParagraph3')}
            </p>
          </div>
        </TextPart>

        {/* Quote Section - Fade in from bottom */}
        <TextPart animationClass="translate-y-16" delay={1200}>
          <div className="backdrop-blur-md bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 p-8 rounded-3xl shadow-2xl">
            <p className="text-xl md:text-2xl text-white/95 italic leading-relaxed drop-shadow-lg mb-4">
              "{t('home.quote')}"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 bg-accent rounded-full"></div>
              <p className="text-white font-semibold text-lg">
                {t('home.quoteAuthor')}
              </p>
            </div>
          </div>
        </TextPart>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
};

export default OurStorySection;
