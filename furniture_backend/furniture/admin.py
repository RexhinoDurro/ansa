from django.contrib import admin
from .models import (
    GalleryCategory, GalleryProject, GalleryImage,
    CustomRequest, ContactImage, ContactMessage,
    Service, Material, Testimonial, FAQ
)


# Gallery Admin
@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'sort_order', 'project_count')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['sort_order', 'name']


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1
    fields = ('image', 'title', 'alt_text', 'is_primary', 'order')


@admin.register(GalleryProject)
class GalleryProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'gallery_category', 'featured', 'is_active', 'sort_order', 'created_at')
    list_filter = ('gallery_category', 'featured', 'is_active', 'created_at')
    search_fields = ('title', 'description', 'client_name')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [GalleryImageInline]
    ordering = ['sort_order', '-created_at']


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('gallery_project', 'title', 'is_primary', 'order', 'created_at')
    list_filter = ('gallery_project', 'is_primary')
    search_fields = ('title', 'alt_text')


# Custom Request Admin
class ContactImageInline(admin.TabularInline):
    model = ContactImage
    extra = 0
    readonly_fields = ('created_at',)


@admin.register(CustomRequest)
class CustomRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'room_type', 'status', 'created_at')
    list_filter = ('status', 'room_type', 'created_at')
    search_fields = ('name', 'email', 'message')
    inlines = [ContactImageInline]
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Project Details', {
            'fields': ('room_type', 'budget_range', 'message')
        }),
        ('Admin', {
            'fields': ('status', 'admin_notes', 'created_at', 'updated_at')
        }),
    )


@admin.register(ContactImage)
class ContactImageAdmin(admin.ModelAdmin):
    list_display = ('contact_request', 'image', 'created_at')
    list_filter = ('created_at',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'is_replied', 'created_at')
    list_filter = ('subject', 'is_read', 'is_replied', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)


# Services & Materials
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_active', 'sort_order')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['sort_order', 'title']


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'is_active', 'sort_order')
    list_filter = ('type', 'is_active')
    search_fields = ('name', 'description')
    ordering = ['type', 'sort_order']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'rating', 'is_featured', 'is_active', 'created_at')
    list_filter = ('rating', 'is_featured', 'is_active', 'created_at')
    search_fields = ('client_name', 'text', 'location')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'sort_order')
    list_filter = ('category', 'is_active')
    search_fields = ('question', 'answer')
    ordering = ['category', 'sort_order']
