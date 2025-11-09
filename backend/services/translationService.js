const Groq = require('groq-sdk');

class TranslationService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.cache = new Map();
  }

  // Detect if text is likely English (simple heuristic)
  isEnglish(text) {
    // Simple check - if text contains common English words and patterns
    const englishPatterns = /^[a-zA-Z\s.,!?\-()'"']+$/;
    return englishPatterns.test(text) && text.length > 0;
  }

  // Primary translation using Groq AI
  async translateWithGroq(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // Determine source language
      const detectedSource = this.isEnglish(text) ? 'en' : sourceLanguage;

      console.log('Groq translation request:', {
        text: text.substring(0, 100) + '...',
        source: detectedSource,
        target: targetLanguage
      });

      // Split text into paragraphs first, then translate each paragraph
      const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
      console.log(`Split into ${paragraphs.length} paragraphs`);

      const translatedParagraphs = [];

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        console.log(`Translating paragraph ${i + 1}/${paragraphs.length}:`, paragraph.substring(0, 50) + '...');

        // Split paragraph into 100-word chunks (Groq can handle larger chunks)
        const wordChunks = this.splitTextIntoWordChunks(paragraph, 100);
        console.log(`Paragraph ${i + 1} split into ${wordChunks.length} word chunks`);

        const translatedChunks = [];

        for (let j = 0; j < wordChunks.length; j++) {
          const chunk = wordChunks[j];
          console.log(`Translating chunk ${j + 1}/${wordChunks.length}:`, chunk.substring(0, 30) + '...');

          try {
            const chatCompletion = await this.groq.chat.completions.create({
              messages: [
                {
                  role: 'system',
                  content: `You are a professional translator. Translate the following text from ${detectedSource === 'auto' ? 'detected language' : detectedSource} to ${targetLanguage}. Maintain the original meaning, tone, and formatting. Only return the translated text, no explanations or additional content.`
                },
                {
                  role: 'user',
                  content: chunk
                }
              ],
              model: 'llama3-8b-8192', // Using Groq's Llama model
              temperature: 0.1, // Low temperature for consistent translations
              max_tokens: 1024,
              top_p: 1,
            });

            const translatedText = chatCompletion.choices[0]?.message?.content?.trim();
            if (translatedText) {
              translatedChunks.push(translatedText);
            } else {
              console.warn(`Empty translation for chunk ${j + 1}, using original`);
              translatedChunks.push(chunk);
            }
          } catch (chunkError) {
            console.error(`Error translating chunk ${j + 1}:`, chunkError);
            // Preserve original text instead of skipping
            console.warn(`Using original text for failed chunk ${j + 1}`);
            translatedChunks.push(chunk);
            continue;
          }
        }

        // Join translated chunks back into paragraph
        const translatedParagraph = translatedChunks.join(' ');
        translatedParagraphs.push(translatedParagraph);
      }

      // Join paragraphs back with double newlines
      const result = translatedParagraphs.join('\n\n');
      console.log('Combined translation result:', result.substring(0, 100) + '...');
      return result;
    } catch (error) {
      console.warn('Groq API failed:', error);
      return null;
    }
  }

  // Helper method to split text into word chunks
  splitTextIntoWordChunks(text, wordsPerChunk) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const chunks = [];

    for (let i = 0; i < words.length; i += wordsPerChunk) {
      const chunk = words.slice(i, i + wordsPerChunk).join(' ');
      chunks.push(chunk);
    }

    return chunks;
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
      // Try Groq AI
      let translatedText = await this.translateWithGroq(text, targetLanguage, sourceLanguage);

      // If Groq fails completely, use fallback
      if (!translatedText) {
        console.warn('Groq failed completely, using fallback');
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
      'en': 'English',
      'hi': 'Hindi',
      'pa': 'Punjabi'
    };
    return languageMap[language] || 'English';
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
module.exports = translationService;
