const APP = {
  SW: null,
  init() {
    //called after DOMContentLoaded
    //register the service worker
    APP.registerSW();
    //add click listener for h2 to load a new image
    document.querySelector('h2').addEventListener('click', APP.addImage);
  },
  registerSW() {
    if ('serviceWorker' in navigator) {
      // Register a service worker hosted at the root of the site
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          APP.SW =
            registration.installing ||
            registration.waiting ||
            registration.active;
        },
        (error) => {
          console.log('Service worker registration failed:', error);
        }
      );
    } else {
      console.log('Service workers are not supported.');
    }
  },
  addImage(ev) {
    let img = document.createElement('img');
    img.src = '/img/hero.png';
    img.alt = 'dynamically added image';
    let p = document.createElement('p');
    p.append(img);
    document.querySelector('main').append(p);
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
