'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const quickLinks = [
    { nameKey: 'navigation.home', path: '/' },
    { nameKey: 'navigation.gallery', path: '/portfolio' },
    { nameKey: 'navigation.about', path: '/services' },
    { nameKey: 'navigation.contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Kitchens', path: '/portfolio' },
    { name: 'Wardrobes', path: '/portfolio' },
    { name: 'Living Rooms', path: '/portfolio' },
    { name: 'Bedrooms', path: '/portfolio' },
    { name: 'Offices', path: '/portfolio' },
    { name: 'Custom Request', path: '/contact' },
  ];

  const features = [
    { icon: Truck, titleKey: 'footer.features.freeShipping', descKey: 'footer.features.freeShippingDesc' },
    { icon: Shield, titleKey: 'footer.features.warranty', descKey: 'footer.features.warrantyDesc' },
    { icon: RotateCcw, titleKey: 'footer.features.returns', descKey: 'footer.features.returnsDesc' },
    { icon: CreditCard, titleKey: 'footer.features.securePayments', descKey: 'footer.features.securePaymentsDesc' },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-gray-400">{t(feature.descKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              {t('footer.newsletter.title')}
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              {t('footer.newsletter.description')}
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500"
              />
              <button className="flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 group">
                {t('footer.newsletter.subscribe')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            <p className="text-xs text-white mt-4">
              {t('footer.newsletter.agreementText')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-3xl font-serif font-bold text-white">
                Ansa Furniture
              </h3>
            </Link>
            <p className="text-white mb-6 leading-relaxed">
              Crafting custom furniture with passion, precision, and commitment to quality since 2015.
              Every piece is made to fit your unique space and style.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="bg-gray-800 hover:bg-accent p-3 rounded-lg transition-colors duration-200 group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-white hover:text-accent transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {t(link.nameKey)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">{t('footer.categories')}</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.path}
                    className="text-white hover:text-accent transition-colors duration-200 flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">{t('footer.getInTouch')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">
                    Rruga e Elbasanit<br />
                    Tirana<br />
                    Albania
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="tel:+355XXXXXXXX"
                  className="text-white hover:text-accent transition-colors duration-200"
                >
                  +355 XX XXX XXXX
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:info@ansafurniture.al"
                  className="text-white hover:text-accent transition-colors duration-200"
                >
                  info@ansafurniture.al
                </a>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div className="text-white">
                  <p className="font-medium text-white mb-1">{t('footer.storeHours')}</p>
                  <p className="text-sm">{t('footer.mondayFriday')}</p>
                  <p className="text-sm">{t('footer.weekend')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white text-sm">
                © {currentYear} Ansa Furniture. {t('footer.allRightsReserved')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-white hover:text-accent transition-colors duration-200"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                href="/terms"
                className="text-white hover:text-accent transition-colors duration-200"
              >
                {t('footer.termsOfService')}
              </Link>
              <Link
                href="/cookies"
                className="text-white hover:text-accent transition-colors duration-200"
              >
                {t('footer.cookiePolicy')}
              </Link>
              <Link
                href="/sitemap"
                className="text-white hover:text-accent transition-colors duration-200"
              >
                {t('footer.sitemap')}
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm mr-2">{t('footer.weAccept')}</span>
              <div className="flex space-x-2 opacity-60">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div className="w-8 h-5 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;