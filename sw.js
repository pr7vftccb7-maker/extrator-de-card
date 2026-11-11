const CACHE_NAME = 'bklogins-cache-v16.9';

// Arquivos para salvar no cache do navegador
const urlsToCache = [
  './',
  './index.html' // Se o seu arquivo principal tiver outro nome, mude aqui (ex: ./ferramenta.html)
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições: se estiver offline, puxa do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o arquivo do cache se encontrar, senão busca na internet
        return response || fetch(event.request);
      })
  );
});
