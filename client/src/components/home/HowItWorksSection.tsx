'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';
import ansaImage from '@/assets/ansa2.png';

interface AccordionItemProps {
  step: number;
  titleKey: string;
  descriptionKey: string;
  isOpen: boolean;
  onClick: () => void;
  delay: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  step,
  titleKey,
  descriptionKey,
  isOpen,
  onClick,
  delay
}) => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

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

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={itemRef}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-10'
      }`}
    >
      <div
        className={`group cursor-pointer transition-all duration-500 ease-in-out ${
          isOpen
            ? 'bg-white/10 backdrop-blur-md shadow-2xl'
            : 'bg-white/5 backdrop-blur-sm hover:bg-white/8'
        } rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden`}
        onClick={onClick}
      >
        {/* Question/Title - Mobile Optimized */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Step Number - Mobile Optimized */}
            <div
              className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all duration-500 flex-shrink-0 ${
                isOpen
                  ? 'bg-accent text-white shadow-lg scale-110'
                  : 'bg-white/10 text-white/70 group-hover:bg-white/20'
              }`}
            >
              {isOpen ? (
                <Check className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              ) : (
                <span className="text-lg sm:text-xl md:text-2xl font-bold">{step}</span>
              )}
            </div>

            {/* Title - Mobile Optimized */}
            <h3
              className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold transition-colors duration-300 truncate sm:whitespace-normal ${
                isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'
              }`}
            >
              {t(titleKey)}
            </h3>
          </div>

          {/* Chevron Icon - Mobile Optimized */}
          <ChevronDown
            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white/70 transition-transform duration-500 flex-shrink-0 ${
              isOpen ? 'rotate-180 text-white' : 'group-hover:text-white'
            }`}
          />
        </div>

        {/* Answer/Description with Animation - Mobile Optimized */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 sm:px-5 md:px-6 lg:px-8 pb-4 sm:pb-5 md:pb-6 lg:pb-8 pt-0">
            <div className="pl-13 sm:pl-16 md:pl-20">
              <div
                className={`h-px bg-gradient-to-r from-white/30 to-transparent mb-4 sm:mb-5 md:mb-6 transition-all duration-500 ${
                  isOpen ? 'w-full' : 'w-0'
                }`}
              ></div>
              <p
                className={`text-sm sm:text-base md:text-lg text-white/90 leading-relaxed transition-all duration-700 ${
                  isOpen ? 'translate-y-0' : 'translate-y-4'
                }`}
              >
                {t(descriptionKey)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation('common');
  const [headerVisible, setHeaderVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number>(0); // First item open by default
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

  const steps = [
    {
      titleKey: 'home.process.step1.title',
      descriptionKey: 'home.process.step1.description',
    },
    {
      titleKey: 'home.process.step2.title',
      descriptionKey: 'home.process.step2.description',
    },
    {
      titleKey: 'home.process.step3.title',
      descriptionKey: 'home.process.step3.description',
    },
    {
      titleKey: 'home.process.step4.title',
      descriptionKey: 'home.process.step4.description',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ansaImage}
          alt="How It Works Background"
          fill
          className="object-cover"
          priority
        />
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900/90 via-brown-900/80 to-black/75"></div>
        {/* Subtle pattern overlay for texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content Container - Mobile Optimized */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header - Mobile Optimized */}
        <div
          ref={headerRef}
          className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-1000 ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8'
          }`}
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl px-2">
            {t('home.howItWorks')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg px-4">
            {t('home.howItWorksSubtitle')}
          </p>
        </div>

        {/* Accordion Items - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {steps.map((step, index) => (
            <AccordionItem
              key={index}
              step={index + 1}
              titleKey={step.titleKey}
              descriptionKey={step.descriptionKey}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
              delay={index * 150}
            />
          ))}
        </div>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-cream-50 to-transparent z-10"></div>
    </section>
  );
};

export default HowItWorksSection;
