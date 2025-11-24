import { useState, useEffect } from 'react';
import { Users, Award, Leaf, Heart, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Add this import

const About = () => {
  const { t } = useTranslation('common'); // Add this hook
  const [isVisible, setIsVisible] = useState(false);
  const [] = useState('story');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '10+', label: t('about.stats.yearsExcellence'), icon: Award },
    { number: '5000+', label: t('about.stats.happyCustomers'), icon: Users },
    { number: '100%', label: t('about.stats.sustainableMaterials'), icon: Leaf },
    { number: '50+', label: t('about.stats.masterCraftsmen'), icon: Star }
  ];

  // Replace hardcoded text with t() functions
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-amber-900/5"></div>
        <div className={`container mx-auto px-4 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full text-sm font-medium text-amber-800 mb-6">
              <Heart className="w-4 h-4" />
              <span>{t('about.passionSince')}</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className={`text-center group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-2">{stat.number}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            {t('about.readyTransform')}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t('product.featuredDescription')}
          </p>
          <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <span>{t('about.exploreCollection')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;