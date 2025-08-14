# furniture_backend/api/admin_views.py (Fixed)
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django.db import models
from django.db.models import Count, Q, Sum
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime, timedelta
import uuid
import json

from furniture.models import CustomRequest
from .serializers import AdminCustomRequestSerializer

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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        print("=== CREATE PRODUCT DEBUG ===")
        print("Request data:", request.data)
        print("Request files:", request.FILES)
        
        try:
            # Extract data
            data = request.data.copy()
            images = request.FILES.getlist('images')
            
            print("Extracted data:", data)
            print("Images count:", len(images))
            
            # Validate required fields
            required_fields = ['name', 'description', 'price', 'category']
            missing_fields = []
            for field in required_fields:
                if not data.get(field):
                    missing_fields.append(field)
            
            if missing_fields:
                return Response(
                    {'error': f'Missing required fields: {", ".join(missing_fields)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Convert string values to proper types
            try:
                if data.get('price'):
                    data['price'] = float(data['price'])
                if data.get('sale_price'):
                    data['sale_price'] = float(data['sale_price'])
                if data.get('stock_quantity'):
                    data['stock_quantity'] = int(data['stock_quantity'])
                if data.get('featured'):
                    data['featured'] = data['featured'].lower() in ['true', '1', 'on']
            except (ValueError, TypeError) as e:
                return Response(
                    {'error': f'Invalid data format: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate category exists
            try:
                category = Category.objects.get(id=data['category'])
                print(f"Found category: {category.name}")
            except Category.DoesNotExist:
                return Response(
                    {'error': 'Selected category does not exist'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate subcategory if provided
            if data.get('subcategory'):
                try:
                    subcategory = Category.objects.get(id=data['subcategory'])
                    if subcategory.parent_category != category:
                        return Response(
                            {'error': 'Subcategory must belong to the selected category'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Category.DoesNotExist:
                    return Response(
                        {'error': 'Selected subcategory does not exist'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Create product
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                product = serializer.save()
                print(f"Created product: {product.name}")
                
                # Handle image uploads
                for i, image in enumerate(images):
                    ProductImage.objects.create(
                        product=product,
                        image=image,
                        alt_text=f"{product.name} - Image {i+1}",
                        is_primary=(i == 0),
                        order=i
                    )
                    print(f"Created image {i+1} for product")
                
                # Return the created product
                response_serializer = ProductDetailSerializer(product, context={'request': request})
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Extract data
        data = request.data.copy()
        images = request.FILES.getlist('images')
        
        # Convert string values to proper types
        try:
            if data.get('price'):
                data['price'] = float(data['price'])
            if data.get('sale_price'):
                data['sale_price'] = float(data['sale_price'])
            if data.get('stock_quantity'):
                data['stock_quantity'] = int(data['stock_quantity'])
            if data.get('featured'):
                data['featured'] = data['featured'].lower() in ['true', '1', 'on']
        except (ValueError, TypeError) as e:
            return Response(
                {'error': f'Invalid data format: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        if serializer.is_valid():
            product = serializer.save()

            # Handle new image uploads
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

            response_serializer = ProductDetailSerializer(product, context={'request': request})
            return Response(response_serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class AdminCustomRequestViewSet(AdminAuthenticationMixin, viewsets.ModelViewSet):
    """Admin-only custom request management"""
    queryset = CustomRequest.objects.all().select_related('assigned_to').order_by('-created_at')
    serializer_class = AdminCustomRequestSerializer
    parser_classes = [JSONParser]

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update custom request status"""
        custom_request = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(CustomRequest.STATUS_CHOICES):
            return Response({
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        old_status = custom_request.status
        custom_request.status = new_status
        
        # Update timestamps based on status
        if new_status == 'reviewing' and old_status == 'pending':
            custom_request.reviewed_at = timezone.now()
        elif new_status == 'completed' and old_status != 'completed':
            custom_request.completed_at = timezone.now()
        
        custom_request.save()
        
        return Response({
            'message': f'Status updated to {custom_request.get_status_display()}'
        })

    @action(detail=True, methods=['post'])
    def assign_to_user(self, request, pk=None):
        """Assign custom request to a user"""
        custom_request = self.get_object()
        user_id = request.data.get('user_id')
        
        if user_id:
            try:
                user = User.objects.get(id=user_id, is_staff=True)
                custom_request.assigned_to = user
                custom_request.save()
                return Response({
                    'message': f'Request assigned to {user.get_full_name() or user.username}'
                })
            except User.DoesNotExist:
                return Response({
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            custom_request.assigned_to = None
            custom_request.save()
            return Response({
                'message': 'Request unassigned'
            })

    @action(detail=True, methods=['post'])
    def add_notes(self, request, pk=None):
        """Add admin notes to custom request"""
        custom_request = self.get_object()
        notes = request.data.get('notes')
        
        if not notes:
            return Response({
                'error': 'Notes are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Append to existing notes with timestamp and user
        timestamp = timezone.now().strftime('%Y-%m-%d %H:%M')
        user_name = request.user.get_full_name() or request.user.username
        new_note = f"\n[{timestamp} - {user_name}]: {notes}"
        
        if custom_request.admin_notes:
            custom_request.admin_notes += new_note
        else:
            custom_request.admin_notes = new_note.strip()
        
        custom_request.save()
        
        return Response({
            'message': 'Notes added successfully'
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get custom request statistics"""
        total_requests = CustomRequest.objects.count()
        pending_requests = CustomRequest.objects.filter(status='pending').count()
        in_progress_requests = CustomRequest.objects.filter(
            status__in=['reviewing', 'quoted', 'approved', 'in_progress']
        ).count()
        completed_requests = CustomRequest.objects.filter(status='completed').count()
        
        return Response({
            'total_requests': total_requests,
            'pending_requests': pending_requests,
            'in_progress_requests': in_progress_requests,
            'completed_requests': completed_requests,
        })

class AdminCategoryViewSet(AdminAuthenticationMixin, viewsets.ModelViewSet):
    """Admin-only category management"""
    queryset = Category.objects.all().order_by('sort_order', 'name')
    serializer_class = CategorySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        print("=== CREATE CATEGORY DEBUG ===")
        print("Request data:", request.data)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response(
                CategorySerializer(category, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        else:
            print("Category serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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