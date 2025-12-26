'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ===============================
// INTERFACES
// ===============================
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface CustomRequestFormData {
  name: string;
  email: string;
  phone: string;
  room: string;
  budget: string;
  message: string;
  images?: FileList | null;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  category_display: string;
  is_active: boolean;
  sort_order: number;
}

// ===============================
// MAIN CONTACT PAGE
// ===============================
export default function ContactPage() {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'contact' | 'custom'>('contact');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cream-100 via-cream-50 to-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brown-900/5 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-scale-pulse"></div>

        <div className="max-w-container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-serif text-hero text-brown-900 mb-6 animate-fade-in-up">
              <span className="inline-block animate-wiggle">{t('contact.title')}</span>
            </h1>
            <p className="text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t('contact.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-brown-700">
              {[
                { icon: CheckCircle, textKey: 'contact.freeConsultation', delay: '0.3s' },
                { icon: CheckCircle, textKey: 'contact.responseTime', delay: '0.4s' },
                { icon: CheckCircle, textKey: 'contact.expertAdvice', delay: '0.5s' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: item.delay }}
                >
                  <item.icon className="w-4 h-4 text-accent mr-2 animate-scale-pulse" />
                  <span>{t(item.textKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <ContactInfo />
        </div>
      </section>

      {/* Tabbed Forms Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          {/* Tab Navigation */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex border-b border-cream-300">
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'contact'
                    ? 'text-accent border-b-2 border-accent bg-white'
                    : 'text-brown-700 hover:text-accent hover:bg-cream-100'
                }`}
              >
                {t('contact.contactUs')}
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'custom'
                    ? 'text-accent border-b-2 border-accent bg-white'
                    : 'text-brown-700 hover:text-accent hover:bg-cream-100'
                }`}
              >
                {t('contact.customRequest')}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'contact' ? <ContactForm /> : <CustomRequestForm />}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <MapSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <FAQSection />
        </div>
      </section>
    </div>
  );
}

// ===============================
// CONTACT INFO CARDS
// ===============================
function ContactInfo() {
  const { t } = useTranslation('common');

  const contactDetails = [
    {
      icon: MapPin,
      titleKey: 'contact.visitWorkshop',
      details: ['Rruga e Elbasanit', 'Tirana, Albania'],
      actionKey: 'contact.getDirections',
      actionLink: 'https://maps.google.com'
    },
    {
      icon: Phone,
      titleKey: 'contact.callUs',
      detailsKeys: ['+355 XX XXX XXXX', 'contact.mondaySaturday'],
      actionKey: 'contact.callNow',
      actionLink: 'tel:+355XXXXXXXX'
    },
    {
      icon: Mail,
      titleKey: 'contact.emailUs',
      detailsKeys: ['info@ansafurniture.al', 'contact.respondWithin'],
      actionKey: 'contact.sendEmail',
      actionLink: 'mailto:info@ansafurniture.al'
    },
    {
      icon: Clock,
      titleKey: 'contact.workshopHours',
      detailsKeys: ['contact.mondayFriday', 'contact.saturday', 'contact.sunday'],
      actionKey: 'contact.scheduleVisit',
      actionLink: '#'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactDetails.map((detail, index) => {
        const Icon = detail.icon;
        return (
          <div
            key={index}
            className="group bg-gradient-to-br from-cream-50 to-white p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 border border-cream-200 hover:border-accent relative overflow-hidden hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="animate-shimmer absolute inset-0"></div>
            </div>

            {/* Rotating background circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full group-hover:animate-rotate-slow transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="bg-accent/10 group-hover:bg-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-brown-900 group-hover:text-accent mb-3 transition-colors duration-300">{t(detail.titleKey)}</h3>
              <div className="space-y-1 mb-4">
                {(detail.details || detail.detailsKeys || []).map((item, idx) => (
                  <p key={idx} className="text-sm text-brown-700 group-hover:text-brown-900 transition-colors duration-300">
                    {item.startsWith('contact.') ? t(item) : item}
                  </p>
                ))}
              </div>
              <a
                href={detail.actionLink}
                className="text-accent hover:text-accent-dark font-medium text-sm transition-all duration-200 inline-flex items-center group-hover:gap-2 gap-1"
              >
                {t(detail.actionKey)}
                <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>

            {/* Decorative corner */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-accent/5 group-hover:bg-accent/10 rounded-tl-full transition-all duration-500"></div>
          </div>
        );
      })}
    </div>
  );
}

// ===============================
// CONTACT FORM
// ===============================
function ContactForm() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const getCsrfToken = async () => {
    // First ensure we have the CSRF token cookie
    try {
      await fetch('/api/csrf-token/', { credentials: 'include' });
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
    }

    const name = 'csrftoken';
    let cookieValue = '';
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in-up relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-brown-900/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-6 animate-slide-in-left">{t('contact.sendMessage')}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
              placeholder={t('contact.yourFullName')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.email')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
              placeholder={t('contact.yourEmail')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.phoneOptional')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
              placeholder={t('contact.phoneNumber')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.subject')} <span className="text-red-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
            >
              <option value="">{t('contact.selectSubject')}</option>
              <option value="general">{t('contact.generalInquiry')}</option>
              <option value="general">{t('contact.projectQuestion')}</option>
              <option value="custom">{t('contact.customFurniture')}</option>
              <option value="general">{t('contact.pricingQuote')}</option>
              <option value="support">{t('contact.existingOrder')}</option>
              <option value="feedback">{t('contact.feedback')}</option>
              <option value="other">{t('contact.other')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            {t('contact.message')} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white resize-none"
            placeholder={t('contact.tellUsAboutInquiry')}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 animate-glow"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('contact.sending')}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2 animate-bounce-slow" />
              {t('contact.sendButton')}
            </>
          )}
        </button>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center animate-fade-in-scale">
            <CheckCircle className="w-5 h-5 mr-2 animate-scale-pulse" />
            {t('contact.thankYouMessage')}
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg animate-wiggle">
            {t('contact.errorMessage')}
          </div>
        )}
      </form>
      </div>
    </div>
  );
}

// ===============================
// CUSTOM REQUEST FORM
// ===============================
function CustomRequestForm() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<CustomRequestFormData>({
    name: '',
    email: '',
    phone: '',
    room: '',
    budget: '',
    message: '',
    images: null
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const getCsrfToken = async () => {
    // First ensure we have the CSRF token cookie
    try {
      await fetch('/api/csrf-token/', { credentials: 'include' });
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
    }

    const name = 'csrftoken';
    let cookieValue = '';
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const formDataToSend = new FormData();

      // Map form fields to backend field names
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.room) formDataToSend.append('room_type', formData.room);
      if (formData.budget) formDataToSend.append('budget_range', formData.budget);
      formDataToSend.append('message', formData.message);

      // Handle images
      if (formData.images) {
        Array.from(formData.images).forEach((file) => {
          formDataToSend.append('images', file);
        });
      }

      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/custom-request/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', room: '', budget: '', message: '', images: null });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setStatus('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      setFormData({ ...formData, [name]: e.target.files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="bg-white rounded-card p-8 shadow-card">
      <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">{t('contact.requestCustomFurniture')}</h2>
      <p className="text-brown-700 mb-6">{t('contact.customFurnitureDesc')}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
              placeholder={t('contact.yourFullName')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.email')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
              placeholder={t('contact.yourEmail')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.phoneOptional')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
              placeholder={t('contact.phoneNumber')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              {t('contact.whatRoom')}
            </label>
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
            >
              <option value="">{t('contact.selectRoom')}</option>
              <option value="kitchen">{t('contact.kitchen')}</option>
              <option value="living-room">{t('contact.livingRoom')}</option>
              <option value="bedroom">{t('contact.bedroom')}</option>
              <option value="wardrobe">{t('contact.wardrobe')}</option>
              <option value="office">{t('contact.office')}</option>
              <option value="dining-room">{t('contact.diningRoom')}</option>
              <option value="other">{t('contact.other')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            {t('contact.budgetRange')}
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
          >
            <option value="">{t('contact.selectRange')}</option>
            <option value="<1000">&lt;€1000</option>
            <option value="1000-3000">€1000–€3000</option>
            <option value="3000-6000">€3000–€6000</option>
            <option value=">6000">&gt;€6000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            {t('contact.projectDescription')} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white resize-none"
            placeholder={t('contact.describeVision')}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            {t('contact.referenceImages')}
          </label>
          <input
            type="file"
            name="images"
            onChange={handleChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark"
          />
          <p className="text-sm text-brown-600 mt-1">{t('contact.uploadPhotos')}</p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('contact.sending')}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t('contact.submitRequest')}
            </>
          )}
        </button>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {t('contact.requestReceivedMessage')}
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {t('contact.errorMessage')}
          </div>
        )}
      </form>
    </div>
  );
}

// ===============================
// MAP SECTION
// ===============================
function MapSection() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-brown-900 mb-3">{t('contact.visitWorkshop')}</h2>
        <p className="text-brown-700 max-w-2xl mx-auto">
          {t('contact.visitWorkshopDesc')}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-cream-100">
        <div className="h-[300px] md:h-[400px] bg-cream-100 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11988.544086733365!2d19.834755531922887!3d41.305904449121265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031c1d9418cfb%3A0xa2e2088da9965781!2sFlladi%20i%20Tuneleve!5e0!3m2!1sen!2s!4v1755091610264!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ansa Furniture Location"
            className="absolute inset-0"
          ></iframe>
        </div>

        <div className="p-6 bg-gradient-to-br from-cream-50 to-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.google.com/maps/place/Flladi+i+Tuneleve/@41.305904449121265,19.834755531922887,12z"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              {t('contact.getDirections')}
            </a>
            <a
              href="#"
              className="flex-1 border-2 border-accent hover:bg-accent text-brown-900 hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300 hover:scale-105"
            >
              {t('contact.scheduleVisit')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================
// FAQ SECTION
// ===============================
function FAQSection() {
  const { t } = useTranslation('common');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: t('contact.all') },
    { value: 'general', label: t('contact.general') },
    { value: 'process', label: t('contact.process') },
    { value: 'pricing', label: t('contact.pricing') },
    { value: 'materials', label: t('contact.materials') },
    { value: 'delivery', label: t('contact.delivery') },
    { value: 'warranty', label: t('contact.warranty') }
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, selectedCategory, searchQuery]);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs/');
      const data = await response.json();
      setFaqs(data.results || data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    setFilteredFaqs(filtered);
  };

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-section text-brown-900 mb-4">
          {t('contact.faqTitle')}
        </h2>
        <p className="text-lg text-brown-800 max-w-2xl mx-auto">
          {t('contact.faqDesc')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brown-600" />
          <input
            type="text"
            placeholder={t('contact.searchQuestions')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              selectedCategory === category.value
                ? 'bg-accent text-white shadow-lg'
                : 'bg-cream-100 text-brown-800 hover:bg-cream-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-brown-800 mt-4">{t('contact.loadingFaqs')}</p>
        </div>
      ) : filteredFaqs.length > 0 ? (
        <div className="space-y-4">
          {filteredFaqs.slice(0, 8).map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-card border border-cream-200 overflow-hidden transition-all duration-300 hover:shadow-card"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-start justify-between p-6 text-left hover:bg-cream-50 transition-colors duration-300"
              >
                <div className="flex-1 pr-4">
                  <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-2">
                    {faq.category_display}
                  </span>
                  <h3 className="text-lg font-semibold text-brown-900">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ${
                  openFaqId === faq.id
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-brown-800 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-card">
          <p className="text-lg text-brown-800 mb-4">
            {searchQuery
              ? `${t('contact.noFaqsFound')} "${searchQuery}"`
              : t('contact.noFaqsCategory')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-accent font-medium hover:underline"
          >
            {t('contact.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}
