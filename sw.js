const CACHE_NAME = 'bklogins-cache-auto';

// Ao instalar, já tenta forçar a ativação imediata
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Ao ativar, limpa qualquer lixo antigo e assume o controle
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Interceptador inteligente (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  // Ignora requisições de outras origens (como imagens do Unsplash) para não dar erro
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Tenta buscar a versão mais nova na internet silenciosamente
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Se a internet funcionar, atualiza o cache com a versão mais nova (v16, v17, v18...)
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Se não tiver internet, ignora o erro e confia no que já tem salvo
        });

        // Se já tiver salvo no cache, exibe instantaneamente. 
        // Se não tiver, espera a internet baixar.
        return response || fetchPromise;
      });
    })
  );
});
