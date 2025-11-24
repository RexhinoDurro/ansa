from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
from django.contrib.auth.models import User
import uuid
import os


# Helper function for gallery images
def gallery_image_path(instance, filename):
    """Generate upload path for gallery images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    # Use current date if project doesn't have created_at yet
    from datetime import datetime
    try:
        year = instance.gallery_project.created_at.year
        month = instance.gallery_project.created_at.month
        category_id = instance.gallery_project.gallery_category.id
    except:
        # Fallback for new objects
        now = datetime.now()
        year = now.year
        month = now.month
        category_id = getattr(instance.gallery_project, 'gallery_category_id', 'unknown')

    return os.path.join('gallery',
                       str(category_id),
                       str(year),
                       str(month),
                       filename)


# Gallery Models - Main Portfolio System
class GalleryCategory(models.Model):
    """Gallery categories for portfolio projects"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='gallery/categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Gallery Categories"
        ordering = ['sort_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def project_count(self):
        return self.gallery_projects.filter(is_active=True).count()


class GalleryProject(models.Model):
    """Gallery projects - shown in portfolio"""
    gallery_category = models.ForeignKey(
        GalleryCategory,
        on_delete=models.CASCADE,
        related_name='gallery_projects'
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    client_name = models.CharField(max_length=100, blank=True, help_text="Client name (optional)")
    project_date = models.DateField(blank=True, null=True, help_text="When the project was completed")
    location = models.CharField(max_length=200, blank=True, help_text="Project location")
    materials_used = models.CharField(max_length=300, blank=True)
    dimensions = models.CharField(max_length=100, blank=True)
    price_range = models.CharField(
        max_length=50,
        choices=[
            ('under-1000', 'Under €1,000'),
            ('1000-5000', '€1,000 - €5,000'),
            ('5000-10000', '€5,000 - €10,000'),
            ('10000-25000', '€10,000 - €25,000'),
            ('over-25000', 'Over €25,000'),
        ],
        blank=True
    )
    featured = models.BooleanField(default=False, help_text="Show in featured projects")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', '-created_at']
        unique_together = ['gallery_category', 'slug']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            self.slug = base_slug
            counter = 1
            while GalleryProject.objects.filter(
                gallery_category=self.gallery_category,
                slug=self.slug
            ).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.gallery_category.name} - {self.title}"

    @property
    def primary_image(self):
        return self.images.filter(is_primary=True).first()

    @property
    def image_count(self):
        return self.images.count()


class GalleryImage(models.Model):
    """Individual images in gallery projects"""
    gallery_project = models.ForeignKey(
        GalleryProject,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to=gallery_image_path)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False, help_text="Primary image for the project")
    is_before_image = models.BooleanField(default=False, help_text="Before/after comparison")
    tags = models.CharField(max_length=300, blank=True, help_text="Comma-separated tags")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['gallery_project', 'is_primary']),
        ]

    def save(self, *args, **kwargs):
        # Ensure only one primary image per project
        if self.is_primary:
            GalleryImage.objects.filter(
                gallery_project=self.gallery_project,
                is_primary=True
            ).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.gallery_project.title} - {self.title or f'Image {self.order}'}"


# Contact & Custom Request Models
def contact_image_path(instance, filename):
    """Generate upload path for contact request images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('contact', str(instance.contact_request.created_at.year),
                       str(instance.contact_request.created_at.month), filename)


class CustomRequest(models.Model):
    """Custom furniture requests from contact form"""
    ROOM_TYPE_CHOICES = [
        ('kitchen', 'Kitchen'),
        ('living_room', 'Living Room'),
        ('bedroom', 'Bedroom'),
        ('wardrobe', 'Wardrobe'),
        ('office', 'Office'),
        ('other', 'Other'),
    ]

    BUDGET_CHOICES = [
        ('under-1000', 'Under €1,000'),
        ('1000-3000', '€1,000 - €3,000'),
        ('3000-6000', '€3,000 - €6,000'),
        ('over-6000', 'Over €6,000'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]

    # Contact Information
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)

    # Project Details
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, default='kitchen')
    budget_range = models.CharField(max_length=20, choices=BUDGET_CHOICES, blank=True)
    message = models.TextField()

    # Admin fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(blank=True, help_text="Internal admin notes")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Custom Request"
        verbose_name_plural = "Custom Requests"

    def __str__(self):
        return f"{self.name} - {self.get_room_type_display()}"

    @property
    def budget_display(self):
        """Convert budget code to readable format"""
        if not self.budget_range:
            return "Not specified"
        return dict(self.BUDGET_CHOICES).get(self.budget_range, self.budget_range)


class ContactImage(models.Model):
    """Images uploaded with contact requests"""
    contact_request = models.ForeignKey(
        CustomRequest,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to=contact_image_path)
    alt_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Image for {self.contact_request.name} - {self.contact_request.room_type}"


# Contact Messages
class ContactMessage(models.Model):
    """General contact messages"""
    SUBJECT_CHOICES = [
        ('general', 'General Inquiry'),
        ('custom', 'Custom Order'),
        ('support', 'Support'),
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


# Services offered
def service_image_path(instance, filename):
    """Generate upload path for service images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('services', filename)


class Service(models.Model):
    """Services offered by the furniture studio"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_description = models.TextField()
    description = models.TextField()
    image = models.ImageField(upload_to=service_image_path, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name or class")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'title']
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# Materials for projects
def material_image_path(instance, filename):
    """Generate upload path for material images"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join('materials', instance.type, filename)


class Material(models.Model):
    """Materials and finishes available"""
    MATERIAL_TYPE_CHOICES = [
        ('wood', 'Wood'),
        ('fabric', 'Fabric / Leather'),
        ('hardware', 'Hardware'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=MATERIAL_TYPE_CHOICES, default='wood')
    description = models.TextField()
    image = models.ImageField(upload_to=material_image_path)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['type', 'sort_order', 'name']
        verbose_name = "Material"
        verbose_name_plural = "Materials"

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


# Testimonials
class Testimonial(models.Model):
    """Client testimonials"""
    client_name = models.CharField(max_length=100)
    text = models.TextField()
    project = models.ForeignKey(
        GalleryProject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='testimonials'
    )
    location = models.CharField(max_length=100, blank=True, help_text="Client location (optional)")
    rating = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating out of 5"
    )
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.client_name} - {self.rating}/5"


# FAQ
class FAQ(models.Model):
    """Frequently Asked Questions"""
    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=[
            ('general', 'General'),
            ('process', 'Process'),
            ('materials', 'Materials'),
            ('delivery', 'Delivery & Installation'),
            ('pricing', 'Pricing'),
            ('maintenance', 'Maintenance'),
        ],
        default='general'
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'sort_order', 'created_at']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question
