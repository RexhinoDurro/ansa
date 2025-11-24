'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: number;
  title: string;
  content: string;
}

const WhyChoose: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(1);

  const items: AccordionItem[] = [
    {
      id: 1,
      title: 'Quality Materials',
      content: 'We use only premium materials - solid hardwoods, high-grade veneers, and durable hardware from trusted European suppliers. Every piece is built to last for generations.'
    },
    {
      id: 2,
      title: 'Made-to-Measure',
      content: 'No two spaces are identical, and neither should your furniture be. We take precise measurements and create custom designs that maximize every centimeter of your space.'
    },
    {
      id: 3,
      title: 'Design & Installation',
      content: 'From 3D visualization to final installation, we handle everything. Our experienced team ensures your furniture is perfectly fitted, leveled, and finished to the highest standard.'
    },
    {
      id: 4,
      title: 'After-Sales Support',
      content: 'Our relationship doesn\'t end at installation. We provide a 2-year warranty and ongoing support. Minor adjustments are always included, and we\'re just a phone call away.'
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-section text-brown-900 mb-4">
            Why Choose Ansa Furniture
          </h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            We combine traditional craftsmanship with modern design to create furniture
            that's perfectly suited to your home.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border border-cream-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out backwards'
              }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-6 text-left bg-cream-50 hover:bg-cream-100 transition-colors duration-300"
                aria-expanded={openItem === item.id}
              >
                <h3 className="text-xl font-semibold text-brown-900">
                  {item.title}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-accent transition-transform duration-300 ${
                    openItem === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openItem === item.id
                    ? 'max-h-48 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <div className="p-6 pt-2 bg-white">
                  <p className="text-brown-800 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
