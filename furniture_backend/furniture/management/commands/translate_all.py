"""
Management command to translate all existing products, categories, and gallery items.
Usage: python manage.py translate_all
"""
from django.core.management.base import BaseCommand
from furniture.models import Product, Category, GalleryCategory, GalleryProject
from furniture.translation_service import TranslationService
from django.db import transaction


class Command(BaseCommand):
    help = 'Translate all existing products, categories, and gallery items to all supported languages'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-translation even if translations already exist',
        )
        parser.add_argument(
            '--model',
            type=str,
            choices=['product', 'category', 'gallery-category', 'gallery-project', 'all'],
            default='all',
            help='Specify which model to translate',
        )

    def handle(self, *args, **options):
        force = options['force']
        model_choice = options['model']

        self.stdout.write(self.style.SUCCESS('Starting translation process...'))

        translation_service = TranslationService()
        target_languages = ['en', 'it', 'al']

        stats = {
            'products': 0,
            'categories': 0,
            'gallery_categories': 0,
            'gallery_projects': 0,
            'errors': 0,
        }

        # Translate Products
        if model_choice in ['product', 'all']:
            self.stdout.write('Translating products...')
            products = Product.objects.all()

            for product in products:
                try:
                    self._translate_product(product, target_languages, translation_service, force)
                    stats['products'] += 1
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Translated product: {product.name}'))
                except Exception as e:
                    stats['errors'] += 1
                    self.stdout.write(self.style.ERROR(f'  ✗ Error translating product {product.name}: {str(e)}'))

        # Translate Categories
        if model_choice in ['category', 'all']:
            self.stdout.write('Translating categories...')
            categories = Category.objects.all()

            for category in categories:
                try:
                    self._translate_category(category, target_languages, translation_service, force)
                    stats['categories'] += 1
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Translated category: {category.name}'))
                except Exception as e:
                    stats['errors'] += 1
                    self.stdout.write(self.style.ERROR(f'  ✗ Error translating category {category.name}: {str(e)}'))

        # Translate Gallery Categories
        if model_choice in ['gallery-category', 'all']:
            self.stdout.write('Translating gallery categories...')
            gallery_categories = GalleryCategory.objects.all()

            for gallery_category in gallery_categories:
                try:
                    self._translate_gallery_category(gallery_category, target_languages, translation_service, force)
                    stats['gallery_categories'] += 1
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Translated gallery category: {gallery_category.name}'))
                except Exception as e:
                    stats['errors'] += 1
                    self.stdout.write(self.style.ERROR(f'  ✗ Error translating gallery category {gallery_category.name}: {str(e)}'))

        # Translate Gallery Projects
        if model_choice in ['gallery-project', 'all']:
            self.stdout.write('Translating gallery projects...')
            gallery_projects = GalleryProject.objects.all()

            for gallery_project in gallery_projects:
                try:
                    self._translate_gallery_project(gallery_project, target_languages, translation_service, force)
                    stats['gallery_projects'] += 1
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Translated gallery project: {gallery_project.title}'))
                except Exception as e:
                    stats['errors'] += 1
                    self.stdout.write(self.style.ERROR(f'  ✗ Error translating gallery project {gallery_project.title}: {str(e)}'))

        # Print summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Translation Summary:'))
        self.stdout.write(f'  Products translated: {stats["products"]}')
        self.stdout.write(f'  Categories translated: {stats["categories"]}')
        self.stdout.write(f'  Gallery categories translated: {stats["gallery_categories"]}')
        self.stdout.write(f'  Gallery projects translated: {stats["gallery_projects"]}')
        if stats['errors'] > 0:
            self.stdout.write(self.style.ERROR(f'  Errors encountered: {stats["errors"]}'))
        self.stdout.write('='*50)

    def _translate_product(self, product, target_languages, translation_service, force):
        """Translate a single product"""
        fields_to_translate = ['name', 'description', 'short_description', 'specifications', 'care_instructions']

        with transaction.atomic():
            for field_name in fields_to_translate:
                field_value = getattr(product, field_name, None)

                if not field_value:
                    continue

                for target_lang in target_languages:
                    # Skip if translation exists and force is False
                    if not force and product.get_translation(field_name, target_lang) != field_value:
                        continue

                    translated_text = translation_service.translate_text(
                        text=field_value,
                        target_lang=target_lang,
                        source_lang='auto'
                    )

                    if translated_text:
                        product.set_translation(field_name, target_lang, translated_text)

    def _translate_category(self, category, target_languages, translation_service, force):
        """Translate a single category"""
        fields_to_translate = ['name', 'description']

        with transaction.atomic():
            for field_name in fields_to_translate:
                field_value = getattr(category, field_name, None)

                if not field_value:
                    continue

                for target_lang in target_languages:
                    if not force and category.get_translation(field_name, target_lang) != field_value:
                        continue

                    translated_text = translation_service.translate_text(
                        text=field_value,
                        target_lang=target_lang,
                        source_lang='auto'
                    )

                    if translated_text:
                        category.set_translation(field_name, target_lang, translated_text)

    def _translate_gallery_category(self, gallery_category, target_languages, translation_service, force):
        """Translate a single gallery category"""
        fields_to_translate = ['name', 'description']

        with transaction.atomic():
            for field_name in fields_to_translate:
                field_value = getattr(gallery_category, field_name, None)

                if not field_value:
                    continue

                for target_lang in target_languages:
                    if not force and gallery_category.get_translation(field_name, target_lang) != field_value:
                        continue

                    translated_text = translation_service.translate_text(
                        text=field_value,
                        target_lang=target_lang,
                        source_lang='auto'
                    )

                    if translated_text:
                        gallery_category.set_translation(field_name, target_lang, translated_text)

    def _translate_gallery_project(self, gallery_project, target_languages, translation_service, force):
        """Translate a single gallery project"""
        fields_to_translate = ['title', 'description']

        with transaction.atomic():
            for field_name in fields_to_translate:
                field_value = getattr(gallery_project, field_name, None)

                if not field_value:
                    continue

                for target_lang in target_languages:
                    if not force and gallery_project.get_translation(field_name, target_lang) != field_value:
                        continue

                    translated_text = translation_service.translate_text(
                        text=field_value,
                        target_lang=target_lang,
                        source_lang='auto'
                    )

                    if translated_text:
                        gallery_project.set_translation(field_name, target_lang, translated_text)
