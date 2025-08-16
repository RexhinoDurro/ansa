# furniture_backend/api/translation_service.py
from googletrans import Translator
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class TranslationService:
    """Simple translation service for product/category data"""
    
    SUPPORTED_LANGUAGES = ['en', 'it', 'al']  # English, Italian, Albanian
    
    def __init__(self):
        self.translator = Translator()
    
    def translate_text(self, text: str, target_lang: str, source_lang: str = 'auto') -> str:
        """Translate a single text to target language"""
        if not text or not text.strip():
            return text
            
        try:
            # Handle Albanian language code (googletrans uses 'sq' for Albanian)
            google_lang_code = 'sq' if target_lang == 'al' else target_lang
            
            result = self.translator.translate(
                text, 
                dest=google_lang_code, 
                src=source_lang
            )
            return result.text
        except Exception as e:
            logger.error(f"Translation failed for '{text}' to {target_lang}: {str(e)}")
            return text  # Return original text if translation fails
    
    def translate_product_data(self, product_data: Dict) -> Dict:
        """Translate product data to all supported languages"""
        translations = {}
        
        # Fields to translate
        translatable_fields = ['name', 'description', 'short_description', 'specifications', 'care_instructions']
        
        for lang in self.SUPPORTED_LANGUAGES:
            translations[lang] = {}
            
            for field in translatable_fields:
                if field in product_data and product_data[field]:
                    translated_text = self.translate_text(
                        product_data[field], 
                        target_lang=lang
                    )
                    translations[lang][field] = translated_text
                else:
                    translations[lang][field] = product_data.get(field, '')
        
        return translations
    
    def translate_category_data(self, category_data: Dict) -> Dict:
        """Translate category data to all supported languages"""
        translations = {}
        
        # Fields to translate
        translatable_fields = ['name', 'description']
        
        for lang in self.SUPPORTED_LANGUAGES:
            translations[lang] = {}
            
            for field in translatable_fields:
                if field in category_data and category_data[field]:
                    translated_text = self.translate_text(
                        category_data[field], 
                        target_lang=lang
                    )
                    translations[lang][field] = translated_text
                else:
                    translations[lang][field] = category_data.get(field, '')
        
        return translations

# Global instance
translation_service = TranslationService()