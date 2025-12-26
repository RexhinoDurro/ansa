// client/src/components/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Inbox,
  CheckCircle,
  Eye,
  MessageSquare,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  gallery_projects: {
    total: number;
    active: number;
    featured: number;
    recent: number;
  };
  gallery_categories: {
    total: number;
    active: number;
  };
  custom_requests: {
    total: number;
    new: number;
    in_progress: number;
    completed: number;
    recent: number;
  };
  contact_messages: {
    total: number;
    unread: number;
    recent: number;
  };
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<any>;
  color?: string;
}> = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard stats');
      // Set default stats to show something
      setStats({
        gallery_projects: {
          total: 0,
          active: 0,
          featured: 0,
          recent: 0
        },
        gallery_categories: {
          total: 0,
          active: 0
        },
        custom_requests: {
          total: 0,
          new: 0,
          in_progress: 0,
          completed: 0,
          recent: 0
        },
        contact_messages: {
          total: 0,
          unread: 0,
          recent: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded mb-2"></div>
              <div className="h-8 bg-neutral-200 rounded mb-1"></div>
              <div className="h-3 bg-neutral-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-accent to-accent-dark rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to ANSA Studio Dashboard</h1>
        <p className="text-cream-100">
          Manage your custom furniture portfolio, client requests, and showcase your craftsmanship.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Portfolio Projects"
          value={stats?.gallery_projects?.total || 0}
          change={`${stats?.gallery_projects?.recent || 0} added recently`}
          icon={ImageIcon}
          color="primary"
        />
        <StatCard
          title="New Requests"
          value={stats?.custom_requests?.new || 0}
          change={`${stats?.custom_requests?.recent || 0} this week`}
          icon={Inbox}
          color="orange"
        />
        <StatCard
          title="Active Projects"
          value={stats?.gallery_projects?.active || 0}
          change={`${stats?.gallery_projects?.featured || 0} featured`}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Unread Messages"
          value={stats?.contact_messages?.unread || 0}
          change={`${stats?.contact_messages?.recent || 0} this week`}
          icon={MessageSquare}
          color="blue"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brown-900">Featured Projects</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-brown-900 mb-2">{stats?.gallery_projects?.featured || 0}</p>
          <p className="text-sm text-brown-600">Projects showcased on homepage</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brown-900">In Progress</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-2">{stats?.custom_requests?.in_progress || 0}</p>
          <p className="text-sm text-brown-600">Custom requests being worked on</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brown-900">Completed</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">{stats?.custom_requests?.completed || 0}</p>
          <p className="text-sm text-brown-600">Successfully delivered projects</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-brown-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/admin/gallery'}
            className="flex items-center justify-center px-4 py-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors duration-200"
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            Manage Gallery
          </button>
          <button
            onClick={() => window.location.href = '/admin/orders'}
            className="flex items-center justify-center px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors duration-200"
          >
            <Inbox className="w-5 h-5 mr-2" />
            View Requests
          </button>
          <button
            onClick={() => window.location.href = '/admin/'}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Django Admin
          </button>
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Website
          </button>
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Custom Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brown-900">Recent Requests</h3>
            <button
              onClick={() => window.location.href = '/admin/orders'}
              className="text-sm text-accent hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {(stats?.custom_requests?.new ?? 0) > 0 ? (
              <div className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                <p className="text-brown-900 font-medium">{stats?.custom_requests?.new ?? 0} new custom requests</p>
                <p className="text-sm text-brown-600 mt-1">Awaiting your review</p>
              </div>
            ) : (
              <p className="text-brown-600 text-sm">No new requests at the moment</p>
            )}
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brown-900">Portfolio Overview</h3>
            <button
              onClick={() => window.location.href = '/admin/gallery'}
              className="text-sm text-accent hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-brown-700">Total Projects</span>
              <span className="font-semibold text-brown-900">{stats?.gallery_projects?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brown-700">Categories</span>
              <span className="font-semibold text-brown-900">{stats?.gallery_categories?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brown-700">Featured</span>
              <span className="font-semibold text-accent">{stats?.gallery_projects?.featured || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;