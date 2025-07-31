# furniture_backend/furniture/admin.py (Updated)
from logging import DEBUG
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from furniture.models import (
    Category, Brand, Product, ProductImage, ProductReview, 
    HomeSlider, ContactMessage, Newsletter, ProductCollection,
    Wishlist, RecentlyViewed
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_category', 'is_active', 'sort_order', 'product_count', 'created_at')
    list_filter = ('is_active', 'parent_category', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active', 'sort_order')
    ordering = ('sort_order', 'name')
    
    def product_count(self, obj):
        return obj.products.filter(status='active').count()
    product_count.short_description = 'Active Products'

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'product_count', 'website', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active',)
    
    def product_count(self, obj):
        return obj.product_set.filter(status='active').count()
    product_count.short_description = 'Active Products'

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'is_primary', 'order')
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', 
                             obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

class ProductReviewInline(admin.TabularInline):
    model = ProductReview
    extra = 0
    fields = ('name', 'rating', 'title', 'is_approved', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'category', 'brand', 'current_price_display', 'stock_quantity', 
        'status', 'featured', 'is_in_stock', 'view_count', 'created_at'
    )
    list_filter = (
        'status', 'featured', 'is_bestseller', 'is_new_arrival', 'category', 
        'brand', 'materials', 'colors', 'condition', 'created_at'
    )
    search_fields = ('name', 'description', 'sku')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('status', 'featured', 'stock_quantity')
    readonly_fields = ('id', 'slug', 'sku', 'view_count', 'purchase_count', 'created_at', 'updated_at')
    inlines = [ProductImageInline, ProductReviewInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'sku', 'short_description', 'description')
        }),
        ('Categorization', {
            'fields': ('category', 'subcategory', 'brand')
        }),
        ('Pricing', {
            'fields': ('price', 'sale_price', 'cost_price')
        }),
        ('Physical Properties', {
            'fields': (
                'materials', 'colors', 'condition',
                ('dimensions_length', 'dimensions_width', 'dimensions_height'),
                'weight'
            )
        }),
        ('Inventory', {
            'fields': ('stock_quantity', 'min_stock_level', 'track_inventory', 'allow_backorder')
        }),
        ('Status & Visibility', {
            'fields': ('status', 'featured', 'is_bestseller', 'is_new_arrival')
        }),
        ('Shipping & Assembly', {
            'fields': (
                'requires_shipping', 'shipping_weight', 'free_shipping',
                'requires_assembly', 'assembly_time_minutes', 'assembly_difficulty'
            )
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Additional Info', {
            'fields': ('specifications', 'care_instructions'),
            'classes': ('collapse',)
        }),
        ('System Info', {
            'fields': ('id', 'view_count', 'purchase_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def current_price_display(self, obj):
        if obj.sale_price:
            return format_html(
                '<span style="text-decoration: line-through;">${}</span> <strong>${}</strong>',
                obj.price, obj.sale_price
            )
        return f"${obj.price}"
    current_price_display.short_description = 'Price'

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'alt_text', 'is_primary', 'order', 'created_at')
    list_filter = ('is_primary', 'created_at')
    list_editable = ('is_primary', 'order')
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', 
                             obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'rating', 'title', 'is_approved', 'is_verified_purchase', 'created_at')
    list_filter = ('rating', 'is_approved', 'is_verified_purchase', 'created_at')
    search_fields = ('product__name', 'name', 'title', 'comment')
    list_editable = ('is_approved',)
    readonly_fields = ('helpful_count', 'created_at', 'updated_at')

@admin.register(HomeSlider)
class HomeSliderAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'start_date', 'end_date', 'created_at')
    list_filter = ('is_active', 'created_at')
    list_editable = ('is_active', 'order')
    fields = (
        'title', 'subtitle', 'description', 'image', 'mobile_image',
        'link_url', 'link_text', 'background_color', 'text_color', 'text_position',
        'order', 'is_active', 'start_date', 'end_date'
    )

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject_display', 'is_read', 'is_replied', 'created_at')
    list_filter = ('subject', 'is_read', 'is_replied', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('is_read',)
    
    def subject_display(self, obj):
        return obj.custom_subject if obj.subject == 'other' and obj.custom_subject else obj.get_subject_display()
    subject_display.short_description = 'Subject'

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'subscribed_at', 'unsubscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email', 'name')
    readonly_fields = ('subscribed_at', 'unsubscribed_at')

@admin.register(ProductCollection)
class ProductCollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'featured', 'product_count', 'created_at')
    list_filter = ('is_active', 'featured', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('products',)
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'

# Customize admin site
admin.site.site_header = "Furniture Store Admin"
admin.site.site_title = "Furniture Admin"
admin.site.index_title = "Welcome to Furniture Store Administration"

# furniture_backend/furniture_backend/settings.py (Add session configuration)
# Add these to your existing settings.py after the CORS settings

# Session configuration for admin authentication
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_SAVE_EVERY_REQUEST = True

# CSRF settings
CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add logging for development
if DEBUG:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'loggers': {
            'django.request': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True,
            },
        },
    }