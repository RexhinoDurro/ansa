import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="h-screen bg-gradient-to-r from-primary-50 to-accent-50 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary-900 mb-6">
              Beautiful Furniture
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Discover our collection of handcrafted furniture pieces that bring 
              elegance and comfort to your home.
            </p>
            <button className="btn-primary text-lg px-8 py-3">
              Shop Now
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="text-center text-neutral-600">
            Featured products will be loaded here...
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
