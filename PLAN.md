# Implementation Plan - ANSA Furniture Website

## Completed ✓

### Backend Simplification
- [x] Removed Product and Category models from backend
- [x] Updated admin.py to remove product/category registrations
- [x] Simplified models.py to keep only:
  - Gallery (GalleryCategory, GalleryProject, GalleryImage) - Portfolio system
  - Contact (CustomRequest, ContactImage, ContactMessage)
  - Services, Materials, Testimonials, FAQ
- [x] Removed ~1,347 lines of code and 15+ ViewSets/Views
- [x] Updated API URLs to remove product/category endpoints
- [x] Created fresh database migrations
- [x] Created superuser (admin/rexhino23)

## Next Steps - Frontend Cleanup

### 1. Remove Product/Category Pages & Components
**Priority: HIGH**

Frontend files to remove/update:
```
client/src/app/(public)/catalogue/page.tsx - DELETE
client/src/app/(public)/product/[slug]/page.tsx - DELETE
client/src/components/ProductCard.tsx - DELETE (if exists)
client/src/components/CategoryList.tsx - DELETE (if exists)
```

Update these files to remove product references:
```
client/src/app/(public)/page.tsx - Remove featured products section
client/src/components/layout/Navbar.tsx - Remove catalogue/products links
client/src/components/layout/Footer.tsx - Remove product links
```

### 2. Simplify Frontend Routing
**Priority: HIGH**

Keep only these public pages:
- `/` - Home page
- `/portfolio` - Gallery/Portfolio (shows GalleryProjects)
- `/services` - Services offered
- `/contact` - Contact form with CustomRequest functionality

Remove from navigation:
- Catalogue/Products pages
- Category browsing
- Product detail pages

### 3. Implement Frontend-Only Language Switching
**Priority: MEDIUM**

Location: `client/src/contexts/LanguageContext.tsx` or similar

**Implementation approach:**
```typescript
// 1. Create language context with i18next
// 2. Store translations in JSON files:
//    - client/public/locales/en/translation.json
//    - client/public/locales/it/translation.json
//    - client/public/locales/al/translation.json

// 3. Language switcher component in Navbar
// 4. Use localStorage to persist language preference
// 5. NO backend translation needed - all client-side
```

**Translation files structure:**
```json
{
  "nav": {
    "home": "Home",
    "portfolio": "Portfolio",
    "services": "Services",
    "contact": "Contact"
  },
  "home": {
    "hero_title": "Custom Furniture Design",
    "hero_subtitle": "...",
    ...
  }
}
```

### 4. Update Admin Dashboard Components
**Priority: MEDIUM**

Files to update:
```
client/src/app/admin/dashboard/page.tsx
client/src/components/admin/*
```

Remove:
- Product management components
- Category management components
- Inventory/stock management

Keep only:
- Gallery/Portfolio management
- Custom Request management
- Contact Message management
- Services/Materials/Testimonials/FAQ management

Simplify dashboard to show:
- New custom requests count
- Unread contact messages count
- Total portfolio projects count
- Recent activity feed

### 5. Update API Integration
**Priority: HIGH**

Update frontend API calls:
```typescript
// Remove these API endpoints from frontend:
- /api/products/
- /api/categories/
- /api/featured-products/

// Keep these:
- /api/gallery-categories/
- /api/gallery-projects/
- /api/custom-request/
- /api/contact/
- /api/services/
- /api/materials/
- /api/testimonials/
- /api/faqs/
```

### 6. Portfolio Page Implementation
**Priority: HIGH**

The portfolio page should:
- Fetch gallery projects from `/api/gallery-projects/`
- Display project cards with primary image
- Filter by gallery category
- Click to view project details with all images
- Show project name/title prominently

**Component structure:**
```
client/src/app/(public)/portfolio/page.tsx
client/src/components/PortfolioGrid.tsx
client/src/components/ProjectCard.tsx
client/src/components/ProjectDetail.tsx
```

## Backend Admin URLs

Django Admin: `http://localhost:8000/admin/`
- Username: `admin`
- Password: `rexhino23`

API Admin: `http://localhost:8000/api/admin/`
- Manage gallery projects
- View/update custom requests
- Manage services, materials, testimonials, FAQs

## Current System Architecture

### Backend (Django REST Framework)
```
Models:
├── Gallery System (Portfolio)
│   ├── GalleryCategory
│   ├── GalleryProject (shown on /portfolio)
│   └── GalleryImage
├── Contact System
│   ├── CustomRequest (from contact form)
│   ├── ContactImage
│   └── ContactMessage
└── Content System
    ├── Service
    ├── Material
    ├── Testimonial
    └── FAQ
```

### Frontend (Next.js)
```
Public Pages:
├── / (Home)
├── /portfolio (Gallery Projects)
├── /services
└── /contact

Admin Pages:
├── /admin/login
└── /admin/dashboard
    ├── Gallery Management
    ├── Custom Requests
    ├── Contact Messages
    └── Content Management (Services/Materials/etc)
```

## Testing Checklist

After completing frontend changes:

- [ ] Backend API endpoints return correct data
- [ ] Portfolio page displays gallery projects
- [ ] Contact form submits custom requests
- [ ] Admin dashboard shows correct stats
- [ ] Language switching works (EN/IT/AL)
- [ ] Navigation links are correct
- [ ] No broken links or 404 errors
- [ ] Admin can upload/manage gallery projects
- [ ] Admin can view/update custom requests

## Notes

- Database has been completely reset with new schema
- All old product/category data has been removed
- Backend is running on port 8000
- Frontend needs to be updated to match new backend structure
- Translations are frontend-only using i18next (no backend translation needed)
