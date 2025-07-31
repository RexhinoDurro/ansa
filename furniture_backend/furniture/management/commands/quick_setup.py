# furniture_backend/furniture/management/commands/quick_setup.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from furniture.models import Category, Brand, Product
from decimal import Decimal

class Command(BaseCommand):
    help = 'Quick setup for testing - creates basic categories, brands, and sample products'

    def handle(self, *args, **options):
        self.stdout.write('Setting up basic data for testing...')
        
        # Create superuser if none exists
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user (username: admin, password: admin123)'))
        
        # Create basic categories
        categories_data = [
            {'name': 'Living Room', 'description': 'Furniture for your living space'},
            {'name': 'Bedroom', 'description': 'Bedroom furniture and accessories'},
            {'name': 'Dining Room', 'description': 'Dining tables, chairs, and storage'},
            {'name': 'Office', 'description': 'Home office furniture'},
            {'name': 'Storage', 'description': 'Storage solutions and organization'},
        ]
        
        created_categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'is_active': True,
                    'sort_order': len(created_categories)
                }
            )
            created_categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Create some subcategories
        subcategories_data = [
            {'name': 'Sofas & Couches', 'parent': 'Living Room'},
            {'name': 'Coffee Tables', 'parent': 'Living Room'},
            {'name': 'Beds', 'parent': 'Bedroom'},
            {'name': 'Nightstands', 'parent': 'Bedroom'},
            {'name': 'Dining Tables', 'parent': 'Dining Room'},
            {'name': 'Dining Chairs', 'parent': 'Dining Room'},
            {'name': 'Desks', 'parent': 'Office'},
            {'name': 'Office Chairs', 'parent': 'Office'},
        ]
        
        for subcat_data in subcategories_data:
            try:
                parent_cat = Category.objects.get(name=subcat_data['parent'])
                subcategory, created = Category.objects.get_or_create(
                    name=subcat_data['name'],
                    defaults={
                        'parent_category': parent_cat,
                        'description': f"{subcat_data['name']} for your {parent_cat.name.lower()}",
                        'is_active': True,
                        'sort_order': 0
                    }
                )
                if created:
                    self.stdout.write(f'Created subcategory: {subcategory.name}')
            except Category.DoesNotExist:
                continue
        
        # Create basic brands
        brands_data = [
            {'name': 'IKEA', 'description': 'Swedish furniture retailer'},
            {'name': 'West Elm', 'description': 'Contemporary furniture and home décor'},
            {'name': 'CB2', 'description': 'Modern furniture for urban living'},
            {'name': 'Article', 'description': 'Mid-century modern designs'},
        ]
        
        created_brands = []
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                name=brand_data['name'],
                defaults={
                    'description': brand_data['description'],
                    'is_active': True
                }
            )
            created_brands.append(brand)
            if created:
                self.stdout.write(f'Created brand: {brand.name}')
        
        # Create a few sample products
        if created_categories and created_brands:
            living_room_cat = Category.objects.filter(name='Living Room').first()
            sofa_subcat = Category.objects.filter(name='Sofas & Couches').first()
            brand = created_brands[0]
            
            sample_products = [
                {
                    'name': 'Modern 3-Seat Sofa',
                    'category': living_room_cat,
                    'subcategory': sofa_subcat,
                    'brand': brand,
                    'price': Decimal('899.99'),
                    'description': 'Comfortable modern sofa with clean lines and soft cushions.',
                    'short_description': 'Modern 3-seat sofa with clean lines',
                    'materials': 'fabric',
                    'colors': 'gray',
                    'stock_quantity': 10,
                    'status': 'active',
                    'featured': True
                },
                {
                    'name': 'Glass Coffee Table',
                    'category': living_room_cat,
                    'brand': brand,
                    'price': Decimal('299.99'),
                    'description': 'Elegant tempered glass coffee table with chrome legs.',
                    'short_description': 'Elegant glass coffee table',
                    'materials': 'glass',
                    'colors': 'clear',
                    'stock_quantity': 5,
                    'status': 'active',
                    'featured': False
                }
            ]
            
            for product_data in sample_products:
                product, created = Product.objects.get_or_create(
                    name=product_data['name'],
                    defaults=product_data
                )
                if created:
                    self.stdout.write(f'Created product: {product.name}')
        
        self.stdout.write(self.style.SUCCESS('\n=== SETUP COMPLETE ==='))
        self.stdout.write('You can now:')
        self.stdout.write('1. Login to admin at: http://localhost:5173/admin/login')
        self.stdout.write('   Username: admin')
        self.stdout.write('   Password: admin123')
        self.stdout.write('2. Add more categories in the Category Management section')
        self.stdout.write('3. Add products in the Product Management section')
        self.stdout.write('4. View the public store at: http://localhost:5173')
        self.stdout.write('\nData created:')
        self.stdout.write(f'- Categories: {Category.objects.count()}')
        self.stdout.write(f'- Brands: {Brand.objects.count()}')
        self.stdout.write(f'- Products: {Product.objects.count()}')
        self.stdout.write(f'- Admin users: {User.objects.filter(is_superuser=True).count()}')