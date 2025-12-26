'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Info, Images, Mail, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavItem {
  nameKey: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation('common');

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    { nameKey: 'navigation.home', path: '/', icon: Home },
    { nameKey: 'navigation.gallery', path: '/portfolio', icon: Images },
    { nameKey: 'navigation.about', path: '/services', icon: Info },
    { nameKey: 'navigation.contact', path: '/contact', icon: Mail },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Pill Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden lg:block w-full max-w-7xl px-4">
        {/* Outer Pill Container */}
        <div className="bg-gradient-to-r from-amber-900/20 via-stone-800/20 to-amber-900/20 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl shadow-black/20 px-6 py-3">
          <div className="flex items-center justify-between gap-8">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-200 pl-2"
            >
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="h-10 w-auto"
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                  S
                </div>
              )}
            </Link>

            {/* Inner Pill - Navigation Links */}
            <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 px-2 py-2 shadow-lg">
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 group ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg shadow-white/10'
                          : 'text-white/70 hover:text-white/95 hover:bg-white/5'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`transition-colors duration-300 ${
                          isActive ? 'text-blue-400' : 'text-white/60 group-hover:text-white/90'
                        }`}
                      />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {t(item.nameKey)}
                      </span>

                      {/* Active glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm -z-10" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Language Switcher */}
            <div className="pr-2">
              <LanguageSwitcher isLightBackground={false} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[calc(100%-2rem)] max-w-2xl">
        <div className="bg-gradient-to-r from-amber-900/20 via-stone-800/20 to-amber-900/20 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl shadow-black/20 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-9 w-auto"
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
              )}
            </Link>

            {/* Right side - Language Switcher + Menu */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher isLightBackground={false} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-96 mt-4' : 'max-h-0'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-3 shadow-lg">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg shadow-white/10'
                          : 'text-white/70 hover:text-white/95 hover:bg-white/5'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`transition-colors duration-300 ${
                          isActive ? 'text-blue-400' : 'text-white/60'
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {t(item.nameKey)}
                      </span>

                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm -z-10" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;