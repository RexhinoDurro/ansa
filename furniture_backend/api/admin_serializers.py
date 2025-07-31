# furniture_backend/api/admin_serializers.py
from rest_framework import serializers
from furniture.models import Product, Category, Brand, ProductImage
from django.core.files.base import ContentFile
import base64
import uuid

class AdminCategorySerializer(serializers.ModelSerializer):
    """Admin serializer for categories with full CRUD"""
    subcategories = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent_category',
            'image', 'is_active', 'sort_order', 'subcategories', 
            'product_count', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'read_only': True}
        }
    
    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return AdminCategorySerializer(
                obj.subcategories.all(), 
                many=True, 
                context=self.context
            ).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()

class AdminProductImageSerializer(serializers.ModelSerializer):
    """Admin serializer for product images"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order', 'created_at']
        extra_kwargs = {
            'id': {'read_only': True}
        }

class AdminProductSerializer(serializers.ModelSerializer):
    """Admin serializer for products with full CRUD"""
    images = AdminProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description', 'description',
            'specifications', 'care_instructions', 'category', 'subcategory',
            'brand', 'price', 'sale_price', 'cost_price', 'materials', 'colors',
            'condition', 'dimensions_length', 'dimensions_width', 'dimensions_height',
            'weight', 'stock_quantity', 'min_stock_level', 'track_inventory',
            'status', 'featured', 'is_bestseller', 'is_new_arrival',
            'allow_backorder', 'requires_assembly', 'assembly_time_minutes',
            'assembly_difficulty', 'requires_shipping', 'free_shipping',
            'meta_title', 'meta_description', 'meta_keywords',
            'images', 'category_name', 'brand_name', 'primary_image',
            'created_at', 'updated_at', 'view_count', 'purchase_count'
        ]
        extra_kwargs = {
            'slug': {'read_only': True},
            'sku': {'read_only': True},
            'view_count': {'read_only': True},
            'purchase_count': {'read_only': True}
        }
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return AdminProductImageSerializer(primary_image, context=self.context).data
        return None

    def validate(self, data):
        # Custom validation
        if data.get('sale_price') and data.get('price'):
            if data['sale_price'] >= data['price']:
                raise serializers.ValidationError(
                    "Sale price must be lower than regular price"
                )
        
        if data.get('subcategory') and data.get('category'):
            if data['subcategory'].parent_category != data['category']:
                raise serializers.ValidationError(
                    "Subcategory must belong to the selected category"
                )
        
        return data