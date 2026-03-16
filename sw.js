// Service Worker para Relatório de Serviço - 15º BPM

const CACHE_NAME = 'relatorio-15bpm-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const ICON_CACHE = 'icons-v1';

// Recursos estáticos locais
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/sw.js'
];

// Ícones locais (quando baixados)
const LOCAL_ICONS = [
    '/icons/icon-512x512.png',
    '/icons/icon-256x256.png',
    '/icons/icon-128x128.png',
    '/icons/icon-64x64.png',
    '/icons/favicon-32x32.png'
];

// Ícones externos (Flaticon) - fallback
const EXTERNAL_ICONS = [
    'https://cdn-icons-png.flaticon.com/512/6345/6345343.png',
    'https://cdn-icons-png.flaticon.com/256/6345/6345343.png',
    'https://cdn-icons-png.flaticon.com/128/6345/6345343.png',
    'https://cdn-icons-png.flaticon.com/64/6345/6345343.png',
    'https://cdn-icons-png.flaticon.com/32/6345/6345343.png'
];

// CDNs externas
const EXTERNAL_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');
    
    event.waitUntil(
        Promise.all([
            // Cache estático
            caches.open(STATIC_CACHE)
                .then(cache => cache.addAll(STATIC_ASSETS)),
            
            // Cache de ícones locais (se existirem)
            caches.open(ICON_CACHE)
                .then(cache => {
                    return Promise.all(
                        LOCAL_ICONS.map(url => 
                            fetch(url)
                                .then(response => {
                                    if (response.ok) return cache.put(url, response);
                                })
                                .catch(() => console.log('[SW] Ícone local não encontrado:', url))
                        )
                    );
                }),
            
            // Cache de ícones externos (fallback)
            caches.open(ICON_CACHE)
                .then(cache => {
                    return Promise.all(
                        EXTERNAL_ICONS.map(url => 
                            fetch(url, { mode: 'no-cors' })
                                .then(response => cache.put(url, response))
                                .catch(() => console.log('[SW] Falha ao cachear ícone externo:', url))
                        )
                    );
                }),
            
            // Cache de assets externos
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    return Promise.all(
                        EXTERNAL_ASSETS.map(url => 
                            fetch(url)
                                .then(response => {
                                    if (response.ok) return cache.put(url, response);
                                })
                                .catch(err => console.log('[SW] Falha ao cachear:', url, err))
                        )
                    );
                })
        ])
        .then(() => {
            console.log('[SW] Instalação concluída');
            return self.skipWaiting();
        })
        .catch(err => console.error('[SW] Erro na instalação:', err))
    );
});

// Ativação
self.addEventListener('activate', (event) => {
    console.log('[SW] Ativando...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (![STATIC_CACHE, DYNAMIC_CACHE, ICON_CACHE].includes(cacheName)) {
                            console.log('[SW] Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch - estratégia de cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Navegação - Cache First
    if (request.mode === 'navigate') {
        event.respondWith(
            caches.match('/index.html')
                .then(response => response || fetch(request))
        );
        return;
    }
    
    // Ícones - Cache First (locais ou externos)
    if (url.pathname.includes('/icons/') || EXTERNAL_ICONS.includes(request.url)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) return response;
                    return fetch(request)
                        .then(fetchResponse => {
                            const clone = fetchResponse.clone();
                            caches.open(ICON_CACHE)
                                .then(cache => cache.put(request, clone));
                            return fetchResponse;
                        })
                        .catch(() => {
                            // Fallback para ícone externo se local falhar
                            if (url.pathname.includes('/icons/')) {
                                const externalUrl = EXTERNAL_ICONS[0];
                                return caches.match(externalUrl);
                            }
                        });
                })
        );
        return;
    }
    
    // Assets estáticos - Cache First
    if (STATIC_ASSETS.includes(url.pathname)) {
        event.respondWith(
            caches.match(request)
                .then(response => response || fetch(request))
        );
        return;
    }
    
    // CDNs - Stale While Revalidate
    if (EXTERNAL_ASSETS.includes(request.url)) {
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                    const fetchPromise = fetch(request)
                        .then(networkResponse => {
                            if (networkResponse.ok) {
                                caches.open(DYNAMIC_CACHE)
                                    .then(cache => cache.put(request, networkResponse.clone()));
                            }
                            return networkResponse;
                        })
                        .catch(() => cachedResponse);
                    
                    return cachedResponse || fetchPromise;
                })
        );
        return;
    }
    
    // Estratégia padrão - Network First
    event.respondWith(
        fetch(request)
            .then(networkResponse => {
                if (networkResponse.ok) {
                    const clone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => cache.put(request, clone));
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(request)
                    .then(cachedResponse => {
                        if (cachedResponse) return cachedResponse;
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker do 15º BPM carregado');
