/* eslint-env browser */
'use strict'
/**
 * Add service worker to restaraunt info page
 */
var online = navigator.onLine;

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
      return new Promise(this.restaurant);
    }
    const id = this.getParameterByName('id');
    if (!id) {
      // no id found in URL
      const error = 'No restaurant id in URL';
      callback(error, null);
    } else {
      return DBHelper.fetchRestaurantById(id).then(restaurant => {
        this.restaurant = restaurant;
        if (!restaurant) {
          console.error('resturant not found');
          return;
        }
        this.fillRestaurantHTML();
        return restaurant;
      });
    }
  }

  /**
   * Create restaurant HTML and add it to the webpage
   * @param {*} restaurant todo add desc
   */
  fillRestaurantHTML(restaurant = this.restaurant) {
    const container = document.querySelector('#restaraunt-name');

    const restarauntName = document.createElement('h2');
    restarauntName.setAttribute('id', 'restaurant-name');
    restarauntName.innerHTML = restaurant.name;
    const picture = this.appendRestaurantImage(restaurant);

    container.insertAdjacentElement('afterbegin', picture);
    container.insertAdjacentElement('afterbegin', restarauntName);


    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;


    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
      this.fillRestaurantHoursHTML();
    }
    // fill reviews
    this.fillReviewsHTML();
  }

  appendRestaurantImage(restaurant) {
    const picture = document.createElement('picture');
    picture.setAttribute('id', 'restaurant-img');
    const images = DBHelper.imageUrlForRestaurant(restaurant);
    const altValue = `Restaurant: ${restaurant.name}`;
    const sources = ImageHelper.creatSourcesForPicture(images, altValue);
    sources.forEach(source => picture.append(source));
    picture.className = 'lazyload';
    return picture;
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
    // this.appendAddReviewSection(container);
    reviews ? this.appendReviewsList(container) : this.appendNoReviews(container);
  }

  appendNoReviews(container) {
    const noReviews = document.createElement('p');
    noReviews.classList = ['no-review-message'];
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
  }

  appendReviewsList(container) {
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(this.createReviewHTML(review));
    });
    container.appendChild(ul);
  }

  appendAddReviewSection(container) {
    const addReviewSection = document.createElement('section');
    addReviewSection.classList = ['add-review-section'];
    this.appendControlsToSection(addReviewSection);
    container.appendChild(addReviewSection);
  }

  appendControlsToSection(addReviewSection) {
    const nameInputSeciton = document.createElement('div');
    nameInputSeciton.classList = ['form-group'];
    nameInputSeciton.appendChild(this.createNameLabel());
    nameInputSeciton.appendChild(this.createNameInput());
    const reviewSection = document.createElement('div');
    reviewSection.classList = ['form-group'];
    reviewSection.appendChild(this.createReviewLabel());
    reviewSection.appendChild(this.createReviewInput());
    const addReviewBtn = this.createReviewBtn();
    const submitBtn = this.createReviewBtn();
    const cancelBtn = this.createCancelBtn();
    addReviewSection.appendChild(nameLabel);
    addReviewSection.appendChild(nameInput);
    addReviewSection.appendChild(reviewLabel);
    addReviewSection.appendChild(reviewInput);
    addReviewSection.appendChild(cancelBtn);
    addReviewSection.appendChild(submitBtn);
  }

  createNameLabel() {
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name-input');
    nameLabel.innerText = 'Your Name';
    return nameLabel;
  }

  createNameInput() {
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', 'name-input');
    return nameInput;
  }

  createReviewLabel() {
    const reviewLabel = document.createElement('label');
    reviewLabel.setAttribute('for', 'review-rating');
    reviewLabel.innerText = 'Review';
    return reviewLabel;
  }

  createReviewInput() {
    const reviewInput = document.createElement('textarea');
    reviewInput.setAttribute('id', 'review-rating');
    return reviewInput;
  }

  createReviewBtn() {
    const createReviewBtn = document.createElement('button');
    createReviewBtn.classList = ['submit-review'];
    createReviewBtn.innerText = 'Add Review';
    return createReviewBtn;
  }

  createCancelBtn() {
    const cancelBtn = document.createElement('button');
    cancelBtn.classList = ['cancel-review'];
    cancelBtn.innerText = 'Cancel';
    return cancelBtn;
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
    rating.className = 'review-rating uppercase';
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
  restarauntInfo.fetchRestaurantFromURL()
    .then(restaurant => {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      restarauntInfo.fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(restarauntInfo.restaurant, map);
    });
};

const accBtn = document.querySelector('.accordion');
if (online) {
  accBtn.addEventListener('click', () => {
    const map = document.querySelector('#map');
    map.classList.toggle('show');
    accBtn.classList.toggle('active');
    accBtn.innerText = getAccordionText(accBtn.innerText);
  });
} else {
  accBtn.style.display = 'none';
}



function setRating(index) {
const radioButtons = document.querySelectorAll('.form-group .rating-label');
  radioButtons.forEach((button, i) => {
    button.innerText =  i > index ? '☆' : '★';
  })
}
function getAccordionText(text) {
  return text === 'SHOW MAP' ? 'HIDE MAP' : 'SHOW MAP';
}
