# Ansa Furniture - Custom Furniture Studio Implementation Status

## 📋 PROJECT OVERVIEW

Transforming the existing e-commerce platform into a **premium custom furniture studio** with:
- Custom-made furniture focus (kitchens, wardrobes, living rooms, offices)
- Design studio + workshop aesthetic
- Premium, minimal, warm interior design vibe
- Full-stack: Django REST + Next.js 14 App Router

---

## ✅ COMPLETED: Backend (Django)

### 1. **Database Models** (/furniture_backend/furniture/models.py)

**New Models Created:**
- ✅ **Service** - Services offered (Custom Kitchens, Built-in Wardrobes, Living Room Systems, Office Interiors)
  - Fields: title, slug, short_description, description, image, icon, is_active, sort_order
  - Translation support via TranslatableModelMixin

- ✅ **Material** - Materials & finishes available
  - Types: Wood, Fabric/Leather, Hardware, Other
  - Fields: name, type, description, image, is_active, sort_order
  - Image upload path: `/media/materials/{type}/`

- ✅ **Testimonial** - Client testimonials
  - Fields: client_name, text, project (FK to GalleryProject), location, rating (1-5), is_featured, is_active
  - Links testimonials to actual projects in gallery

- ✅ **FAQ** - Frequently Asked Questions
  - Categories: General, Process, Materials, Delivery & Installation, Pricing, Maintenance
  - Fields: question, answer, category, is_active, sort_order

- ✅ **ContactImage** - Inspiration photos uploaded with custom requests
  - FK to CustomRequest with cascade delete
  - Image upload path: `/media/contact/{year}/{month}/`

**Updated Models:**
- ✅ **CustomRequest** - Completely restructured for custom furniture requests:
  ```python
  # Old fields removed: title, width, height, primary_color, style, deadline, additional,
  #                     contact_method, estimated_price, assigned_to, reviewed_at, completed_at

  # New simplified structure:
  - name, email, phone (contact info)
  - room_type (choices: kitchen, living_room, bedroom, wardrobe, office, other)
  - budget_range (choices: <€1,000, €1-3K, €3-6K, >€6K)
  - message (TextField)
  - status (choices: new, in_progress, done)
  - admin_notes (internal notes)
  - images (via ContactImage related model)
  ```

### 2. **Django Admin** (/furniture_backend/furniture/admin.py)

✅ All models registered with proper admin interfaces:
- Service, Material, Testimonial, FAQ admins with list_display, filters, search
- ContactImage inline in CustomRequest admin
- All models support ordering, activation toggles
- Image previews where applicable

### 3. **Database Migration**

✅ Fresh migration created and applied:
```bash
furniture/migrations/0001_initial.py
```
- All 19 models included
- Indexes created for performance
- Foreign keys and constraints properly set

✅ Superuser created:
- Username: `admin`
- Password: `admin123`
- Email: `admin@ansa.com`

---

## 🚧 NEEDS IMPLEMENTATION: Backend API

### Required Files to Create/Update:

#### 1. **/furniture_backend/api/serializers.py** - ADD:

```python
from furniture.models import Service, Material, Testimonial, FAQ, ContactImage

# Service Serializers
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'short_description', 'description',
                  'image', 'icon', 'is_active', 'sort_order']

# Material Serializers
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name', 'type', 'description', 'image', 'is_active', 'sort_order']

# Testimonial Serializers
class TestimonialSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'text', 'project', 'project_title',
                  'location', 'rating', 'is_featured', 'created_at']

# FAQ Serializers
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'is_active', 'sort_order']

# ContactImage Serializer
class ContactImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactImage
        fields = ['id', 'image', 'alt_text', 'created_at']

# Updated CustomRequest Serializer
class CustomRequestSerializer(serializers.ModelSerializer):
    images = ContactImageSerializer(many=True, read_only=True)
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    budget_display = serializers.CharField(read_only=True)

    class Meta:
        model = CustomRequest
        fields = ['id', 'name', 'email', 'phone', 'room_type', 'room_type_display',
                  'budget_range', 'budget_display', 'message', 'status', 'images',
                  'admin_notes', 'created_at', 'updated_at']
        read_only_fields = ['status', 'admin_notes']
```

#### 2. **/furniture_backend/api/views.py** - ADD public endpoints:

```python
from furniture.models import Service, Material, Testimonial, FAQ
from .serializers import ServiceSerializer, MaterialSerializer, TestimonialSerializer, FAQSerializer

@api_view(['GET'])
def service_list(request):
    services = Service.objects.filter(is_active=True).order_by('sort_order')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def material_list(request):
    materials = Material.objects.filter(is_active=True).order_by('type', 'sort_order')
    serializer = MaterialSerializer(materials, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def testimonial_list(request):
    testimonials = Testimonial.objects.filter(is_active=True).order_by('-created_at')
    if request.GET.get('featured') == 'true':
        testimonials = testimonials.filter(is_featured=True)
    serializer = TestimonialSerializer(testimonials, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def faq_list(request):
    faqs = FAQ.objects.filter(is_active=True).order_by('category', 'sort_order')
    category = request.GET.get('category')
    if category:
        faqs = faqs.filter(category=category)
    serializer = FAQSerializer(faqs, many=True)
    return Response(serializer.data)

# Update custom-request to handle image uploads
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def custom_request_create(request):
    serializer = CustomRequestSerializer(data=request.data)
    if serializer.is_valid():
        custom_request = serializer.save()

        # Handle multiple image uploads
        images = request.FILES.getlist('images')
        for image in images:
            ContactImage.objects.create(
                contact_request=custom_request,
                image=image
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### 3. **/furniture_backend/api/admin_views.py** - ADD admin CRUD:

```python
# Add to existing AdminViewSet or create new ones

class AdminServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class AdminMaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAdminUser]

class AdminTestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]

class AdminFAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAdminUser]
```

#### 4. **/furniture_backend/api/urls.py** - ADD routes:

```python
# Public endpoints
path('services/', views.service_list, name='service-list'),
path('materials/', views.material_list, name='material-list'),
path('testimonials/', views.testimonial_list, name='testimonial-list'),
path('faqs/', views.faq_list, name='faq-list'),
path('custom-request/', views.custom_request_create, name='custom-request-create'),

# Admin endpoints
path('admin/services/', admin_views.AdminServiceViewSet.as_view({'get': 'list', 'post': 'create'})),
path('admin/services/<int:pk>/', admin_views.AdminServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
# ... repeat for materials, testimonials, faqs
```

---

## 🚧 NEEDS IMPLEMENTATION: Frontend (Next.js)

### 1. **Tailwind Config** (/client/tailwind.config.js) - UPDATE:

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Custom Furniture Studio Colors
        cream: {
          50: '#FAFAF7',
          100: '#F7F3EE',
          200: '#F0EAE3',
        },
        brown: {
          900: '#241D1A',
          800: '#1F2933',
        },
        accent: {
          DEFAULT: '#1F4D3A', // Deep green (or use #C46A3C for terracotta)
          dark: '#163A2C',
          light: '#2D6B4F',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'card': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
```

### 2. **New Components Needed:**

#### a) **/client/src/components/home/Hero.tsx**
- Full-width hero section
- Large background image
- Title: "Custom Furniture, Built for Your Space"
- Subtitle: "From idea to installation..."
- Two CTAs: "Request a Custom Design" + "View Our Work"

#### b) **/client/src/components/home/WhyChoose.tsx**
- Accordion/dropdown cards (no icons)
- 4 points: Quality Materials, Made-to-Measure, Design & Installation, After-Sales
- Smooth expand/collapse animation

#### c) **/client/src/components/home/Process.tsx**
- 4-step timeline: Consultation → 3D Design → Crafting → Delivery
- Horizontal stepper with connectors

#### d) **/client/src/components/home/PortfolioPreview.tsx**
- Grid of 6 project cards from GalleryProject
- Hover: zoom + shadow effect
- Link to /portfolio

#### e) **/client/src/components/home/Testimonials.tsx**
- 2-4 testimonial cards
- Fetch from /api/testimonials/?featured=true

#### f) **/client/src/components/home/ContactForm.tsx**
- Fields: name, email, phone (optional), room_type (select), budget_range (select), message
- Multiple file upload for inspiration images
- POST to /api/custom-request/ with multipart/form-data

### 3. **New Pages:**

- `/app/(public)/portfolio/page.tsx` - Portfolio listing with category filter
- `/app/(public)/portfolio/[slug]/page.tsx` - Project detail with image gallery
- `/app/(public)/services/page.tsx` - Services listing
- `/app/(public)/materials/page.tsx` - Materials grid
- `/app/(public)/faq/page.tsx` - FAQ with accordions
- `/app/admin/services/page.tsx` - Admin service management
- `/app/admin/materials/page.tsx` - Admin material management
- `/app/admin/testimonials/page.tsx` - Admin testimonial management
- `/app/admin/faqs/page.tsx` - Admin FAQ management

### 4. **Update Existing:**

#### `/app/admin/orders/page.tsx` (CustomRequestManager.tsx):
```typescript
// Update to show:
- Room type (instead of old fields)
- Budget range
- Message
- Phone number prominently
- Email prominently
- Uploaded images in a gallery
- Status dropdown (new, in_progress, done)
```

---

## 📦 DATABASE CONFIGURATION

### Current: SQLite (development)
### Recommended for Production: PostgreSQL

**To switch to PostgreSQL:**

1. Install psycopg2:
```bash
pip install psycopg2-binary
```

2. Update /furniture_backend/furniture_backend/settings.py:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ansa_furniture',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 🎨 DESIGN SYSTEM

### Colors:
- **Background:** #F7F3EE (light beige/cream)
- **Text:** #241D1A (dark brown)
- **Accent:** #1F4D3A (deep green) OR #C46A3C (terracotta)

### Typography:
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans)
- **H1:** 42-56px

### Layout:
- **Container:** max-width 1200px
- **Cards:** border-radius 16-24px, subtle shadow
- **Grid:** 2-3 columns for portfolio/services

### Animations:
- Fade + slide up on scroll (subtle, 0.3s)
- Hover zoom on images (scale 1.02)
- Accordion expand/collapse smooth transition

---

## 🔐 AUTHENTICATION

### Current: Session-based (cookies)
### Recommended: Add JWT for scalability

**To add JWT:**

1. Install:
```bash
pip install djangorestframework-simplejwt
```

2. Configure in settings.py:
```python
INSTALLED_APPS += ['rest_framework_simplejwt']

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

3. Add URLs:
```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
```

---

## 🌱 SEED DATA

Create `/furniture_backend/furniture/management/commands/seed_studio_data.py`:

```python
from django.core.management.base import BaseCommand
from furniture.models import Service, Material, Testimonial, FAQ, GalleryCategory

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Services
        Service.objects.get_or_create(
            title="Custom Kitchens",
            defaults={
                'short_description': "Tailored kitchen designs for your space",
                'description': "From modern minimalist to classic traditional...",
                'is_active': True,
                'sort_order': 1
            }
        )
        # Add more services...

        # Materials
        Material.objects.get_or_create(
            name="Solid Oak",
            defaults={
                'type': 'wood',
                'description': "Premium solid oak with natural grain...",
                'is_active': True
            }
        )
        # Add more materials...

        # FAQs
        FAQ.objects.get_or_create(
            question="How long does a project take?",
            defaults={
                'answer': "Most projects take 4-8 weeks from design to installation...",
                'category': 'process',
                'is_active': True,
                'sort_order': 1
            }
        )
        # Add more FAQs...

        self.stdout.write(self.style.SUCCESS('Seed data created!'))
```

Run: `python manage.py seed_studio_data`

---

## 🚀 NEXT STEPS (Priority Order)

1. **✅ DONE:** Backend models & migrations
2. **🔄 IN PROGRESS:** API serializers & endpoints
3. **⏳ TODO:** Update Tailwind with design system
4. **⏳ TODO:** Create Home page components
5. **⏳ TODO:** Build Portfolio, Services, Materials, FAQ pages
6. **⏳ TODO:** Update admin dashboard for custom requests
7. **⏳ TODO:** Create admin CRUD for new models
8. **⏳ TODO:** Add animations
9. **⏳ TODO:** Seed data & testing

---

## 📁 FILE STRUCTURE

```
ansa/
├── furniture_backend/
│   ├── furniture/
│   │   ├── models.py ✅ (19 models including new ones)
│   │   ├── admin.py ✅ (all models registered)
│   │   ├── migrations/ ✅
│   │   └── management/commands/
│   │       └── seed_studio_data.py ⏳ (needs creation)
│   ├── api/
│   │   ├── serializers.py 🔄 (needs new serializers)
│   │   ├── views.py 🔄 (needs new endpoints)
│   │   ├── admin_views.py 🔄 (needs CRUD viewsets)
│   │   └── urls.py 🔄 (needs new routes)
│   └── db.sqlite3 ✅ (migrated, superuser created)
│
├── client/
│   ├── tailwind.config.js ⏳ (needs premium design update)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx ⏳ (update home page)
│   │   │   │   ├── portfolio/ ⏳ (new)
│   │   │   │   ├── services/ ⏳ (new)
│   │   │   │   ├── materials/ ⏳ (new)
│   │   │   │   └── faq/ ⏳ (new)
│   │   │   └── admin/
│   │   │       ├── orders/page.tsx 🔄 (update custom requests)
│   │   │       ├── services/ ⏳ (new)
│   │   │       ├── materials/ ⏳ (new)
│   │   │       ├── testimonials/ ⏳ (new)
│   │   │       └── faqs/ ⏳ (new)
│   │   └── components/
│   │       ├── home/ ⏳ (new components)
│   │       └── admin/ 🔄 (update existing)
│
└── IMPLEMENTATION_STATUS.md ✅ (this file)
```

---

## ⚡ QUICK START

1. **Start Backend:**
```bash
cd furniture_backend
../venv/bin/python manage.py runserver
```

2. **Start Frontend:**
```bash
cd client
npm run dev
```

3. **Access:**
- Frontend: http://localhost:3000
- Django Admin: http://localhost:8000/admin (admin/admin123)
- API: http://localhost:8000/api/

---

## 💡 NOTES

- All new models support **multi-language** translation (EN, IT, AL) via existing translation system
- Image uploads configured with proper media handling (organized by type/date)
- Existing e-commerce models (Product, Category, Brand) are **preserved** - you can choose to hide or repurpose them
- Gallery system (GalleryProject/GalleryImage) serves as the **Portfolio**
- Admin dashboard layout and authentication system remain unchanged

---

**Status:** Backend foundation complete. API layer and frontend implementation in progress.
