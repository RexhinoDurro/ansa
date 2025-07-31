// client/src/components/admin/AdminDashboard.tsx (Updated to use new structure)
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  MessageSquare,
  Star
} from 'lucide-react';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    draft: number;
    featured: number;
    low_stock: number;
    recent: number;
  };
  categories: {
    total: number;
    active: number;
  };
  messages: {
    total: number;
    unread: number;
    recent: number;
  };
  reviews: {
    total: number;
    pending: number;
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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/stats/', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
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

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h1>
        <p className="text-primary-100">
          Here's what's happening with your furniture store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.products.total}
          change={`${stats.products.recent} added this week`}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Active Products"
          value={stats.products.active}
          change={`${stats.products.draft} in draft`}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Categories"
          value={stats.categories.total}
          change={`${stats.categories.active} active`}
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="Unread Messages"
          value={stats.messages.unread}
          change={`${stats.messages.recent} this week`}
          icon={MessageSquare}
          color="orange"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Featured Products</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{stats.products.featured}</p>
          <p className="text-sm text-neutral-600">Products marked as featured</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Low Stock Alert</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600 mb-2">{stats.products.low_stock}</p>
          <p className="text-sm text-neutral-600">Products running low</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Pending Reviews</h3>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-2">{stats.reviews.pending}</p>
          <p className="text-sm text-neutral-600">Reviews awaiting approval</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center px-4 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors duration-200">
            <Package className="w-5 h-5 mr-2" />
            Add Product
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200">
            <BarChart3 className="w-5 h-5 mr-2" />
            Add Category
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200">
            <MessageSquare className="w-5 h-5 mr-2" />
            View Messages
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors duration-200">
            <Eye className="w-5 h-5 mr-2" />
            View Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;