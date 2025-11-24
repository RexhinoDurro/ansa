"""
Management command to seed the database with custom furniture studio data
"""
from django.core.management.base import BaseCommand
from furniture.models import (
    Service, Material, Testimonial, FAQ,
    GalleryCategory, GalleryProject, CustomRequest
)
from django.utils.text import slugify


class Command(BaseCommand):
    help = 'Seed the database with custom furniture studio example data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting to seed custom furniture studio data...'))

        # Create Services
        self.stdout.write('Creating Services...')
        services_data = [
            {
                'title': 'Custom Kitchens',
                'short_description': 'Tailored kitchen designs that maximize space and functionality',
                'description': 'From modern minimalist to classic traditional, we design and build custom kitchens that perfectly fit your space and lifestyle. Every cabinet, countertop, and detail is crafted to your exact specifications.',
                'icon': 'kitchen',
                'sort_order': 1
            },
            {
                'title': 'Built-in Wardrobes',
                'short_description': 'Maximize bedroom storage with custom wardrobe solutions',
                'description': 'Our built-in wardrobes are designed to make the most of your available space. With custom shelving, hanging rails, and drawer systems, everything has its perfect place. Choose from a wide range of finishes and interior fittings.',
                'icon': 'wardrobe',
                'sort_order': 2
            },
            {
                'title': 'Living Room Systems',
                'short_description': 'Complete living room furniture systems and TV walls',
                'description': 'Create a cohesive living space with our custom-built TV units, shelving systems, and storage solutions. Designed to integrate seamlessly with your room\'s architecture and your entertainment needs.',
                'icon': 'living-room',
                'sort_order': 3
            },
            {
                'title': 'Office & Commercial Interiors',
                'short_description': 'Professional workspace solutions for home and business',
                'description': 'Productive workspaces require thoughtful design. We create custom office furniture, reception areas, and commercial interiors that combine functionality with professional aesthetics.',
                'icon': 'office',
                'sort_order': 4
            }
        ]

        for data in services_data:
            service, created = Service.objects.get_or_create(
                title=data['title'],
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created service: {service.title}'))
            else:
                self.stdout.write(f'  - Service already exists: {service.title}')

        # Create Materials
        self.stdout.write('Creating Materials...')
        materials_data = [
            {
                'name': 'Solid Oak',
                'type': 'wood',
                'description': 'Premium solid oak with natural grain patterns. Durable, timeless, and ages beautifully. Perfect for traditional and contemporary designs.'
            },
            {
                'name': 'Walnut Veneer',
                'type': 'wood',
                'description': 'Rich, dark walnut veneer over engineered wood core. Offers the luxury appearance of solid walnut with improved stability and sustainability.'
            },
            {
                'name': 'White Matt Lacquer',
                'type': 'wood',
                'description': 'Smooth, contemporary white finish with a soft-touch matt surface. Easy to clean and maintains a modern, minimalist aesthetic.'
            },
            {
                'name': 'Natural Ash',
                'type': 'wood',
                'description': 'Light-colored hardwood with distinctive grain. Brings warmth and Scandinavian simplicity to any space.'
            },
            {
                'name': 'Premium Leather',
                'type': 'fabric',
                'description': 'Top-grain leather for upholstery and panel details. Available in multiple colors, ages gracefully with a beautiful patina.'
            },
            {
                'name': 'Linen Fabric',
                'type': 'fabric',
                'description': 'Natural linen blend fabric, breathable and durable. Ideal for cushions, headboards, and upholstered panels.'
            },
            {
                'name': 'Soft-Close Hinges',
                'type': 'hardware',
                'description': 'Premium soft-close door hinges from Blum. Silent operation and guaranteed durability for thousands of cycles.'
            },
            {
                'name': 'Drawer Runners - Full Extension',
                'type': 'hardware',
                'description': 'Full-extension drawer runners with soft-close mechanism. Smooth operation and 40kg load capacity.'
            }
        ]

        for data in materials_data:
            material, created = Material.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created material: {material.name}'))
            else:
                self.stdout.write(f'  - Material already exists: {material.name}')

        # Create FAQs
        self.stdout.write('Creating FAQs...')
        faqs_data = [
            {
                'question': 'How long does a custom furniture project typically take?',
                'answer': 'Most projects take 4-8 weeks from initial consultation to final installation. This includes design approval, manufacturing, and installation. Timelines vary based on project complexity and current workload.',
                'category': 'process',
                'sort_order': 1
            },
            {
                'question': 'Do you provide 3D visualizations before manufacturing?',
                'answer': 'Yes! After taking precise measurements, we create detailed 3D renderings of your custom furniture. This allows you to see exactly how it will look in your space and make any adjustments before we begin manufacturing.',
                'category': 'process',
                'sort_order': 2
            },
            {
                'question': 'What areas do you serve?',
                'answer': 'We primarily serve Tirana and surrounding areas within 50km. For larger projects, we may be able to accommodate locations further afield. Please contact us to discuss your project location.',
                'category': 'general',
                'sort_order': 1
            },
            {
                'question': 'Do you handle delivery and installation?',
                'answer': 'Absolutely. All our projects include professional delivery and installation by our experienced team. We ensure everything is perfectly fitted, leveled, and finished to the highest standard.',
                'category': 'delivery',
                'sort_order': 1
            },
            {
                'question': 'How does payment work?',
                'answer': 'We typically request a 30% deposit after design approval, 40% when manufacturing begins, and the final 30% upon completion and installation. Payment plans can be discussed for larger projects.',
                'category': 'pricing',
                'sort_order': 1
            },
            {
                'question': 'What materials do you work with?',
                'answer': 'We work with a wide range of materials including solid wood (oak, walnut, ash), engineered wood with premium veneers, high-quality laminates, lacquered finishes, glass, metal, and various upholstery fabrics and leathers.',
                'category': 'materials',
                'sort_order': 1
            },
            {
                'question': 'Do you offer warranties?',
                'answer': 'Yes. All our furniture comes with a 2-year warranty covering manufacturing defects and hardware. Premium hardware (hinges, runners) often carries longer manufacturer warranties of 5-10 years.',
                'category': 'general',
                'sort_order': 2
            },
            {
                'question': 'How do I care for my custom furniture?',
                'answer': 'Care instructions depend on the materials used. Generally, wood surfaces should be cleaned with a soft, damp cloth and dried immediately. Avoid harsh chemicals. Leather should be conditioned periodically. We provide detailed care instructions with each project.',
                'category': 'maintenance',
                'sort_order': 1
            },
            {
                'question': 'Can you match existing furniture or bring samples?',
                'answer': 'Yes to both! We can work to match existing finishes and styles, or we can bring material samples to your home so you can see how they look in your actual lighting conditions.',
                'category': 'process',
                'sort_order': 3
            },
            {
                'question': 'What if I need changes after installation?',
                'answer': 'Minor adjustments are included in our service. For significant changes or additions, we\'ll provide a quote for the additional work. Our goal is your complete satisfaction.',
                'category': 'general',
                'sort_order': 3
            }
        ]

        for data in faqs_data:
            faq, created = FAQ.objects.get_or_create(
                question=data['question'],
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created FAQ: {faq.question[:50]}...'))
            else:
                self.stdout.write(f'  - FAQ already exists: {faq.question[:50]}...')

        # Create example Testimonials (only if we have gallery projects)
        gallery_projects = GalleryProject.objects.all()
        if gallery_projects.exists():
            self.stdout.write('Creating Testimonials...')
            testimonials_data = [
                {
                    'client_name': 'Maria & Andrea',
                    'text': 'Ansa Furniture transformed our kitchen into exactly what we dreamed of. The attention to detail and quality of craftsmanship is outstanding. They worked within our budget and timeline perfectly.',
                    'location': 'Tirana',
                    'rating': 5,
                    'is_featured': True
                },
                {
                    'client_name': 'Arben K.',
                    'text': 'Professional from start to finish. The 3D designs helped us visualize everything before committing. The installation team was punctual and left everything spotless. Highly recommended!',
                    'location': 'Durrës',
                    'rating': 5,
                    'is_featured': True
                },
                {
                    'client_name': 'Elena M.',
                    'text': 'Our built-in wardrobes are a game-changer. So much storage space beautifully organized. The soft-close mechanisms and quality hardware make such a difference in daily use.',
                    'location': 'Tirana',
                    'rating': 5,
                    'is_featured': False
                }
            ]

            for i, data in enumerate(testimonials_data):
                # Assign to different projects if available
                if i < len(gallery_projects):
                    data['project'] = gallery_projects[i]

                testimonial, created = Testimonial.objects.get_or_create(
                    client_name=data['client_name'],
                    defaults=data
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Created testimonial from: {testimonial.client_name}'))
                else:
                    self.stdout.write(f'  - Testimonial already exists from: {testimonial.client_name}')
        else:
            self.stdout.write(self.style.WARNING('  ! Skipping testimonials - no gallery projects found. Create some gallery projects first.'))

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Seed data creation complete!'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(f'Services: {Service.objects.count()}')
        self.stdout.write(f'Materials: {Material.objects.count()}')
        self.stdout.write(f'FAQs: {FAQ.objects.count()}')
        self.stdout.write(f'Testimonials: {Testimonial.objects.count()}')
        self.stdout.write('')
        self.stdout.write('Next steps:')
        self.stdout.write('1. Create gallery categories and projects via admin')
        self.stdout.write('2. Upload images for services and materials')
        self.stdout.write('3. Test the public API endpoints:')
        self.stdout.write('   - http://localhost:8000/api/services/')
        self.stdout.write('   - http://localhost:8000/api/materials/')
        self.stdout.write('   - http://localhost:8000/api/faqs/')
        self.stdout.write('   - http://localhost:8000/api/testimonials/')
