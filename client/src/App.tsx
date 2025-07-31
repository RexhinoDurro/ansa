// client/src/App.tsx (Updated to include admin routes)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Public components
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin components
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './components/admin/Dashboard';
import ProductManager from './components/admin/ProductManager';
import CategoryManager from './components/admin/CategoryManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin onLogin={() => {}} />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="categories" element={<CategoryManager />} />
              <Route path="orders" element={<div>Orders Management (Coming Soon)</div>} />
              <Route path="customers" element={<div>Customer Management (Coming Soon)</div>} />
              <Route path="messages" element={<div>Message Management (Coming Soon)</div>} />
              <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
            </Route>
          </Routes>
        </Router>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;