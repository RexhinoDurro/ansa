# furniture_backend/api/admin_views.py (Fixed)
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.db import models
from django.db.models import Count, Q, Sum
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from furniture.models import Product, Category, Brand, ProductImage, ContactMessage, ProductReview
from .serializers import (
    ProductCreateUpdateSerializer, ProductDetailSerializer, CategorySerializer,
    ProductImageSerializer, ContactMessageDetailSerializer
)
from .authentication import CsrfExemptSessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class AdminAuthenticationMixin:
    """Mixin for admin-only views with CSRF exemption"""
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

class AdminProductViewSet(AdminAuthenticationMixin, viewsets.ModelViewSet):
    """Admin-only product management"""
    queryset = Product.objects.all().select_related('category', 'subcategory', 'brand').prefetch_related('images')
    serializer_class = ProductCreateUpdateSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Handle image uploads
        images = request.FILES.getlist('images')
        for i, image in enumerate(images):
            ProductImage.objects.create(
                product=product,
                image=image,
                alt_text=f"{product.name} - Image {i+1}",
                is_primary=(i == 0),
                order=i
            )
        
        return Response(
            ProductDetailSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Handle new image uploads
        images = request.FILES.getlist('images')
        if images:
            for i, image in enumerate(images):
                # Get the highest order number for existing images
                max_order = ProductImage.objects.filter(product=product).aggregate(
                    max_order=models.Max('order')
                )['max_order'] or -1
                
                ProductImage.objects.create(
                    product=product,
                    image=image,
                    alt_text=f"{product.name} - Image {max_order + i + 2}",
                    is_primary=False,
                    order=max_order + i + 1
                )

        return Response(
            ProductDetailSerializer(product, context={'request': request}).data
        )

    @action(detail=True, methods=['post'])
    def upload_images(self, request, pk=None):
        """Upload additional images for a product"""
        product = self.get_object()
        images = request.FILES.getlist('images')
        
        if not images:
            return Response({
                'error': 'No images provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        created_images = []
        max_order = ProductImage.objects.filter(product=product).aggregate(
            max_order=models.Max('order')
        )['max_order'] or -1
        
        for i, image in enumerate(images):
            product_image = ProductImage.objects.create(
                product=product,
                image=image,
                alt_text=request.data.get(f'alt_text_{i}', f"{product.name} - Image {max_order + i + 2}"),
                is_primary=False,
                order=max_order + i + 1
            )
            created_images.append(product_image)
        
        serializer = ProductImageSerializer(created_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Delete a specific product image"""
        product = self.get_object()
        image_id = request.data.get('image_id')
        
        try:
            image = ProductImage.objects.get(id=image_id, product=product)
            image.delete()
            return Response({'message': 'Image deleted successfully'})
        except ProductImage.DoesNotExist:
            return Response({
                'error': 'Image not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get product statistics"""
        total_products = Product.objects.count()
        active_products = Product.objects.filter(status='active').count()
        draft_products = Product.objects.filter(status='draft').count()
        low_stock_products = Product.objects.filter(
            track_inventory=True,
            stock_quantity__lte=models.F('min_stock_level')
        ).count()
        
        return Response({
            'total_products': total_products,
            'active_products': active_products,
            'draft_products': draft_products,
            'low_stock_products': low_stock_products,
        })

class AdminCategoryViewSet(AdminAuthenticationMixin, viewsets.ModelViewSet):
    """Admin-only category management"""
    queryset = Category.objects.all().order_by('sort_order', 'name')
    serializer_class = CategorySerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        
        return Response(
            CategorySerializer(category, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get category tree structure"""
        parent_categories = Category.objects.filter(
            parent_category=None, 
            is_active=True
        ).prefetch_related('subcategories')
        
        tree_data = []
        for parent in parent_categories:
            parent_data = CategorySerializer(parent, context={'request': request}).data
            tree_data.append(parent_data)
        
        return Response(tree_data)

    @action(detail=True, methods=['post'])
    def reorder(self, request, pk=None):
        """Reorder categories"""
        category = self.get_object()
        new_order = request.data.get('sort_order')
        
        if new_order is not None:
            category.sort_order = new_order
            category.save()
            return Response({'message': 'Category reordered successfully'})
        
        return Response({
            'error': 'sort_order is required'
        }, status=status.HTTP_400_BAD_REQUEST)

class AdminContactMessageViewSet(AdminAuthenticationMixin, viewsets.ReadOnlyModelViewSet):
    """Admin-only contact message management"""
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageDetailSerializer

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({'message': 'Message marked as read'})

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Reply to contact message"""
        message = self.get_object()
        reply_text = request.data.get('reply_message')
        
        if not reply_text:
            return Response({
                'error': 'Reply message is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        message.reply_message = reply_text
        message.is_replied = True
        message.replied_at = timezone.now()
        message.replied_by = request.user
        message.save()
        
        # Here you could add email sending logic
        
        return Response({'message': 'Reply sent successfully'})

class AdminDashboardStatsView(AdminAuthenticationMixin, APIView):
    """Admin dashboard statistics"""
    
    def get(self, request):
        # Product stats
        total_products = Product.objects.count()
        active_products = Product.objects.filter(status='active').count()
        draft_products = Product.objects.filter(status='draft').count()
        featured_products = Product.objects.filter(featured=True).count()
        
        # Low stock products
        low_stock_products = Product.objects.filter(
            track_inventory=True,
            stock_quantity__lte=models.F('min_stock_level')
        ).count()
        
        # Category stats
        total_categories = Category.objects.count()
        active_categories = Category.objects.filter(is_active=True).count()
        
        # Message stats
        total_messages = ContactMessage.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        
        # Review stats
        total_reviews = ProductReview.objects.count()
        pending_reviews = ProductReview.objects.filter(is_approved=False).count()
        
        # Recent activity
        recent_products = Product.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        recent_messages = ContactMessage.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        return Response({
            'products': {
                'total': total_products,
                'active': active_products,
                'draft': draft_products,
                'featured': featured_products,
                'low_stock': low_stock_products,
                'recent': recent_products
            },
            'categories': {
                'total': total_categories,
                'active': active_categories
            },
            'messages': {
                'total': total_messages,
                'unread': unread_messages,
                'recent': recent_messages
            },
            'reviews': {
                'total': total_reviews,
                'pending': pending_reviews
            }
        })