/* eslint-disable no-undef */
workbox.routing.registerRoute(
  /^https?.*\.(png|gif|jpg|jpeg|webp|svg|ttf|woff)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'assets',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  })
)
