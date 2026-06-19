// ==========================================
// SERVICE WORKER - Relatório 15º BPM PWA
// Cache-first strategy para assets estáticos
// ==========================================

const CACHE_NAME = 'relatorio-15bpm-v1';
const STATIC_ASSETS = [
  '/',
  '/relatorio.html',
  '/manifest.json',
  // Ícones
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Imagens do app
  '/img/relatorio-15bpm-icon-transparent.png',
  // Bibliotecas externas (fallback)
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// ==========================================
// INSTALAÇÃO - Pré-cache dos assets
// ==========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto, adicionando assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Assets cacheados com sucesso');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Erro ao cachear assets:', err);
      })
  );
});

// ==========================================
// ATIVAÇÃO - Limpar caches antigos
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deletando cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Ativado e controlando clientes');
      return self.clients.claim();
    })
  );
});

// ==========================================
// FETCH - Estratégia de cache
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') return;

  // Estratégia: Cache-First para assets locais
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia: Stale-While-Revalidate para CDN
  if (url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Estratégia: Network-First para outros recursos
  event.respondWith(networkFirst(request));
});

// ==========================================
// HELPERS DE ESTRATÉGIA
// ==========================================

function isStaticAsset(url) {
  const staticPaths = [
    '/relatorio.html',
    '/manifest.json',
    '/icons/',
    '/img/',
    '/screenshots/',
    '/css/',
    '/js/'
  ];
  return staticPaths.some(path => url.pathname.startsWith(path)) || url.pathname === '/';
}

// Cache-First: Serve do cache, busca na rede se não estiver
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    // Atualizar cache em background (stale-while-revalidate)
    fetch(request).then((response) => {
      if (response.ok) cache.put(request, response.clone());
    }).catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[SW] Falha ao buscar recurso:', request.url);
    // Retornar página offline se disponível
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    throw error;
  }
}

// Stale-While-Revalidate: Serve cache imediatamente, atualiza em background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Network-First: Tenta rede primeiro, cai para cache se offline
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

// ==========================================
// BACKGROUND SYNC (para envio offline)
// ==========================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-relatorios') {
    event.waitUntil(syncRelatoriosPendentes());
  }
});

async function syncRelatoriosPendentes() {
  // Implementar sincronização de relatórios pendentes
  console.log('[SW] Sincronizando relatórios pendentes...');
}

// ==========================================
// PUSH NOTIFICATIONS (opcional)
// ==========================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Novo relatório disponível',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'relatorio-15bpm',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Relatório 15º BPM',
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
