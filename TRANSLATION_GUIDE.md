# News Translation Guide

## Current Implementation ✅
The news sidebar now supports **language-based content**:

### What's Working:
- **Fallback News**: Pre-translated Hindi and English news articles
- **Facts & Tips**: Translated environmental facts and daily tips
- **Language Switching**: Content automatically changes when language is switched
- **Caching**: Efficient caching per language

### How It Works:
1. **English Mode**: Shows real-time news from NewsAPI + English fallback
2. **Hindi Mode**: Shows pre-translated Hindi news articles
3. **Auto-refresh**: Content updates every 10 minutes
4. **Language Detection**: Uses the app's language context

---

## Option 1: Google Translate API (Recommended for Real-time Translation)

If you want to translate **real-time news** from the API, here's how:

### Step 1: Get Google Translate API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Cloud Translation API"
3. Create credentials and get your API key

### Step 2: Add Translation Function
```typescript
// Add to src/lib/newsApi.ts
const GOOGLE_TRANSLATE_API_KEY = 'your_google_api_key_here';
const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'text'
      })
    });
    
    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Return original text if translation fails
  }
}
```

### Step 3: Update NewsService
```typescript
// In getEnvironmentalNews method, add translation:
if (language === 'hi') {
  const translatedArticles = await Promise.all(
    articles.map(async (article) => ({
      ...article,
      title: await translateText(article.title, 'hi'),
      description: await translateText(article.description, 'hi'),
      category: await translateText(article.category, 'hi')
    }))
  );
  return translatedArticles;
}
```

---

## Option 2: Free Translation Services

### LibreTranslate (Free)
```typescript
async function translateWithLibreTranslate(text: string, targetLanguage: string): Promise<string> {
  const response = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: targetLanguage
    })
  });
  
  const data = await response.json();
  return data.translatedText;
}
```

### MyMemory API (Free with limits)
```typescript
async function translateWithMyMemory(text: string, targetLanguage: string): Promise<string> {
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`
  );
  
  const data = await response.json();
  return data.responseData.translatedText;
}
```

---

## Current Status: ✅ Working Solution

The current implementation provides:
- ✅ **Immediate translation** for fallback content
- ✅ **Language switching** works perfectly
- ✅ **No API costs** for translation
- ✅ **Fast loading** with cached content
- ✅ **Reliable** - no external API dependencies

### To Test:
1. Switch language to Hindi in the app
2. Check the news sidebar - content should be in Hindi
3. Switch back to English - content should be in English

The news content will now be properly translated based on the selected language! 🎉
