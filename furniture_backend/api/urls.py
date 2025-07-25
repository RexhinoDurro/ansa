from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    # ViewSet URLs
    path('', include(router.urls)),
    
    # Custom API endpoints
    path('featured-products/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('slider/', views.HomeSliderView.as_view(), name='slider'),
    path('contact/', views.ContactMessageView.as_view(), name='contact'),
    path('filters/', views.FilterOptionsView.as_view(), name='filters'),
    path('newsletter/', views.NewsletterView.as_view(), name='newsletter'),
    
    # Admin dashboard endpoints
    path('admin-stats/', views.AdminStatsView.as_view(), name='admin-stats'),
    
    # Product detail by slug
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
]