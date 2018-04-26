
var dbPromise = idb.open('restaurants-store', 1, db => {
  if(!db.objectStoreNames.contains('restaurants')) {
    db.createObjectStore('restaurants')
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
    .then(function(db) {
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
