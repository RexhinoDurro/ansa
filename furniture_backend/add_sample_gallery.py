#!/usr/bin/env python
"""
Quick script to add sample gallery data for testing
Run from furniture_backend directory: python add_sample_gallery.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'furniture_backend.settings')
django.setup()

from furniture.models import GalleryCategory, GalleryProject, GalleryImage

def create_sample_data():
    print("Creating sample gallery data...")

    # Create categories
    kitchen_cat, _ = GalleryCategory.objects.get_or_create(
        slug='kitchen-projects',
        defaults={
            'name': 'Kitchen Projects',
            'description': 'Custom kitchen designs and installations',
            'is_active': True,
            'sort_order': 1
        }
    )
    print(f"✓ Created category: {kitchen_cat.name}")

    living_cat, _ = GalleryCategory.objects.get_or_create(
        slug='living-room',
        defaults={
            'name': 'Living Room',
            'description': 'Modern living room furniture and designs',
            'is_active': True,
            'sort_order': 2
        }
    )
    print(f"✓ Created category: {living_cat.name}")

    bedroom_cat, _ = GalleryCategory.objects.get_or_create(
        slug='bedroom-wardrobes',
        defaults={
            'name': 'Bedroom & Wardrobes',
            'description': 'Built-in wardrobes and bedroom furniture',
            'is_active': True,
            'sort_order': 3
        }
    )
    print(f"✓ Created category: {bedroom_cat.name}")

    # Create sample projects
    projects_data = [
        {
            'title': 'Modern Oak Kitchen',
            'slug': 'modern-oak-kitchen',
            'gallery_category': kitchen_cat,
            'description': 'A stunning modern kitchen featuring solid oak cabinetry with sleek handleless doors. The design combines natural wood tones with contemporary minimalist aesthetics.',
            'location': 'Milan, Italy',
            'project_date': '2025-01-15',
            'materials_used': 'Solid Oak, Quartz Countertops, Stainless Steel Hardware',
            'featured': True,
            'is_active': True,
        },
        {
            'title': 'Luxury Walnut Living Room',
            'slug': 'luxury-walnut-living-room',
            'gallery_category': living_cat,
            'description': 'Custom-built entertainment unit and shelving in rich walnut wood. Features integrated LED lighting and hidden storage compartments.',
            'location': 'Rome, Italy',
            'project_date': '2025-02-10',
            'materials_used': 'Walnut Veneer, Tempered Glass, LED Lighting',
            'featured': True,
            'is_active': True,
        },
        {
            'title': 'Contemporary White Wardrobe',
            'slug': 'contemporary-white-wardrobe',
            'gallery_category': bedroom_cat,
            'description': 'Floor-to-ceiling built-in wardrobe with sliding mirror doors. Maximizes storage while creating an illusion of space.',
            'location': 'Florence, Italy',
            'project_date': '2024-12-20',
            'materials_used': 'White Lacquer, Mirror Glass, Soft-close Mechanisms',
            'featured': True,
            'is_active': True,
        },
        {
            'title': 'Minimalist Grey Kitchen',
            'slug': 'minimalist-grey-kitchen',
            'gallery_category': kitchen_cat,
            'description': 'Clean lines and neutral tones define this minimalist kitchen. Features include integrated appliances and a large island with breakfast bar.',
            'location': 'Turin, Italy',
            'project_date': '2024-11-05',
            'materials_used': 'Grey Matte Lacquer, Marble Countertops, Chrome Fixtures',
            'featured': True,
            'is_active': True,
        },
        {
            'title': 'Scandinavian Bedroom Suite',
            'slug': 'scandinavian-bedroom-suite',
            'gallery_category': bedroom_cat,
            'description': 'Light wood and minimalist design characterize this Scandinavian-inspired bedroom. Features built-in storage and floating nightstands.',
            'location': 'Venice, Italy',
            'project_date': '2024-10-12',
            'materials_used': 'Birch Wood, White Oak, Natural Linen',
            'featured': True,
            'is_active': True,
        },
        {
            'title': 'Industrial Loft Living Space',
            'slug': 'industrial-loft-living',
            'gallery_category': living_cat,
            'description': 'Custom furniture for a converted industrial loft. Combines raw materials with refined craftsmanship.',
            'location': 'Milan, Italy',
            'project_date': '2024-09-28',
            'materials_used': 'Reclaimed Wood, Steel Frame, Concrete Finish',
            'featured': True,
            'is_active': True,
        },
    ]

    created_projects = []
    for project_data in projects_data:
        project, created = GalleryProject.objects.get_or_create(
            slug=project_data['slug'],
            defaults=project_data
        )
        if created:
            print(f"✓ Created project: {project.title}")
        else:
            print(f"  Project already exists: {project.title}")
        created_projects.append(project)

    print(f"\n✅ Sample data created successfully!")
    print(f"   - {GalleryCategory.objects.count()} categories")
    print(f"   - {GalleryProject.objects.count()} projects")
    print(f"\n📝 Next steps:")
    print(f"   1. Go to http://localhost:8000/admin/")
    print(f"   2. Login with: admin / rexhino23")
    print(f"   3. Add images to your projects in 'Gallery images'")
    print(f"   4. View the portfolio at http://localhost:3000/portfolio")

if __name__ == '__main__':
    create_sample_data()
