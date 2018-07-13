/**
 * Common database helper functions.
 */
'use strict'
var networkDataReceived = false;
class DBHelper {

  static get DATABASE_PORT() {
    return 1337;
  }
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL_GET() {
    // Change this to your server port
    return `http://localhost:${DBHelper.DATABASE_PORT}/restaurants`;
  }

  static get DATABASE_URL_ADD() {
    return `http://localhost:${DBHelper.DATABASE_PORT}/reviews/`
  }
  /**
   * Get all reviews for a restaurant
   * http://localhost:1337/reviews/?restaurant_id=<restaurant_id>
   */
  static get DATABASE_URL_GET_REVIEWS() {
    return `http://localhost:${DBHelper.DATABASE_PORT}/reviews/?restaurant_id=`
  }

  static get DATABASE_URL_DELETE_REVIEW() {
    return `http://localhost:${DBHelper.DATABASE_PORT}/reviews/`
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return navigator.onLine ?
      DBHelper._fetchRestaurants().then(res => res).catch(() => {
        return readData('restaurants').then(res => res[0]);
      }) :
      readData('restaurants').then(res => {
        console.log('restaurant from cache', res);
        return res[0]
      });
  }

  /**
   * Fetch reviews for restaurant
   */

   static getRestaurantReviews(restaurantId) {
     return navigator.onLine ?
     DBHelper._getRestaurantReviews(restaurantId).then(res => res).catch(() => {
       return  readDataByKey('reviews', restaurantId);
     }) :
     readDataByKey('reviews', restaurantId).then(res => {
       console.log('reviews from cache', res);
       return res
      });
   }

  /**
   * Add review to a restaurant
   */
   static addReview(data) {
     return fetch(DBHelper.DATABASE_URL_ADD, {
       method: 'POST',
       body: JSON.stringify(data)
     })
   }

   static deleteReview(review_id) {
     return fetch(DBHelper.DATABASE_URL_DELETE_REVIEW+review_id, {
       method: 'DELETE'
     })
     .then(res => res.json())
     .catch(error => console.log(error));
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

  /**
   * get restaurant review
   */
  static _getRestaurantReviews(restaurantId) {
    return fetch(DBHelper.DATABASE_URL_GET_REVIEWS+restaurantId)
    .then(res => res.json())
    .catch(error => console.log(error));
  }
  /**
   * Fetch restaurant data
   */
  static _fetchRestaurants() {
    return fetch(DBHelper.DATABASE_URL_GET)
    .then(res => res.json())
    .catch(error => console.log(error));
  }
}
