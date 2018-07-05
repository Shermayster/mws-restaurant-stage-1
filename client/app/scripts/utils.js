'use strict'
var dbPromise = idb.open('restaurants-store', 1, db => {
  if (!db.objectStoreNames.contains('restaurants')) {
    db.createObjectStore('restaurants')
  }
  if (!db.objectStoreNames.contains('restaurants')) {
    db.createObjectStore('reviews')
  }
});

/**
 * Writes data to indexdb
 * @param {string} st
 * @param {{key: any}} data
 */
function writeData(st, data, dataKey) {
  return dbPromise.then((db) => {
    const tx = db.transaction(st, 'readwrite');
    tx.objectStore(st).put(data, dataKey);
    return tx.complete;
  });
}

function readData(st) {
  return dbPromise.then((db) => {
    const tx = db.transaction(st, 'readonly');
    const store = tx.objectStore(st);
    return store.getAll().then(data => data[0]);
  })
}

function clearAllData(st) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    });
}

function readAllData(st) {
  return dbPromise.then(db => {
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  })
}

class ImageHelper {
  static creatSourcesForPicture(images, altValue) {
    return Object.keys(images).map(key => {
      if (key !== 'jpg') {
        const source = document.createElement('source');
        return ImageHelper.addAttributesToSource(source, images[key], key);
      } else {
        const img = document.createElement('img');
        img.setAttribute('data-src', images[key].url);
        img.alt = altValue;
        img.className = 'restaurant-img lazyload';
        return img;
      }
    });
  }

  static addAttributesToSource(source, picMetadata, key) {
    source.setAttribute('type', `image/${picMetadata.type}`);
    source.setAttribute(
      'media',
      `(min-width:${key.includes('280') ? '280px' : '500px'})`
    );
    source.setAttribute('srcset', picMetadata.url);
    source.className = 'restaurant-img lazyload';
    return source;
  }
}
