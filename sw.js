const CACHE = "bora-v1";
const ARQUIVOS = ["./", "./index.html", "./app.bundle.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // não faz cache de chamadas de API (IA, banco de imagens) — só do app em si
  if (e.request.url.includes("api.anthropic.com") || e.request.url.includes("githubusercontent.com")) return;
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});
