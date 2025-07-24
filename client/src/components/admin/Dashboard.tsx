import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Mail,
  Bell,
  Settings,
  LogOut,
  Home,
  Grid,
  MessageSquare
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

// Types for admin data
interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  recentOrders: any[];
  topProducts: any[];
  lowStockProducts: any[];
}

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-neutral-900 text-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <h1 className="text-2xl font-serif font-bold">Furniture Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-neutral-800 transition-colors duration-200 ${
                activeSection === item.id ? 'bg-primary-600 hover:bg-primary-700' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-700">
        <button className="w-full flex items-center px-3 py-2 text-neutral-300 hover:text-white transition-colors duration-200">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

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

const DashboardSection: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalProducts: 247,
    totalOrders: 1543,
    totalCustomers: 892,
    totalRevenue: 125480,
    monthlyRevenue: [12000, 15000, 18000, 22000, 19000, 25000],
    recentOrders: [
      { id: '#ORD-001', customer: 'John Doe', amount: 1299, status: 'completed', date: '2024-01-15' },
      { id: '#ORD-002', customer: 'Jane Smith', amount: 899, status: 'processing', date: '2024-01-15' },
      { id: '#ORD-003', customer: 'Mike Johnson', amount: 2199, status: 'shipped', date: '2024-01-14' },
    ],
    topProducts: [
      { name: 'Modern Dining Table', sales: 45, revenue: 13455 },
      { name: 'Comfort Lounge Chair', sales: 38, revenue: 11400 },
      { name: 'Oak Coffee Table', sales: 32, revenue: 9600 },
    ],
    lowStockProducts: [
      { name: 'Vintage Armchair', stock: 3, minStock: 10 },
      { name: 'Glass Side Table', stock: 5, minStock: 15 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change="+5% from last month"
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+12% from last month"
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          change="+8% from last month"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+15% from last month"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-neutral-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-neutral-600">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">Low Stock Alert</h3>
          <div className="space-y-2">
            {stats.lowStockProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-orange-700">{product.name}</span>
                <span className="text-orange-600 font-medium">
                  {product.stock} remaining (min: {product.minStock})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Modern Dining Table',
      category: 'Tables',
      price: 299,
      stock: 15,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Comfort Lounge Chair',
      category: 'Chairs',
      price: 399,
      stock: 8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Oak Coffee Table',
      category: 'Tables',
      price: 199,
      stock: 3,
      status: 'low_stock',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Products</h2>
        <button className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option value="tables">Tables</option>
          <option value="chairs">Chairs</option>
          <option value="sofas">Sofas</option>
          <option value="storage">Storage</option>
        </select>
        <button className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Stock</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-600">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-900">{product.category}</td>
                  <td className="px-6 py-4 text-neutral-900">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' :
                      product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {product.status === 'active' ? 'Active' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing 1 to 3 of 247 products
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
            Previous
          </button>
          <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">1</button>
          <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
            2
          </button>
          <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
            3
          </button>
          <button className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersSection: React.FC = () => {
  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 1299,
      status: 'completed',
      date: '2024-01-15',
      items: 3
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 899,
      status: 'processing',
      date: '2024-01-15',
      items: 2
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      total: 2199,
      status: 'shipped',
      date: '2024-01-14',
      items: 5
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Orders</h2>
        <button className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Items</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">{order.customer}</p>
                      <p className="text-sm text-neutral-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-900">{order.items} items</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-900">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'products':
        return <ProductsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'customers':
        return <div>Customers section coming soon...</div>;
      case 'messages':
        return <div>Messages section coming soon...</div>;
      case 'settings':
        return <div>Settings section coming soon...</div>;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 capitalize">
                {activeSection}
              </h1>
              <p className="text-neutral-600">
                Welcome back! Here's what's happening with your furniture business.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;