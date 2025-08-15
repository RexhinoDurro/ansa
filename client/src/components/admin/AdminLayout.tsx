// client/src/components/admin/AdminLayout.tsx (Complete File)
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Home,
  Grid,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
    { id: 'categories', label: 'Categories', icon: Grid, path: '/admin/categories' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, path: '/admin/gallery' }, //
    { id: 'orders', label: 'Custom Requests', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700">
          <Link to="/admin/dashboard" className="text-2xl font-serif font-bold">
            Furniture Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-left hover:bg-neutral-800 transition-colors duration-200 ${
                  isActive ? 'bg-primary-600 hover:bg-primary-700 border-r-4 border-primary-400' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.first_name || user?.username}</p>
              <p className="text-sm text-neutral-400">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 mr-4"
            >
              <Menu size={20} />
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                {menuItems.find(item => isActivePath(item.path))?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-neutral-600">
                Manage your furniture store
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              target="_blank"
              className="flex items-center px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              View Store
            </Link>
            
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;