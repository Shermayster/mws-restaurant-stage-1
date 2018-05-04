/* eslint-env browser*/
/* global  DBHelper, google*/

/**
 * Add service worker to main page
 */
var marked = false;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => {
      console.log('service worker registered!');
    })
    .catch(err => {
      console.log(err);
    });
}

let map;

class Main {
  constructor() {
    this.restaurants = null;
    this.neighborhoods = null;
    this.cuisines = null;
    this.markers = [];
  }

  /**
   * Set cuisines HTML.
   */
  fillCuisinesHTML() {
    const select = document.getElementById('cuisines-select');
    this.cuisines.forEach(cuisine => {
      const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      select.append(option);
    });
  }

  /**
   * Fetch all cuisines and set their HTML.
   */
  fetchCuisines() {
    DBHelper.fetchCuisines().then(
      cuisines => {
        this.cuisines = cuisines;
        this.fillCuisinesHTML();
      },
      error => console.log(error)
    );
  }

  /**
   * Set neighborhoods HTML.
   */
  fillNeighborhoodsHTML() {
    const select = document.getElementById('neighborhoods-select');
    this.neighborhoods.forEach(neighborhood => {
      const option = document.createElement('option');
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      select.append(option);
    });
  }

  appendRestaurantImage(restaurant, li) {
    const picture = document.createElement('picture');
    const images = DBHelper.imageUrlForRestaurant(restaurant);
    const altValue = `Restaurant: ${restaurant.name}`;
    const sources = ImageHelper.creatSourcesForPicture(images, altValue);
    sources.forEach(source => picture.append(source));
    picture.className = 'lazyload';
    li.append(picture);
  }

  appendRestaurantTitle(restaurant, li) {
    const name = document.createElement('h3');
    name.innerHTML = restaurant.name;
    li.append(name);
  }

  appendRestaurantNeighborhood(restaurant, li) {
    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);
  }

  appendRestaurantAddress(restaurant, li) {
    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);
  }

  appendRestaurantDetails(restaurant, li) {
    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    li.append(more);
  }

  /**
   * Add markers for current restaurants to the map.
   */
  addMarkersToMap() {
    if (this.getMapDisplayProperty() !== 'block') {
      return;
    }
    this.restaurants.forEach(restaurant => {
      // Add marker to the map
      const marker = DBHelper.mapMarkerForRestaurant(restaurant, map);
      google.maps.event.addListener(marker, 'click', () => {
        window.location.href = marker.url;
      });
      this.markers.push(marker);
    });
    marked = true;
  }

  getMapDisplayProperty() {
    const map = document.querySelector('#map');
    return window.getComputedStyle(map, null).getPropertyValue('display');
  }

  appendRestaurantItems(restaurant, li) {
    this.appendRestaurantImage(restaurant, li);
    this.appendRestaurantTitle(restaurant, li);
    this.appendRestaurantNeighborhood(restaurant, li);
    this.appendRestaurantAddress(restaurant, li);
    this.appendRestaurantDetails(restaurant, li);
  }

  /**
   * Create restaurant HTML.
   * @param {*} restaurant object
   * @return {*} HTML Element
   */
  createRestaurantHTML(restaurant) {
    const li = document.createElement('li');
    this.appendRestaurantItems(restaurant, li);
    return li;
  }

  /**
   * Create all restaurants HTML and add them to the webpage.
   */
  fillRestaurantsHTML() {
    const ul = document.getElementById('restaurants-list');
    this.restaurants.forEach(restaurant => {
      ul.append(this.createRestaurantHTML(restaurant));
    });
    this.addMarkersToMap();
  }
  /**
   * Fetch all neighborhoods and set their HTML.
   */
  fetchNeighborhoods() {
    DBHelper.fetchNeighborhoods().then(neighborhoodsList => {
      this.neighborhoods = neighborhoodsList;
      this.fillNeighborhoodsHTML();
    });
  }

  /**
   * @desc Clear current restaurants, their HTML and remove their map markers.
   * @param {*} restaurantsList todo: add list description
   */
  resetRestaurants(restaurantsList) {
    // Remove all restaurants
    this.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    this.restaurants = restaurantsList;
  }

  /**
   * Update page and map for current restaurants.
   */
  updateRestaurants() {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(
      cuisine,
      neighborhood
    ).then(
      restaurantsList => {
        this.resetRestaurants(restaurantsList);
        this.fillRestaurantsHTML();
      },
      error => console.log(error)
    );
  }
}

const main = new Main();

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  main.fetchNeighborhoods();
  main.fetchCuisines();
  main.updateRestaurants();
});

/**
 * Initialize Google map, called from HTML.
 */

window.onload = () => {
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
  main.addMarkersToMap();
};

const accBtn = document.querySelector('.accordion');
accBtn.addEventListener('click', () => {
  const map = document.querySelector('#map');
  map.classList.toggle('show');
  accBtn.classList.toggle('active');
  accBtn.innerText = getAccordionText(accBtn.innerText);
  if (!marked) {
    main.addMarkersToMap();
  }
});

function getAccordionText(text) {
  return text === 'SHOW MAP' ? 'HIDE MAP' : 'SHOW MAP';
}
