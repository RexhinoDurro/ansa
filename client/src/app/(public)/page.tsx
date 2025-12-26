'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

// Import existing components we'll keep
import WhyChooseUs from '@/components/WhyChooseUs';
import SomeOfOurWork from '@/components/SomeOfOurWork';

// Import background images
import bgImage1 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.28.jpeg';
import bgImage2 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.40.jpeg';
import bgImage3 from '@/assets/WhatsApp Image 2025-11-24 at 20.53.54.jpeg';
import bgImage4 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.08.jpeg';
import bgImage5 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.17.jpeg';
import bgImage6 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.28.jpeg';
import bgImage7 from '@/assets/WhatsApp Image 2025-11-24 at 20.54.41.jpeg';

export default function Home() {
  const { t } = useTranslation('common');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [bgImage1, bgImage2, bgImage3, bgImage4, bgImage5, bgImage6, bgImage7];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-brown-900 overflow-hidden">
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

        {/* Hero Content */}
        <div className="relative z-10 max-w-container mx-auto px-4 md:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-fade-in-up">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 mb-8 max-w-3xl mx-auto animate-fade-in-up">
            {t('home.heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Link
              href="/contact"
              className="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              {t('home.requestDesign')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-brown-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              {t('home.viewWork')}
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-32 bg-gradient-to-br from-white via-cream-50/30 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brown-900/5 rounded-full blur-3xl"></div>

        <div className="max-w-container mx-auto px-4 md:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="animate-slide-in-left">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold text-sm uppercase tracking-wider rounded-full">
                  {t('home.ourJourney')}
                </span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl text-brown-900 mb-8 leading-tight">
                {t('home.craftingDreams')}
                <span className="block text-accent mt-2">{t('home.reality')}</span>
              </h2>
              <div className="space-y-6 text-lg text-brown-800 leading-relaxed">
                <p className="border-l-4 border-accent pl-6">
                  {t('home.storyParagraph1')}
                </p>
                <p>
                  {t('home.storyParagraph2')}
                </p>
                <p>
                  {t('home.storyParagraph3')}
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-brown-200">
                <p className="text-brown-700 italic">
                  "{t('home.quote')}"
                </p>
                <p className="text-brown-900 font-semibold mt-2">{t('home.quoteAuthor')}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 animate-slide-in-right">
              {[
                { number: '10+', labelKey: 'home.stats.yearsExperience' },
                { number: '500+', labelKey: 'home.stats.projectsCompleted' },
                { number: '15+', labelKey: 'home.stats.masterCraftsmen' },
                { number: '100%', labelKey: 'home.stats.customMade' }
              ].map((stat, index) => (
                <div
                  key={stat.labelKey}
                  className="group relative bg-white rounded-2xl p-8 hover:bg-accent transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 border border-brown-100"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    opacity: 0,
                    animation: `fadeInScale 0.6s ease-out ${index * 150}ms forwards`
                  }}
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 group-hover:bg-white/20 rounded-bl-full rounded-tr-2xl transition-all duration-500"></div>

                  <div className="relative">
                    <div className="text-5xl md:text-6xl font-serif font-bold text-accent group-hover:text-white mb-3 transition-colors duration-500">
                      {stat.number}
                    </div>
                    <div className="text-sm font-semibold text-brown-700 group-hover:text-white/90 uppercase tracking-wide transition-colors duration-500">
                      {t(stat.labelKey)}
                    </div>
                    {/* Bottom accent line */}
                    <div className="mt-4 h-1 w-12 bg-accent group-hover:bg-white rounded-full transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR WORKSHOP, YOUR IDEAS (Workshop Features) */}
      <section className="py-24 bg-cream-50 relative">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold text-sm uppercase tracking-wider rounded-full mb-4">
              {t('whyChoose.title')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brown-900 mb-4">
              {t('home.workshopTitle')}
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              {t('home.workshopSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                titleKey: 'home.features.feature1.title',
                descriptionKey: 'home.features.feature1.description'
              },
              {
                number: '02',
                titleKey: 'home.features.feature2.title',
                descriptionKey: 'home.features.feature2.description'
              },
              {
                number: '03',
                titleKey: 'home.features.feature3.title',
                descriptionKey: 'home.features.feature3.description'
              }
            ].map((feature, index) => (
              <div
                key={feature.titleKey}
                className="group bg-white rounded-2xl p-8 hover:bg-brown-900 transition-all duration-500 border border-brown-100 hover:border-brown-900 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out backwards'
                }}
              >
                {/* Number badge */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-6xl font-serif font-bold text-accent/20 group-hover:text-white/30 transition-colors duration-500">
                    {feature.number}
                  </span>
                  <div className="h-1 w-12 bg-accent rounded-full mt-6 group-hover:w-20 transition-all duration-500"></div>
                </div>

                <h3 className="text-2xl font-semibold text-brown-900 group-hover:text-white mb-4 transition-colors duration-500">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-brown-800 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                  {t(feature.descriptionKey)}
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
              {t('home.howItWorks')}
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              {t('home.howItWorksSubtitle')}
            </p>
          </div>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block relative">
            {/* Static Background Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-cream-300"></div>

            {/* Animated Snake Path */}
            <div className="absolute top-12 left-0 right-0 h-1 overflow-hidden">
              <div className="h-full bg-accent animate-snake-path"></div>
            </div>

            {/* Animated Snake Dot */}
            <div className="absolute top-10 left-0 right-0 h-6">
              <div className="absolute animate-snake-dot">
                <div className="relative">
                  {/* Main dot */}
                  <div className="w-6 h-6 bg-accent rounded-full shadow-lg border-2 border-white"></div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 w-6 h-6 bg-accent rounded-full animate-pulse-ring"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-8 relative">
              {[
                {
                  number: 1,
                  titleKey: 'home.process.step1.title',
                  descriptionKey: 'home.process.step1.description'
                },
                {
                  number: 2,
                  titleKey: 'home.process.step2.title',
                  descriptionKey: 'home.process.step2.description'
                },
                {
                  number: 3,
                  titleKey: 'home.process.step3.title',
                  descriptionKey: 'home.process.step3.description'
                },
                {
                  number: 4,
                  titleKey: 'home.process.step4.title',
                  descriptionKey: 'home.process.step4.description'
                }
              ].map((step, index) => (
                <div key={step.number} className="text-center" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Number Circle */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent text-white font-serif text-3xl font-bold mb-6 shadow-lg z-10">
                    {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-brown-900 mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-brown-800 leading-relaxed">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-8 relative">
            {/* Static Background Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-cream-300"></div>

            {/* Animated Vertical Snake Path */}
            <div className="absolute left-8 top-0 bottom-0 w-1 overflow-hidden">
              <div className="w-full bg-accent animate-snake-path-vertical"></div>
            </div>

            {/* Animated Vertical Snake Dot */}
            <div className="absolute left-6 top-0 bottom-0 w-5">
              <div className="absolute animate-snake-dot-vertical">
                <div className="relative">
                  {/* Main dot */}
                  <div className="w-5 h-5 bg-accent rounded-full shadow-lg border-2 border-white"></div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 w-5 h-5 bg-accent rounded-full animate-pulse-ring"></div>
                </div>
              </div>
            </div>

            {[
              {
                number: 1,
                titleKey: 'home.process.step1.title',
                descriptionKey: 'home.process.step1.description'
              },
              {
                number: 2,
                titleKey: 'home.process.step2.title',
                descriptionKey: 'home.process.step2.description'
              },
              {
                number: 3,
                titleKey: 'home.process.step3.title',
                descriptionKey: 'home.process.step3.description'
              },
              {
                number: 4,
                titleKey: 'home.process.step4.title',
                descriptionKey: 'home.process.step4.description'
              }
            ].map((step) => (
              <div key={step.number} className="flex gap-4 relative">
                {/* Number Circle */}
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white font-serif text-2xl font-bold shadow-lg z-10">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-brown-900 mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-brown-800 leading-relaxed">
                    {t(step.descriptionKey)}
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
      <section className="py-24 bg-cream-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-brown-900/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-container mx-auto px-4 md:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent font-semibold text-sm uppercase tracking-wider rounded-full mb-4">
              {t('home.testimonials.title')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-brown-900 mb-4">
              {t('home.testimonials.subtitle')}
            </h2>
            <p className="text-lg text-brown-800 max-w-2xl mx-auto">
              {t('home.testimonials.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                nameKey: 'home.testimonials.client1.name',
                projectKey: 'home.testimonials.client1.project',
                quoteKey: 'home.testimonials.client1.quote',
                rating: 5
              },
              {
                nameKey: 'home.testimonials.client2.name',
                projectKey: 'home.testimonials.client2.project',
                quoteKey: 'home.testimonials.client2.quote',
                rating: 5
              },
              {
                nameKey: 'home.testimonials.client3.name',
                projectKey: 'home.testimonials.client3.project',
                quoteKey: 'home.testimonials.client3.quote',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-brown-100 hover:border-accent relative overflow-hidden hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInScale 0.6s ease-out backwards'
                }}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="animate-shimmer absolute inset-0"></div>
                </div>

                {/* Decorative quote mark with animation */}
                <div className="absolute top-4 right-4 text-7xl font-serif text-accent/10 group-hover:text-accent/20 group-hover:scale-110 transition-all duration-500 leading-none">
                  "
                </div>

                {/* Stars Rating */}
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-accent transform group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Verified badge with animation */}
                <div className="mb-6 relative z-10">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider rounded-full group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    ✓ Verified Client
                  </span>
                </div>

                <p className="text-brown-800 leading-relaxed mb-6 italic relative z-10 group-hover:text-brown-900 transition-colors duration-300">
                  "{t(testimonial.quoteKey)}"
                </p>

                <div className="border-t-2 border-accent/20 group-hover:border-accent pt-4 transition-colors duration-300 relative z-10">
                  <p className="font-bold text-brown-900 text-lg group-hover:text-accent transition-colors duration-300">{t(testimonial.nameKey)}</p>
                  <p className="text-sm text-brown-700 mt-1">{t(testimonial.projectKey)}</p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent/5 group-hover:bg-accent/10 rounded-tr-full transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* Animated decorative line */}
          <div className="mt-12 flex justify-center">
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
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
      const response = await fetch('/api/custom-requests/', {
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
