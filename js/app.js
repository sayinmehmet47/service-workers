const APP = {
  SW: null,
  init() {
    //called after DOMContentLoaded
    //register the service worker
    APP.registerSW();
    //add click listener for h2 to load a new image

    document
      .getElementById('colorForm')
      .addEventListener('click', APP.saveColor);
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
  saveColor(ev) {
    ev.preventDefault();
    let name = document.getElementById('name');
    let color = document.getElementById('color');

    let strName = name.value.trim();
    let strColor = color.value.trim();
    if (strName && strColor) {
      let person = {
        id: Date.now(),
        name: strName,
        color: strColor,
      };
      console.log('Save', person);
      APP.sendMessage({ addPerson: person, otherAction: 'hello' });
    }
  },

  sendMessage(msg) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  },
  onMessage({ data }) {},
};

document.addEventListener('DOMContentLoaded', APP.init);
