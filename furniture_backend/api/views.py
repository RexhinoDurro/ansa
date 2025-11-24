from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from furniture.models import (
    GalleryCategory, GalleryProject, GalleryImage,
    CustomRequest, ContactMessage, ContactImage,
    Service, Material, Testimonial, FAQ
)
from .serializers import (
    GalleryCategorySerializer, GalleryProjectListSerializer,
    GalleryProjectDetailSerializer, ContactMessageSerializer,
    CustomRequestSerializer, ServiceSerializer,
    MaterialSerializer, TestimonialSerializer, FAQSerializer
)


class GalleryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Gallery Categories (read-only for public)
    """
    queryset = GalleryCategory.objects.filter(is_active=True).order_by('sort_order', 'name')
    serializer_class = GalleryCategorySerializer
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # Include projects if specifically requested
        context['include_projects'] = self.action == 'retrieve'
        return context

    @action(detail=True, methods=['get'])
    def projects(self, request, slug=None):
        """Get all projects for a specific category"""
        category = self.get_object()
        projects = category.gallery_projects.filter(is_active=True).order_by('sort_order', '-created_at')

        # Apply filters
        featured_only = request.query_params.get('featured', '').lower() == 'true'
        if featured_only:
            projects = projects.filter(featured=True)

        serializer = GalleryProjectListSerializer(projects, many=True, context={'request': request})
        return Response(serializer.data)


class GalleryProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Gallery Projects (read-only for public)
    """
    queryset = GalleryProject.objects.filter(is_active=True).select_related('gallery_category').prefetch_related('images')
    serializer_class = GalleryProjectListSerializer
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GalleryProjectDetailSerializer
        return GalleryProjectListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by category
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(gallery_category__slug=category_slug)

        # Filter featured projects
        featured_only = self.request.query_params.get('featured', '').lower() == 'true'
        if featured_only:
            queryset = queryset.filter(featured=True)

        return queryset.order_by('sort_order', '-created_at')


class FeaturedGalleryProjectsView(generics.ListAPIView):
    """
    List featured gallery projects
    """
    queryset = GalleryProject.objects.filter(
        is_active=True,
        featured=True
    ).select_related('gallery_category').prefetch_related('images').order_by('sort_order', '-created_at')
    serializer_class = GalleryProjectListSerializer


class CustomRequestView(generics.CreateAPIView):
    """
    Create a new custom request with optional image uploads
    """
    queryset = CustomRequest.objects.all()
    serializer_class = CustomRequestSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_request = serializer.save()

        # Handle multiple image uploads (inspiration photos)
        images = request.FILES.getlist('images')
        for image in images:
            ContactImage.objects.create(
                contact_request=custom_request,
                image=image
            )

        # You can add email notification logic here
        # send_custom_request_notification_email(custom_request)

        return Response(
            {
                'message': 'Thank you for your custom request! We will review it and get back to you soon.',
                'request_id': custom_request.id
            },
            status=201
        )


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
            status=201
        )


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Services (read-only for public)
    """
    queryset = Service.objects.filter(is_active=True).order_by('sort_order', 'title')
    serializer_class = ServiceSerializer
    lookup_field = 'slug'


class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Materials (read-only for public)
    """
    queryset = Material.objects.filter(is_active=True).order_by('type', 'sort_order', 'name')
    serializer_class = MaterialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by material type if provided
        material_type = self.request.query_params.get('type')
        if material_type:
            queryset = queryset.filter(type=material_type)

        return queryset


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Testimonials (read-only for public)
    """
    queryset = Testimonial.objects.filter(is_active=True).select_related('project').order_by('-created_at')
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter featured testimonials
        featured_only = self.request.query_params.get('featured', '').lower() == 'true'
        if featured_only:
            queryset = queryset.filter(is_featured=True)

        # Filter by rating
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)

        return queryset


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for FAQs (read-only for public)
    """
    queryset = FAQ.objects.filter(is_active=True).order_by('category', 'sort_order', 'created_at')
    serializer_class = FAQSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        return queryset

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all available FAQ categories"""
        categories = FAQ.objects.filter(is_active=True).values_list('category', flat=True).distinct()
        category_choices = dict(FAQ._meta.get_field('category').choices)

        result = [
            {
                'value': cat,
                'label': category_choices.get(cat, cat),
                'count': FAQ.objects.filter(is_active=True, category=cat).count()
            }
            for cat in categories
        ]

        return Response(result)
