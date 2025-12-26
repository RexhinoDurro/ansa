'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ansaImage from '@/assets/ansa1.png';

interface FeatureProps {
  titleKey: string;
  descriptionKey: string;
  position: string;
  animationClass: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ titleKey, descriptionKey, position, animationClass, delay }) => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.2 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={featureRef}
      className={`${position} transition-all duration-1000 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${animationClass}`
      }`}
    >
      <div className="max-w-sm space-y-3">
        {/* Title */}
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
          {t(titleKey)}
        </h3>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-lg">
          {t(descriptionKey)}
        </p>
      </div>
    </div>
  );
};

const WhyChooseSection: React.FC = () => {
  const { t } = useTranslation('common');
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  const features = [
    {
      titleKey: 'home.features.feature1.title',
      descriptionKey: 'home.features.feature1.description',
      position: 'absolute top-16 left-8 md:top-24 md:left-16',
      animationClass: '-translate-x-20',
      delay: 200
    },
    {
      titleKey: 'home.features.feature2.title',
      descriptionKey: 'home.features.feature2.description',
      position: 'absolute top-16 right-8 md:top-24 md:right-16',
      animationClass: 'translate-x-20',
      delay: 400
    },
    {
      titleKey: 'home.features.feature3.title',
      descriptionKey: 'home.features.feature3.description',
      position: 'absolute bottom-16 left-8 md:bottom-24 md:left-16',
      animationClass: 'translate-y-20',
      delay: 600
    }
  ];

  return (
    <section className="relative min-h-screen py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ansaImage}
          alt="Ansa Furniture Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900/70 via-brown-900/50 to-black/60"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 min-h-[80vh]">
        {/* Header - Centered */}
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8'
          }`}
        >
          <span className="inline-block px-6 py-3 bg-accent/90 text-white font-semibold text-sm uppercase tracking-wider rounded-full mb-6 shadow-xl backdrop-blur-sm">
            {t('whyChoose.title')}
          </span>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-2xl">
            {t('home.workshopTitle')}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
            {t('home.workshopSubtitle')}
          </p>
        </div>

        {/* Features positioned in different corners */}
        <div className="relative min-h-[600px] md:min-h-[800px]">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
};

export default WhyChooseSection;
