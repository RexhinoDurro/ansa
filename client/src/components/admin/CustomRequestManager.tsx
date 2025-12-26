// client/src/components/admin/CustomRequestManager.tsx
import React, { useState, useEffect } from 'react';
import {
  Eye,
  User,
  Calendar,
  MessageSquare,
  ChevronRight,
  X,
  Mail,
  Phone,
  Image as ImageIcon
} from 'lucide-react';

interface ContactImage {
  id: number;
  image: string;
  alt_text: string;
  created_at: string;
}

interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  room_type: string;
  room_type_display: string;
  budget_range: string;
  budget_display: string;
  message: string;
  status: string;
  status_display: string;
  admin_notes: string;
  images: ContactImage[];
  created_at: string;
  updated_at: string;
}

const CustomRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/custom-requests/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.results || data || []);
      } else {
        throw new Error('Failed to fetch custom requests');
      }
    } catch (error) {
      console.error('Error fetching custom requests:', error);
      setError('Failed to load custom requests');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/custom-requests/${requestId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchRequests();
        if (selectedRequest && selectedRequest.id === requestId) {
          const updatedRequest = requests.find(r => r.id === requestId);
          if (updatedRequest) {
            setSelectedRequest({ ...updatedRequest, status: newStatus });
          }
        }
        alert('Status updated successfully!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'done': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Furniture Requests</h2>
          <p className="text-gray-600 mt-1">Manage customer custom furniture inquiries</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'All Requests' },
            { key: 'new', label: 'New' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'done', label: 'Done' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs">
                ({tab.key === 'all' ? requests.length : requests.filter(r => r.status === tab.key).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Requests ({filteredRequests.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? 'No custom requests have been submitted yet.'
                    : `No requests with status "${filter}".`
                  }
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedRequest?.id === request.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {request.name}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status_display}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{request.room_type_display}</span>
                          {request.budget_display && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{request.budget_display}</span>
                            </>
                          )}
                        </div>
                        {request.images && request.images.length > 0 && (
                          <div className="flex items-center text-blue-600">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            <span>{request.images.length} image{request.images.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(request.created_at)}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {selectedRequest ? (
            <div>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedRequest.room_type_display} Project
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Request ID: {selectedRequest.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
                {/* Status and Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status_display}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedRequest.status === 'new' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'in_progress')}
                        className="px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition-colors duration-200"
                      >
                        Start Processing
                      </button>
                    )}
                    {selectedRequest.status === 'in_progress' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'done')}
                        className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors duration-200"
                      >
                        Mark as Done
                      </button>
                    )}
                    {selectedRequest.status === 'done' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'new')}
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">{selectedRequest.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {selectedRequest.email}
                      </a>
                    </div>
                    {selectedRequest.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <a
                          href={`tel:${selectedRequest.phone}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {selectedRequest.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Project Details</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600 mb-1">Room Type</p>
                      <p className="text-sm font-medium text-gray-900">{selectedRequest.room_type_display}</p>
                    </div>

                    {selectedRequest.budget_display && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-gray-600 mb-1">Budget Range</p>
                        <p className="text-sm font-medium text-gray-900">{selectedRequest.budget_display}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600 mb-1">Message</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedRequest.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inspiration Images */}
                {selectedRequest.images && selectedRequest.images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Inspiration Photos ({selectedRequest.images.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedRequest.images.map((image) => (
                        <div
                          key={image.id}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity duration-200 group"
                          onClick={() => setLightboxImage(image.image)}
                        >
                          <img
                            src={image.image}
                            alt={image.alt_text || 'Inspiration image'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{formatDate(selectedRequest.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">{formatDate(selectedRequest.updated_at)}</span>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedRequest.admin_notes && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Admin Notes</h4>
                    <div className="bg-yellow-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap border border-yellow-200">
                      {selectedRequest.admin_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a request</h3>
              <p className="text-gray-600">
                Choose a custom request from the list to view details and manage it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default CustomRequestManager;
