import React, { useState, useEffect } from 'react';
import { Users, Award, Leaf, Heart, ArrowRight, Star } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '10+', label: 'Years of Excellence', icon: Award },
    { number: '5000+', label: 'Happy Customers', icon: Users },
    { number: '100%', label: 'Sustainable Materials', icon: Leaf },
    { number: '50+', label: 'Master Craftsmen', icon: Star }
  ];

  const values = [
    {
      title: 'Craftsmanship',
      description: 'Every piece is meticulously handcrafted by our skilled artisans who have perfected their craft over decades.',
      gradient: 'from-amber-400 to-orange-600'
    },
    {
      title: 'Sustainability',
      description: 'We source only the finest sustainable materials, ensuring our furniture is as kind to the planet as it is beautiful.',
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      title: 'Innovation',
      description: 'Blending traditional techniques with modern design principles to create timeless pieces for contemporary living.',
      gradient: 'from-blue-400 to-indigo-600'
    }
  ];

  const tabs = [
    { id: 'story', label: 'Our Story' },
    { id: 'mission', label: 'Our Mission' },
    { id: 'team', label: 'Our Team' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 to-amber-900/5"></div>
        <div className={`container mx-auto px-4 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full text-sm font-medium text-amber-800 mb-6">
              <Heart className="w-4 h-4" />
              <span>Crafted with passion since 2014</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              About Furniture Ansa
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Where timeless craftsmanship meets modern innovation, creating furniture that tells your story and transforms your space into something extraordinary.
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

      {/* Main Content with Tabs */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-200/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md' 
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/50">
              {activeTab === 'story' && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">Our Journey</h2>
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <p className="text-lg text-slate-700 leading-relaxed">
                        Founded in 2014 with a simple vision: to create furniture that doesn't just fill a space, but transforms it into something meaningful. What started as a small workshop has grown into a renowned furniture house, but our core values remain unchanged.
                      </p>
                      <p className="text-lg text-slate-700 leading-relaxed">
                        Every piece tells a story of dedication, where traditional woodworking techniques meet contemporary design sensibilities. We believe that great furniture should be an investment in your life, not just your home.
                      </p>
                    </div>
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl flex items-center justify-center">
                        <div className="text-6xl">🪑</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mission' && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">Our Mission</h2>
                  <p className="text-xl text-slate-700 leading-relaxed mb-8">
                    To create exceptional furniture that enhances lives, respects our planet, and preserves the art of traditional craftsmanship for future generations.
                  </p>
                  <div className="grid md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                      <div key={value.title} className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <div className={`h-2 bg-gradient-to-r ${value.gradient}`}></div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">{value.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{value.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">Master Craftsmen</h2>
                  <p className="text-lg text-slate-700 leading-relaxed mb-8">
                    Our team consists of over 50 skilled artisans, each bringing decades of experience and an unwavering commitment to excellence. From our master woodworkers to our design specialists, every team member contributes to the magic that makes Furniture Ansa special.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Experienced Artisans</h3>
                          <p className="text-slate-600">Average 15+ years of woodworking experience</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">Award-Winning Designers</h3>
                          <p className="text-slate-600">Recognized for innovation and sustainability</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-slate-100 to-amber-100 rounded-2xl flex items-center justify-center">
                        <div className="text-4xl">👥</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover our collection of handcrafted furniture and let us help you create the home of your dreams.
          </p>
          <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <span>Explore Our Collection</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
