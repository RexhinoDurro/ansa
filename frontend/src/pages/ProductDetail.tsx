import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Product Detail</h1>
        <div className="text-center text-neutral-600">
          Product detail for "{slug}" will be implemented here...
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
