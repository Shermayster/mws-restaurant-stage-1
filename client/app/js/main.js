/* eslint-env browser, no-unused-vars: "off" */
/* global  DBHelper, google */
/* */
let restaurants;
let neighborhoods;
let cuisines;
let map;
let markers = [];

/**
 * Add service worker to main page
 */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(() => {
    console.log('service worker registered!');
  })
  .catch(err => {
    console.log(err);
  });
}

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = () => {
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = () => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

const appendRestaurantImage = (restaurant, li) => {
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = `Restaurant: ${restaurant.name}`;
  li.append(image);
};

const appendRestaurantTitle = (restaurant, li) => {
  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  li.append(name);
};

const appendRestaurantNeighborhood = (restaurant, li) => {
  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);
};

const appendRestaurantAddress = (restaurant, li) => {
  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);
};

const appendRestaurantDetails = (restaurant, li) => {
  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = () => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

const appendRestaurantItems = (restaurant, li) => {
  appendRestaurantImage(restaurant, li);
  appendRestaurantTitle(restaurant, li);
  appendRestaurantNeighborhood(restaurant, li);
  appendRestaurantAddress(restaurant, li);
  appendRestaurantDetails(restaurant, li);
};

/**
 * Create restaurant HTML.
 * @param {*} restaurant restaurna object
 * @return {*} HTML Element
 */
const createRestaurantHTML = restaurant => {
  const li = document.createElement('li');
  appendRestaurantItems(restaurant, li);
  return li;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = () => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};
/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoodsList) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      neighborhoods = neighborhoodsList;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * @desc Clear current restaurants, their HTML and remove their map markers.
 * @param {*} restaurantsList todo: add list description
 */
const resetRestaurants = restaurantsList => {
  // Remove all restaurants
  restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  markers.forEach(m => m.setMap(null));
  markers = [];
  restaurants = restaurantsList;
};

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood,
    (error, restaurantsList) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurantsList);
        fillRestaurantsHTML();
      }
    });
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  const loadedMap = map;
  // disable keyboard navigation for google maps
  google.maps.event.addListener(loadedMap, 'tilesloaded', () => {
    document.querySelectorAll('#map a').forEach(item => {
      item.setAttribute('tabindex', '-1');
    });
    document.querySelectorAll('#map area').forEach(item => {
      item.setAttribute('tabindex', '-1');
    });
  });
  updateRestaurants();
};
