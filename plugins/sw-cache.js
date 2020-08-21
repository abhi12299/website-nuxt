/* eslint-disable no-undef */
workbox.routing.registerRoute(
  /^https?.*\.(png|gif|jpg|jpeg|webp|svg|ttf|woff)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  })
)

// for safari
workbox.routing.registerRoute(
  /\.(mp4|webm)/,
  new workbox.strategies.CacheFirst({
    plugins: [new workbox.rangeRequests.RangeRequestsPlugin()]
  }),
  'GET'
)
