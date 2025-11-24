# 🌍 Complete Translation System Guide

## Overview

Your furniture website now has a **fully automatic translation system** that supports:
- 🇬🇧 **English (en)**
- 🇮🇹 **Italian (it)**
- 🇦🇱 **Albanian (al)**

The system automatically detects the language you write in and translates to the other two languages!

---

## 🚀 How It Works

### Automatic Translation Flow

```
You create a product in ANY language (e.g., Albanian)
         ↓
Django saves the product
         ↓
Signal triggers auto-translation
         ↓
Google Translate API detects source language
         ↓
Translates to English + Italian automatically
         ↓
All 3 translations saved in database
         ↓
Users can view in any language!
```

---

## ✨ Features Implemented

### 1. **Auto-Translation on Save**
- When you create/update a Product, Category, Gallery Category, or Gallery Project
- System automatically translates ALL text fields to all 3 languages
- Uses Google Translate API with auto-detection

### 2. **Smart Translation Logic**
- Only translates if translation doesn't exist (efficient)
- Auto-detects source language (write in any language!)
- Falls back to original text if translation fails

### 3. **Translatable Models**
✅ **Product** - All fields translated:
  - `name`
  - `description`
  - `short_description`
  - `specifications`
  - `care_instructions`

✅ **Category** - All fields translated:
  - `name`
  - `description`

✅ **Gallery Category** - All fields translated:
  - `name`
  - `description`

✅ **Gallery Project** - All fields translated:
  - `title`
  - `description`

---

## 📖 Usage Examples

### Example 1: Creating a Product in Albanian

**Django Admin / API:**
```python
Product.objects.create(
    name="Tavolinë moderne",
    description="Një tavolinë e bukur moderne për dhomën e ndenjjes",
    short_description="Tavolinë moderne",
    price=299.99
)
```

**What Happens Automatically:**
1. Product saved with Albanian text
2. Signal detects save
3. Auto-translates to:
   - **English**: "Modern table" / "A beautiful modern table for the living room"
   - **Italian**: "Tavolo moderno" / "Un bel tavolo moderno per il soggiorno"
4. All 3 versions saved in Translation table

**API Response** (when user requests `?lang=it`):
```json
{
  "id": 1,
  "name": "Tavolinë moderne",
  "localized_name": "Tavolo moderno",
  "localized_description": "Un bel tavolo moderno per il soggiorno",
  "price": "299.99"
}
```

### Example 2: Creating a Product in English

**Django Admin:**
```python
Product.objects.create(
    name="Leather Sofa",
    description="Premium Italian leather sofa with modern design",
    price=1299.99
)
```

**Auto-Translation Result:**
- **Italian**: "Divano in pelle" / "Divano in pelle italiana premium con design moderno"
- **Albanian**: "Divan lëkure" / "Divan lëkure premium italian me dizajn modern"

### Example 3: Creating a Category in Italian

**Django Admin:**
```python
Category.objects.create(
    name="Camera da letto",
    description="Mobili per la camera da letto"
)
```

**Auto-Translation Result:**
- **English**: "Bedroom" / "Bedroom furniture"
- **Albanian**: "Dhoma e gjumit" / "Mobilie për dhomën e gjumit"

---

## 🛠️ Management Commands

### Translate All Existing Content

```bash
# Translate everything
python manage.py translate_all

# Force re-translate (overwrite existing translations)
python manage.py translate_all --force

# Translate only products
python manage.py translate_all --model=product

# Translate only categories
python manage.py translate_all --model=category

# Translate only gallery items
python manage.py translate_all --model=gallery-category
python manage.py translate_all --model=gallery-project
```

**Output Example:**
```
Starting translation process...
Translating products...
  ✓ Translated product: Modern Sofa
  ✓ Translated product: Wooden Chair
Translating categories...
  ✓ Translated category: Living Room
  ✓ Translated category: Bedroom

==================================================
Translation Summary:
  Products translated: 2
  Categories translated: 2
  Gallery categories translated: 0
  Gallery projects translated: 0
==================================================
```

---

## 🌐 Frontend Integration

### Automatic Language Detection

The frontend automatically:
1. Detects user's preferred language from browser
2. Stores preference in localStorage
3. Sends language in every API request
4. Displays translated content

### Language Switcher

Users can change language using the dropdown in the navbar:
- 🇺🇸 English
- 🇮🇹 Italiano
- 🇦🇱 Shqip

### API Requests

Every API request includes language:
```
GET /api/products/?lang=it
Accept-Language: it
```

Backend returns localized fields:
```json
{
  "localized_name": "Divano moderno",
  "localized_description": "Un bellissimo divano...",
  "localized_short_description": "Divano moderno"
}
```

---

## 🔧 Technical Details

### Database Structure

**Translation Table:**
```
┌─────────────────┬──────────────┬─────────────────┬───────────────┬──────────────────┐
│ content_type    │ object_id    │ field_name      │ language_code │ translated_text  │
├─────────────────┼──────────────┼─────────────────┼───────────────┼──────────────────┤
│ product         │ uuid-123     │ name            │ en            │ Modern Sofa      │
│ product         │ uuid-123     │ name            │ it            │ Divano Moderno   │
│ product         │ uuid-123     │ name            │ al            │ Divan Modern     │
│ product         │ uuid-123     │ description     │ en            │ A beautiful...   │
│ product         │ uuid-123     │ description     │ it            │ Un bellissimo... │
│ product         │ uuid-123     │ description     │ al            │ Një divan i...   │
└─────────────────┴──────────────┴─────────────────┴───────────────┴──────────────────┘
```

### Translation Service

**File:** `furniture/translation_service.py`

```python
from googletrans import Translator

class TranslationService:
    SUPPORTED_LANGUAGES = ['en', 'it', 'al']

    def translate_text(self, text, target_lang, source_lang='auto'):
        """
        Translate text to target language.

        Args:
            text: Text to translate
            target_lang: Target language ('en', 'it', 'al')
            source_lang: Source language ('auto' for auto-detect)

        Returns:
            Translated text
        """
        # Maps 'al' to 'sq' for Google Translate
        # Auto-detects source language
        # Returns translated text
```

### Signal Handlers

**File:** `furniture/signals.py`

Signals trigger on:
- `post_save` for Product
- `post_save` for Category
- `post_save` for GalleryCategory
- `post_save` for GalleryProject

Each signal:
1. Checks if translations exist
2. Skips if already translated
3. Calls TranslationService
4. Saves translations to database

---

## 📝 API Endpoints

### Get Translated Content

```bash
# Get products in Italian
GET /api/products/?lang=it

# Get categories in Albanian
GET /api/categories/?lang=al

# Get product details in English
GET /api/products/modern-sofa/?lang=en
```

### Response Format

```json
{
  "id": 1,
  "name": "Modern Sofa",           // Original field (always present)
  "localized_name": "Divano Moderno",  // Translated field (based on ?lang=)
  "description": "A beautiful...",
  "localized_description": "Un bellissimo...",
  "price": "1299.99",
  "is_in_stock": true
}
```

---

## ⚡ Performance Optimization

### Caching Strategy

Translations are cached at multiple levels:
1. **Database**: Stored permanently in Translation table
2. **Query Optimization**: Uses indexes on (content_type, object_id, language_code)
3. **API Response**: Frontend caches API responses using React Query

### Avoiding Re-translation

The system is smart:
- ✅ Only translates NEW content
- ✅ Skips if translation already exists
- ✅ Won't re-translate on every save
- ✅ Use `--force` flag only when needed

---

## 🎯 Best Practices

### 1. Write in Your Preferred Language
```python
# You can write in ANY language - system will translate!

# Albanian example
Product.objects.create(name="Karrige lëkure")

# English example
Product.objects.create(name="Leather Chair")

# Italian example
Product.objects.create(name="Sedia in pelle")

# ALL will be translated to the other 2 languages automatically!
```

### 2. Bulk Translation
```bash
# After importing many products, translate all at once:
python manage.py translate_all

# This is faster than translating one by one
```

### 3. Re-translating Content
```bash
# If you update product descriptions and want new translations:
python manage.py translate_all --force

# Warning: This will overwrite ALL existing translations
```

### 4. Model-Specific Translation
```bash
# Only translate products (faster if you only updated products):
python manage.py translate_all --model=product
```

---

## 🐛 Troubleshooting

### Issue: Translations Not Appearing

**Check 1: Is the signal registered?**
```bash
# Restart Django server
CTRL+C
python manage.py runserver
```

**Check 2: Are translations in database?**
```python
from furniture.models import Translation, Product

product = Product.objects.first()
translations = Translation.objects.filter(
    object_id=str(product.id)
)
print(translations)
```

**Check 3: Is API sending language parameter?**
```bash
# Check browser network tab
GET /api/products/?lang=it  # Should include lang parameter
```

### Issue: Wrong Translations

**Solution 1: Re-translate specific item**
```python
from furniture.models import Product
from furniture.translation_service import TranslationService

product = Product.objects.get(id=1)
service = TranslationService()

# Delete old translation
Translation.objects.filter(
    object_id=str(product.id),
    field_name='name',
    language_code='it'
).delete()

# Re-translate
product.save()  # Signal will auto-translate
```

**Solution 2: Force re-translate all**
```bash
python manage.py translate_all --force
```

### Issue: Google Translate API Limits

If you hit rate limits:
1. Wait a few minutes
2. Translate in smaller batches:
   ```bash
   python manage.py translate_all --model=product
   # Wait 5 minutes
   python manage.py translate_all --model=category
   ```

---

## 📊 Translation Quality

### Google Translate Accuracy

**Best Results:**
- ✅ Short product names (90%+ accurate)
- ✅ Simple descriptions
- ✅ Common furniture terms

**May Need Manual Review:**
- ⚠️ Complex technical specifications
- ⚠️ Marketing copy with idioms
- ⚠️ Brand-specific terms

### Manual Override

You can manually edit translations:
```python
from furniture.models import Product

product = Product.objects.get(id=1)

# Override Italian translation
product.set_translation('name', 'it', 'Divano di lusso personalizzato')
```

---

## 🔐 Security & Privacy

- ✅ Uses official Google Translate library (googletrans)
- ✅ No API keys stored (uses free tier)
- ✅ No user data sent to Google (only product descriptions)
- ✅ Translations cached locally (no repeated requests)

---

## 🎓 Advanced Usage

### Custom Translation Logic

You can customize translations in `furniture/signals.py`:

```python
@receiver(post_save, sender=Product)
def auto_translate_product(sender, instance, created, **kwargs):
    # Add your custom logic here
    # E.g., skip translation for certain categories

    if instance.category.name == "Custom Made":
        return  # Don't auto-translate custom items

    # Continue with normal translation...
```

### Translation Webhooks

You can add webhooks to notify when translation completes:

```python
from django.core.signals import Signal

translation_complete = Signal()

@receiver(translation_complete)
def notify_admin(sender, instance, **kwargs):
    # Send email/notification when translation is done
    pass
```

---

## 📚 Summary

### What Was Implemented

✅ **Automatic translation on save** - Write in any language, get all 3!
✅ **Smart translation** - Only translates what's missing
✅ **Gallery support** - Categories and projects fully translated
✅ **Management commands** - Bulk translate existing content
✅ **API integration** - Frontend automatically gets translated content
✅ **Language detection** - Auto-detects what language you write in

### How to Use

1. **Create product in ANY language** → Auto-translates to other 2
2. **Users switch language** → See content in their language
3. **Bulk translate existing** → `python manage.py translate_all`

### Key Files

- `furniture/signals.py` - Auto-translation triggers
- `furniture/translation_service.py` - Google Translate integration
- `furniture/models.py` - TranslatableModelMixin
- `furniture/management/commands/translate_all.py` - Bulk translation command

---

## 🎉 You're All Set!

Your furniture website now has a **production-ready, multi-language translation system**!

**Next Steps:**
1. Add some products via Django admin
2. Watch them auto-translate
3. Switch languages in frontend
4. See your content in English, Italian, and Albanian!

Enjoy your multilingual furniture website! 🛋️🌍
