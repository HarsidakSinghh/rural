// Translation service using Google Translate API
class TranslationService {
  constructor() {
    // For client-side, we'll use a different approach since @google-cloud/translate is for server-side
    // We'll use the Google Translate web API or a proxy service
    this.apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
    this.baseURL = 'https://translation.googleapis.com/language/translate/v2';
  }

  // Translate text using Google Translate API
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      if (!this.apiKey) {
        console.warn('Google Translate API key not found, using fallback');
        return this.fallbackTranslation(text, targetLanguage);
      }

      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return this.fallbackTranslation(text, targetLanguage);
    }
  }

  // Fallback translation for when API is not available
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

  // Cache translations to avoid repeated API calls
  cache = new Map();

  async translateWithCache(text, targetLanguage, sourceLanguage = 'auto') {
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const translatedText = await this.translateText(text, targetLanguage, sourceLanguage);
    this.cache.set(cacheKey, translatedText);

    return translatedText;
  }

  // Translate multiple texts at once
  async translateBatch(texts, targetLanguage, sourceLanguage = 'auto') {
    try {
      const translations = await Promise.all(
        texts.map(text => this.translateWithCache(text, targetLanguage, sourceLanguage))
      );
      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts.map(text => this.fallbackTranslation(text, targetLanguage));
    }
  }
}

// Create and export singleton instance
const translationService = new TranslationService();
export default translationService;
