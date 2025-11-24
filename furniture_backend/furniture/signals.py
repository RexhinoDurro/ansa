"""
Auto-translation signals for furniture models.
Automatically translates products and categories when saved.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product, Category, GalleryCategory, GalleryProject
from .translation_service import TranslationService
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Product)
def auto_translate_product(sender, instance, created, **kwargs):
    """
    Automatically translate product fields to all supported languages.

    Detects the source language from the content and translates to:
    - English (en)
    - Italian (it)
    - Albanian (al)
    """
    # Avoid infinite recursion
    if kwargs.get('raw', False):
        return

    try:
        translation_service = TranslationService()

        # Fields to translate
        fields_to_translate = [
            'name',
            'description',
            'short_description',
            'specifications',
            'care_instructions'
        ]

        # Get all supported languages
        target_languages = ['en', 'it', 'al']

        for field_name in fields_to_translate:
            field_value = getattr(instance, field_name, None)

            if not field_value:
                continue

            # Check if translations already exist for this field
            existing_translations = instance.get_all_translations_for_field(field_name)

            # If we already have translations for all languages, skip
            if len(existing_translations) >= len(target_languages):
                continue

            try:
                # Auto-detect source language and translate to all target languages
                for target_lang in target_languages:
                    # Skip if translation already exists
                    existing_translation = instance.get_translation(field_name, target_lang)
                    if existing_translation:
                        continue

                    # Translate
                    translated_text = translation_service.translate_text(
                        text=field_value,
                        target_lang=target_lang,
                        source_lang='auto'  # Auto-detect source language
                    )

                    if translated_text:
                        instance.set_translation(field_name, target_lang, translated_text)
                        logger.info(
                            f"Auto-translated {instance.__class__.__name__} "
                            f"'{instance.name}' field '{field_name}' to '{target_lang}'"
                        )

            except Exception as e:
                logger.error(
                    f"Failed to translate {field_name} for product {instance.id}: {str(e)}"
                )
                continue

    except Exception as e:
        logger.error(f"Auto-translation failed for product {instance.id}: {str(e)}")


@receiver(post_save, sender=Category)
def auto_translate_category(sender, instance, created, **kwargs):
    """
    Automatically translate category fields to all supported languages.
    """
    # Avoid infinite recursion
    if kwargs.get('raw', False):
        return

    try:
        translation_service = TranslationService()

        # Fields to translate
        fields_to_translate = ['name', 'description']

        # Get all supported languages
        target_languages = ['en', 'it', 'al']

        for field_name in fields_to_translate:
            field_value = getattr(instance, field_name, None)

            if not field_value:
                continue

            # Check if translations already exist for this field
            existing_translations = instance.get_all_translations_for_field(field_name)

            # If we already have translations for all languages, skip
            if len(existing_translations) >= len(target_languages):
                continue

            try:
                # Auto-detect source language and translate to all target languages
                for target_lang in target_languages:
                    # Skip if translation already exists
                    existing_translation = instance.get_translation(field_name, target_lang)
                    if existing_translation:
                        continue

                    # Translate
                    translated_text = translation_service.translate_text(
                        text=field_value,
                        target_lang=target_lang,
                        source_lang='auto'
                    )

                    if translated_text:
                        instance.set_translation(field_name, target_lang, translated_text)
                        logger.info(
                            f"Auto-translated Category '{instance.name}' "
                            f"field '{field_name}' to '{target_lang}'"
                        )

            except Exception as e:
                logger.error(
                    f"Failed to translate {field_name} for category {instance.id}: {str(e)}"
                )
                continue

    except Exception as e:
        logger.error(f"Auto-translation failed for category {instance.id}: {str(e)}")


@receiver(post_save, sender=GalleryCategory)
def auto_translate_gallery_category(sender, instance, created, **kwargs):
    """
    Automatically translate gallery category fields to all supported languages.
    """
    if kwargs.get('raw', False):
        return

    try:
        translation_service = TranslationService()
        fields_to_translate = ['name', 'description']
        target_languages = ['en', 'it', 'al']

        for field_name in fields_to_translate:
            field_value = getattr(instance, field_name, None)
            if not field_value:
                continue

            for target_lang in target_languages:
                existing_translation = instance.get_translation(field_name, target_lang)
                if existing_translation:
                    continue

                translated_text = translation_service.translate_text(
                    text=field_value,
                    target_lang=target_lang,
                    source_lang='auto'
                )

                if translated_text:
                    instance.set_translation(field_name, target_lang, translated_text)
                    logger.info(
                        f"Auto-translated GalleryCategory '{instance.name}' "
                        f"field '{field_name}' to '{target_lang}'"
                    )

    except Exception as e:
        logger.error(f"Auto-translation failed for gallery category {instance.id}: {str(e)}")


@receiver(post_save, sender=GalleryProject)
def auto_translate_gallery_project(sender, instance, created, **kwargs):
    """
    Automatically translate gallery project fields to all supported languages.
    """
    if kwargs.get('raw', False):
        return

    try:
        translation_service = TranslationService()
        fields_to_translate = ['title', 'description']
        target_languages = ['en', 'it', 'al']

        for field_name in fields_to_translate:
            field_value = getattr(instance, field_name, None)
            if not field_value:
                continue

            for target_lang in target_languages:
                existing_translation = instance.get_translation(field_name, target_lang)
                if existing_translation:
                    continue

                translated_text = translation_service.translate_text(
                    text=field_value,
                    target_lang=target_lang,
                    source_lang='auto'
                )

                if translated_text:
                    instance.set_translation(field_name, target_lang, translated_text)
                    logger.info(
                        f"Auto-translated GalleryProject '{instance.title}' "
                        f"field '{field_name}' to '{target_lang}'"
                    )

    except Exception as e:
        logger.error(f"Auto-translation failed for gallery project {instance.id}: {str(e)}")
