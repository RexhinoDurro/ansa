'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
}

// Accordion Item Component
interface AccordionItemProps {
  step: number;
  titleKey: string;
  descKey: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  step,
  titleKey,
  descKey,
  isOpen,
  onClick,
}) => {
  const { t } = useTranslation('common');

  return (
    <div
      className="perspective-1000 cursor-pointer"
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      {/* Question Card - Left Side with 3D Effect */}
      <div
        className={`relative rounded-xl transition-all duration-700 ease-out transform-gpu ${
          isOpen
            ? 'shadow-2xl translate-x-2'
            : 'shadow-md hover:shadow-lg border border-cream-200 hover:translate-x-1'
        } bg-white`}
        style={{
          transform: isOpen
            ? 'rotateY(-2deg) rotateX(1deg) translateZ(10px)'
            : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center gap-3 p-4">
          {/* Step Number with 3D Pop */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 flex-shrink-0 transform-gpu ${
              isOpen
                ? 'bg-accent shadow-lg scale-110'
                : 'bg-cream-100 scale-100'
            }`}
            style={{
              transform: isOpen
                ? 'translateZ(20px) scale(1.1)'
                : 'translateZ(0px) scale(1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <span className={`text-lg font-bold font-serif transition-colors duration-500 ${
              isOpen ? 'text-white' : 'text-accent'
            }`}>
              {step}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-base md:text-lg font-semibold transition-all duration-500 flex-1 ${
              isOpen ? 'text-accent font-bold' : 'text-brown-900'
            }`}
            style={{
              transform: isOpen ? 'translateZ(10px)' : 'translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {t(titleKey)}
          </h3>

          {/* Chevron Icon with 3D Rotation */}
          <ChevronDown
            className={`w-5 h-5 transition-all duration-700 flex-shrink-0 ${
              isOpen
                ? 'rotate-180 text-accent'
                : 'text-brown-600 group-hover:text-accent'
            }`}
            style={{
              transform: isOpen
                ? 'rotateX(180deg) translateZ(5px)'
                : 'rotateX(0deg) translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
          />
        </div>

        {/* 3D Active Indicator Bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-700 ${
            isOpen ? 'bg-accent' : 'bg-transparent'
          }`}
          style={{
            transform: isOpen ? 'translateZ(15px)' : 'translateZ(0px)',
            transformStyle: 'preserve-3d',
          }}
        />

        {/* 3D Shadow Overlay */}
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-700 ${
            isOpen ? 'opacity-5' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, transparent 70%)',
            transform: 'translateZ(-5px)',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>
    </div>
  );
};

// How We Work Accordion Section
const HowWeWorkAccordion: React.FC = () => {
  const { t } = useTranslation('common');
  const [openIndex, setOpenIndex] = useState<number>(0);

  const steps = [
    { step: 1, titleKey: 'services.consultation', descKey: 'services.consultationDesc' },
    { step: 2, titleKey: 'services.design', descKey: 'services.designDesc' },
    { step: 3, titleKey: 'services.crafting', descKey: 'services.craftingDesc' },
    { step: 4, titleKey: 'services.installation', descKey: 'services.installationDesc' }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-cream-50 to-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-brown-900 mb-4">
            {t('services.howWeWork')}
          </h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            {t('services.processSubtitle')}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Questions */}
          <div className="space-y-3">
            {steps.map((item, index) => (
              <AccordionItem
                key={index}
                step={item.step}
                titleKey={item.titleKey}
                descKey={item.descKey}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>

          {/* Right Side - Answer Panel with 3D */}
          <div className="lg:sticky lg:top-8" style={{ perspective: '1500px' }}>
            <div className="relative min-h-[300px]">
              {steps.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    openIndex === index
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    transform: openIndex === index
                      ? 'perspective(1500px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
                      : 'perspective(1500px) rotateY(15deg) rotateX(-5deg) translateZ(-50px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-l-4 border-accent transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: openIndex === index ? 'translateZ(0px)' : 'translateZ(-20px)',
                    }}
                  >
                    {/* Step Badge with 3D Pop */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg"
                        style={{
                          transform: openIndex === index ? 'translateZ(30px) scale(1)' : 'translateZ(0px) scale(0.9)',
                          transformStyle: 'preserve-3d',
                          transition: 'all 0.7s ease-out',
                        }}
                      >
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div
                        style={{
                          transform: openIndex === index ? 'translateZ(15px)' : 'translateZ(0px)',
                          transformStyle: 'preserve-3d',
                          transition: 'all 0.7s ease-out 0.1s',
                        }}
                      >
                        <p className="text-xs font-semibold text-accent uppercase tracking-wider">Step {item.step}</p>
                        <h3 className="text-xl md:text-2xl font-bold text-brown-900">
                          {t(item.titleKey)}
                        </h3>
                      </div>
                    </div>

                    {/* Decorative Line with 3D Depth */}
                    <div
                      className="h-px bg-gradient-to-r from-accent/40 via-accent/20 to-transparent mb-6"
                      style={{
                        transform: openIndex === index ? 'translateZ(10px) scaleX(1)' : 'translateZ(0px) scaleX(0)',
                        transformStyle: 'preserve-3d',
                        transition: 'all 0.7s ease-out 0.2s',
                        transformOrigin: 'left',
                      }}
                    ></div>

                    {/* Description with 3D Layers */}
                    <p
                      className="text-base md:text-lg text-brown-800 leading-relaxed"
                      style={{
                        transform: openIndex === index ? 'translateZ(8px)' : 'translateZ(0px)',
                        transformStyle: 'preserve-3d',
                        transition: 'all 0.7s ease-out 0.3s',
                      }}
                    >
                      {t(item.descKey)}
                    </p>

                    {/* Decorative Element with Staggered 3D */}
                    <div className="mt-8 flex items-center gap-2">
                      <div
                        className="h-1 w-12 bg-gradient-to-r from-accent to-transparent rounded-full"
                        style={{
                          transform: openIndex === index ? 'translateZ(12px)' : 'translateZ(0px)',
                          transformStyle: 'preserve-3d',
                          transition: 'all 0.7s ease-out 0.4s',
                        }}
                      ></div>
                      <div
                        className="h-1 w-8 bg-gradient-to-r from-accent/60 to-transparent rounded-full"
                        style={{
                          transform: openIndex === index ? 'translateZ(8px)' : 'translateZ(0px)',
                          transformStyle: 'preserve-3d',
                          transition: 'all 0.7s ease-out 0.45s',
                        }}
                      ></div>
                      <div
                        className="h-1 w-4 bg-gradient-to-r from-accent/30 to-transparent rounded-full"
                        style={{
                          transform: openIndex === index ? 'translateZ(4px)' : 'translateZ(0px)',
                          transformStyle: 'preserve-3d',
                          transition: 'all 0.7s ease-out 0.5s',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link
            href="/contact"
            className="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            {t('services.startProject')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function ServicesPage() {
  const { t } = useTranslation('common');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services/');
      const data = await response.json();
      setServices(data.results || data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative py-20 bg-cream-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="font-serif text-hero text-brown-900 mb-6">
              {t('services.title')}
            </h1>
            <p className="text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="text-brown-800 mt-4">{t('services.loading')}</p>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-cream-50 rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'fadeInUp 0.6s ease-out backwards'
                  }}
                >
                  {/* Image */}
                  {service.image && (
                    <div className="relative h-64 overflow-hidden bg-cream-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="font-serif text-subsection text-brown-900 mb-4">
                      {service.title}
                    </h2>

                    <p className="text-brown-800 leading-relaxed mb-4 text-lg">
                      {service.short_description}
                    </p>

                    <p className="text-brown-800 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-brown-800">
                {t('services.noServices')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Process Overview - Accordion Style */}
      <HowWeWorkAccordion />

      {/* Portfolio CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-accent to-accent-dark rounded-card p-12 text-center text-white shadow-card">
            <h2 className="font-serif text-section mb-4">
              {t('services.seeWork')}
            </h2>
            <p className="text-lg mb-8 text-cream-100 max-w-2xl mx-auto">
              {t('services.portfolioDesc')}
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-white hover:bg-cream-50 text-accent font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              {t('services.viewPortfolio')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
