'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChoiceItem {
  id: string;
  title: string;
  description: string;
}

const WhyChooseUs: React.FC = () => {
  const { t } = useTranslation('common');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const choices: ChoiceItem[] = [
    {
      id: 'quality',
      title: t('whyChoose.quality.title', 'Quality'),
      description: t('whyChoose.quality.description', 'We use premium materials and craftsmanship to ensure every piece lasts for generations.')
    },
    {
      id: 'design',
      title: t('whyChoose.design.title', 'Design'),
      description: t('whyChoose.design.description', 'Our furniture blends modern minimalism with everyday comfort.')
    },
    {
      id: 'sustainability',
      title: t('whyChoose.sustainability.title', 'Sustainability'),
      description: t('whyChoose.sustainability.description', 'We source eco-friendly materials and minimize waste.')
    },
    {
      id: 'support',
      title: t('whyChoose.support.title', 'Customer Support'),
      description: t('whyChoose.support.description', 'From order to delivery, our team ensures a seamless experience.')
    }
  ];

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
            {t('whyChoose.title', 'Why Choose Ansa Furniture')}
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl">
            {t('whyChoose.subtitle', 'Discover what sets us apart in the world of fine furniture.')}
          </p>
        </div>

        <div className="max-w-4xl space-y-3">
          {choices.map((choice, index) => {
            const isExpanded = expandedId === choice.id;
            const isHovered = hoveredId === choice.id;

            return (
              <div
                key={choice.id}
                className={`group relative overflow-hidden rounded-lg transition-all duration-500 ${
                  isExpanded ? 'bg-neutral-50' : 'bg-white'
                }`}
                style={{
                  transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <button
                  onClick={() => toggleItem(choice.id)}
                  onMouseEnter={() => setHoveredId(choice.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left relative"
                  aria-expanded={isExpanded}
                  aria-controls={`content-${choice.id}`}
                >
                  {/* Left border animation */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-600 to-primary-400 transition-all duration-300 ${
                      isHovered || isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: isHovered ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'top'
                    }}
                  ></div>

                  {/* Animated number badge */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300 ${
                        isHovered || isExpanded
                          ? 'bg-primary-600 text-white scale-110'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <h3
                      className={`text-2xl font-bold transition-all duration-300 ${
                        isHovered || isExpanded
                          ? 'text-primary-600 translate-x-2'
                          : 'text-neutral-900'
                      }`}
                    >
                      {choice.title}
                    </h3>
                  </div>

                  {/* Chevron with rotation */}
                  <ChevronDown
                    className={`w-6 h-6 transition-all duration-300 ${
                      isHovered || isExpanded ? 'text-primary-600' : 'text-neutral-400'
                    } ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    style={{
                      transform: isExpanded ? 'rotate(180deg) scale(1.1)' : isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />

                  {/* Bottom border glow effect */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                    style={{
                      opacity: isHovered ? 0.5 : 0,
                      transition: 'opacity 0.3s ease-out'
                    }}
                  ></div>
                </button>

                {/* Collapsible content with slide animation */}
                <div
                  id={`content-${choice.id}`}
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isExpanded ? '200px' : '0',
                    opacity: isExpanded ? 1 : 0
                  }}
                >
                  <div
                    className="px-6 pb-6 pl-20"
                    style={{
                      transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                      transition: 'transform 0.5s ease-out'
                    }}
                  >
                    <p className="text-neutral-600 text-lg leading-relaxed">
                      {choice.description}
                    </p>
                  </div>
                </div>

                {/* Background gradient on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/20 to-primary-50/0 pointer-events-none"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease-out'
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
