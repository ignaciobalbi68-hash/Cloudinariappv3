const CACHE_NAME = 'tatifestt-v3';

// Archivos a cachear (rutas relativas a la raíz del sitio)
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error de cache:', err))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Para páginas HTML (navegación)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Sin conexión: mostrar el juego offline.html
          return caches.match('./offline.html');
        })
    );
    return;
  }
  
  // Para otros recursos (CSS, JS, imágenes)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});