export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBv9aeIJ2wGXAuzIt46mvC6s_5mkRIzXVg',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'grocare-c77c6.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'grocare-c77c6',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'grocare-c77c6.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '73341031855',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:73341031855:web:4e37dc5b050262ef028b5a',
};

export const ollamaConfig = {
  apiKey: process.env.NEXT_PUBLIC_OLLAMA_API_KEY || '',
  endpoint: process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT || 'https://ollama.com/api',
};
