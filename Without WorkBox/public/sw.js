const STATIC_CACHE_NAME = "FootbalPWA-static-v83";
const DYNAMIC_CACHE_NAME = "FootbalPWA-dynamic";

var urlToCache = [
  "/",
  "/index.html",
  "/nav.html",
  "/pages/standings.html",
  "/pages/schedule.html",
  "/pages/top-scorer.html",
  "/src/css/style.css",
  "/src/css/materialize.min.css",
  "/src/images/icons/ball-64x64.png",
  "/src/js/app.js",
  "/src/js/api.js",
  "/src/js/nav.js",
  "/src/js/idb.js",
  "/src/js/notif.js",
  "/src/js/materialize.min.js",
  "https://fonts.googleapis.com/css?family=Roboto:400,700",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(function(cache) {
      return cache.addAll(urlToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("[Service Worker] Activating Service Worker...");
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log("[Service Worker] Removing old cache.", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(res) {
            return caches.open(DYNAMIC_CACHE_NAME).then(function(cache) {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch(function(err) {});
      }
    })
  );
});

self.addEventListener("push", function(event) {
  console.log("push notification received");
  var body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push Message no payload";
  }

  var options = {
    body: body,
    icon: "/src/images/icons/ball-30x30.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification("Footbal Match Subcription", options)
  );
});
