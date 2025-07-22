import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Furniture Co.</h3>
            <p className="text-neutral-300">
              Quality furniture for your home and office.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/catalogue" className="hover:text-white">Catalogue</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="/catalogue?category=chairs" className="hover:text-white">Chairs</a></li>
              <li><a href="/catalogue?category=tables" className="hover:text-white">Tables</a></li>
              <li><a href="/catalogue?category=sofas" className="hover:text-white">Sofas</a></li>
              <li><a href="/catalogue?category=storage" className="hover:text-white">Storage</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-neutral-300">
              <p>123 Furniture Street</p>
              <p>City, State 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@furnitureco.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 Furniture Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
