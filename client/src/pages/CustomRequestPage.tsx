// client/src/pages/CustomRequestPage.tsx (Complete File)
import React, { useState } from 'react';
import { ChevronDown, X, Palette, Send } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  width: string;
  height: string;
  primary_color: string;
  style: string;
  deadline: string;
  budget: string;
  additional: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
}

const CustomRequestPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    width: '',
    height: '',
    primary_color: '#3b82f6',
    style: '',
    deadline: '',
    budget: '',
    additional: '',
    name: '',
    email: '',
    phone: '',
    contact_method: 'email'
  });

  const [expandedSections, setExpandedSections] = useState({
    project: true,
    specifications: true,
    contact: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.description || !formData.name || !formData.email) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/custom-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Thank you! Your custom request has been submitted. We will contact you soon!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          width: '',
          height: '',
          primary_color: '#3b82f6',
          style: '',
          deadline: '',
          budget: '',
          additional: '',
          name: '',
          email: '',
          phone: '',
          contact_method: 'email'
        });
      } else {
        alert('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting custom request:', error);
      alert('There was an error submitting your request. Please try again.');
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      width: '',
      height: '',
      primary_color: '#3b82f6',
      style: '',
      deadline: '',
      budget: '',
      additional: '',
      name: '',
      email: '',
      phone: '',
      contact_method: 'email'
    });
  };

  const hasFormData = Object.values(formData).some(value => value !== '' && value !== 'email' && value !== '#3b82f6');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-blue-600 transition-colors duration-200">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Custom Request</span>
          </nav>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-4">
            <Palette className="w-10 h-10 text-blue-600" />
            Custom Request
          </h1>
          <p className="text-lg text-gray-600">
            Tell us exactly what you need and we'll create something unique just for you
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Request Overview</h3>
              
              {hasFormData && (
                <button
                  onClick={clearForm}
                  className="w-full mb-4 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  Clear All Fields
                </button>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-600">Project:</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {formData.title || 'Not specified'}
                  </div>
                </div>
                
                {formData.style && (
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <div className="font-medium text-gray-900 mt-1">
                      {formData.style}
                    </div>
                  </div>
                )}
                
                {formData.budget && (
                  <div>
                    <span className="text-gray-600">Budget:</span>
                    <div className="font-medium text-gray-900 mt-1">
                      {formData.budget.replace('-', ' - ').replace('under-', 'Under ').replace('over-', 'Over ')}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600">Color:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: formData.primary_color }}
                    />
                    <span className="font-medium text-gray-900">
                      {formData.primary_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Project Details Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('project')}
                    className="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      expandedSections.project ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.project && (
                    <div className="space-y-6 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Project Title <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="What would you like to call your project?"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Project Description <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe in detail what you want us to create for you..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Additional Requirements
                        </label>
                        <textarea
                          name="additional"
                          value={formData.additional}
                          onChange={handleInputChange}
                          placeholder="Any other specific requirements, features, or notes..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Specifications Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('specifications')}
                    className="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      expandedSections.specifications ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.specifications && (
                    <div className="space-y-6 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Dimensions
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="width"
                            value={formData.width}
                            onChange={handleInputChange}
                            placeholder="Width (e.g., 120cm, 4ft)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <input
                            type="text"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            placeholder="Height (e.g., 80cm, 3ft)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            name="primary_color"
                            value={formData.primary_color}
                            onChange={handleInputChange}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.primary_color}
                            onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                            placeholder="#3b82f6"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Style Preference
                        </label>
                        <select
                          name="style"
                          value={formData.style}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select a style...</option>
                          <option value="modern">Modern</option>
                          <option value="minimal">Minimal</option>
                          <option value="classic">Classic</option>
                          <option value="traditional">Traditional</option>
                          <option value="contemporary">Contemporary</option>
                          <option value="rustic">Rustic</option>
                          <option value="scandinavian">Scandinavian</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Preferred Deadline
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Budget Range
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">Select budget range...</option>
                            <option value="under-500">Under €500</option>
                            <option value="500-1000">€500 - €1,000</option>
                            <option value="1000-2500">€1,000 - €2,500</option>
                            <option value="2500-5000">€2,500 - €5,000</option>
                            <option value="over-5000">Over €5,000</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('contact')}
                    className="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      expandedSections.contact ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.contact && (
                    <div className="space-y-6 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+355 69 123 4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Preferred Contact Method
                        </label>
                        <select
                          name="contact_method"
                          value={formData.contact_method}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="both">Both Email & Phone</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    type="submit"
                    className="w-full lg:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Custom Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRequestPage;