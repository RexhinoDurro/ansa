import React from 'react';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">About Us</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-neutral-600 mb-6">
            Welcome to Furniture Co., where craftsmanship meets modern design. 
            For over 30 years, we have been creating beautiful, functional furniture 
            that transforms houses into homes.
          </p>
          <p className="text-lg text-neutral-600">
            Our commitment to quality, sustainability, and customer satisfaction 
            drives everything we do. Each piece is carefully crafted by skilled 
            artisans using the finest materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
