import django_filters
from django.db import models
from furniture.models import Product, Category

class ProductFilter(django_filters.FilterSet):
    """
    Filter set for Product model
    """
    # Price range filters
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    price = django_filters.RangeFilter()
    
    # Category filters
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.filter(is_active=True)
    )
    category_slug = django_filters.CharFilter(
        field_name='category__slug',
        lookup_expr='iexact'
    )
    
    # Material and color filters
    materials = django_filters.ChoiceFilter(
        choices=Product.MATERIAL_CHOICES
    )
    colors = django_filters.ChoiceFilter(
        choices=Product.COLOR_CHOICES
    )
    condition = django_filters.ChoiceFilter(
        choices=Product.CONDITION_CHOICES
    )
    
    # Boolean filters
    featured = django_filters.BooleanFilter()
    is_bestseller = django_filters.BooleanFilter()
    is_new_arrival = django_filters.BooleanFilter()
    in_stock = django_filters.BooleanFilter(
        method='filter_in_stock'
    )
    
    # Text search
    search = django_filters.CharFilter(
        method='filter_search'
    )
    
    class Meta:
        model = Product
        fields = {
            'price': ['exact', 'gte', 'lte'],
            'created_at': ['gte', 'lte'],
            'stock_quantity': ['gte', 'lte'],
        }
    
    def filter_in_stock(self, queryset, name, value):
        """Filter products that are in stock"""
        if value:
            return queryset.filter(
                models.Q(track_inventory=False) | 
                models.Q(stock_quantity__gt=0) |
                models.Q(allow_backorder=True)
            )
        return queryset
    
    def filter_search(self, queryset, name, value):
        """Search across multiple fields"""
        return queryset.filter(
            models.Q(name__icontains=value) |
            models.Q(description__icontains=value) |
            models.Q(short_description__icontains=value) |
            models.Q(category__name__icontains=value) |
            models.Q(brand__name__icontains=value)
        ).distinct()