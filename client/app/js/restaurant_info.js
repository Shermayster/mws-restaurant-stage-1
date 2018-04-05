/* eslint-env browser */

/**
 * Add service worker to restaraunt info page
 */
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

class RestarauntInfo {
  constructor() {
    this.restaurant = null;
  }

  /**
   * Get current restaurant from page URL.
   * @param {*} callback todo add desc
   */
  fetchRestaurantFromURL(callback) {
    if (this.restaurant) {
    // restaurant already fetched!
      callback(null, this.restaurant);
      return;
    }
    const id = this.getParameterByName('id');
    const idNotFound = !id;
    if (idNotFound) {
      // no id found in URL
      const error = 'No restaurant id in URL';
      callback(error, null);
    } else {
      DBHelper.fetchRestaurantById(id, (error, restaurant) => {
        this.restaurant = restaurant;
        if (!restaurant) {
          console.error(error);
          return;
        }
        this.fillRestaurantHTML();
        callback(null, restaurant);
      });
    }
  }

  /**
   * Create restaurant HTML and add it to the webpage
   * @param {*} restaurant todo add desc
   */
  fillRestaurantHTML(restaurant = this.restaurant) {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt = `Restaurant: ${restaurant.name}`;

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
      this.fillRestaurantHoursHTML();
    }
    // fill reviews
    this.fillReviewsHTML();
  }

  /**
   * Create restaurant operating hours HTML table and add it to the webpage.
   * @param {*} operatingHours todo add desc
   */
  fillRestaurantHoursHTML(operatingHours = this.restaurant.operating_hours) {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
      if (key) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
      }
    }
  }

  /**
   * Create all reviews HTML and add them to the webpage.
   * @param {*} reviews todo add desc
   */
  fillReviewsHTML(reviews = this.restaurant.reviews) {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(this.createReviewHTML(review));
    });
    container.appendChild(ul);
  }

  /**
   * Create review HTML and add it to the webpage.
   * @param {*} review todo add desc
   * @return {*} li todo add desc
   */
  createReviewHTML(review) {
    const li = document.createElement('li');
    const reviewTitle = document.createElement('div');
    reviewTitle.className = 'review-title review-details';
    li.appendChild(reviewTitle);

    const name = document.createElement('p');
    name.innerHTML = review.name;
    name.className = 'reviewer-name';
    reviewTitle.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    date.className = 'review-date';
    reviewTitle.appendChild(date);

    const reviewContent = document.createElement('div');
    reviewContent.className = 'review-content review-details';
    li.appendChild(reviewContent);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    rating.className = 'review-raiting uppercase';
    reviewContent.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    reviewContent.appendChild(comments);

    return li;
  }

  /**
  * Add restaurant name to the breadcrumb navigation menu
  * @param {*} restaurant todo add desc
  */
  fillBreadcrumb(restaurant = this.restaurant) {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
    li.setAttribute('aria-current', 'page');
    breadcrumb.appendChild(li);
  }

  /**
   * Get a parameter by name from page URL.
   * @param {*} name todo add desc
   * @param {*} url todo add desc
   * @return {*} todo add return
   */
  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}

const restarauntInfo = new RestarauntInfo();

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  restarauntInfo.fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      restarauntInfo.fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(restarauntInfo.restaurant, map);
    }
  });
};
