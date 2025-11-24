'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown, Search, Filter } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'contact' | 'custom'>('contact');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-cream-100">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="font-serif text-hero text-brown-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-brown-800 max-w-3xl mx-auto leading-relaxed mb-8">
              Have a project in mind? We'd love to hear from you. Reach out to discuss your custom furniture needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-brown-700">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-accent mr-2" />
                <span>Free Design Consultation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-accent mr-2" />
                <span>24-hour Response Time</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-accent mr-2" />
                <span>Expert Furniture Advice</span>
              </div>
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
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                  activeTab === 'custom'
                    ? 'text-accent border-b-2 border-accent bg-white'
                    : 'text-brown-700 hover:text-accent hover:bg-cream-100'
                }`}
              >
                Custom Request
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
  const contactDetails = [
    {
      icon: MapPin,
      title: 'Visit Our Workshop',
      details: ['Rruga e Elbasanit', 'Tirana, Albania'],
      action: 'Get Directions',
      actionLink: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+355 XX XXX XXXX', 'Mon-Sat: 9AM - 6PM'],
      action: 'Call Now',
      actionLink: 'tel:+355XXXXXXXX'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@ansafurniture.al', 'We respond within 24 hours'],
      action: 'Send Email',
      actionLink: 'mailto:info@ansafurniture.al'
    },
    {
      icon: Clock,
      title: 'Workshop Hours',
      details: ['Mon-Fri: 9AM - 6PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed'],
      action: 'Schedule Visit',
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
            className="bg-cream-50 p-6 rounded-card hover:shadow-card transition-all duration-300 border border-cream-200"
          >
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-brown-900 mb-3">{detail.title}</h3>
            <div className="space-y-1 mb-4">
              {detail.details.map((item, idx) => (
                <p key={idx} className="text-sm text-brown-700">{item}</p>
              ))}
            </div>
            <a
              href={detail.actionLink}
              className="text-accent hover:text-accent-dark font-medium text-sm transition-colors duration-200"
            >
              {detail.action} →
            </a>
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
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
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
    <div className="bg-white rounded-card p-8 shadow-card">
      <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-6">Send Us a Message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-brown-900 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white"
            >
              <option value="">Select a subject...</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Project Question">Project Question</option>
              <option value="Custom Furniture">Custom Furniture</option>
              <option value="Pricing & Quote">Pricing & Quote</option>
              <option value="Existing Order">Existing Order</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white resize-none"
            placeholder="Tell us about your inquiry..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </button>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Thank you! We'll get back to you within 24 hours.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            Something went wrong. Please try again or contact us directly.
          </div>
        )}
      </form>
    </div>
  );
}

// ===============================
// CUSTOM REQUEST FORM
// ===============================
function CustomRequestForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images' && value) {
          Array.from(value as FileList).forEach((file) => {
            formDataToSend.append('images', file);
          });
        } else if (value) {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('http://localhost:8000/api/custom-requests/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', room: '', budget: '', message: '', images: null });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
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
      <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">Request Custom Furniture</h2>
      <p className="text-brown-700 mb-6">Tell us about your project and we'll create something perfect for your space.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option value="dining-room">Dining Room</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

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
            <option value="<1000">&lt;€1000</option>
            <option value="1000-3000">€1000–€3000</option>
            <option value="3000-6000">€3000–€6000</option>
            <option value=">6000">&gt;€6000</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white resize-none"
            placeholder="Describe your vision, measurements, style preferences, materials..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-900 mb-2">
            Reference Images (optional)
          </label>
          <input
            type="file"
            name="images"
            onChange={handleChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark"
          />
          <p className="text-sm text-brown-600 mt-1">Upload photos of your space or inspiration images</p>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Request
            </>
          )}
        </button>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Thank you! We'll review your request and contact you within 24 hours.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            Something went wrong. Please try again or contact us directly.
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
  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <div className="aspect-video bg-cream-200 relative">
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

      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-brown-900 mb-2">Visit Our Workshop</h3>
        <p className="text-brown-700 mb-4">
          Come see our craftsmanship in person. Our workshop showcases completed projects and works in progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.google.com/maps/place/Flladi+i+Tuneleve/@41.305904449121265,19.834755531922887,12z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200"
          >
            Get Directions
          </a>
          <a
            href="#"
            className="flex-1 border border-cream-300 hover:border-accent hover:bg-accent/5 text-brown-900 hover:text-accent font-semibold py-3 px-4 rounded-lg text-center transition-all duration-200"
          >
            Schedule Visit
          </a>
        </div>
      </div>
    </div>
  );
}

// ===============================
// FAQ SECTION
// ===============================
function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General' },
    { value: 'process', label: 'Process' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'materials', label: 'Materials' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'warranty', label: 'Warranty' }
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, selectedCategory, searchQuery]);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/faqs/');
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
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-brown-800 max-w-2xl mx-auto">
          Find answers to common questions about our custom furniture services.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brown-600" />
          <input
            type="text"
            placeholder="Search questions..."
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
          <p className="text-brown-800 mt-4">Loading FAQs...</p>
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
              ? `No FAQs found matching "${searchQuery}"`
              : 'No FAQs found in this category'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-accent font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
