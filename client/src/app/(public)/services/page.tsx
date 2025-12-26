'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

      {/* Process Overview */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-section text-brown-900 mb-4">
              {t('services.howWeWork')}
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              {t('services.processSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              { step: 1, titleKey: 'services.consultation', descKey: 'services.consultationDesc' },
              { step: 2, titleKey: 'services.design', descKey: 'services.designDesc' },
              { step: 3, titleKey: 'services.crafting', descKey: 'services.craftingDesc' },
              { step: 4, titleKey: 'services.installation', descKey: 'services.installationDesc' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                {/* Step Number */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
                  {item.step}
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-brown-900 mb-2">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-brown-800 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/custom-request-page"
              className="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              {t('services.startProject')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

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
