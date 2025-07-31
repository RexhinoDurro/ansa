# furniture_backend/api/urls.py (Updated)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .authentication import AdminLoginView, AdminLogoutView, AdminProfileView
from .admin_views import (
    AdminProductViewSet, AdminCategoryViewSet, 
    AdminContactMessageViewSet, AdminDashboardStatsView
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'products', AdminProductViewSet, basename='admin-product')
admin_router.register(r'categories', AdminCategoryViewSet, basename='admin-category')
admin_router.register(r'messages', AdminContactMessageViewSet, basename='admin-messages')

urlpatterns = [
    # Public API endpoints
    path('', include(router.urls)),
    
    # Custom public API endpoints
    path('featured-products/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('slider/', views.HomeSliderView.as_view(), name='slider'),
    path('contact/', views.ContactMessageView.as_view(), name='contact'),
    path('filters/', views.FilterOptionsView.as_view(), name='filters'),
    path('newsletter/', views.NewsletterView.as_view(), name='newsletter'),
    
    # Admin authentication endpoints
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/profile/', AdminProfileView.as_view(), name='admin-profile'),
    
    # Admin API endpoints
    path('admin/', include(admin_router.urls)),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    
    # Product detail by slug (keep this last to avoid conflicts)
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
]