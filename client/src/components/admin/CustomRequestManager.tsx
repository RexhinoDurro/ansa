// client/src/components/admin/CustomRequestManager.tsx
import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  User, 
  Calendar, 
  DollarSign, 
  Palette, 
  MessageSquare, 
  ChevronRight,
  X,
  Check,
  Clock,
  Mail,
  Phone} from 'lucide-react';

interface CustomRequest {
  id: string;
  title: string;
  description: string;
  width: string;
  height: string;
  primary_color: string;
  style: string;
  deadline: string;
  budget: string;
  budget_display: string;
  additional: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
  status: string;
  status_display: string;
  admin_notes: string;
  estimated_price: number | null;
  assigned_to: number | null;
  assigned_to_name: string;
  dimensions_display: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  completed_at: string | null;
}

const CustomRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/admin/custom-requests/', {
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
      const response = await fetch(`http://localhost:8000/api/admin/custom-requests/${requestId}/update_status/`, {
        method: 'POST',
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
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewing': 'bg-blue-100 text-blue-800',
      'quoted': 'bg-purple-100 text-purple-800',
      'approved': 'bg-green-100 text-green-800',
      'in_progress': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
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
          <h2 className="text-2xl font-bold text-gray-900">Custom Requests</h2>
          <p className="text-gray-600 mt-1">Manage customer custom furniture requests</p>
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
            { key: 'pending', label: 'Pending' },
            { key: 'reviewing', label: 'Under Review' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' }
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
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
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
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {request.title}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status_display}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span className="truncate">{request.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(request.created_at)}
                        </span>
                        {request.budget_display && (
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {request.budget_display}
                          </span>
                        )}
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
                      {selectedRequest.title}
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
              <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
                {/* Status and Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status_display}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRequest.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'reviewing')}
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Start Review
                      </button>
                    )}
                    {selectedRequest.status === 'reviewing' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'quoted')}
                        className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors duration-200"
                      >
                        Send Quote
                      </button>
                    )}
                    {selectedRequest.status === 'quoted' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'approved')}
                        className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors duration-200"
                      >
                        Approve
                      </button>
                    )}
                    {selectedRequest.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'in_progress')}
                        className="px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Start Work
                      </button>
                    )}
                    {selectedRequest.status === 'in_progress' && (
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'completed')}
                        className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors duration-200"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{selectedRequest.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a 
                        href={`mailto:${selectedRequest.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {selectedRequest.email}
                      </a>
                    </div>
                    {selectedRequest.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a 
                          href={`tel:${selectedRequest.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedRequest.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{selectedRequest.contact_method}</span>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Project Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <strong>Description:</strong> {selectedRequest.description}
                    </p>
                    
                    {selectedRequest.dimensions_display && (
                      <p className="text-sm text-gray-700">
                        <strong>Dimensions:</strong> {selectedRequest.dimensions_display}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Palette className="w-4 h-4 text-gray-400" />
                      <span>Color: </span>
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: selectedRequest.primary_color }}
                      />
                      <span>{selectedRequest.primary_color}</span>
                    </div>
                    
                    {selectedRequest.style && (
                      <p className="text-sm text-gray-700">
                        <strong>Style:</strong> <span className="capitalize">{selectedRequest.style}</span>
                      </p>
                    )}
                    
                    {selectedRequest.budget_display && (
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>Budget: {selectedRequest.budget_display}</span>
                      </div>
                    )}
                    
                    {selectedRequest.deadline && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Deadline: {new Date(selectedRequest.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {selectedRequest.additional && (
                      <p className="text-sm text-gray-700">
                        <strong>Additional Notes:</strong> {selectedRequest.additional}
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Timeline</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Created: {formatDate(selectedRequest.created_at)}</span>
                    </div>
                    {selectedRequest.reviewed_at && (
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Reviewed: {formatDate(selectedRequest.reviewed_at)}</span>
                      </div>
                    )}
                    {selectedRequest.completed_at && (
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Completed: {formatDate(selectedRequest.completed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedRequest.admin_notes && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Admin Notes</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap">
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
    </div>
  );
};

export default CustomRequestManager;