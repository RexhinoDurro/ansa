
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import i18n configuration
import './i18n';
import { LanguageProvider } from './contexts/LanguageContext';

// Public components
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact'; 
import CustomRequestPage from './pages/CustomRequestPage';

// Admin components
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './components/admin/Dashboard';
import ProductManager from './components/admin/ProductManager';
import CategoryManager from './components/admin/CategoryManager';
import CustomRequestManager from './components/admin/CustomRequestManager';
import GalleryManager from './components/admin/GalleryManager';
import Gallery from './pages/Gallery';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <Layout>
                  <Home />
                </Layout>
              } />
              <Route path="/catalogue" element={
                <Layout>
                  <Catalogue />
                </Layout>
              } />
              <Route path="/product/:slug" element={
                <Layout>
                  <ProductDetail />
                </Layout>
              } />
              <Route path="/about" element={
                <Layout>
                  <About />
                </Layout>
              } />
              <Route path="/contact" element={
                <Layout>
                  <Contact />
                </Layout>
              } />
               <Route path="/custom-request-page" element={
                <Layout>
                  <CustomRequestPage/>
                </Layout>
              } />
              <Route path="/gallery" element={
                <Layout>
                  <Gallery/>
                </Layout>
              } />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                {/* Default admin route redirects to dashboard */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="orders" element={<CustomRequestManager />} />
                <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p className="text-gray-600 mt-2">Coming Soon</p></div>} />
              </Route>
            </Routes>
          </Router>
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;