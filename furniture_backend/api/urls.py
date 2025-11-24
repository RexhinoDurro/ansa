# furniture_backend/api/urls.py (Simplified)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .authentication import AdminLoginView, AdminLogoutView, AdminProfileView, CSRFTokenView
from .admin_views import (
    AdminContactMessageViewSet, AdminDashboardStatsView,
    AdminCustomRequestViewSet, AdminServiceViewSet,
    AdminMaterialViewSet, AdminTestimonialViewSet, AdminFAQViewSet,
    AdminGalleryCategoryViewSet, AdminGalleryProjectViewSet, AdminGalleryImageViewSet
)

from .views import GalleryCategoryViewSet, GalleryProjectViewSet, FeaturedGalleryProjectsView

# Public router for ViewSets
router = DefaultRouter()
router.register(r'gallery-categories', GalleryCategoryViewSet, basename='gallery-category')
router.register(r'gallery-projects', GalleryProjectViewSet, basename='gallery-project')
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'materials', views.MaterialViewSet, basename='material')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonial')
router.register(r'faqs', views.FAQViewSet, basename='faq')

# Admin router
admin_router = DefaultRouter()
admin_router.register(r'messages', AdminContactMessageViewSet, basename='admin-messages')
admin_router.register(r'custom-requests', AdminCustomRequestViewSet, basename='admin-custom-requests')
admin_router.register(r'gallery-categories', AdminGalleryCategoryViewSet, basename='admin-gallery-category')
admin_router.register(r'gallery-projects', AdminGalleryProjectViewSet, basename='admin-gallery-project')
admin_router.register(r'gallery-images', AdminGalleryImageViewSet, basename='admin-gallery-image')
admin_router.register(r'services', AdminServiceViewSet, basename='admin-service')
admin_router.register(r'materials', AdminMaterialViewSet, basename='admin-material')
admin_router.register(r'testimonials', AdminTestimonialViewSet, basename='admin-testimonial')
admin_router.register(r'faqs', AdminFAQViewSet, basename='admin-faq')

urlpatterns = [
    # Public API endpoints
    path('', include(router.urls)),

    # Custom public API endpoints
    path('contact/', views.ContactMessageView.as_view(), name='contact'),
    path('custom-request/', views.CustomRequestView.as_view(), name='custom-request'),
    path('featured-gallery/', FeaturedGalleryProjectsView.as_view(), name='featured-gallery'),

    # CSRF token endpoint
    path('csrf-token/', CSRFTokenView.as_view(), name='csrf-token'),

    # Admin authentication endpoints
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/profile/', AdminProfileView.as_view(), name='admin-profile'),

    # Admin API endpoints
    path('admin/', include(admin_router.urls)),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
]
