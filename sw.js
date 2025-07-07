// Service Worker para Portafolio PWA
const CACHE_NAME = 'portafolio-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.json',
  '/assets/img/favicon.png',
  '/assets/img/PerfilPhoto.jpeg',
  '/assets/img/fondoPortada.png',
  '/assets/img/html5.png',
  '/assets/img/css3.png',
  '/assets/img/js.png',
  '/assets/img/react.png',
  '/assets/img/Next.png',
  '/assets/img/tailwind.png',
  '/assets/img/node.png',
  '/assets/img/Express.png',
  '/assets/img/MongoDB.png',
  '/assets/img/PostgreSQL.png',
  '/assets/img/git.png',
  '/assets/img/github.png',
  '/assets/img/VS Code.png',
  '/assets/img/Figma.png',
  '/assets/img/logoYaka.png',
  '/assets/img/vitalscore.png',
  '/assets/img/fomnowon.png',
  '/assets/img/email.svg',
  '/assets/img/linkedin.png',
  '/assets/img/ubicacion.png',
  '/assets/img/experiencia.png',
  '/assets/img/frontend.png',
  '/assets/img/backend.png',
  '/assets/img/herramientas.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Error al cachear recursos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver desde cache si existe
        if (response) {
          return response;
        }

        // Si no está en cache, hacer petición a la red
        return fetch(event.request)
          .then(response => {
            // Verificar que la respuesta sea válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para cachearla
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si falla la red, devolver página offline
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Manejo de mensajes
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 