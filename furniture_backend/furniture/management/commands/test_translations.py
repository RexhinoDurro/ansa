from django.core.management.base import BaseCommand
from furniture.models import Product
from furniture.translation_service import translation_service

class Command(BaseCommand):
    help = 'Test translation functionality'

    def handle(self, *args, **options):
        # Get first product
        product = Product.objects.first()
        if not product:
            self.stdout.write("No products found!")
            return

        self.stdout.write(f"Testing translations for: {product.name}")

        # Generate translations
        translations = translation_service.translate_product_data({
            'name': product.name,
            'description': product.description,
            'short_description': product.short_description,
        })

        self.stdout.write(f"Generated translations: {translations}")

        # Save translations
        product.save_translations(translations)

        # Test retrieval
        italian_name = product.get_localized_name('it')
        albanian_name = product.get_localized_name('al')

        self.stdout.write(f"Italian name: {italian_name}")
        self.stdout.write(f"Albanian name: {albanian_name}")

        self.stdout.write("Translation test completed!")