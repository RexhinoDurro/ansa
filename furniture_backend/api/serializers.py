from rest_framework import serializers
from django.db.models import Avg, Count
from furniture.models import (
    Product, ProductImage, ProductReview, Category, Brand, 
    HomeSlider, ContactMessage, Newsletter, ProductCollection,
    Wishlist, RecentlyViewed
)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent_category', 
            'image', 'subcategories', 'product_count'
        ]
    
    def get_subcategories(self, obj):
        if obj.subcategories.filter(is_active=True).exists():
            return CategorySerializer(
                obj.subcategories.filter(is_active=True), 
                many=True, 
                context=self.context
            ).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = [
            'id', 'name', 'rating', 'title', 'comment', 
            'is_verified_purchase', 'helpful_count', 'created_at'
        ]

class ProductListSerializer(serializers.ModelSerializer):
    primary_image = ProductImageSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'price', 'sale_price',
            'current_price', 'discount_percentage', 'primary_image', 
            'category_name', 'brand_name', 'colors', 'materials', 'condition',
            'featured', 'is_bestseller', 'is_new_arrival', 'is_in_stock', 
            'is_low_stock', 'average_rating', 'review_count', 'created_at'
        ]
    
    def get_average_rating(self, obj):
        avg_rating = obj.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating']
        return round(avg_rating, 1) if avg_rating else None
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    subcategory = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    dimensions_display = serializers.CharField(read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    rating_distribution = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'specifications', 'care_instructions', 'price', 'sale_price',
            'current_price', 'discount_percentage', 'category', 'subcategory',
            'brand', 'materials', 'colors', 'condition', 'dimensions_length',
            'dimensions_width', 'dimensions_height', 'dimensions_display',
            'weight', 'stock_quantity', 'min_stock_level', 'featured',
            'is_bestseller', 'is_new_arrival', 'is_in_stock', 'is_low_stock',
            'requires_assembly', 'assembly_time_minutes', 'assembly_difficulty',
            'requires_shipping', 'free_shipping', 'images', 'reviews',
            'average_rating', 'review_count', 'rating_distribution',
            'related_products', 'created_at', 'updated_at'
        ]
    
    def get_average_rating(self, obj):
        avg_rating = obj.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating']
        return round(avg_rating, 1) if avg_rating else None
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()
    
    def get_rating_distribution(self, obj):
        """Get distribution of ratings (1-5 stars)"""
        distribution = {}
        for i in range(1, 6):
            count = obj.reviews.filter(is_approved=True, rating=i).count()
            distribution[str(i)] = count
        return distribution
    
    def get_related_products(self, obj):
        """Get related products from same category"""
        related = Product.objects.filter(
            category=obj.category,
            status='active'
        ).exclude(id=obj.id)[:4]
        
        return ProductListSerializer(
            related, 
            many=True, 
            context=self.context
        ).data

class HomeSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeSlider
        fields = [
            'id', 'title', 'subtitle', 'description', 'image', 
            'mobile_image', 'link_url', 'link_text', 'background_color',
            'text_color', 'text_position', 'order'
        ]

class ContactMessageSerializer(serializers.ModelSerializer):
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'subject_display',
            'custom_subject', 'message', 'created_at'
        ]
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
        }
    
    def create(self, validated_data):
        # You could add email notification logic here
        return super().create(validated_data)

class ContactMessageDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for admin use"""
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    replied_by_name = serializers.CharField(source='replied_by.get_full_name', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'subject_display',
            'custom_subject', 'message', 'is_read', 'is_replied',
            'reply_message', 'replied_at', 'replied_by_name', 'created_at'
        ]

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['email', 'name']
    
    def create(self, validated_data):
        # Handle existing subscriptions
        newsletter, created = Newsletter.objects.get_or_create(
            email=validated_data['email'],
            defaults=validated_data
        )
        
        if not created and not newsletter.is_active:
            # Reactivate if previously unsubscribed
            newsletter.is_active = True
            newsletter.unsubscribed_at = None
            newsletter.save()
        
        return newsletter

class ProductCollectionSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductCollection
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'products', 'product_count', 'featured', 'created_at'
        ]
    
    def get_product_count(self, obj):
        return obj.products.filter(status='active').count()

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
        }
    
    def create(self, validated_data):
        session_key = self.context['request'].session.session_key
        if not session_key:
            self.context['request'].session.create()
            session_key = self.context['request'].session.session_key
        
        validated_data['session_key'] = session_key
        
        # Get or create wishlist item
        wishlist_item, created = Wishlist.objects.get_or_create(
            session_key=session_key,
            product_id=validated_data['product_id']
        )
        
        return wishlist_item

class RecentlyViewedSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = RecentlyViewed
        fields = ['id', 'product', 'viewed_at']

# Filter serializers for providing filter options
class FilterOptionsSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True, read_only=True)
    brands = BrandSerializer(many=True, read_only=True)
    materials = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField()
    conditions = serializers.SerializerMethodField()
    price_range = serializers.SerializerMethodField()
    
    def get_materials(self, obj):
        return [{'value': value, 'label': label} for value, label in Product.MATERIAL_CHOICES]
    
    def get_colors(self, obj):
        return [{'value': value, 'label': label} for value, label in Product.COLOR_CHOICES]
    
    def get_conditions(self, obj):
        return [{'value': value, 'label': label} for value, label in Product.CONDITION_CHOICES]
    
    def get_price_range(self, obj):
        from django.db.models import Min, Max
        price_range = Product.objects.filter(status='active').aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        return {
            'min': float(price_range['min_price'] or 0),
            'max': float(price_range['max_price'] or 0)
        }

# Admin dashboard serializers
class AdminStatsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    active_products = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_revenue = serializers.ListField(child=serializers.DecimalField(max_digits=10, decimal_places=2))
    low_stock_products = serializers.IntegerField()
    pending_reviews = serializers.IntegerField()
    unread_messages = serializers.IntegerField()

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'short_description', 'specifications',
            'care_instructions', 'category', 'subcategory', 'brand',
            'price', 'sale_price', 'materials', 'colors', 'condition',
            'dimensions_length', 'dimensions_width', 'dimensions_height',
            'weight', 'stock_quantity', 'min_stock_level', 'track_inventory',
            'status', 'featured', 'is_bestseller', 'is_new_arrival',
            'allow_backorder', 'requires_assembly', 'assembly_time_minutes',
            'assembly_difficulty', 'requires_shipping', 'free_shipping',
            'meta_title', 'meta_description', 'meta_keywords'
        ]
    
    def validate(self, data):
        # Custom validation logic
        if data.get('sale_price') and data.get('price'):
            if data['sale_price'] >= data['price']:
                raise serializers.ValidationError("Sale price must be lower than regular price")
        
        return data

class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating product reviews"""
    
    class Meta:
        model = ProductReview
        fields = ['name', 'email', 'rating', 'title', 'comment']
    
    def create(self, validated_data):
        # Add the product from URL parameter
        product_id = self.context['view'].kwargs.get('product_pk')
        validated_data['product_id'] = product_id
        return super().create(validated_data)