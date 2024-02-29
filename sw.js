const version = 4;
let staticName = `staticCache$-${version}`;
let dynamicName = 'dynamicCache';
let fontName = 'fontCache';
let imageName = 'imageCache';

let assets = ['/', '/index.html', '/css/main.css', '/js/app.js'];

self.addEventListener('install', (ev) => {
  const preCache = async () => {
    const cache = await caches.open(staticName);
    return cache.addAll(assets).then(() => {
      console.log(`Version ${version} installed`);
    });
  };
  ev.waitUntil(preCache());
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList
          .filter((key) => key !== staticName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (ev) => {});

self.addEventListener('message', (ev) => {});
