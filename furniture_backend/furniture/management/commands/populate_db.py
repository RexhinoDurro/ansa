import os
import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils import timezone
from django.utils.text import slugify
from furniture.models import (
    Category, Brand, Product, ProductImage, ProductReview, 
    HomeSlider, ContactMessage, Newsletter, ProductCollection
)
from io import BytesIO

class Command(BaseCommand):
    help = 'Populate database with sample furniture store data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before populating',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            self.clear_data()

        self.stdout.write('Starting database population...')
        
        # Create data in order of dependencies
        brands = self.create_brands()
        categories = self.create_categories()
        products = self.create_products(categories, brands)
        self.create_product_images(products)
        self.create_product_reviews(products)
        self.create_home_slider()
        self.create_contact_messages()
        self.create_newsletter_subscriptions()
        self.create_product_collections(products)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data!')
        )
        self.print_summary()

    def clear_data(self):
        """Clear existing data"""
        ProductCollection.objects.all().delete()
        Newsletter.objects.all().delete()
        ContactMessage.objects.all().delete()
        HomeSlider.objects.all().delete()
        ProductReview.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Brand.objects.all().delete()
        Category.objects.all().delete()

    def create_brands(self):
        """Create furniture brands"""
        brands_data = [
            {
                'name': 'IKEA',
                'description': 'Swedish furniture retailer known for affordable, modern designs and flat-pack furniture.',
                'website': 'https://ikea.com'
            },
            {
                'name': 'West Elm',
                'description': 'Contemporary furniture and home décor company offering modern designs.',
                'website': 'https://westelm.com'
            },
            {
                'name': 'CB2',
                'description': 'Modern furniture and home accessories for urban living.',
                'website': 'https://cb2.com'
            },
            {
                'name': 'Article',
                'description': 'Direct-to-consumer furniture brand specializing in mid-century modern designs.',
                'website': 'https://article.com'
            },
            {
                'name': 'Herman Miller',
                'description': 'Premium furniture manufacturer known for iconic office and home furniture.',
                'website': 'https://hermanmiller.com'
            },
            {
                'name': 'Pottery Barn',
                'description': 'American furniture and home furnishing retail chain.',
                'website': 'https://potterybarn.com'
            },
            {
                'name': 'Restoration Hardware',
                'description': 'Luxury home furnishings company offering high-end furniture and décor.',
                'website': 'https://rh.com'
            },
            {
                'name': 'Wayfair',
                'description': 'Online furniture and home goods retailer.',
                'website': 'https://wayfair.com'
            }
        ]

        brands = []
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                name=brand_data['name'],
                defaults=brand_data
            )
            brands.append(brand)
            if created:
                self.stdout.write(f'Created brand: {brand.name}')

        return brands

    def create_categories(self):
        """Create furniture categories"""
        categories_data = [
            {
                'name': 'Living Room',
                'description': 'Comfortable seating and furniture for your living space',
                'subcategories': ['Sofas & Couches', 'Coffee Tables', 'TV Stands', 'Armchairs', 'Side Tables']
            },
            {
                'name': 'Bedroom',
                'description': 'Everything you need for a comfortable bedroom',
                'subcategories': ['Beds', 'Nightstands', 'Dressers', 'Wardrobes', 'Mattresses']
            },
            {
                'name': 'Dining Room',
                'description': 'Dining furniture for family meals and entertaining',
                'subcategories': ['Dining Tables', 'Dining Chairs', 'Bar Stools', 'Buffets', 'China Cabinets']
            },
            {
                'name': 'Office',
                'description': 'Productive workspace furniture',
                'subcategories': ['Desks', 'Office Chairs', 'Bookcases', 'Filing Cabinets', 'Desk Accessories']
            },
            {
                'name': 'Storage',
                'description': 'Organization and storage solutions',
                'subcategories': ['Shelving Units', 'Storage Cabinets', 'Closet Organizers', 'Storage Bins', 'Coat Racks']
            },
            {
                'name': 'Outdoor',
                'description': 'Outdoor furniture and patio essentials',
                'subcategories': ['Patio Sets', 'Outdoor Chairs', 'Garden Benches', 'Umbrellas', 'Fire Pits']
            }
        ]

        categories = []
        for cat_data in categories_data:
            # Create parent category
            parent_cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'sort_order': len(categories)
                }
            )
            categories.append(parent_cat)
            if created:
                self.stdout.write(f'Created category: {parent_cat.name}')

            # Create subcategories
            for i, subcat_name in enumerate(cat_data['subcategories']):
                subcat, created = Category.objects.get_or_create(
                    name=subcat_name,
                    defaults={
                        'parent_category': parent_cat,
                        'description': f'{subcat_name} for your {parent_cat.name.lower()}',
                        'sort_order': i
                    }
                )
                categories.append(subcat)
                if created:
                    self.stdout.write(f'Created subcategory: {subcat.name}')

        return categories

    def create_products(self, categories, brands):
        """Create sample products"""
        # Sample product data with realistic furniture items
        products_data = [
            # Living Room
            {
                'name': 'Modern 3-Seat Sofa',
                'category': 'Living Room',
                'subcategory': 'Sofas & Couches',
                'price': 899.99,
                'sale_price': 749.99,
                'material': 'fabric',
                'color': 'gray',
                'description': 'Comfortable modern sofa with clean lines and soft cushions. Perfect for contemporary living spaces.',
                'dimensions': [210, 85, 80],
                'weight': 45,
                'featured': True,
                'is_bestseller': True
            },
            {
                'name': 'Glass Coffee Table',
                'category': 'Living Room',
                'subcategory': 'Coffee Tables',
                'price': 299.99,
                'material': 'glass',
                'color': 'clear',
                'description': 'Elegant tempered glass coffee table with chrome legs.',
                'dimensions': [120, 60, 45],
                'weight': 25,
                'featured': True
            },
            {
                'name': 'Leather Armchair',
                'category': 'Living Room',
                'subcategory': 'Armchairs',
                'price': 549.99,
                'material': 'leather',
                'color': 'brown',
                'description': 'Classic leather armchair with solid wood frame.',
                'dimensions': [80, 85, 95],
                'weight': 35,
                'is_new_arrival': True
            },
            # Bedroom
            {
                'name': 'Queen Platform Bed',
                'category': 'Bedroom',
                'subcategory': 'Beds',
                'price': 699.99,
                'material': 'wood',
                'color': 'oak',
                'description': 'Modern platform bed with built-in nightstands.',
                'dimensions': [165, 215, 85],
                'weight': 60,
                'featured': True,
                'requires_assembly': True,
                'assembly_time_minutes': 120
            },
            {
                'name': 'Wooden Nightstand',
                'category': 'Bedroom',
                'subcategory': 'Nightstands',
                'price': 149.99,
                'material': 'wood',
                'color': 'walnut',
                'description': 'Solid wood nightstand with two drawers.',
                'dimensions': [50, 40, 60],
                'weight': 15,
                'is_bestseller': True
            },
            {
                'name': '6-Drawer Dresser',
                'category': 'Bedroom',
                'subcategory': 'Dressers',
                'price': 449.99,
                'material': 'wood',
                'color': 'white',
                'description': 'Spacious dresser with ample storage space.',
                'dimensions': [150, 45, 80],
                'weight': 45,
                'requires_assembly': True
            },
            # Dining Room
            {
                'name': 'Extendable Dining Table',
                'category': 'Dining Room',
                'subcategory': 'Dining Tables',
                'price': 799.99,
                'sale_price': 649.99,
                'material': 'wood',
                'color': 'oak',
                'description': 'Beautiful oak dining table that extends to seat 8 people.',
                'dimensions': [180, 90, 75],
                'weight': 55,
                'featured': True,
                'requires_assembly': True
            },
            {
                'name': 'Upholstered Dining Chair',
                'category': 'Dining Room',
                'subcategory': 'Dining Chairs',
                'price': 89.99,
                'material': 'fabric',
                'color': 'beige',
                'description': 'Comfortable upholstered dining chair with wooden legs.',
                'dimensions': [45, 55, 85],
                'weight': 8,
                'is_bestseller': True
            },
            {
                'name': 'Modern Bar Stool',
                'category': 'Dining Room',
                'subcategory': 'Bar Stools',
                'price': 129.99,
                'material': 'metal',
                'color': 'black',
                'description': 'Adjustable height bar stool with back support.',
                'dimensions': [40, 40, 95],
                'weight': 12,
                'is_new_arrival': True
            },
            # Office
            {
                'name': 'Executive Office Desk',
                'category': 'Office',
                'subcategory': 'Desks',
                'price': 599.99,
                'material': 'wood',
                'color': 'mahogany',
                'description': 'Large executive desk with built-in drawers and cable management.',
                'dimensions': [160, 80, 75],
                'weight': 50,
                'featured': True,
                'requires_assembly': True
            },
            {
                'name': 'Ergonomic Office Chair',
                'category': 'Office',
                'subcategory': 'Office Chairs',
                'price': 349.99,
                'sale_price': 279.99,
                'material': 'fabric',
                'color': 'black',
                'description': 'Ergonomic office chair with lumbar support and adjustable height.',
                'dimensions': [65, 65, 110],
                'weight': 22,
                'is_bestseller': True
            },
            {
                'name': '5-Shelf Bookcase',
                'category': 'Office',
                'subcategory': 'Bookcases',
                'price': 199.99,
                'material': 'wood',
                'color': 'white',
                'description': 'Tall bookcase with 5 adjustable shelves.',
                'dimensions': [80, 30, 180],
                'weight': 35,
                'requires_assembly': True
            },
            # Storage
            {
                'name': 'Modular Storage Unit',
                'category': 'Storage',
                'subcategory': 'Shelving Units',
                'price': 259.99,
                'material': 'wood',
                'color': 'natural',
                'description': 'Versatile modular storage system that can be configured multiple ways.',
                'dimensions': [120, 40, 160],
                'weight': 30,
                'is_new_arrival': True
            },
            {
                'name': 'Storage Cabinet',
                'category': 'Storage',
                'subcategory': 'Storage Cabinets',
                'price': 179.99,
                'material': 'wood',
                'color': 'gray',
                'description': 'Two-door storage cabinet with internal shelving.',
                'dimensions': [80, 40, 120],
                'weight': 25
            },
            # Outdoor
            {
                'name': '4-Piece Patio Set',
                'category': 'Outdoor',
                'subcategory': 'Patio Sets',
                'price': 699.99,
                'sale_price': 549.99,
                'material': 'rattan',
                'color': 'brown',
                'description': 'Weather-resistant wicker patio set with cushions.',
                'dimensions': [150, 80, 75],
                'weight': 40,
                'featured': True,
                'free_shipping': True
            },
            {
                'name': 'Teak Garden Bench',
                'category': 'Outdoor',
                'subcategory': 'Garden Benches',
                'price': 299.99,
                'material': 'wood',
                'color': 'natural',
                'description': 'Solid teak garden bench that weathers beautifully.',
                'dimensions': [120, 55, 85],
                'weight': 28,
                'condition': 'new'
            }
        ]

        products = []
        for i, prod_data in enumerate(products_data):
            # Find category and subcategory
            try:
                category = Category.objects.get(name=prod_data['category'])
                subcategory = None
                if prod_data.get('subcategory'):
                    subcategory = Category.objects.get(
                        name=prod_data['subcategory'],
                        parent_category=category
                    )
            except Category.DoesNotExist:
                self.stdout.write(f"Category not found: {prod_data['category']}")
                continue

            # Random brand
            brand = random.choice(brands)

            # Create product
            product_defaults = {
                'short_description': prod_data['description'][:200],
                'description': prod_data['description'] + '\n\nThis piece combines functionality with style, perfect for modern homes. Crafted with attention to detail and built to last.',
                'category': category,
                'subcategory': subcategory,
                'brand': brand,
                'price': Decimal(str(prod_data['price'])),
                'materials': prod_data.get('material', 'wood'),
                'colors': prod_data.get('color', 'natural'),
                'condition': prod_data.get('condition', 'new'),
                'stock_quantity': random.randint(5, 50),
                'featured': prod_data.get('featured', False),
                'is_bestseller': prod_data.get('is_bestseller', False),
                'is_new_arrival': prod_data.get('is_new_arrival', False),
                'requires_assembly': prod_data.get('requires_assembly', False),
                'assembly_time_minutes': prod_data.get('assembly_time_minutes'),
                'free_shipping': prod_data.get('free_shipping', False),
                'weight': prod_data.get('weight'),
                'specifications': f"Material: {prod_data.get('material', 'Wood').title()}\nColor: {prod_data.get('color', 'Natural').title()}\nCondition: {prod_data.get('condition', 'New').title()}",
                'care_instructions': 'Clean with a soft, dry cloth. Avoid harsh chemicals. For wood furniture, use appropriate wood polish occasionally.',
                'meta_title': f"{prod_data['name']} - Premium Furniture",
                'meta_description': prod_data['description'][:150]
            }

            if prod_data.get('sale_price'):
                product_defaults['sale_price'] = Decimal(str(prod_data['sale_price']))

            if prod_data.get('dimensions'):
                dims = prod_data['dimensions']
                product_defaults.update({
                    'dimensions_length': Decimal(str(dims[0])),
                    'dimensions_width': Decimal(str(dims[1])),
                    'dimensions_height': Decimal(str(dims[2]))
                })

            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults=product_defaults
            )
            
            products.append(product)
            if created:
                self.stdout.write(f'Created product: {product.name}')

        return products

    def create_product_images(self, products):
        """Create sample product images"""
        # Unsplash furniture image IDs for different categories
        furniture_images = {
            'sofa': ['photo-1586023492125-27b2c045efd7', 'photo-1555041469-a586c61ea9bc'],
            'table': ['photo-1549497538-303791108f95', 'photo-1581539250439-c96689b516dd'],
            'chair': ['photo-1506439773649-6e0eb8cfb237', 'photo-1549497538-303791108f95'],
            'bed': ['photo-1540932239986-30128078f3c5', 'photo-1586023492125-27b2c045efd7'],
            'desk': ['photo-1541558869434-2840d308329a', 'photo-1549497538-303791108f95'],
            'outdoor': ['photo-1519947486511-46149fa0a254', 'photo-1600596542815-ffad4c1539a9'],
            'storage': ['photo-1586023492125-27b2c045efd7', 'photo-1555041469-a586c61ea9bc']
        }

        for product in products:
            # Determine image category based on product name/category
            image_category = 'table'  # default
            product_name_lower = product.name.lower()
            if 'sofa' in product_name_lower or 'couch' in product_name_lower:
                image_category = 'sofa'
            elif 'chair' in product_name_lower:
                image_category = 'chair'
            elif 'table' in product_name_lower:
                image_category = 'table'
            elif 'bed' in product_name_lower:
                image_category = 'bed'
            elif 'desk' in product_name_lower:
                image_category = 'desk'
            elif 'outdoor' in product_name_lower or 'patio' in product_name_lower:
                image_category = 'outdoor'
            elif 'storage' in product_name_lower or 'cabinet' in product_name_lower or 'shelf' in product_name_lower:
                image_category = 'storage'

            # Create 2-4 images per product
            num_images = random.randint(2, 4)
            available_images = furniture_images.get(image_category, furniture_images['table'])
            
            for i in range(num_images):
                image_id = random.choice(available_images)
                image_url = f'https://images.unsplash.com/{image_id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                
                # Create ProductImage (without actually downloading the image in this demo)
                product_image = ProductImage.objects.create(
                    product=product,
                    image=f'products/sample_{product.id}_{i+1}.jpg',  # Mock path
                    alt_text=f'{product.name} - View {i+1}',
                    is_primary=(i == 0),  # First image is primary
                    order=i
                )

        self.stdout.write(f'Created sample product images')

    def create_product_reviews(self, products):
        """Create sample product reviews"""
        sample_reviews = [
            {
                'name': 'Sarah Johnson',
                'email': 'sarah.j@example.com',
                'rating': 5,
                'title': 'Excellent quality!',
                'comment': 'This piece exceeded my expectations. The quality is outstanding and it looks beautiful in my home.'
            },
            {
                'name': 'Mike Chen',
                'email': 'mike.chen@example.com',
                'rating': 4,
                'title': 'Great value for money',
                'comment': 'Very happy with this purchase. Easy to assemble and looks great. Would recommend!'
            },
            {
                'name': 'Emma Wilson',
                'email': 'emma.w@example.com',
                'rating': 5,
                'title': 'Love it!',
                'comment': 'Perfect addition to my living room. The color matches perfectly and the comfort is amazing.'
            },
            {
                'name': 'David Brown',
                'email': 'david.brown@example.com',
                'rating': 4,
                'title': 'Solid construction',
                'comment': 'Well-built furniture that should last for years. Assembly instructions were clear and helpful.'
            },
            {
                'name': 'Lisa Martinez',
                'email': 'lisa.m@example.com',
                'rating': 5,
                'title': 'Highly recommend',
                'comment': 'Beautiful craftsmanship and attention to detail. This piece has become the focal point of our room.'
            },
            {
                'name': 'John Anderson',
                'email': 'john.a@example.com',
                'rating': 3,
                'title': 'Good but not perfect',
                'comment': 'Overall satisfied with the purchase. A few minor issues with finishing, but still a good value.'
            }
        ]

        # Add reviews to random products
        reviewed_products = random.sample(products, min(len(products), 12))
        
        for product in reviewed_products:
            num_reviews = random.randint(1, 4)
            selected_reviews = random.sample(sample_reviews, num_reviews)
            
            for review_data in selected_reviews:
                ProductReview.objects.create(
                    product=product,
                    name=review_data['name'],
                    email=review_data['email'],
                    rating=review_data['rating'],
                    title=review_data['title'],
                    comment=review_data['comment'],
                    is_verified_purchase=random.choice([True, False]),
                    is_approved=True,
                    helpful_count=random.randint(0, 15)
                )

        self.stdout.write(f'Created product reviews for {len(reviewed_products)} products')

    def create_home_slider(self):
        """Create home page slider content"""
        slider_data = [
            {
                'title': 'Modern Living',
                'subtitle': 'Discover Contemporary Furniture',
                'description': 'Transform your space with our carefully curated collection of modern furniture pieces',
                'link_url': '/catalogue',
                'link_text': 'Shop Now',
                'order': 1
            },
            {
                'title': 'Comfort & Style',
                'subtitle': 'Premium Seating Collection',
                'description': 'Experience ultimate comfort with our luxury chairs and sofas designed for modern living',
                'link_url': '/catalogue?category=living-room',
                'link_text': 'Explore',
                'order': 2
            },
            {
                'title': 'Handcrafted Excellence',
                'subtitle': 'Artisan Made Furniture',
                'description': 'Each piece tells a story of craftsmanship and attention to detail',
                'link_url': '/about',
                'link_text': 'Learn More',
                'order': 3
            }
        ]

        for slide_data in slider_data:
            HomeSlider.objects.create(
                title=slide_data['title'],
                subtitle=slide_data['subtitle'],
                description=slide_data['description'],
                image='slider/sample_slide.jpg',  # Mock path
                link_url=slide_data['link_url'],
                link_text=slide_data['link_text'],
                order=slide_data['order'],
                is_active=True
            )

        self.stdout.write('Created home slider content')

    def create_contact_messages(self):
        """Create sample contact messages"""
        messages_data = [
            {
                'name': 'Jennifer Adams',
                'email': 'jennifer.adams@example.com',
                'phone': '+1-555-0123',
                'subject': 'product',
                'message': 'Hi, I\'m interested in the Modern 3-Seat Sofa. Do you have it available in navy blue? Also, what are the delivery options for zip code 90210?'
            },
            {
                'name': 'Robert Taylor',
                'email': 'robert.taylor@example.com',
                'subject': 'custom',
                'message': 'I\'m looking for a custom dining table for 10 people. Can you provide a quote for a solid oak table with specific dimensions?'
            },
            {
                'name': 'Maria Garcia',
                'email': 'maria.garcia@example.com',
                'phone': '+1-555-0456',
                'subject': 'shipping',
                'message': 'I placed an order last week (Order #12345) and wanted to check on the shipping status. When can I expect delivery?'
            },
            {
                'name': 'Thomas Wilson',
                'email': 'thomas.wilson@example.com',
                'subject': 'general',
                'message': 'Do you offer interior design consultation services? I\'m furnishing a new home and would love some professional advice.'
            },
            {
                'name': 'Amanda Lee',
                'email': 'amanda.lee@example.com',
                'subject': 'feedback',
                'message': 'Just wanted to say thank you for the excellent service. The Queen Platform Bed we purchased is beautiful and the delivery team was very professional.'
            }
        ]

        for msg_data in messages_data:
            ContactMessage.objects.create(
                name=msg_data['name'],
                email=msg_data['email'],
                phone=msg_data.get('phone', ''),
                subject=msg_data['subject'],
                message=msg_data['message'],
                is_read=random.choice([True, False])
            )

        self.stdout.write('Created sample contact messages')

    def create_newsletter_subscriptions(self):
        """Create sample newsletter subscriptions"""
        subscribers = [
            {'email': 'newsletter1@example.com', 'name': 'Alex Johnson'},
            {'email': 'newsletter2@example.com', 'name': 'Sarah Davis'},
            {'email': 'newsletter3@example.com', 'name': 'Mike Thompson'},
            {'email': 'newsletter4@example.com', 'name': 'Emily Rodriguez'},
            {'email': 'newsletter5@example.com', 'name': 'Daniel Kim'},
            {'email': 'newsletter6@example.com', 'name': 'Jessica White'},
            {'email': 'newsletter7@example.com', 'name': 'Christopher Miller'},
            {'email': 'newsletter8@example.com', 'name': 'Ashley Brown'}
        ]

        for subscriber in subscribers:
            Newsletter.objects.create(
                email=subscriber['email'],
                name=subscriber['name']
            )

        self.stdout.write('Created newsletter subscriptions')

    def create_product_collections(self, products):
        """Create product collections"""
        collections_data = [
            {
                'name': 'Modern Living Room Set',
                'description': 'Complete your living room with this coordinated set of modern furniture pieces.',
                'featured': True,
                'product_names': ['Modern 3-Seat Sofa', 'Glass Coffee Table', 'Leather Armchair']
            },
            {
                'name': 'Home Office Essentials',
                'description': 'Everything you need for a productive home office setup.',
                'featured': True,
                'product_names': ['Executive Office Desk', 'Ergonomic Office Chair', '5-Shelf Bookcase']
            },
            {
                'name': 'Bedroom Basics',
                'description': 'Essential furniture pieces to create a comfortable bedroom retreat.',
                'featured': False,
                'product_names': ['Queen Platform Bed', 'Wooden Nightstand', '6-Drawer Dresser']
            }
        ]

        for coll_data in collections_data:
            collection = ProductCollection.objects.create(
                name=coll_data['name'],
                description=coll_data['description'],
                image='collections/sample_collection.jpg',  # Mock path
                featured=coll_data['featured']
            )

            # Add products to collection
            for product_name in coll_data['product_names']:
                try:
                    product = Product.objects.get(name=product_name)
                    collection.products.add(product)
                except Product.DoesNotExist:
                    pass

        self.stdout.write('Created product collections')

    def print_summary(self):
        """Print summary of created data"""
        self.stdout.write('\n' + '='*50)
        self.stdout.write('DATABASE POPULATION SUMMARY')
        self.stdout.write('='*50)
        self.stdout.write(f'Categories: {Category.objects.count()}')
        self.stdout.write(f'Brands: {Brand.objects.count()}')
        self.stdout.write(f'Products: {Product.objects.count()}')
        self.stdout.write(f'Product Images: {ProductImage.objects.count()}')
        self.stdout.write(f'Product Reviews: {ProductReview.objects.count()}')
        self.stdout.write(f'Home Slider Items: {HomeSlider.objects.count()}')
        self.stdout.write(f'Contact Messages: {ContactMessage.objects.count()}')
        self.stdout.write(f'Newsletter Subscribers: {Newsletter.objects.count()}')
        self.stdout.write(f'Product Collections: {ProductCollection.objects.count()}')
        self.stdout.write('='*50)
        self.stdout.write('\nYour furniture store is now ready to demo!')
        self.stdout.write('You can now:')
        self.stdout.write('1. Start the Django server: python manage.py runserver')
        self.stdout.write('2. Start the React frontend: npm run dev (in client folder)')
        self.stdout.write('3. Visit http://localhost:5173 to see the store')
        self.stdout.write('4. Visit http://localhost:8000/admin to manage content')
        self.stdout.write('5. API endpoints available at http://localhost:8000/api/')