import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Add this import
import { api, endpoints } from '../../utils/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactInfo: React.FC = () => {
  const { t } = useTranslation('common'); // Add this hook

  const contactDetails = [
    {
      icon: MapPin,
      title: t('contact.visitShowroom'),
      details: [
        '123 Furniture Street',
        'Design District',
        'City, State 12345'
      ],
      action: t('contact.getDirections'),
      actionLink: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: t('contact.callUs'),
      details: [
        '(555) 123-4567',
        '(555) 123-4568 (Sales)',
        '(555) 123-4569 (Support)'
      ],
      action: 'Call Now',
      actionLink: 'tel:+15551234567'
    },
    {
      icon: Mail,
      title: t('contact.emailUs'),
      details: [
        'info@furnitureco.com',
        'sales@furnitureco.com',
        'support@furnitureco.com'
      ],
      action: 'Send Email',
      actionLink: 'mailto:info@furnitureco.com'
    },
    {
      icon: Clock,
      title: t('contact.storeHours'),
      details: [
        t('footer.mondayFriday'),
        t('footer.weekend'),
        'Sunday: 12PM - 5PM'
      ],
      action: t('contact.scheduleVisit'),
      actionLink: '#'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactDetails.map((detail, index) => {
        const Icon = detail.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-300">
            <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-3">{detail.title}</h3>
            <div className="space-y-1 mb-4">
              {detail.details.map((item, idx) => (
                <p key={idx} className="text-sm text-neutral-600">{item}</p>
              ))}
            </div>
            <a
              href={detail.actionLink}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
            >
              {detail.action}
            </a>
          </div>
        );
      })}
    </div>
  );
};

const ContactForm: React.FC = () => {
  const { t } = useTranslation('common'); // Add this hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const validateForm = () => {
    const newErrors: Partial<ContactForm> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('common.error') + ': Name is required'; // You can add specific error translations
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('common.error') + ': Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.subject) {
      newErrors.subject = t('contact.subject') + ' is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.message') + ' is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.message') + ' must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.post(endpoints.contact, formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
            {t('contact.messageSent')}
          </h3>
          <p className="text-neutral-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-6">{t('contact.sendMessage')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t('contact.fullName')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                errors.name ? 'border-red-300' : 'border-neutral-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t('contact.emailAddress')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                errors.email ? 'border-red-300' : 'border-neutral-300'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t('contact.phoneNumber')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t('contact.subject')} *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                errors.subject ? 'border-red-300' : 'border-neutral-300'
              }`}
            >
              <option value="">Select a subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Product Question">Product Question</option>
              <option value="Custom Order">Custom Order</option>
              <option value="Shipping & Delivery">Shipping & Delivery</option>
              <option value="Returns & Exchanges">Returns & Exchanges</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
            {errors.subject && (
              <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t('contact.message')} *
          </label>
          <textarea
            rows={6}
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none ${
              errors.message ? 'border-red-300' : 'border-neutral-300'
            }`}
            placeholder="Tell us how we can help you..."
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600">
            By submitting this form, you agree to our{' '}
            <a href="/privacy" className="text-primary-600 hover:text-primary-700">
              {t('footer.privacyPolicy')}
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-primary-600 hover:text-primary-700">
              {t('footer.termsOfService')}
            </a>
            . We'll never share your information with third parties.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending Message...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t('contact.sendButton')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const MapSection: React.FC = () => {
  const { t } = useTranslation('common'); // Add this hook

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="aspect-video bg-neutral-200 relative">
        {/* Replace with actual Google Maps embed */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11988.544086733365!2d19.834755531922887!3d41.305904449121265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031c1d9418cfb%3A0xa2e2088da9965781!2sFlladi%20i%20Tuneleve!5e0!3m2!1sen!2s!4v1755091610264!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Furniture Co. Location"
          className="absolute inset-0"
        ></iframe>
        
        {/* Location image overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Flladi i Tuneleve - Beautiful mountain landscape view"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-neutral-900 mb-2">{t('contact.visitShowroom')}</h3>
        <p className="text-neutral-600 mb-4">
          Come see our furniture collections in person. Our showroom features room displays 
          that showcase how our pieces look in real home settings.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.google.com/maps/place/Flladi+i+Tuneleve/@41.305904449121265,19.834755531922887,12z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200"
          >
            {t('contact.getDirections')}
          </a>
          <a
            href="https://www.google.com/maps/place/Flladi+i+Tuneleve/@41.305904449121265,19.834755531922887,12z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-neutral-300 hover:border-primary-300 hover:bg-primary-50 text-neutral-700 hover:text-primary-600 font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200"
          >
            {t('contact.scheduleVisit')}
          </a>
        </div>
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const { t } = useTranslation('common'); // Add this hook

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-accent-50 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              {t('contact.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Free Design Consultation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>24-hour Response Time</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Expert Furniture Advice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Choose the method that works best for you. We're committed to providing 
              excellent customer service across all channels.
            </p>
          </div>
          <ContactInfo />
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <MapSection />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-600">
                Quick answers to common questions about our furniture and services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Do you offer custom furniture?
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Yes! We offer custom furniture solutions. Contact us to discuss 
                    your specific requirements and get a personalized quote.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    What's your delivery timeframe?
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Standard delivery is 3-7 business days for in-stock items. 
                    Custom pieces typically take 4-8 weeks depending on complexity.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Do you offer assembly services?
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Yes, we offer professional assembly services for an additional fee. 
                    Our team can set up your furniture in your preferred location.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    What's your return policy?
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    We offer a 30-day return policy for most items in original condition. 
                    Custom pieces may have different return terms.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Do you have financing options?
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Yes, we offer flexible financing options including 0% APR for 
                    qualified customers. Contact us for more details.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Can I visit your showroom?
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    Absolutely! Our showroom is open 7 days a week. We recommend 
                    scheduling an appointment for personalized service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;