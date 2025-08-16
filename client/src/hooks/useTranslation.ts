// client/src/hooks/useTranslation.ts
import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const getLocalizedText = (item: any, field: string): string => {
    // Check if localized version exists
    const localizedField = `localized_${field}`;
    
    if (item[localizedField] && item[localizedField].trim()) {
      return item[localizedField];
    }
    
    // Fallback to original field
    return item[field] || '';
  };

  const getLocalizedProduct = (product: any) => {
    return {
      ...product,
      name: getLocalizedText(product, 'name'),
      description: getLocalizedText(product, 'description'),
      short_description: getLocalizedText(product, 'short_description'),
      specifications: getLocalizedText(product, 'specifications'),
      care_instructions: getLocalizedText(product, 'care_instructions'),
    };
  };

  const getLocalizedCategory = (category: any) => {
    return {
      ...category,
      name: getLocalizedText(category, 'name'),
      description: getLocalizedText(category, 'description'),
    };
  };

  return {
    currentLanguage,
    getLocalizedText,
    getLocalizedProduct,
    getLocalizedCategory,
  };
};