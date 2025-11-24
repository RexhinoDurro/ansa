'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

// Import existing components we'll keep
import WhyChooseUs from '@/components/WhyChooseUs';
import SomeOfOurWork from '@/components/SomeOfOurWork';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-brown-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=80"
            alt="Custom Kitchen"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brown-900/80 to-brown-900/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-container mx-auto px-4 md:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in-up">
            Custom Furniture, Built for Your Space.
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 mb-8 max-w-3xl mx-auto animate-fade-in-up">
            From idea to installation, we design and build furniture tailored to your home and lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Link
              href="/contact"
              className="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Request a Custom Design
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-brown-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in-up">
              <h2 className="font-serif text-section text-brown-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-brown-800 leading-relaxed">
                <p>
                  For over a decade, Ansa Furniture has been transforming homes across Albania
                  with custom-designed and expertly crafted furniture. What started as a small
                  workshop in Tirana has grown into a trusted name in bespoke furniture design.
                </p>
                <p>
                  We believe every home is unique, and your furniture should be too. That's why
                  we don't sell pre-made pieces. Instead, we work closely with you to understand
                  your space, your style, and your needs—then we design and build furniture that's
                  perfectly tailored to your life.
                </p>
                <p>
                  Our craftsmen combine traditional woodworking techniques with modern design
                  principles to create furniture that's not only beautiful but built to last
                  for generations.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              {[
                { number: '10+', label: 'Years Experience' },
                { number: '500+', label: 'Projects Completed' },
                { number: '15+', label: 'Master Craftsmen' },
                { number: '100%', label: 'Custom Made' }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-cream-50 rounded-card p-6 text-center hover:shadow-card transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-serif font-bold text-brown-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-brown-700">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR WORKSHOP, YOUR IDEAS (Workshop Features) */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-section text-brown-900 mb-4">
              Our Workshop, Your Ideas
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              What sets us apart is our dedication to bringing your vision to life with
              uncompromising quality and attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Tailored Designs for Your Space',
                description: 'Every piece is custom-designed to fit your exact measurements, style preferences, and functional needs. No two projects are the same.'
              },
              {
                title: 'Handcrafted Precision',
                description: 'Our skilled craftsmen use time-tested techniques and state-of-the-art tools to ensure every joint, edge, and finish is perfect.'
              },
              {
                title: 'Long-Term Durability',
                description: 'We use only premium materials and construction methods that stand the test of time, so your furniture lasts for decades.'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-card p-8 hover:shadow-card transition-all duration-300"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out backwards'
                }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-white mb-6">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-brown-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-brown-800 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS / HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-section text-brown-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              Every project follows our proven process, ensuring exceptional results from start to finish.
            </p>
          </div>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-cream-300">
              <div className="h-full bg-accent w-0 animate-pulse" style={{ width: '100%' }}></div>
            </div>

            <div className="grid grid-cols-4 gap-8 relative">
              {[
                {
                  number: 1,
                  title: 'Consultation',
                  description: 'We meet to discuss your vision, needs, and budget. Understanding your space and lifestyle is our first priority.'
                },
                {
                  number: 2,
                  title: '3D Design & Measurements',
                  description: 'Our designers create detailed 3D renderings and take precise measurements to ensure a perfect fit.'
                },
                {
                  number: 3,
                  title: 'Crafting in Our Workshop',
                  description: 'Skilled craftsmen bring your design to life using quality materials and expert techniques.'
                },
                {
                  number: 4,
                  title: 'Delivery & Installation',
                  description: 'We deliver and professionally install your custom furniture, ensuring everything is perfect.'
                }
              ].map((step, index) => (
                <div key={step.number} className="text-center" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Number Circle */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent text-white font-serif text-3xl font-bold mb-6 shadow-lg z-10">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-brown-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-brown-800 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-8">
            {[
              {
                number: 1,
                title: 'Consultation',
                description: 'We meet to discuss your vision, needs, and budget. Understanding your space and lifestyle is our first priority.'
              },
              {
                number: 2,
                title: '3D Design & Measurements',
                description: 'Our designers create detailed 3D renderings and take precise measurements to ensure a perfect fit.'
              },
              {
                number: 3,
                title: 'Crafting in Our Workshop',
                description: 'Skilled craftsmen bring your design to life using quality materials and expert techniques.'
              },
              {
                number: 4,
                title: 'Delivery & Installation',
                description: 'We deliver and professionally install your custom furniture, ensuring everything is perfect.'
              }
            ].map((step) => (
              <div key={step.number} className="flex gap-4">
                {/* Number Circle */}
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-serif text-2xl font-bold shadow-lg">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-brown-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-brown-800 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOME OF OUR WORK */}
      <SomeOfOurWork />

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-section text-brown-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              Don't just take our word for it – hear from the people who trusted us with their spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Maria K.',
                project: 'Custom Kitchen – Tirana',
                quote: 'The team at Ansa transformed our kitchen into exactly what we envisioned. The attention to detail and quality of craftsmanship is outstanding.'
              },
              {
                name: 'Alban S.',
                project: 'Built-in Wardrobes – Durrës',
                quote: 'Professional service from start to finish. They maximized our bedroom storage while maintaining a beautiful, minimalist aesthetic.'
              },
              {
                name: 'Elira M.',
                project: 'Living Room System – Tirana',
                quote: 'We couldn\'t be happier with our custom TV wall unit. It fits perfectly and the quality is exceptional. Highly recommend!'
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-card p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent mr-2" />
                  <span className="text-sm font-medium text-accent">Verified Client</span>
                </div>

                <p className="text-brown-800 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-cream-200 pt-4">
                  <p className="font-semibold text-brown-900">{testimonial.name}</p>
                  <p className="text-sm text-brown-700">{testimonial.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / REQUEST A QUOTE */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-section text-brown-900 mb-4">
                Start Your Project
              </h2>
              <p className="text-lg text-brown-800">
                Tell us about your project – we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="bg-cream-50 rounded-card p-8 md:p-12 shadow-card">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    room: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8000/api/custom-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', room: '', budget: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
            placeholder="+355 XX XXX XXXX"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            What room?
          </label>
          <select
            name="room"
            value={formData.room}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
          >
            <option value="">Select a room...</option>
            <option value="kitchen">Kitchen</option>
            <option value="living-room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="wardrobe">Wardrobe</option>
            <option value="office">Office</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-brown-900 mb-2">
          Budget Range
        </label>
        <select
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
        >
          <option value="">Select a range...</option>
          <option value="<1000">&lt;1000€</option>
          <option value="1000-3000">1000–3000€</option>
          <option value="3000-6000">3000–6000€</option>
          <option value=">6000">&gt;6000€</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-brown-900 mb-2">
          Tell us about your project <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white resize-none"
          placeholder="Describe your vision, measurements, style preferences..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Thank you! We'll get back to you soon.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          Something went wrong. Please try again or contact us directly.
        </div>
      )}
    </form>
  );
}
