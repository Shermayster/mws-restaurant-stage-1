/* eslint-env browser */

/**
 * register service worker on a page
 * @param {string} swPath sw.js path
 */
export function registerSw(swPath) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swPath).then(() => {
      console.log('service worker registered!');
    }).catch(err => {
      console.log(err);
    });
  }
}
