'use client';

import React from 'react';
import { MessageCircle, Ruler, Hammer, Truck } from 'lucide-react';

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Process: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Consultation',
      description: 'We discuss your vision, needs, and budget. Share inspiration photos and tell us about your space.'
    },
    {
      number: 2,
      icon: <Ruler className="w-8 h-8" />,
      title: '3D Design & Measurements',
      description: 'Precise measurements and detailed 3D renderings so you can see exactly how your furniture will look.'
    },
    {
      number: 3,
      icon: <Hammer className="w-8 h-8" />,
      title: 'Crafting in Our Workshop',
      description: 'Expert craftsmen build your furniture with premium materials and attention to every detail.'
    },
    {
      number: 4,
      icon: <Truck className="w-8 h-8" />,
      title: 'Delivery & Installation',
      description: 'Professional delivery and installation. We ensure everything is perfectly fitted and finished.'
    }
  ];

  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-section text-brown-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            From initial consultation to final installation, we guide you through
            every step of creating your perfect custom furniture.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-accent/20"
               style={{ width: 'calc(100% - 8rem)', left: '4rem' }}>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out backwards'
                }}
              >
                {/* Number Circle */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-serif text-2xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>

                {/* Icon Circle */}
                <div className="w-20 h-20 rounded-full bg-white shadow-card flex items-center justify-center text-accent mb-4">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-brown-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-brown-800 leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-8 text-accent/30">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 5 L35 20 L20 35 M5 20 L35 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/custom-request-page"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Process;
