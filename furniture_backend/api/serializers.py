from rest_framework import serializers
from furniture.models import (
    GalleryCategory, GalleryProject, GalleryImage,
    CustomRequest, ContactMessage, ContactImage,
    Service, Material, Testimonial, FAQ
)


# Gallery Serializers
class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = [
            'id', 'image', 'title', 'description', 'alt_text',
            'is_primary', 'is_before_image', 'tags', 'order', 'created_at'
        ]


class GalleryProjectListSerializer(serializers.ModelSerializer):
    primary_image = GalleryImageSerializer(read_only=True)
    image_count = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='gallery_category.name', read_only=True)

    class Meta:
        model = GalleryProject
        fields = [
            'id', 'title', 'slug', 'description', 'client_name',
            'project_date', 'location', 'materials_used', 'dimensions',
            'price_range', 'featured', 'primary_image', 'image_count',
            'category_name', 'created_at'
        ]


class GalleryProjectDetailSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    gallery_category = serializers.StringRelatedField(read_only=True)
    image_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = GalleryProject
        fields = [
            'id', 'title', 'slug', 'description', 'client_name',
            'project_date', 'location', 'materials_used', 'dimensions',
            'price_range', 'featured', 'gallery_category', 'images',
            'image_count', 'created_at', 'updated_at'
        ]


class GalleryCategorySerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()
    project_count = serializers.IntegerField(read_only=True)
    total_images = serializers.IntegerField(read_only=True)

    class Meta:
        model = GalleryCategory
        fields = [
            'id', 'name', 'slug', 'description', 'cover_image',
            'projects', 'project_count', 'total_images', 'created_at'
        ]

    def get_projects(self, obj):
        # Only include projects if specifically requested
        if self.context.get('include_projects', False):
            projects = obj.gallery_projects.filter(is_active=True)
            return GalleryProjectListSerializer(
                projects,
                many=True,
                context=self.context
            ).data
        return []


# Admin serializers for CRUD operations
class AdminGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = '__all__'


class AdminGalleryProjectSerializer(serializers.ModelSerializer):
    images = AdminGalleryImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='gallery_category.name', read_only=True)
    image_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = GalleryProject
        fields = [
            'id', 'gallery_category', 'title', 'slug', 'description',
            'client_name', 'project_date', 'location', 'materials_used',
            'dimensions', 'price_range', 'featured', 'is_active',
            'sort_order', 'images', 'category_name', 'image_count',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'read_only': True}
        }


class AdminGalleryCategorySerializer(serializers.ModelSerializer):
    projects = AdminGalleryProjectSerializer(source='gallery_projects', many=True, read_only=True)
    project_count = serializers.IntegerField(read_only=True)
    total_images = serializers.IntegerField(read_only=True)

    class Meta:
        model = GalleryCategory
        fields = [
            'id', 'name', 'slug', 'description', 'cover_image',
            'is_active', 'sort_order', 'projects', 'project_count',
            'total_images', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'read_only': True}
        }


# Contact & Custom Request Serializers
class ContactImageSerializer(serializers.ModelSerializer):
    """Serializer for ContactImage model"""
    class Meta:
        model = ContactImage
        fields = ['id', 'image', 'alt_text', 'created_at']
        read_only_fields = ['created_at']


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


class CustomRequestSerializer(serializers.ModelSerializer):
    """CustomRequest serializer for custom furniture studio"""
    images = ContactImageSerializer(many=True, read_only=True)
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    budget_display = serializers.CharField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CustomRequest
        fields = [
            'id', 'name', 'email', 'phone', 'room_type', 'room_type_display',
            'budget_range', 'budget_display', 'message', 'status', 'status_display',
            'images', 'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'admin_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create a new custom request"""
        custom_request = CustomRequest.objects.create(**validated_data)
        return custom_request


class AdminCustomRequestSerializer(serializers.ModelSerializer):
    """Admin serializer for custom requests with full access"""
    images = ContactImageSerializer(many=True, read_only=True)
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    budget_display = serializers.CharField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = CustomRequest
        fields = [
            'id', 'name', 'email', 'phone', 'room_type', 'room_type_display',
            'budget_range', 'budget_display', 'message', 'status', 'status_display',
            'admin_notes', 'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# Service & Material Serializers
class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model"""
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'description',
            'image', 'icon', 'is_active', 'sort_order', 'created_at'
        ]


class MaterialSerializer(serializers.ModelSerializer):
    """Serializer for Material model"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Material
        fields = [
            'id', 'name', 'type', 'type_display', 'description', 'image',
            'is_active', 'sort_order', 'created_at'
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for Testimonial model"""
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_slug = serializers.CharField(source='project.slug', read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'text', 'project', 'project_title', 'project_slug',
            'location', 'rating', 'is_featured', 'created_at'
        ]


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQ model"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = FAQ
        fields = [
            'id', 'question', 'answer', 'category', 'category_display',
            'is_active', 'sort_order', 'created_at'
        ]
