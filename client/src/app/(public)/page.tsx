'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

// Import existing components we'll keep
import WhyChooseUs from '@/components/WhyChooseUs';
import SomeOfOurWork from '@/components/SomeOfOurWork';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import OurStorySection from '@/components/home/OurStorySection';
import PremiumTestimonials from '@/components/home/PremiumTestimonials';

// Import background images
import bgImage1 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.28.jpeg';
import bgImage2 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.40.jpeg';
import bgImage3 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.54.jpeg';
import bgImage4 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.08.jpeg';
import bgImage5 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.28.jpeg';
import bgImage6 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.41.jpeg';
import ansaImage3 from '@/assets/ansa3.png';

export default function Home() {
  const { t } = useTranslation('common');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [bgImage1, bgImage2, bgImage3, bgImage4, bgImage5, bgImage6];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Mobile Optimized */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:h-screen flex items-center justify-center bg-brown-900 overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-40' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Custom Furniture ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-brown-900/80 to-brown-900/40"></div>
        </div>

        {/* Hero Content - Mobile Optimized */}
        <div className="relative z-10 w-full max-w-container mx-auto px-4 sm:px-6 md:px-8 text-center py-12">
          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 animate-fade-in-up leading-tight px-2">
            {t('home.heroTitle')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cream-100 mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in-up px-4">
            {t('home.heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in-up px-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group text-sm sm:text-base"
            >
              {t('home.requestDesign')}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-brown-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              {t('home.viewWork')}
            </Link>
          </div>
        </div>

        {/* Carousel Indicators - Mobile Friendly */}
        <div className="absolute bottom-20 sm:bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator - Hide on very small screens */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <OurStorySection />

      {/* WHY CHOOSE ANSA FURNITURE */}
      <WhyChooseSection />

      {/* PROCESS / HOW IT WORKS */}
      <HowItWorksSection />

      {/* SOME OF OUR WORK */}
      <SomeOfOurWork />

      {/* TESTIMONIALS */}
      <PremiumTestimonials />
    </div>
  );
}
