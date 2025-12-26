// client/src/components/admin/ContactManager.tsx
import React, { useState, useEffect } from 'react';
import {
  Mail,
  User,
  Calendar,
  MessageSquare,
  ChevronRight,
  X,
  Phone,
  Tag
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  subject_display: string;
  message: string;
  status: string;
  status_display: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

const ContactManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/messages/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.results || data || []);
      } else {
        throw new Error('Failed to fetch contact messages');
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setError('Failed to load contact messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchMessages();
        if (selectedMessage && selectedMessage.id === messageId) {
          const updatedMessage = messages.find(m => m.id === messageId);
          if (updatedMessage) {
            setSelectedMessage({ ...updatedMessage, status: newStatus });
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

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
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
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600 mt-1">Manage customer inquiries and contact form submissions</p>
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
            { key: 'all', label: 'All Messages' },
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
                ({tab.key === 'all' ? messages.length : messages.filter(m => m.status === tab.key).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Messages ({filteredMessages.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? 'No contact messages have been submitted yet.'
                    : `No messages with status "${filter}".`
                  }
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {message.name}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status_display}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Tag className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="font-medium">{message.subject_display || message.subject}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {message.message.substring(0, 80)}...
                        </p>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {selectedMessage ? (
            <div>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedMessage.subject_display || selectedMessage.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Message ID: {selectedMessage.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status_display}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedMessage.status === 'new' && (
                      <button
                        onClick={() => updateStatus(selectedMessage.id, 'in_progress')}
                        className="px-3 py-2 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition-colors duration-200"
                      >
                        Start Processing
                      </button>
                    )}
                    {selectedMessage.status === 'in_progress' && (
                      <button
                        onClick={() => updateStatus(selectedMessage.id, 'done')}
                        className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors duration-200"
                      >
                        Mark as Done
                      </button>
                    )}
                    {selectedMessage.status === 'done' && (
                      <button
                        onClick={() => updateStatus(selectedMessage.id, 'new')}
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
                      <span className="font-medium text-gray-900">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Message Details</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600 mb-1">Subject</p>
                      <p className="text-sm font-medium text-gray-900">{selectedMessage.subject_display || selectedMessage.subject}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600 mb-1">Message</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{formatDate(selectedMessage.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">{formatDate(selectedMessage.updated_at)}</span>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedMessage.admin_notes && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Admin Notes</h4>
                    <div className="bg-yellow-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap border border-yellow-200">
                      {selectedMessage.admin_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
              <p className="text-gray-600">
                Choose a contact message from the list to view details and manage it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
