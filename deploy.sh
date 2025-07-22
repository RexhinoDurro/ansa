#!/bin/bash

# Furniture Website Deployment Script
echo "🚀 Starting Furniture Website Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Create main project directory
PROJECT_NAME="furniture-website"
print_info "Creating project directory: $PROJECT_NAME"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# =============================================================================
# BACKEND SETUP
# =============================================================================
print_info "Setting up Django Backend..."

# Create backend directory
mkdir -p backend
cd backend

# Create virtual environment
print_info "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Create requirements.txt
print_info "Creating requirements.txt..."
cat > requirements.txt << 'EOF'
Django==5.0.1
djangorestframework==3.14.0
django-cors-headers==4.3.1
django-filter==23.5
Pillow==10.2.0
python-decouple==3.8
django-extensions==3.2.3
whitenoise==6.6.0
django-debug-toolbar==4.2.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
EOF

# Install requirements
print_info "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create Django project
print_info "Creating Django project..."
django-admin startproject furniture_project .
cd furniture_project

# Create Django app
print_info "Creating Django app..."
python ../manage.py startapp furniture_app

# Go back to backend root
cd ..

# Create .env file
print_info "Creating .env file..."
cat > .env << 'EOF'
SECRET_KEY=django-insecure-your-secret-key-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EOF

# Create Django settings
print_info "Creating Django settings..."
cat > furniture_project/settings.py << 'EOF'
from pathlib import Path
import os
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-your-secret-key-here')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'django_filters',
]

LOCAL_APPS = [
    'furniture_app',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']

ROOT_URLCONF = 'furniture_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'furniture_project.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

if DEBUG:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'].append('rest_framework.renderers.BrowsableAPIRenderer')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG

FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024

EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@furniturestore.com')
EOF

# Create main URLs
print_info "Creating main URLs..."
cat > furniture_project/urls.py << 'EOF'
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('furniture_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [path('__debug__/', include(debug_toolbar.urls)),] + urlpatterns
EOF

# Create app models
print_info "Creating Django models..."
cat > furniture_app/models.py << 'EOF'
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse
import uuid

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='subcategories')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Product(models.Model):
    COLOR_CHOICES = [
        ('white', 'White'), ('black', 'Black'), ('brown', 'Brown'), ('gray', 'Gray'),
        ('beige', 'Beige'), ('blue', 'Blue'), ('green', 'Green'), ('red', 'Red'),
        ('natural', 'Natural Wood'), ('other', 'Other'),
    ]
    
    MATERIAL_CHOICES = [
        ('wood', 'Wood'), ('metal', 'Metal'), ('fabric', 'Fabric'), ('leather', 'Leather'),
        ('glass', 'Glass'), ('plastic', 'Plastic'), ('composite', 'Composite'),
        ('rattan', 'Rattan'), ('bamboo', 'Bamboo'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategory_products')
    materials = models.CharField(max_length=50, choices=MATERIAL_CHOICES, default='wood')
    colors = models.CharField(max_length=50, choices=COLOR_CHOICES, default='natural')
    dimensions_length = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, help_text="Length in cm")
    dimensions_width = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, help_text="Width in cm")
    dimensions_height = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, help_text="Height in cm")
    weight = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, help_text="Weight in kg")
    stock_quantity = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
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
        return self.stock_quantity > 0

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/%Y/%m/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"

class HomeSlider(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='slider/')
    link_url = models.URLField(blank=True)
    link_text = models.CharField(max_length=100, blank=True, default="Shop Now")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
EOF

# Create serializers
print_info "Creating Django serializers..."
cat > furniture_app/serializers.py << 'EOF'
from rest_framework import serializers
from .models import Product, ProductImage, Category, HomeSlider, ContactMessage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent_category', 'subcategories']
    
    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return CategorySerializer(obj.subcategories.all(), many=True).data
        return []

class ProductListSerializer(serializers.ModelSerializer):
    primary_image = ProductImageSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'short_description', 'price', 'primary_image', 'category_name', 'colors', 'materials', 'featured', 'is_in_stock', 'created_at']

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    subcategory = CategorySerializer(read_only=True)
    dimensions_display = serializers.CharField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'short_description', 'price', 'category', 'subcategory', 'materials', 'colors', 'dimensions_length', 'dimensions_width', 'dimensions_height', 'dimensions_display', 'weight', 'stock_quantity', 'featured', 'is_in_stock', 'images', 'created_at', 'updated_at']

class HomeSliderSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeSlider
        fields = ['id', 'title', 'subtitle', 'description', 'image', 'link_url', 'link_text', 'order']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']
EOF

# Create views
print_info "Creating Django views..."
cat > furniture_app/views.py << 'EOF'
from rest_framework import generics, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Min, Max
from .models import Product, Category, HomeSlider, ContactMessage
from .serializers import ProductListSerializer, ProductDetailSerializer, CategorySerializer, HomeSliderSerializer, ContactMessageSerializer

class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'subcategory', 'materials', 'colors', 'featured']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

class FeaturedProductsView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, featured=True)
    serializer_class = ProductListSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(parent_category=None)
    serializer_class = CategorySerializer

class HomeSliderView(generics.ListAPIView):
    queryset = HomeSlider.objects.filter(is_active=True)
    serializer_class = HomeSliderSerializer

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

@api_view(['GET'])
def product_filters(request):
    categories = Category.objects.all()
    materials = Product.MATERIAL_CHOICES
    colors = Product.COLOR_CHOICES
    products = Product.objects.filter(is_active=True)
    min_price = products.aggregate(min_price=Min('price'))['min_price'] or 0
    max_price = products.aggregate(max_price=Max('price'))['max_price'] or 0
    
    return Response({
        'categories': CategorySerializer(categories, many=True).data,
        'materials': [{'value': value, 'label': label} for value, label in materials],
        'colors': [{'value': value, 'label': label} for value, label in colors],
        'price_range': {'min': float(min_price), 'max': float(max_price)}
    })
EOF

# Create app URLs
print_info "Creating app URLs..."
cat > furniture_app/urls.py << 'EOF'
from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('featured-products/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('slider/', views.HomeSliderView.as_view(), name='home-slider'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact-message'),
    path('filters/', views.product_filters, name='product-filters'),
]
EOF

# Create admin
print_info "Creating Django admin..."
cat > furniture_app/admin.py << 'EOF'
from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage, Category, HomeSlider, ContactMessage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'is_primary', 'order')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_category', 'created_at')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity', 'featured', 'is_active')
    list_filter = ('category', 'materials', 'colors', 'featured', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]

@admin.register(HomeSlider)
class HomeSliderAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_editable = ('order', 'is_active')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')

admin.site.site_header = "Furniture Business Admin"
EOF

# Create media directories
mkdir -p media/products media/slider

# Run migrations
print_info "Running Django migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (you'll need to enter details manually)
print_info "Creating superuser..."
echo "Please create a superuser account for Django admin:"
python manage.py createsuperuser

print_status "Backend setup completed!"

# =============================================================================
# FRONTEND SETUP
# =============================================================================
cd ..
print_info "Setting up React Frontend..."

# Create frontend directory
mkdir -p frontend
cd frontend

# Initialize npm project
print_info "Initializing npm project..."
npm init -y

# Create package.json
print_info "Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "furniture-website-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "axios": "^1.6.5",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.312.0",
    "react-intersection-observer": "^9.5.3",
    "react-query": "^3.39.3",
    "embla-carousel-react": "^8.0.0",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF

# Install dependencies
print_info "Installing npm dependencies..."
npm install

# Create Vite config
print_info "Creating Vite config..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
EOF

# Create TypeScript config
print_info "Creating TypeScript config..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Initialize Tailwind CSS
print_info "Setting up Tailwind CSS..."
npx tailwindcss init -p

# Create Tailwind config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f6f3',
          500: '#b08660',
          600: '#a37654',
          700: '#886247',
          800: '#6f513e',
          900: '#5a4234',
        },
        accent: {
          50: '#f7f7f6',
          500: '#737364',
          600: '#5c5c4f',
          700: '#4a4a41',
          800: '#3f3f37',
          900: '#363630',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
EOF

# Create PostCSS config
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create src directory structure
print_info "Creating src directory structure..."
mkdir -p src/{components/{layout,ui,product,admin},pages/{admin},hooks,utils,types,styles}

# Create main CSS file
print_info "Creating CSS files..."
cat > src/styles/index.css << 'EOF'
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply font-sans text-neutral-900 bg-white;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
}
EOF

# Create types
print_info "Creating TypeScript types..."
cat > src/types/index.ts << 'EOF'
export interface ProductImage {
  id: string;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_category: number | null;
  subcategories: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  category: Category;
  subcategory: Category | null;
  materials: string;
  colors: string;
  dimensions_length: number | null;
  dimensions_width: number | null;
  dimensions_height: number | null;
  dimensions_display: string;
  weight: number | null;
  stock_quantity: number;
  featured: boolean;
  is_in_stock: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  price: number;
  primary_image: ProductImage | null;
  category_name: string;
  colors: string;
  materials: string;
  featured: boolean;
  is_in_stock: boolean;
  created_at: string;
}

export interface HomeSlider {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link_url: string;
  link_text: string;
  order: number;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
EOF

# Create API utilities
print_info "Creating API utilities..."
cat > src/utils/api.ts << 'EOF'
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  products: '/products/',
  featuredProducts: '/featured-products/',
  categories: '/categories/',
  slider: '/slider/',
  contact: '/contact/',
  filters: '/filters/',
} as const;
EOF

# Create main App component
print_info "Creating React components..."
cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
EOF

# Create basic layout components
cat > src/components/layout/Layout.tsx << 'EOF'
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
EOF

cat > src/components/layout/Navbar.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    } border-b border-neutral-200/20`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-serif font-bold text-primary-700">
            Furniture Co.
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/catalogue" className="nav-link">Catalogue</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200/20">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/catalogue" className="nav-link">Catalogue</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
EOF

cat > src/components/layout/Footer.tsx << 'EOF'
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Furniture Co.</h3>
            <p className="text-neutral-300">
              Quality furniture for your home and office.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/catalogue" className="hover:text-white">Catalogue</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="/catalogue?category=chairs" className="hover:text-white">Chairs</a></li>
              <li><a href="/catalogue?category=tables" className="hover:text-white">Tables</a></li>
              <li><a href="/catalogue?category=sofas" className="hover:text-white">Sofas</a></li>
              <li><a href="/catalogue?category=storage" className="hover:text-white">Storage</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-neutral-300">
              <p>123 Furniture Street</p>
              <p>City, State 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@furnitureco.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 Furniture Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
EOF

# Create basic pages
print_info "Creating basic pages..."
cat > src/pages/Home.tsx << 'EOF'
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="h-screen bg-gradient-to-r from-primary-50 to-accent-50 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary-900 mb-6">
              Beautiful Furniture
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              Discover our collection of handcrafted furniture pieces that bring 
              elegance and comfort to your home.
            </p>
            <button className="btn-primary text-lg px-8 py-3">
              Shop Now
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="text-center text-neutral-600">
            Featured products will be loaded here...
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
EOF

cat > src/pages/Catalogue.tsx << 'EOF'
import React from 'react';

const Catalogue: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Catalogue</h1>
        <div className="text-center text-neutral-600">
          Product catalogue will be implemented here...
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
EOF

cat > src/pages/ProductDetail.tsx << 'EOF'
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Product Detail</h1>
        <div className="text-center text-neutral-600">
          Product detail for "{slug}" will be implemented here...
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
EOF

cat > src/pages/About.tsx << 'EOF'
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">About Us</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-neutral-600 mb-6">
            Welcome to Furniture Co., where craftsmanship meets modern design. 
            For over 30 years, we have been creating beautiful, functional furniture 
            that transforms houses into homes.
          </p>
          <p className="text-lg text-neutral-600">
            Our commitment to quality, sustainability, and customer satisfaction 
            drives everything we do. Each piece is carefully crafted by skilled 
            artisans using the finest materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
EOF

cat > src/pages/Contact.tsx << 'EOF'
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Contact Us</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full py-3">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
EOF

# Create main.tsx
print_info "Creating main.tsx..."
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Create index.html
print_info "Creating index.html..."
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Furniture Co. - Quality Furniture for Your Home</title>
    <meta name="description" content="Discover our collection of handcrafted furniture pieces that bring elegance and comfort to your home." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Add nav-link styles to CSS
cat >> src/styles/index.css << 'EOF'

.nav-link {
  @apply text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200;
}
EOF

print_status "Frontend setup completed!"

# =============================================================================
# FINAL SETUP
# =============================================================================
cd ..

# Create main README
print_info "Creating project README..."
cat > README.md << 'EOF'
# Furniture Business Website

A full-stack furniture business website built with React (TypeScript) and Django.

## Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Django + Django REST Framework + SQLite3

## Getting Started

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Activate virtual environment:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start development server:
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

   Frontend will be available at: http://localhost:5173

## Project Structure

```
furniture-website/
├── backend/                 # Django backend
│   ├── furniture_project/   # Django project
│   ├── furniture_app/       # Django app
│   ├── media/              # Media files
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json       # Node dependencies
└── README.md              # This file
```

## Features

- Responsive design with Tailwind CSS
- Product catalog with filtering
- Admin dashboard
- Contact form
- Image slider
- Product detail pages

## Development

- Django admin: http://localhost:8000/admin/
- API endpoints: http://localhost:8000/api/
- Frontend: http://localhost:5173

## Next Steps

1. Add sample data through Django admin
2. Implement advanced components (image slider, filters)
3. Add authentication
4. Deploy to production
EOF

# Create startup scripts
print_info "Creating startup scripts..."
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
python manage.py runserver
EOF

cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
npm run dev
EOF

chmod +x start-backend.sh start-frontend.sh

# Create gitignore
print_info "Creating .gitignore..."
cat > .gitignore << 'EOF'
# Backend
backend/venv/
backend/db.sqlite3
backend/media/
backend/__pycache__/
backend/*/__pycache__/
backend/*.pyc
backend/.env

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local

# General
*.log
.DS_Store
.vscode/
*.swp
*.swo
*~
EOF

print_status "Project setup completed successfully! 🎉"

echo ""
print_info "Next steps:"
echo "1. Navigate to the project directory: cd $PROJECT_NAME"
echo "2. Start the backend: ./start-backend.sh"
echo "3. In another terminal, start the frontend: ./start-frontend.sh"
echo "4. Visit Django admin at: http://localhost:8000/admin/"
echo "5. Visit the website at: http://localhost:5173"
echo ""
print_info "Add sample data through Django admin to see the website in action!"
echo ""
print_warning "Don't forget to add your sample furniture data, categories, and slider images!"