from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.urls import reverse
from django.contrib.auth.models import User
import uuid
import os

def product_image_path(instance, filename):
    """Generate upload path for product images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('products', str(instance.product.created_at.year), 
                       str(instance.product.created_at.month), filename)

def slider_image_path(instance, filename):
    """Generate upload path for slider images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('slider', filename)

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='subcategories'
    )
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['sort_order', 'name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        if self.parent_category:
            return f"{self.parent_category.name} > {self.name}"
        return self.name
    
    @property
    def get_full_path(self):
        """Get the full category path"""
        if self.parent_category:
            return f"{self.parent_category.get_full_path} > {self.name}"
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    COLOR_CHOICES = [
        ('white', 'White'), ('black', 'Black'), ('brown', 'Brown'), ('gray', 'Gray'),
        ('beige', 'Beige'), ('blue', 'Blue'), ('green', 'Green'), ('red', 'Red'),
        ('natural', 'Natural Wood'), ('oak', 'Oak'), ('walnut', 'Walnut'),
        ('pine', 'Pine'), ('mahogany', 'Mahogany'), ('cherry', 'Cherry'),
        ('gold', 'Gold'), ('silver', 'Silver'), ('bronze', 'Bronze'),
        ('cream', 'Cream'), ('navy', 'Navy'), ('burgundy', 'Burgundy'),
        ('other', 'Other'),
    ]
    
    MATERIAL_CHOICES = [
        ('wood', 'Wood'), ('metal', 'Metal'), ('fabric', 'Fabric'), ('leather', 'Leather'),
        ('glass', 'Glass'), ('plastic', 'Plastic'), ('composite', 'Composite'),
        ('rattan', 'Rattan'), ('bamboo', 'Bamboo'), ('marble', 'Marble'),
        ('stone', 'Stone'), ('ceramic', 'Ceramic'), ('wicker', 'Wicker'),
        ('velvet', 'Velvet'), ('linen', 'Linen'), ('cotton', 'Cotton'),
        ('polyester', 'Polyester'), ('microfiber', 'Microfiber'),
    ]
    
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('refurbished', 'Refurbished'),
        ('vintage', 'Vintage'),
        ('antique', 'Antique'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('discontinued', 'Discontinued'),
    ]
    
    # Basic Information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    sku = models.CharField(max_length=50, unique=True, blank=True)
    
    # Descriptions
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    specifications = models.TextField(blank=True, help_text="Technical specifications and details")
    care_instructions = models.TextField(blank=True, help_text="Care and maintenance instructions")
    
    # Categorization
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='subcategory_products'
    )
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Pricing
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        help_text="Regular price"
    )
    sale_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True,
        validators=[MinValueValidator(0)],
        help_text="Sale price (optional)"
    )
    cost_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True,
        validators=[MinValueValidator(0)],
        help_text="Cost price for internal use"
    )
    
    # Physical Properties
    materials = models.CharField(max_length=50, choices=MATERIAL_CHOICES, default='wood')
    colors = models.CharField(max_length=50, choices=COLOR_CHOICES, default='natural')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='new')
    
    # Dimensions (in centimeters)
    dimensions_length = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True, 
        help_text="Length in cm"
    )
    dimensions_width = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True, 
        help_text="Width in cm"
    )
    dimensions_height = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True, 
        help_text="Height in cm"
    )
    weight = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True, 
        help_text="Weight in kg"
    )
    
    # Inventory
    stock_quantity = models.PositiveIntegerField(default=0)
    min_stock_level = models.PositiveIntegerField(default=5, help_text="Minimum stock level for alerts")
    track_inventory = models.BooleanField(default=True)
    
    # Status and Visibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    allow_backorder = models.BooleanField(default=False)
    
    # SEO
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    
    # Shipping
    requires_shipping = models.BooleanField(default=True)
    shipping_weight = models.DecimalField(
        max_digits=8, decimal_places=2, blank=True, null=True,
        help_text="Shipping weight in kg (may differ from actual weight)"
    )
    free_shipping = models.BooleanField(default=False)
    
    # Assembly
    requires_assembly = models.BooleanField(default=False)
    assembly_time_minutes = models.PositiveIntegerField(blank=True, null=True)
    assembly_difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', 'Easy'),
            ('medium', 'Medium'),
            ('hard', 'Hard'),
            ('professional', 'Professional Required'),
        ],
        blank=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    purchase_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'featured']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['price']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.sku:
            self.sku = f"FUR-{self.category.name[:3].upper()}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def is_active(self):
        return self.status == 'active'
    
    @property
    def current_price(self):
        """Return sale price if available, otherwise regular price"""
        return self.sale_price if self.sale_price else self.price
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage if on sale"""
        if self.sale_price and self.sale_price < self.price:
            return round((1 - (self.sale_price / self.price)) * 100)
        return 0
    
    @property
    def primary_image(self):
        return self.images.filter(is_primary=True).first()
    
    @property
    def dimensions_display(self):
        if self.dimensions_length and self.dimensions_width and self.dimensions_height:
            return f"{self.dimensions_length} × {self.dimensions_width} × {self.dimensions_height} cm"
        return "Dimensions not specified"
    
    @property
    def is_in_stock(self):
        if not self.track_inventory:
            return True
        return self.stock_quantity > 0 or self.allow_backorder
    
    @property
    def is_low_stock(self):
        if not self.track_inventory:
            return False
        return self.stock_quantity <= self.min_stock_level
    
    def get_absolute_url(self):
        return reverse('product-detail', kwargs={'slug': self.slug})

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_image_path)
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['product', 'is_primary']),
        ]
    
    def save(self, *args, **kwargs):
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"

class ProductReview(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.IntegerField(choices=RATING_CHOICES, validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', 'is_approved']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.product.name} ({self.rating}/5)"

class HomeSlider(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=slider_image_path)
    mobile_image = models.ImageField(upload_to=slider_image_path, blank=True, null=True)
    link_url = models.URLField(blank=True)
    link_text = models.CharField(max_length=100, blank=True, default="Shop Now")
    background_color = models.CharField(max_length=7, blank=True, help_text="Hex color code")
    text_color = models.CharField(max_length=7, default="#FFFFFF", help_text="Hex color code")
    text_position = models.CharField(
        max_length=20,
        choices=[
            ('left', 'Left'),
            ('center', 'Center'),
            ('right', 'Right'),
        ],
        default='left'
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('product', 'Product Question'),
        ('custom', 'Custom Order'),
        ('shipping', 'Shipping & Delivery'),
        ('returns', 'Returns & Exchanges'),
        ('support', 'Technical Support'),
        ('feedback', 'Feedback'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    custom_subject = models.CharField(max_length=200, blank=True, help_text="Custom subject if 'Other' is selected")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    reply_message = models.TextField(blank=True)
    replied_at = models.DateTimeField(blank=True, null=True)
    replied_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_read', 'created_at']),
        ]
    
    def __str__(self):
        subject_display = self.custom_subject if self.subject == 'other' and self.custom_subject else self.get_subject_display()
        return f"{self.name} - {subject_display}"

class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-subscribed_at']
    
    def __str__(self):
        return self.email

class ProductCollection(models.Model):
    """Collections/Sets of products that go together"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='collections/')
    products = models.ManyToManyField(Product, related_name='collections')
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Wishlist(models.Model):
    """User wishlist functionality"""
    session_key = models.CharField(max_length=40, db_index=True)  # For anonymous users
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['session_key', 'product']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Wishlist - {self.product.name}"

class RecentlyViewed(models.Model):
    """Track recently viewed products"""
    session_key = models.CharField(max_length=40, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['session_key', 'product']
        ordering = ['-viewed_at']
    
    def __str__(self):
        return f"Recently viewed - {self.product.name}"