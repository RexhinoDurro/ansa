// client/src/components/admin/TestimonialManager.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Star, Eye, EyeOff } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  text: string;
  rating: number;
  location?: string;
  project_title?: string;
  project?: number;
  is_featured: boolean;
  created_at: string;
}

interface GalleryProject {
  id: number;
  title: string;
}

const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    text: '',
    rating: 5,
    location: '',
    project: '',
    is_featured: false
  });

  useEffect(() => {
    fetchTestimonials();
    fetchProjects();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/testimonials/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.results || data || []);
      } else {
        throw new Error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials');
      setTestimonials([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/gallery-projects/', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.results || data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = editingTestimonial
        ? `http://localhost:8000/api/admin/testimonials/${editingTestimonial.id}/`
        : 'http://localhost:8000/api/admin/testimonials/';

      const method = editingTestimonial ? 'PATCH' : 'POST';

      const submitData = {
        client_name: formData.client_name,
        text: formData.text,
        rating: formData.rating,
        location: formData.location || null,
        project: formData.project ? parseInt(formData.project) : null,
        is_featured: formData.is_featured
      };

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        await fetchTestimonials();
        closeModal();
        alert(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        setError('Error saving testimonial. Please check the form.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      text: testimonial.text,
      rating: testimonial.rating,
      location: testimonial.location || '',
      project: testimonial.project ? testimonial.project.toString() : '',
      is_featured: testimonial.is_featured
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/testimonials/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchTestimonials();
        alert('Testimonial deleted successfully!');
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial');
    }
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/testimonials/${testimonial.id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_featured: !testimonial.is_featured })
      });

      if (response.ok) {
        await fetchTestimonials();
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      text: '',
      rating: 5,
      location: '',
      project: '',
      is_featured: false
    });
    setError(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600 mt-1">Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">No testimonials found. Add your first testimonial!</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 relative"
            >
              {/* Featured Badge */}
              {testimonial.is_featured && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                    Featured
                  </span>
                </div>
              )}

              {/* Rating */}
              <div className="mb-3">
                {renderStars(testimonial.rating)}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Client Info */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="font-semibold text-gray-900">{testimonial.client_name}</p>
                {testimonial.location && (
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                )}
                {testimonial.project_title && (
                  <p className="text-sm text-blue-600 mt-1">{testimonial.project_title}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleFeatured(testimonial)}
                  className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                    testimonial.is_featured
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {testimonial.is_featured ? 'Remove from Featured' : 'Feature'}
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Maria & Andrea"
                  />
                </div>

                {/* Testimonial Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonial *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What did the client say about your work?"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating *
                  </label>
                  <select
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Tirana, Durres"
                  />
                </div>

                {/* Link to Project */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link to Project (optional)
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No project linked</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Link this testimonial to a portfolio project</p>
                </div>

                {/* Is Featured */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Feature this testimonial on homepage
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : (editingTestimonial ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManager;
