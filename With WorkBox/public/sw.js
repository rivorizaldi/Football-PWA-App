importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

workbox.precaching.precacheAndRoute([
  "/index.html",
  "/nav.html",
  "/src/images/icons/ball-64x64.png",
  "/src/css/style.css",
  "/src/css/materialize.min.css",
  "/src/js/materialize.min.js",
  "/src/js/nav.js"
]);

workbox.routing.registerRoute(
  /\/favorite/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "favorite"
  })
);

workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "player-badge-img"
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.networkFirst({
    cacheName: "json-data"
  })
);

workbox.routing.registerRoute(
  /\/pages\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages"
  })
);

workbox.routing.registerRoute(
  /\/src\/js\//,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "js"
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "google-fonts-stylesheets"
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
);

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
