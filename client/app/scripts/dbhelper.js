/**
 * Common database helper functions.
 */
'use strict'
var networkDataReceived = false;
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    // Change this to your server port
    const port = 1337;
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return readData('restaurants').then(res => {
      return res ? res : DBHelper._fetchRestaurants();
    })
  }

  /**
   *
   * Fetch a restaurant by its ID.
   * @param {number} id todo: add description
   * @param {any} callback todo: add description
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    return DBHelper.fetchRestaurants().then(restaurants => {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) {
          // Got the restaurant
          return restaurant;
        }
      });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants.then(restaurants => {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type === cuisine);
        return results;
    }, error => console.log(error));
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants().then(restaurants => {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood === neighborhood);
        return results;
      },
      error => console.log(error));
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => {
      let results = restaurants;
      if (cuisine !== 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type === cuisine);
      }
      if (neighborhood !== 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood === neighborhood);
      }
      return results;
    }, error => console.log(error));
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => {
      // Get all neighborhoods from all restaurants
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
      return uniqueNeighborhoods;
    }, error => console.log(error));
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => {
      // Get all cuisines from all restaurants
      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
      // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
      return uniqueCuisines;
    }, error => console.log(error));
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return {
      '280jpg': {
        url: `/images/${restaurant.photograph}-280px.jpg`,
        type: 'jpg'
      },
      '280webp': {
        url: `/images/${restaurant.photograph}-280px.webp`,
        type: 'webp'
      },
      'webp': {
        url: `/images/${restaurant.photograph}-380px.jpg`,
        type: 'webp'
      },
      'jpg': {
        url: `/images/${restaurant.photograph}.jpg`,
        type: 'jpg'
    }
    };
  }

  static addPictureSuffix() {

  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

  static _fetchRestaurants() {
    return fetch(DBHelper.DATABASE_URL)
    .then(res => res.json())
    .catch(error => console.log(error));
  }
}
