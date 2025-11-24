'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems: Array<{ name: string; path: string; isSection?: boolean }> = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.catalogue'), path: '/catalogue' },
    { name: t('navigation.about'), path: '/about', isSection: true },
    { name: t('navigation.contact'), path: '/contact' },
    { name: t('navigation.gallery'), path: '/gallery' },
    { name: t('navigation.custom'), path: '/custom-request-page' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname === '/') {
      // Already on homepage, just scroll
      const section = document.getElementById('about-us');
      if (section) {
        const navbarHeight = 80; // Approximate navbar height
        const sectionTop = section.offsetTop - navbarHeight;
        window.scrollTo({
          top: sectionTop,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to homepage first, then scroll
      router.push('/#about-us');
      setTimeout(() => {
        const section = document.getElementById('about-us');
        if (section) {
          const navbarHeight = 80;
          const sectionTop = section.offsetTop - navbarHeight;
          window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
  scrolled
    ? 'transparent backdrop-blur-lg shadow-sm border-b border-neutral-200/30'
    : 'transparent border-b border-white/10'
}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl lg:text-3xl font-serif font-bold text-primary-700 hover:text-primary-800 transition-colors duration-200"
          >
            Furniture Ansa
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={item.isSection ? handleAboutClick : undefined}
                className={`relative font-medium transition-all duration-200 hover:text-primary-600 ${
                    isActivePath(item.path)
                      ? 'text-primary-600'
                      : 'text-neutral-700'
                } group`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full ${
                  isActivePath(item.path) ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                scrolled ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 pb-4' : 'max-h-0'
        }`}>
          <div className="border-t border-neutral-200/20 pt-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={item.isSection ? handleAboutClick : undefined}
                  className={`font-medium transition-colors duration-200 hover:text-primary-600 ${
                      isActivePath(item.path)
                        ? 'text-primary-600'
                        : 'text-neutral-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;