let CACHE = "burgerci-v20260305235718";
let CORE = ["/","/site.css","/site.js","/logo.png","/favicon.png","/favicon.ico"];
let PRODUCTS = ["/products/ayran-30-cl.html","/products/capri-sun-multi-vitamin-33-cl.html","/products/capri-sun-mystic-dragon-33-cl.html","/products/cheeseburger.html","/products/coca-cola-25-l.html","/products/coca-cola-33-cl.html","/products/ekmek-arasi-izgara-tavuk.html","/products/ekmek-arasi-kasap-sucuk.html","/products/ekmek-arasi-kofte.html","/products/fanta-33-cl.html","/products/hamburger.html","/products/lipton-ice-tea-33-cl.html","/products/salgam-suyu-33-cl.html","/products/sprite-33-cl.html","/products/su-50-cl.html","/products/tavukburger.html","/img/products/ayran-30-cl-k.webp","/img/products/ayran-30-cl.webp","/img/products/capri-sun-multi-vitamin-33-cl-k.webp","/img/products/capri-sun-multi-vitamin-33-cl.webp","/img/products/capri-sun-mystic-dragon-33-cl-k.webp","/img/products/capri-sun-mystic-dragon-33-cl.webp","/img/products/cheeseburger-k.webp","/img/products/cheeseburger.webp","/img/products/coca-cola-25-l-k.webp","/img/products/coca-cola-25-l.webp","/img/products/coca-cola-33-cl-k.webp","/img/products/coca-cola-33-cl.webp","/img/products/ekmek-arasi-izgara-tavuk-k.webp","/img/products/ekmek-arasi-izgara-tavuk.webp","/img/products/ekmek-arasi-kasap-sucuk-k.webp","/img/products/ekmek-arasi-kasap-sucuk.webp","/img/products/ekmek-arasi-kofte-k.webp","/img/products/ekmek-arasi-kofte.webp","/img/products/fanta-33-cl-k.webp","/img/products/fanta-33-cl.webp","/img/products/hamburger-k.webp","/img/products/hamburger.webp","/img/products/lipton-ice-tea-33-cl-k.webp","/img/products/lipton-ice-tea-33-cl.webp","/img/products/salgam-suyu-33-cl-k.webp","/img/products/salgam-suyu-33-cl.webp","/img/products/sprite-33-cl-k.webp","/img/products/sprite-33-cl.webp","/img/products/su-50-cl-k.webp","/img/products/su-50-cl.webp","/img/products/tavukburger-k.webp","/img/products/tavukburger.webp"];
let PAGES = ["/pages/gizlilik-politikasi.html","/pages/hakkimizda.html","/pages/satis-sozlesmesi.html","/pages/site-haritasi.html","/pages/urunlerimiz.html","/index.html","/404.html","/img/address.png","/img/basket.png","/img/delete.png","/img/email.png","/img/instagram.png","/img/map.png","/img/menu-close.png","/img/menu-open.png","/img/minus.png","/img/phone.png","/img/plus.png","/img/telegram.png","/img/whatsapp.png","/img/pages/hero-header-k.webp","/img/pages/hero-header.webp"];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(CORE); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("message", function(e) {
  if (e.data === "cache-all") {
    caches.open(CACHE).then(function(c) {
      c.addAll(PRODUCTS).then(function() {
        return c.addAll(PAGES);
      }, function() {
        return c.addAll(PAGES);
      });
    });
  }
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;

  let url = new URL(e.request.url);
  let isCore = CORE.indexOf(url.pathname) !== -1;

  if (isCore) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        let clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return caches.match(url.pathname);
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(cached) {
      let fetched = fetch(e.request).then(function(res) {
        let clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(url.pathname, clone); });
        return res;
      }).catch(function() {
        return cached;
      });
      return cached || fetched;
    })
  );
});
