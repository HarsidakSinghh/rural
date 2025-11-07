// Translation service using free translation APIs
class TranslationService {
  constructor() {
    // Using MyMemory API (free tier) and Lingva Translate as fallback
    this.mymemoryURL = 'https://api.mymemory.translated.net/get';
    this.lingvaURL = 'https://lingva.ml/api/v1';
    this.cache = new Map();
  }

  // Primary translation using MyMemory API (free)
  async translateWithMyMemory(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      const params = new URLSearchParams({
        q: text,
        langpair: `${sourceLanguage}|${targetLanguage}`,
        de: 'your-email@example.com' // Optional: helps with rate limits
      });

      const response = await fetch(`${this.mymemoryURL}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.warn('MyMemory API failed:', error);
      return null;
    }
  }

  // Fallback translation using Lingva Translate (completely free, no API key)
  async translateWithLingva(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      const response = await fetch(`${this.lingvaURL}/${sourceLanguage}/${targetLanguage}/${encodeURIComponent(text)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Lingva API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.warn('Lingva API failed:', error);
      return null;
    }
  }

  // Main translation method with fallbacks
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    if (!text || text.trim() === '') return text;
    if (sourceLanguage === targetLanguage) return text;

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Try MyMemory API first
      let translatedText = await this.translateWithMyMemory(text, targetLanguage, sourceLanguage);

      // If MyMemory fails, try Lingva
      if (!translatedText) {
        translatedText = await this.translateWithLingva(text, targetLanguage, sourceLanguage);
      }

      // If both APIs fail, use fallback
      if (!translatedText) {
        translatedText = this.fallbackTranslation(text, targetLanguage);
      }

      // Cache the result
      this.cache.set(cacheKey, translatedText);
      return translatedText;

    } catch (error) {
      console.error('Translation error:', error);
      const fallbackText = this.fallbackTranslation(text, targetLanguage);
      this.cache.set(cacheKey, fallbackText);
      return fallbackText;
    }
  }

  // Fallback translation for when APIs are not available
  fallbackTranslation(text, targetLanguage) {
    // For demo purposes, return the original text with a note
    // In a real app, you might want to implement basic translations or use another service
    return `${text} [Translated to ${targetLanguage.toUpperCase()}]`;
  }

  // Get language code mapping
  getLanguageCode(language) {
    const languageMap = {
      'en': 'en',
      'hi': 'hi',
      'pa': 'pa' // Punjabi
    };
    return languageMap[language] || 'en';
  }

  // Translate multiple texts at once
  async translateBatch(texts, targetLanguage, sourceLanguage = 'auto') {
    try {
      const translations = await Promise.all(
        texts.map(text => this.translateText(text, targetLanguage, sourceLanguage))
      );
      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts.map(text => this.fallbackTranslation(text, targetLanguage));
    }
  }

  // Clear cache (useful for memory management)
  clearCache() {
    this.cache.clear();
  }
}

// Create and export singleton instance
const translationService = new TranslationService();
export default translationService;
