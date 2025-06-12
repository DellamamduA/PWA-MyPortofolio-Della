// Versi unik dari cache untuk pembaruan konten
const VERSIONED_CACHE = 'cache-v3-portofolio';

// Daftar berkas yang wajib tersedia saat offline
const PRELOAD_FILES = [
  './index.html',
  './style.css',
  './app.js',
  './profileku.jpg',
  './profileku1.jpg'
];

// Ketika service worker pertama kali didaftarkan
self.addEventListener('install', event => {
  console.log('[SW] Memulai instalasi...');
  event.waitUntil(
    (async () => {
      const cacheStore = await caches.open(VERSIONED_CACHE);
      await cacheStore.addAll(PRELOAD_FILES);
      console.log('[SW] Semua aset telah dimasukkan ke cache.');
    })()
  );
});

// Mengelola permintaan resource dari halaman web
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const foundInCache = await caches.match(event.request);
      if (foundInCache) {
        return foundInCache;
      }
      try {
        const freshResponse = await fetch(event.request);
        return freshResponse;
      } catch (err) {
        console.warn('[SW] Gagal mengambil dari jaringan:', err);
      }
    })()
  );
});

// Saat SW baru diaktifkan, bersihkan cache lama
self.addEventListener('activate', event => {
  console.log('[SW] Aktivasi dan penyaringan cache lama...');
  event.waitUntil(
    (async () => {
      const storedKeys = await caches.keys();
      await Promise.all(
        storedKeys.map(key => {
          if (key !== VERSIONED_CACHE) {
            console.log(`[SW] Cache lama dibuang: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })()
  );
});
