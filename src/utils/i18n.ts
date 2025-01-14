import en from './languages/en';
import ch from './languages/ch';

// Define a recursive type for translations
type Translations = {
  [key: string]: string | Translations;
};

// Create an object to hold the different language translations
const translations: Record<string, Translations> = {
  en,
  ch,
};

// Updated translate function to accept the current language as a parameter
export const translate = (key: string, language: string): string => {
  // Validate key and language before using them
  if (!key || typeof key !== 'string') {
    console.warn('Invalid translation key:', key);
    return key; // Return the key itself as fallback
  }
  
  if (!language || typeof language !== 'string' || !translations[language]) {
    console.warn('Invalid language or translation not found:', language);
    return key; // Return the key itself as fallback
  }

  const keys = key.split('.'); // Support nested keys
  let result: Translations | string | undefined = translations[language];

  // Traverse the nested keys to find the correct translation
  for (const k of keys) {
    if (typeof result === 'object' && result !== undefined) {
      result = result[k];
    } else {
      return key; // If any key is not found, return the original key as fallback
    }
  }

  return typeof result === 'string' ? result : key; // Fallback to key if translation is not found
};
