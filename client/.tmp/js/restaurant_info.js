'use strict'; /* eslint-env browser */
var restaurant = void 0;
var map;

/**
          * Add service worker to restaraunt info page
          */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.
  register('./sw.js').
  then(function () {
    console.log('service worker registered!');
  }).
  catch(function (err) {
    console.log(err);
  });
}

/**
   * Initialize Google map, called from HTML.
   */
window.initMap = function () {
  fetchRestaurantFromURL(function (error, restaurant) {
    if (error) {// Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false });

      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
    * Get current restaurant from page URL.
    */
fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
  if (self.restaurant) {// restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  var id = getParameterByName('id');
  if (!id) {// no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, function (error, restaurant) {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
    * Create restaurant HTML and add it to the webpage
    */
fillRestaurantHTML = function fillRestaurantHTML() {var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;
  var name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  var address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  var image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = 'Restaurant: ' + restaurant.name;

  var cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
    * Create restaurant operating hours HTML table and add it to the webpage.
    */
fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;
  var hours = document.getElementById('restaurant-hours');
  for (var key in operatingHours) {
    var row = document.createElement('tr');

    var day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    var time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
    * Create all reviews HTML and add them to the webpage.
    */
fillReviewsHTML = function fillReviewsHTML() {var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;
  var container = document.getElementById('reviews-container');
  var title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    var noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  var ul = document.getElementById('reviews-list');
  reviews.forEach(function (review) {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
    * Create review HTML and add it to the webpage.
    */
createReviewHTML = function createReviewHTML(review) {
  var li = document.createElement('li');
  var reviewTitle = document.createElement('div');
  reviewTitle.className = 'review-title review-details';
  li.appendChild(reviewTitle);

  var name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'reviewer-name';
  reviewTitle.appendChild(name);

  var date = document.createElement('p');
  date.innerHTML = review.date;
  date.className = 'review-date';
  reviewTitle.appendChild(date);

  var reviewContent = document.createElement('div');
  reviewContent.className = 'review-content review-details';
  li.appendChild(reviewContent);

  var rating = document.createElement('p');
  rating.innerHTML = 'Rating: ' + review.rating;
  rating.className = 'review-raiting uppercase';
  reviewContent.appendChild(rating);

  var comments = document.createElement('p');
  comments.innerHTML = review.comments;
  reviewContent.appendChild(comments);

  return li;
};

/**
    * Add restaurant name to the breadcrumb navigation menu
    */
fillBreadcrumb = function fillBreadcrumb() {var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;
  var breadcrumb = document.getElementById('breadcrumb');
  var li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-current", "page");
  breadcrumb.appendChild(li);
};

/**
    * Get a parameter by name from page URL.
    */
getParameterByName = function getParameterByName(name, url) {
  if (!url)
  url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results)
  return null;
  if (!results[2])
  return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwibWFwIiwibmF2aWdhdG9yIiwic2VydmljZVdvcmtlciIsInJlZ2lzdGVyIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJjYXRjaCIsImVyciIsIndpbmRvdyIsImluaXRNYXAiLCJmZXRjaFJlc3RhdXJhbnRGcm9tVVJMIiwiZXJyb3IiLCJzZWxmIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ6b29tIiwiY2VudGVyIiwibGF0bG5nIiwic2Nyb2xsd2hlZWwiLCJmaWxsQnJlYWRjcnVtYiIsIkRCSGVscGVyIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsImNhbGxiYWNrIiwiaWQiLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiZmlsbFJlc3RhdXJhbnRIVE1MIiwibmFtZSIsImlubmVySFRNTCIsImFkZHJlc3MiLCJpbWFnZSIsImNsYXNzTmFtZSIsInNyYyIsImltYWdlVXJsRm9yUmVzdGF1cmFudCIsImFsdCIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsImZpbGxSZXZpZXdzSFRNTCIsIm9wZXJhdGluZ0hvdXJzIiwiaG91cnMiLCJrZXkiLCJyb3ciLCJjcmVhdGVFbGVtZW50IiwiZGF5IiwiYXBwZW5kQ2hpbGQiLCJ0aW1lIiwicmV2aWV3cyIsImNvbnRhaW5lciIsInRpdGxlIiwibm9SZXZpZXdzIiwidWwiLCJmb3JFYWNoIiwiY3JlYXRlUmV2aWV3SFRNTCIsInJldmlldyIsImxpIiwicmV2aWV3VGl0bGUiLCJkYXRlIiwicmV2aWV3Q29udGVudCIsInJhdGluZyIsImNvbW1lbnRzIiwiYnJlYWRjcnVtYiIsInNldEF0dHJpYnV0ZSIsInVybCIsImxvY2F0aW9uIiwiaHJlZiIsInJlcGxhY2UiLCJyZWdleCIs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QUFTakMsU0FBVCxHQUFxQjJCLE9BQU9NLFFBQTVCO0FBQ0FGLGdCQUFjYixXQUFkLENBQTBCZSxRQUExQjs7QUFFQSxTQUFPTCxFQUFQO0FBQ0QsQ0E5QkQ7O0FBZ0NBOzs7QUFHQXJDLGlCQUFpQiwwQkFBZ0MsS0FBL0J4QixVQUErQix1RUFBcEJjLEtBQUtkLFVBQWU7QUFDL0MsTUFBTW1FLGFBQWFqRCxTQUFTQyxjQUFULENBQXdCLFlBQXhCLENBQW5CO0FBQ0EsTUFBTTBDLEtBQUszQyxTQUFTK0IsYUFBVCxDQUF1QixJQUF2QixDQUFYO0FBQ0FZLEtBQUc1QixTQUFILEdBQWVqQyxXQUFXZ0MsSUFBMUI7QUFDQTZCLEtBQUdPLFlBQUgsQ0FBZ0IsY0FBaEIsRUFBZ0MsTUFBaEM7QUFDQUQsYUFBV2hCLFdBQVgsQ0FBdUJVLEVBQXZCO0FBQ0QsQ0FORDs7QUFRQTs7O0FBR0FoQyxxQkFBcUIsNEJBQUNHLElBQUQsRUFBT3FDLEdBQVAsRUFBZTtBQUNsQyxNQUFJLENBQUNBLEdBQUw7QUFDRUEsUUFBTTNELE9BQU80RCxRQUFQLENBQWdCQyxJQUF0QjtBQUNGdkMsU0FBT0EsS0FBS3dDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLE1BQXhCLENBQVA7QUFDQSxNQUFNQyxRQUFRLElBQUlDLE1BQUosVUFBa0IxQyxJQUFsQix1QkFBZDtBQUNFMkMsWUFBVUYsTUFBTUcsSUFBTixDQUFXUCxHQUFYLENBRFo7QUFFQSxNQUFJLENBQUNNLE9BQUw7QUFDRSxTQUFPLElBQVA7QUFDRixNQUFJLENBQUNBLFFBQVEsQ0FBUixDQUFMO0FBQ0UsU0FBTyxFQUFQO0FBQ0YsU0FBT0UsbUJBQW1CRixRQUFRLENBQVIsRUFBV0gsT0FBWCxDQUFtQixLQUFuQixFQUEwQixHQUExQixDQUFuQixDQUFQO0FBQ0QsQ0FYRCIsImZpbGUiOiJyZXN0YXVyYW50X2luZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmxldCByZXN0YXVyYW50O1xudmFyIG1hcDtcblxuLyoqXG4gKiBBZGQgc2VydmljZSB3b3JrZXIgdG8gcmVzdGFyYXVudCBpbmZvIHBhZ2VcbiAqL1xuaWYoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlclxuICAucmVnaXN0ZXIoJy4vc3cuanMnKVxuICAudGhlbigoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3NlcnZpY2Ugd29ya2VyIHJlZ2lzdGVyZWQhJyk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSlcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIEdvb2dsZSBtYXAsIGNhbGxlZCBmcm9tIEhUTUwuXG4gKi9cbndpbmRvdy5pbml0TWFwID0gKCkgPT4ge1xuICBmZXRjaFJlc3RhdXJhbnRGcm9tVVJMKChlcnJvciwgcmVzdGF1cmFudCkgPT4ge1xuICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxNixcbiAgICAgICAgY2VudGVyOiByZXN0YXVyYW50LmxhdGxuZyxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIGZpbGxCcmVhZGNydW1iKCk7XG4gICAgICBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHNlbGYucmVzdGF1cmFudCwgc2VsZi5tYXApO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogR2V0IGN1cnJlbnQgcmVzdGF1cmFudCBmcm9tIHBhZ2UgVVJMLlxuICovXG5mZXRjaFJlc3RhdXJhbnRGcm9tVVJMID0gKGNhbGxiYWNrKSA9PiB7XG4gIGlmIChzZWxmLnJlc3RhdXJhbnQpIHsgLy8gcmVzdGF1cmFudCBhbHJlYWR5IGZldGNoZWQhXG4gICAgY2FsbGJhY2sobnVsbCwgc2VsZi5yZXN0YXVyYW50KVxuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBpZCA9IGdldFBhcmFtZXRlckJ5TmFtZSgnaWQnKTtcbiAgaWYgKCFpZCkgeyAvLyBubyBpZCBmb3VuZCBpbiBVUkxcbiAgICBlcnJvciA9ICdObyByZXN0YXVyYW50IGlkIGluIFVSTCdcbiAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG4gICAgICBzZWxmLnJlc3RhdXJhbnQgPSByZXN0YXVyYW50O1xuICAgICAgaWYgKCFyZXN0YXVyYW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmaWxsUmVzdGF1cmFudEhUTUwoKTtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQgPSBzZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LW5hbWUnKTtcbiAgbmFtZS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XG5cbiAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWFkZHJlc3MnKTtcbiAgYWRkcmVzcy5pbm5lckhUTUwgPSByZXN0YXVyYW50LmFkZHJlc3M7XG5cbiAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1pbWcnKTtcbiAgaW1hZ2UuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnQtaW1nJ1xuICBpbWFnZS5zcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gIGltYWdlLmFsdCA9IGBSZXN0YXVyYW50OiAke3Jlc3RhdXJhbnQubmFtZX1gO1xuXG4gIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XG4gIGN1aXNpbmUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGU7XG5cbiAgLy8gZmlsbCBvcGVyYXRpbmcgaG91cnNcbiAgaWYgKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG4gICAgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwoKTtcbiAgfVxuICAvLyBmaWxsIHJldmlld3NcbiAgZmlsbFJldmlld3NIVE1MKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHJlc3RhdXJhbnQgb3BlcmF0aW5nIGhvdXJzIEhUTUwgdGFibGUgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwgPSAob3BlcmF0aW5nSG91cnMgPSBzZWxmLnJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSA9PiB7XG4gIGNvbnN0IGhvdXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaG91cnMnKTtcbiAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblxuICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgZGF5LmlubmVySFRNTCA9IGtleTtcbiAgICByb3cuYXBwZW5kQ2hpbGQoZGF5KTtcblxuICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIHRpbWUuaW5uZXJIVE1MID0gb3BlcmF0aW5nSG91cnNba2V5XTtcbiAgICByb3cuYXBwZW5kQ2hpbGQodGltZSk7XG5cbiAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGFsbCByZXZpZXdzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmV2aWV3c0hUTUwgPSAocmV2aWV3cyA9IHNlbGYucmVzdGF1cmFudC5yZXZpZXdzKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gIHRpdGxlLmlubmVySFRNTCA9ICdSZXZpZXdzJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICBpZiAoIXJldmlld3MpIHtcbiAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWxpc3QnKTtcbiAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmV2aWV3SFRNTChyZXZpZXcpKTtcbiAgfSk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh1bCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHJldmlldyBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmNyZWF0ZVJldmlld0hUTUwgPSAocmV2aWV3KSA9PiB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgY29uc3QgcmV2aWV3VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcmV2aWV3VGl0bGUuY2xhc3NOYW1lID0gJ3Jldmlldy10aXRsZSByZXZpZXctZGV0YWlscyc7XG4gIGxpLmFwcGVuZENoaWxkKHJldmlld1RpdGxlKTtcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lLmlubmVySFRNTCA9IHJldmlldy5uYW1lO1xuICBuYW1lLmNsYXNzTmFtZSA9ICdyZXZpZXdlci1uYW1lJztcbiAgcmV2aWV3VGl0bGUuYXBwZW5kQ2hpbGQobmFtZSk7XG5cbiAgY29uc3QgZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgZGF0ZS5pbm5lckhUTUwgPSByZXZpZXcuZGF0ZTtcbiAgZGF0ZS5jbGFzc05hbWUgPSAncmV2aWV3LWRhdGUnO1xuICByZXZpZXdUaXRsZS5hcHBlbmRDaGlsZChkYXRlKTtcblxuICBjb25zdCByZXZpZXdDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHJldmlld0NvbnRlbnQuY2xhc3NOYW1lID0gJ3Jldmlldy1jb250ZW50IHJldmlldy1kZXRhaWxzJztcbiAgbGkuYXBwZW5kQ2hpbGQocmV2aWV3Q29udGVudCk7XG5cbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICByYXRpbmcuaW5uZXJIVE1MID0gYFJhdGluZzogJHtyZXZpZXcucmF0aW5nfWA7XG4gIHJhdGluZy5jbGFzc05hbWUgPSAncmV2aWV3LXJhaXRpbmcgdXBwZXJjYXNlJztcbiAgcmV2aWV3Q29udGVudC5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIHJldmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQoY29tbWVudHMpO1xuXG4gIHJldHVybiBsaTtcbn1cblxuLyoqXG4gKiBBZGQgcmVzdGF1cmFudCBuYW1lIHRvIHRoZSBicmVhZGNydW1iIG5hdmlnYXRpb24gbWVudVxuICovXG5maWxsQnJlYWRjcnVtYiA9IChyZXN0YXVyYW50PXNlbGYucmVzdGF1cmFudCkgPT4ge1xuICBjb25zdCBicmVhZGNydW1iID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyZWFkY3J1bWInKTtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBsaS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XG4gIGxpLnNldEF0dHJpYnV0ZShcImFyaWEtY3VycmVudFwiLCBcInBhZ2VcIik7XG4gIGJyZWFkY3J1bWIuYXBwZW5kQ2hpbGQobGkpO1xufVxuXG4vKipcbiAqIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcbiAgaWYgKCF1cmwpXG4gICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgaWYgKCFyZXN1bHRzKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoIXJlc3VsdHNbMl0pXG4gICAgcmV0dXJuICcnO1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuIl19
