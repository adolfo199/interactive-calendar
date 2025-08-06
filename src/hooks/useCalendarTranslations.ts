import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export interface UseCalendarTranslationsOptions {
  locale?: 'en' | 'es';
  customTranslations?: Record<string, unknown>;
}

export function useCalendarTranslations(options: UseCalendarTranslationsOptions = {}) {
  const { locale, customTranslations = {} } = options;
  const { t, i18n } = useTranslation(['common', 'appointments']);

  // Change language if locale prop is provided
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  // Listen for language changes from external sources (like localStorage updates)
  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newLanguage = customEvent.detail;
      if (newLanguage && i18n.language !== newLanguage) {
        i18n.changeLanguage(newLanguage);
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'i18nextLng' && event.newValue) {
        const newLanguage = event.newValue;
        if ((newLanguage === 'en' || newLanguage === 'es') && i18n.language !== newLanguage) {
          i18n.changeLanguage(newLanguage);
        }
      }
    };

    // Listen for custom language change events
    window.addEventListener('languageChanged', handleLanguageChange);
    
    // Listen for localStorage changes (for cross-tab synchronization)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [i18n]);

  // Custom translation function that can override with customTranslations
  const translate = (key: string, options?: Record<string, unknown>): string => {
    // Check custom translations first
    const customValue = getNestedValue(customTranslations, key);
    if (customValue !== undefined && typeof customValue === 'string') {
      return customValue;
    }
    
    // Fall back to i18next
    const result = t(key, options);
    return typeof result === 'string' ? result : key;
  };

  return {
    t: translate,
    i18n,
    currentLanguage: i18n.language as 'en' | 'es',
    changeLanguage: i18n.changeLanguage,
  };
}

// Helper function to get nested object values
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    return current && typeof current === 'object' && current !== null && key in current 
      ? (current as Record<string, unknown>)[key] 
      : undefined;
  }, obj);
}
