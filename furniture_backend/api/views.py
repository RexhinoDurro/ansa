from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Min, Max
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from furniture.models import (
    Product, Category, Brand, HomeSlider, ContactMessage, 
    Newsletter, ProductCollection, ProductReview
)
from furniture_backend.api import models
from .serializers import (
    ProductListSerializer, ProductDetailSerializer, CategorySerializer,
    HomeSliderSerializer, ContactMessageSerializer, NewsletterSerializer,
    FilterOptionsSerializer, AdminStatsSerializer, ProductCreateUpdateSerializer,
    ReviewCreateSerializer
)
from .filters import ProductFilter

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product model with full CRUD operations
    """
    queryset = Product.objects.filter(status='active').select_related('category', 'brand').prefetch_related('images')
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category if provided
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by price range
        min_price = self.request.query_params.get('price__gte')
        max_price = self.request.query_params.get('price__lte')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by materials
        materials = self.request.query_params.get('materials')
        if materials:
            queryset = queryset.filter(materials=materials)
        
        # Filter by colors
        colors = self.request.query_params.get('colors')
        if colors:
            queryset = queryset.filter(colors=colors)
        
        return queryset

    @action(detail=True, methods=['post'])
    def add_review(self, request, slug=None):
        """Add a review to a product"""
        product = self.get_object()
        serializer = ReviewCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single product by slug
    """
    queryset = Product.objects.filter(status='active').select_related('category', 'subcategory', 'brand').prefetch_related('images', 'reviews')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Category model (read-only)
    """
    queryset = Category.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = CategorySerializer

class FeaturedProductsView(generics.ListAPIView):
    """
    List featured products
    """
    queryset = Product.objects.filter(status='active', featured=True).select_related('category', 'brand').prefetch_related('images')
    serializer_class = ProductListSerializer

class HomeSliderView(generics.ListAPIView):
    """
    List active home slider items
    """
    queryset = HomeSlider.objects.filter(is_active=True).order_by('order')
    serializer_class = HomeSliderSerializer

class ContactMessageView(generics.CreateAPIView):
    """
    Create a new contact message
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # You can add email notification logic here
        # send_contact_notification_email(serializer.instance)
        
        return Response(
            {'message': 'Thank you for your message. We will get back to you soon!'},
            status=status.HTTP_201_CREATED
        )

class NewsletterView(generics.CreateAPIView):
    """
    Subscribe to newsletter
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        newsletter = serializer.save()
        
        if newsletter:  # Newsletter was created or reactivated
            return Response(
                {'message': 'Successfully subscribed to newsletter!'},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'message': 'Email already subscribed!'},
            status=status.HTTP_200_OK
        )

class FilterOptionsView(APIView):
    """
    Get filter options for the catalogue page
    """
    def get(self, request):
        # Get active categories
        categories = Category.objects.filter(is_active=True)
        
        # Get active brands
        brands = Brand.objects.filter(is_active=True)
        
        # Get price range
        price_range = Product.objects.filter(status='active').aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        
        data = {
            'categories': CategorySerializer(categories, many=True).data,
            'brands': [{'id': b.id, 'name': b.name, 'slug': b.slug} for b in brands],
            'materials': [{'value': choice[0], 'label': choice[1]} for choice in Product.MATERIAL_CHOICES],
            'colors': [{'value': choice[0], 'label': choice[1]} for choice in Product.COLOR_CHOICES],
            'conditions': [{'value': choice[0], 'label': choice[1]} for choice in Product.CONDITION_CHOICES],
            'price_range': {
                'min': float(price_range['min_price'] or 0),
                'max': float(price_range['max_price'] or 0)
            }
        }
        
        return Response(data)

class AdminStatsView(APIView):
    """
    Get dashboard statistics for admin
    """
    def get(self, request):
        # Calculate basic stats
        total_products = Product.objects.count()
        active_products = Product.objects.filter(status='active').count()
        total_messages = ContactMessage.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()
        low_stock_products = Product.objects.filter(
            track_inventory=True,
            stock_quantity__lte=models.F('min_stock_level')
        ).count()
        pending_reviews = ProductReview.objects.filter(is_approved=False).count()
        
        # Mock data for orders and revenue (implement when you add order models)
        total_orders = 0
        total_customers = 0
        total_revenue = 0
        monthly_revenue = [0] * 12
        
        data = {
            'total_products': total_products,
            'active_products': active_products,
            'total_orders': total_orders,
            'total_customers': total_customers,
            'total_revenue': total_revenue,
            'monthly_revenue': monthly_revenue,
            'low_stock_products': low_stock_products,
            'pending_reviews': pending_reviews,
            'unread_messages': unread_messages,
        }
        
        return Response(data)