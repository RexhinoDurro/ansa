'use client';

import React, { useState } from 'react';
import { Send, Upload, X } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  room_type: string;
  budget_range: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    room_type: 'kitchen',
    budget_range: '',
    message: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('room_type', formData.room_type);
      formDataToSend.append('budget_range', formData.budget_range);
      formDataToSend.append('message', formData.message);

      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('http://localhost:8000/api/custom-request/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          room_type: 'kitchen',
          budget_range: '',
          message: ''
        });
        setImages([]);
      } else {
        const errorData = await response.json();
        setErrorMessage(JSON.stringify(errorData));
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Network error. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-serif text-section text-brown-900 mb-4">
            Request a Custom Design
          </h2>
          <p className="text-lg text-brown-800 max-w-2xl mx-auto">
            Tell us about your project – we'll get back to you as soon as possible
            with ideas and a quote.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-cream-50 rounded-card p-8 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-brown-900 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brown-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-brown-900 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                />
              </div>

              {/* Room Type */}
              <div>
                <label htmlFor="room_type" className="block text-sm font-semibold text-brown-900 mb-2">
                  What room? *
                </label>
                <select
                  id="room_type"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                >
                  <option value="kitchen">Kitchen</option>
                  <option value="living_room">Living room</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="wardrobe">Wardrobe</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="md:col-span-2">
                <label htmlFor="budget_range" className="block text-sm font-semibold text-brown-900 mb-2">
                  Budget range
                </label>
                <select
                  id="budget_range"
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300"
                >
                  <option value="">Prefer not to say</option>
                  <option value="under-1000">Under €1,000</option>
                  <option value="1000-3000">€1,000 - €3,000</option>
                  <option value="3000-6000">€3,000 - €6,000</option>
                  <option value="over-6000">Over €6,000</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-brown-900 mb-2">
                Tell us about your project *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-cream-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 resize-none"
                placeholder="Describe your space, style preferences, specific requirements..."
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-brown-900 mb-2">
                Inspiration Photos (optional, max 5)
              </label>
              <div className="border-2 border-dashed border-cream-300 rounded-lg p-6 text-center hover:border-accent transition-colors duration-300">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="images"
                  className={`cursor-pointer ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-brown-800">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-sm text-brown-700 mt-1">
                    PNG, JPG up to 10MB ({images.length}/5)
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                Thank you! Your request has been submitted. We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {errorMessage || 'Something went wrong. Please try again.'}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Request
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
