// Translation service using free translation APIs
class TranslationService {
  constructor() {
    // Using Lingva.ml - free alternative to Google Translate
    this.lingvaURL = 'https://lingva.ml/api/v1';
    this.cache = new Map();
  }

  // Detect if text is likely English (simple heuristic)
  isEnglish(text) {
    // Simple check - if text contains common English words and patterns
    const englishPatterns = /^[a-zA-Z\s.,!?\-()'"']+$/;
    return englishPatterns.test(text) && text.length > 0;
  }

  // Primary translation using Lingva.ml
  async translateWithLingva(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // Determine source language
      const detectedSource = this.isEnglish(text) ? 'en' : sourceLanguage;

      console.log('Lingva.ml request:', {
        text: text.substring(0, 100) + '...',
        source: detectedSource,
        target: targetLanguage
      });

      const response = await fetch(`${this.lingvaURL}/${detectedSource}/${targetLanguage}/${encodeURIComponent(text)}`);

      console.log('Lingva.ml response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lingva.ml error response:', errorText);
        throw new Error(`Lingva.ml API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Lingva.ml response data:', data);
      return data.translation;
    } catch (error) {
      console.warn('Lingva.ml API failed:', error);
      return null;
    }
  }

  // Main translation method with fallback
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    if (!text || text.trim() === '') return text;
    if (sourceLanguage === targetLanguage) return text;

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Try Lingva.ml
      let translatedText = await this.translateWithLingva(text, targetLanguage, sourceLanguage);

      // If Lingva.ml fails, use fallback
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
    // For demo purposes, return the original text
    // In a real app, you might want to implement basic translations or use another service
    return text;
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
