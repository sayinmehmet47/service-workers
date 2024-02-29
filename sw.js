const version = 2;
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

self.addEventListener('fetch', (ev) => {
  // ev.request each time the webpage asks for any resource.
  //Extendable Event
  console.log(`fetch request for: ${ev.request.url}`);
  /*                  */
  // version 1 - pass thru
  // ev.respondWith(fetch(ev.request));
  /*                  */
  // version 2 - check the caches first for the file. If missing do a fetch
  // ev.respondWith(
  //   caches.match(ev.request).then((cacheRes) => {
  //     if (cacheRes == undefined) {
  //       console.log(`MISSING ${ev.request.url}`);
  //     }
  //     return cacheRes || fetch(ev.request);
  //   })
  // );
  /*                  */
  //version 3 - check cache. fetch if missing. then add response to cache
  ev.respondWith(
    caches.match(ev.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(ev.request).then((fetchResponse) => {
          let type = fetchResponse.headers.get('content-type');
          if (
            (type && type.match(/^text\/css/i)) ||
            ev.request.url.match(/fonts.googleapis.com/i)
          ) {
            //css to save in dynamic cache
            console.log(`save a CSS file ${ev.request.url}`);
            return caches.open(dynamicName).then((cache) => {
              cache.put(ev.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else if (
            (type && type.match(/^font\//i)) ||
            ev.request.url.match(/fonts.gstatic.com/i)
          ) {
            console.log(`save a FONT file ${ev.request.url}`);
            return caches.open(fontName).then((cache) => {
              cache.put(ev.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else if (type && type.match(/^image\//i)) {
            //save in image cache
            console.log(`save an IMAGE file ${ev.request.url}`);
            return caches.open(imageName).then((cache) => {
              cache.put(ev.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else {
            //save in dynamic cache
            console.log(`OTHER save ${ev.request.url}`);
            return caches.open(dynamicName).then((cache) => {
              cache.put(ev.request, fetchResponse.clone());
              return fetchResponse;
            });
          }
        })
      );
    })
  );
});

self.addEventListener('message', (ev) => {});
