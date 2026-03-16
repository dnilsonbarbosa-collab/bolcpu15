// sw.js - Service Worker atualizado para Sistema de Relatório 15º BPM
const CACHE_NAME = 'relatorio-bpm-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// URLs externas para cache (CDNs)
const EXTERNAL_ASSETS = [
  'https://cdn-icons-png.flaticon.com/512/6345/6345343.png',
  'https://cdn-icons-png.flaticon.com/256/6345/6345343.png',
  'https://cdn-icons-png.flaticon.com/128/6345/6345343.png',
  'https://cdn-icons-png.flaticon.com/64/6345/6345343.png',
  'https://cdn-icons-png.flaticon.com/32/6345/6345343.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalação - Limpar caches antigos e instalar novo cache
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando novo Service Worker v3...');
  
  // Forçar ativação imediata
  self.skipWaiting();
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Deletar TODOS os caches antigos (de qualquer versão)
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Deletando cache antigo:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Criar novo cache
      return caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Criando novo cache:', CACHE_NAME);
        
        // Cachear assets locais
        const localCache = cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('[SW] Erro ao cachear assets locais:', err);
        });
        
        // Cachear assets externos (com fallback)
        const externalCache = Promise.all(
          EXTERNAL_ASSETS.map(url => 
            fetch(url, { mode: 'no-cors' })
              .then(response => cache.put(url, response))
              .catch(err => console.warn('[SW] Falha ao cachear:', url))
          )
        );
        
        return Promise.all([localCache, externalCache]);
      });
    })
  );
});

// Ativação - Limpar caches antigos e assumir controle imediato
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker v3...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Assumir controle de TODAS as abas/clientes imediatamente
      return self.clients.claim();
    }).then(() => {
      // Notificar todos os clients que o SW foi atualizado
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
        });
      });
    })
  );
});

// Estratégia de cache: Network First para HTML, Cache First para assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Estratégia para páginas HTML (Network First)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Atualizar cache com versão nova
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback para cache se offline
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // Se não tiver no cache, retorna página offline
            return caches.match('./index.html');
          });
        })
    );
    return;
  }
  
  // Estratégia para assets estáticos (Cache First)
  if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Retorna do cache e atualiza em background
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }).catch(() => {});
          return cached;
        }
        
        // Se não estiver no cache, busca na rede
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        }).catch(() => {
          // Retorna resposta vazia se falhar
          return new Response('', { status: 404, statusText: 'Not found' });
        });
      })
    );
    return;
  }
  
  // Para outras requisições (APIs, etc) - Network Only com fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Mensagens do client
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-relatorios') {
    console.log('[SW] Sincronizando relatórios pendentes...');
  }
});
