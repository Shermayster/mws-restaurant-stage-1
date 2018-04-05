'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} /* eslint-env browser*/
/* global  DBHelper, google*/

/**
                               * Add service worker to main page
                               */

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./sw.js').then(() => {
//     console.log('service worker registered!');
//   }).catch(err => {
//     console.log(err);
//   });
// }

var map = void 0;var

Main = function () {
  function Main() {_classCallCheck(this, Main);
    this.restaurants = null;
    this.neighborhoods = null;
    this.cuisines = null;
    this.markers = [];
  }

  /**
       * Set cuisines HTML.
     */_createClass(Main, [{ key: 'fillCuisinesHTML', value: function fillCuisinesHTML()
    {
      var select = document.getElementById('cuisines-select');
      this.cuisines.forEach(function (cuisine) {
        var option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
      });
    }

    /**
         * Fetch all cuisines and set their HTML.
       */ }, { key: 'fetchCuisines', value: function fetchCuisines()
    {var _this = this;
      DBHelper.fetchCuisines().then(function (cuisines) {
        _this.cuisines = cuisines;
        _this.fillCuisinesHTML();
      });
    }

    /**
         * Set neighborhoods HTML.
         */ }, { key: 'fillNeighborhoodsHTML', value: function fillNeighborhoodsHTML()
    {
      var select = document.getElementById('neighborhoods-select');
      this.neighborhoods.forEach(function (neighborhood) {
        var option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
      });
    } }, { key: 'appendRestaurantImage', value: function appendRestaurantImage(

    restaurant, li) {
      var image = document.createElement('img');
      image.className = 'restaurant-img';
      image.src = DBHelper.imageUrlForRestaurant(restaurant);
      image.alt = 'Restaurant: ' + restaurant.name;
      li.append(image);
    } }, { key: 'appendRestaurantTitle', value: function appendRestaurantTitle(

    restaurant, li) {
      var name = document.createElement('h3');
      name.innerHTML = restaurant.name;
      li.append(name);
    } }, { key: 'appendRestaurantNeighborhood', value: function appendRestaurantNeighborhood(

    restaurant, li) {
      var neighborhood = document.createElement('p');
      neighborhood.innerHTML = restaurant.neighborhood;
      li.append(neighborhood);
    } }, { key: 'appendRestaurantAddress', value: function appendRestaurantAddress(

    restaurant, li) {
      var address = document.createElement('p');
      address.innerHTML = restaurant.address;
      li.append(address);
    } }, { key: 'appendRestaurantDetails', value: function appendRestaurantDetails(

    restaurant, li) {
      var more = document.createElement('a');
      more.innerHTML = 'View Details';
      more.href = DBHelper.urlForRestaurant(restaurant);
      li.append(more);
    }

    /**
         * Add markers for current restaurants to the map.
         */ }, { key: 'addMarkersToMap', value: function addMarkersToMap()
    {var _this2 = this;
      this.restaurants.forEach(function (restaurant) {
        // Add marker to the map
        var marker = DBHelper.mapMarkerForRestaurant(restaurant, map);
        google.maps.event.addListener(marker, 'click', function () {
          window.location.href = marker.url;
        });
        _this2.markers.push(marker);
      });
    } }, { key: 'appendRestaurantItems', value: function appendRestaurantItems(

    restaurant, li) {
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
         */ }, { key: 'createRestaurantHTML', value: function createRestaurantHTML(
    restaurant) {
      var li = document.createElement('li');
      this.appendRestaurantItems(restaurant, li);
      return li;
    }

    /**
         * Create all restaurants HTML and add them to the webpage.
         */ }, { key: 'fillRestaurantsHTML', value: function fillRestaurantsHTML()
    {var _this3 = this;
      var ul = document.getElementById('restaurants-list');
      this.restaurants.forEach(function (restaurant) {
        ul.append(_this3.createRestaurantHTML(restaurant));
      });
      this.addMarkersToMap();
    }
    /**
         * Fetch all neighborhoods and set their HTML.
         */ }, { key: 'fetchNeighborhoods', value: function fetchNeighborhoods()
    {var _this4 = this;
      DBHelper.fetchNeighborhoods().then(function (neighborhoodsList) {
        _this4.neighborhoods = neighborhoodsList;
        _this4.fillNeighborhoodsHTML();
      });
    }

    /**
         * @desc Clear current restaurants, their HTML and remove their map markers.
         * @param {*} restaurantsList todo: add list description
         */ }, { key: 'resetRestaurants', value: function resetRestaurants(
    restaurantsList) {
      // Remove all restaurants
      this.restaurants = [];
      var ul = document.getElementById('restaurants-list');
      ul.innerHTML = '';

      // Remove all map markers
      this.markers.forEach(function (m) {return m.setMap(null);});
      this.markers = [];
      this.restaurants = restaurantsList;
    }

    /**
         * Update page and map for current restaurants.
         */ }, { key: 'updateRestaurants', value: function updateRestaurants()
    {var _this5 = this;
      var cSelect = document.getElementById('cuisines-select');
      var nSelect = document.getElementById('neighborhoods-select');

      var cIndex = cSelect.selectedIndex;
      var nIndex = nSelect.selectedIndex;

      var cuisine = cSelect[cIndex].value;
      var neighborhood = nSelect[nIndex].value;

      DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood).
      then(function (restaurantsList) {
        _this5.resetRestaurants(restaurantsList);
        _this5.fillRestaurantsHTML();
      });
    } }]);return Main;}();


var main = new Main();

/**
                        * Fetch neighborhoods and cuisines as soon as the page is loaded.
                        */
document.addEventListener('DOMContentLoaded', function () {
  main.fetchNeighborhoods();
  main.fetchCuisines();
});

/**
     * Initialize Google map, called from HTML.
     */
window.initMap = function () {
  var loc = {
    lat: 40.722216,
    lng: -73.987501 };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false });

  var loadedMap = map;
  // disable keyboard navigation for google maps
  google.maps.event.addListener(loadedMap, 'tilesloaded', function () {
    document.querySelectorAll('#map a').forEach(function (item) {
      item.setAttribute('tabindex', '-1');
    });
    document.querySelectorAll('#map area').forEach(function (item) {
      item.setAttribute('tabindex', '-1');
    });
  });
  main.updateRestaurants();
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsibWFwIiwiTWFpbiIsInJlc3RhdXJhbnRzIiwibmVpZ2hib3Job29kcyIsImN1aXNpbmVzIiwibWFya2VycyIsInNlbGVjdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJmb3JFYWNoIiwib3B0aW9uIiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsImN1aXNpbmUiLCJ2YWx1ZSIsImFwcGVuZCIsIkRCSGVscGVyIiwiZmV0Y2hDdWlzaW5lcyIsInRoZW4iLCJmaWxsQ3Vpc2luZXNIVE1MIiwibmVpZ2hib3Job29kIiwicmVzdGF1cmFudCIsImxpIiwiaW1hZ2UiLCJjbGFzc05hbWUiLCJzcmMiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJhbHQiLCJuYW1lIiwiYWRkcmVzcyIsIm1vcmUiLCJocmVmIiwidXJsRm9yUmVzdGF1cmFudCIsIm1hcmtlciIsIm1hcE1hcmtlckZvclJlc3RhdXJhbnQiLCJnb29nbGUiLCJtYXBzIiwiZXZlbnQiLCJhZGRMaXN0ZW5lciIsIndpbmRvdyIsImxvY2F0aW9uIiwidXJsIiwicHVzaCIsImFwcGVuZFJlc3RhdXJhbnRJbWFnZSIsImFwcGVuZFJlc3RhdXJhbnRUaXRsZSIsImFwcGVuZFJlc3RhdXJhbnROZWlnaGJvcmhvb2QiLCJhcHBlbmRSZXN0YXVyYW50QWRkcmVzcyIsImFwcGVuZFJlc3RhdXJhbnREZXRhaWxzIiwiYXBwZW5kUmVzdGF1cmFudEl0ZW1zIiwidWwiLCJjcmVhdGVSZXN0YXVyYW50SFRNTCIsImFkZE1hcmtlcnNUb01hcCIsImZldGNoTmVpZ2hib3Job29kcyIsIm5laWdoYm9yaG9vZHNMaXN0IiwiZmlsbE5laWdoYm9yaG9vZHNIVE1MIiwicmVzdGF1cmFudHNMaXN0IiwibSIsInNldE1hcCIsImNTZWxlY3QiLCJuU2VsZWN0IiwiY0luZGV4Iiwic2VsZWN0ZWRJbmRleCIsIm5JbmRleCIsImZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZCIsInJlc2V0UmVzdGF1cmFudHMiLCJmaWxsUmVzdGF1cmFudHNIVE1MIiwibWFpbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0TWFwIiwibG9jIiwibGF0IiwibG5nIiwiTWFwIiwiem9vbSIsImNlbnRlciIsInNjcm9sbHdoZWVsIiwibG9hZGVkTWFwIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJzZXRBdHRyaWJ1dGUiLCJ1cGRhdGVSZXN0YXVyYW50cyJdLCJtYXBwaW5ncyI6IndzQkFBQTtBQUNBOztBQUVBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSUEsWUFBSixDOztBQUVNQyxJO0FBQ0osa0JBQWM7QUFDWixTQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNEOztBQUVEOzs7QUFHbUI7QUFDakIsVUFBTUMsU0FBU0MsU0FBU0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBZjtBQUNBLFdBQUtKLFFBQUwsQ0FBY0ssT0FBZCxDQUFzQixtQkFBVztBQUMvQixZQUFNQyxTQUFTSCxTQUFTSSxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQUQsZUFBT0UsU0FBUCxHQUFtQkMsT0FBbkI7QUFDQUgsZUFBT0ksS0FBUCxHQUFlRCxPQUFmO0FBQ0FQLGVBQU9TLE1BQVAsQ0FBY0wsTUFBZDtBQUNELE9BTEQ7QUFNRDs7QUFFRDs7O0FBR2dCO0FBQ2RNLGVBQVNDLGFBQVQsR0FBeUJDLElBQXpCLENBQThCLG9CQUFZO0FBQ3hDLGNBQUtkLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsY0FBS2UsZ0JBQUw7QUFDRCxPQUhEO0FBSUQ7O0FBRUQ7OztBQUd3QjtBQUN0QixVQUFNYixTQUFTQyxTQUFTQyxjQUFULENBQXdCLHNCQUF4QixDQUFmO0FBQ0EsV0FBS0wsYUFBTCxDQUFtQk0sT0FBbkIsQ0FBMkIsd0JB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LEs7OztBQUdILElBQU1DLE9BQU8sSUFBSWpFLElBQUosRUFBYjs7QUFFQTs7O0FBR0FNLFNBQVM0RCxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNsREQsT0FBS2Qsa0JBQUw7QUFDQWMsT0FBS2pELGFBQUw7QUFDRCxDQUhEOztBQUtBOzs7QUFHQXNCLE9BQU82QixPQUFQLEdBQWlCLFlBQU07QUFDckIsTUFBSUMsTUFBTTtBQUNSQyxTQUFLLFNBREc7QUFFUkMsU0FBSyxDQUFDLFNBRkUsRUFBVjs7QUFJQXZFLFFBQU0sSUFBSW1DLE9BQU9DLElBQVAsQ0FBWW9DLEdBQWhCLENBQW9CakUsU0FBU0MsY0FBVCxDQUF3QixLQUF4QixDQUFwQixFQUFvRDtBQUN4RGlFLFVBQU0sRUFEa0Q7QUFFeERDLFlBQVFMLEdBRmdEO0FBR3hETSxpQkFBYSxLQUgyQyxFQUFwRCxDQUFOOztBQUtBLE1BQU1DLFlBQVk1RSxHQUFsQjtBQUNBO0FBQ0FtQyxTQUFPQyxJQUFQLENBQVlDLEtBQVosQ0FBa0JDLFdBQWxCLENBQThCc0MsU0FBOUIsRUFBeUMsYUFBekMsRUFBd0QsWUFBTTtBQUM1RHJFLGFBQVNzRSxnQkFBVCxDQUEwQixRQUExQixFQUFvQ3BFLE9BQXBDLENBQTRDLGdCQUFRO0FBQ2xEcUUsV0FBS0MsWUFBTCxDQUFrQixVQUFsQixFQUE4QixJQUE5QjtBQUNELEtBRkQ7QUFHQXhFLGFBQVNzRSxnQkFBVCxDQUEwQixXQUExQixFQUF1Q3BFLE9BQXZDLENBQStDLGdCQUFRO0FBQ3JEcUUsV0FBS0MsWUFBTCxDQUFrQixVQUFsQixFQUE4QixJQUE5QjtBQUNELEtBRkQ7QUFHRCxHQVBEO0FBUUFiLE9BQUtjLGlCQUFMO0FBQ0QsQ0FyQkQiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciovXG4vKiBnbG9iYWwgIERCSGVscGVyLCBnb29nbGUqL1xuXG4vKipcbiAqIEFkZCBzZXJ2aWNlIHdvcmtlciB0byBtYWluIHBhZ2VcbiAqL1xuXG4vLyBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuLy8gICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignLi9zdy5qcycpLnRoZW4oKCkgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKCdzZXJ2aWNlIHdvcmtlciByZWdpc3RlcmVkIScpO1xuLy8gICB9KS5jYXRjaChlcnIgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKGVycik7XG4vLyAgIH0pO1xuLy8gfVxuXG5sZXQgbWFwO1xuXG5jbGFzcyBNYWluIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXN0YXVyYW50cyA9IG51bGw7XG4gICAgdGhpcy5uZWlnaGJvcmhvb2RzID0gbnVsbDtcbiAgICB0aGlzLmN1aXNpbmVzID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgICAqIFNldCBjdWlzaW5lcyBIVE1MLlxuICAgKi9cbiAgZmlsbEN1aXNpbmVzSFRNTCgpIHtcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XG4gICAgdGhpcy5jdWlzaW5lcy5mb3JFYWNoKGN1aXNpbmUgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHRpb24uaW5uZXJIVE1MID0gY3Vpc2luZTtcbiAgICAgIG9wdGlvbi52YWx1ZSA9IGN1aXNpbmU7XG4gICAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgYW5kIHNldCB0aGVpciBIVE1MLlxuICAgKi9cbiAgZmV0Y2hDdWlzaW5lcygpIHtcbiAgICBEQkhlbHBlci5mZXRjaEN1aXNpbmVzKCkudGhlbihjdWlzaW5lcyA9PiB7XG4gICAgICB0aGlzLmN1aXNpbmVzID0gY3Vpc2luZXM7XG4gICAgICB0aGlzLmZpbGxDdWlzaW5lc0hUTUwoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgICAqIFNldCBuZWlnaGJvcmhvb2RzIEhUTUwuXG4gICAgICovXG4gIGZpbGxOZWlnaGJvcmhvb2RzSFRNTCgpIHtcbiAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmVpZ2hib3Job29kcy1zZWxlY3QnKTtcbiAgICB0aGlzLm5laWdoYm9yaG9vZHMuZm9yRWFjaChuZWlnaGJvcmhvb2QgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHRpb24uaW5uZXJIVE1MID0gbmVpZ2hib3Job29kO1xuICAgICAgb3B0aW9uLnZhbHVlID0gbmVpZ2hib3Job29kO1xuICAgICAgc2VsZWN0LmFwcGVuZChvcHRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXBwZW5kUmVzdGF1cmFudEltYWdlKHJlc3RhdXJhbnQsIGxpKSB7XG4gICAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xuICAgIGltYWdlLnNyYyA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcbiAgICBpbWFnZS5hbHQgPSBgUmVzdGF1cmFudDogJHtyZXN0YXVyYW50Lm5hbWV9YDtcbiAgICBsaS5hcHBlbmQoaW1hZ2UpO1xuICB9XG5cbiAgYXBwZW5kUmVzdGF1cmFudFRpdGxlKHJlc3RhdXJhbnQsIGxpKSB7XG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gICAgbmFtZS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XG4gICAgbGkuYXBwZW5kKG5hbWUpO1xuICB9XG5cbiAgYXBwZW5kUmVzdGF1cmFudE5laWdoYm9yaG9vZChyZXN0YXVyYW50LCBsaSkge1xuICAgIGNvbnN0IG5laWdoYm9yaG9vZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBuZWlnaGJvcmhvb2QuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uZWlnaGJvcmhvb2Q7XG4gICAgbGkuYXBwZW5kKG5laWdoYm9yaG9vZCk7XG4gIH1cblxuICBhcHBlbmRSZXN0YXVyYW50QWRkcmVzcyhyZXN0YXVyYW50LCBsaSkge1xuICAgIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgYWRkcmVzcy5pbm5lckhUTUwgPSByZXN0YXVyYW50LmFkZHJlc3M7XG4gICAgbGkuYXBwZW5kKGFkZHJlc3MpO1xuICB9XG5cbiAgYXBwZW5kUmVzdGF1cmFudERldGFpbHMocmVzdGF1cmFudCwgbGkpIHtcbiAgICBjb25zdCBtb3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIG1vcmUuaW5uZXJIVE1MID0gJ1ZpZXcgRGV0YWlscyc7XG4gICAgbW9yZS5ocmVmID0gREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcbiAgICBsaS5hcHBlbmQobW9yZSk7XG4gIH1cblxuICAvKipcbiAgICAgKiBBZGQgbWFya2VycyBmb3IgY3VycmVudCByZXN0YXVyYW50cyB0byB0aGUgbWFwLlxuICAgICAqL1xuICBhZGRNYXJrZXJzVG9NYXAoKSB7XG4gICAgdGhpcy5yZXN0YXVyYW50cy5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xuICAgICAgLy8gQWRkIG1hcmtlciB0byB0aGUgbWFwXG4gICAgICBjb25zdCBtYXJrZXIgPSBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCk7XG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsICgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtYXJrZXIudXJsO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgYXBwZW5kUmVzdGF1cmFudEl0ZW1zKHJlc3RhdXJhbnQsIGxpKSB7XG4gICAgdGhpcy5hcHBlbmRSZXN0YXVyYW50SW1hZ2UocmVzdGF1cmFudCwgbGkpO1xuICAgIHRoaXMuYXBwZW5kUmVzdGF1cmFudFRpdGxlKHJlc3RhdXJhbnQsIGxpKTtcbiAgICB0aGlzLmFwcGVuZFJlc3RhdXJhbnROZWlnaGJvcmhvb2QocmVzdGF1cmFudCwgbGkpO1xuICAgIHRoaXMuYXBwZW5kUmVzdGF1cmFudEFkZHJlc3MocmVzdGF1cmFudCwgbGkpO1xuICAgIHRoaXMuYXBwZW5kUmVzdGF1cmFudERldGFpbHMocmVzdGF1cmFudCwgbGkpO1xuICB9XG5cbiAgLyoqXG4gICAgICogQ3JlYXRlIHJlc3RhdXJhbnQgSFRNTC5cbiAgICAgKiBAcGFyYW0geyp9IHJlc3RhdXJhbnQgb2JqZWN0XG4gICAgICogQHJldHVybiB7Kn0gSFRNTCBFbGVtZW50XG4gICAgICovXG4gIGNyZWF0ZVJlc3RhdXJhbnRIVE1MKHJlc3RhdXJhbnQpIHtcbiAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgdGhpcy5hcHBlbmRSZXN0YXVyYW50SXRlbXMocmVzdGF1cmFudCwgbGkpO1xuICAgIHJldHVybiBsaTtcbiAgfVxuXG4gIC8qKlxuICAgICAqIENyZWF0ZSBhbGwgcmVzdGF1cmFudHMgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gICAgICovXG4gIGZpbGxSZXN0YXVyYW50c0hUTUwoKSB7XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudHMtbGlzdCcpO1xuICAgIHRoaXMucmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcbiAgICAgIHVsLmFwcGVuZCh0aGlzLmNyZWF0ZVJlc3RhdXJhbnRIVE1MKHJlc3RhdXJhbnQpKTtcbiAgICB9KTtcbiAgICB0aGlzLmFkZE1hcmtlcnNUb01hcCgpO1xuICB9XG4gIC8qKlxuICAgICAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIGFuZCBzZXQgdGhlaXIgSFRNTC5cbiAgICAgKi9cbiAgZmV0Y2hOZWlnaGJvcmhvb2RzKCkge1xuICAgIERCSGVscGVyLmZldGNoTmVpZ2hib3Job29kcygpLnRoZW4obmVpZ2hib3Job29kc0xpc3QgPT4ge1xuICAgICAgdGhpcy5uZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kc0xpc3Q7XG4gICAgICB0aGlzLmZpbGxOZWlnaGJvcmhvb2RzSFRNTCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAgICogQGRlc2MgQ2xlYXIgY3VycmVudCByZXN0YXVyYW50cywgdGhlaXIgSFRNTCBhbmQgcmVtb3ZlIHRoZWlyIG1hcCBtYXJrZXJzLlxuICAgICAqIEBwYXJhbSB7Kn0gcmVzdGF1cmFudHNMaXN0IHRvZG86IGFkZCBsaXN0IGRlc2NyaXB0aW9uXG4gICAgICovXG4gIHJlc2V0UmVzdGF1cmFudHMocmVzdGF1cmFudHNMaXN0KSB7XG4gICAgLy8gUmVtb3ZlIGFsbCByZXN0YXVyYW50c1xuICAgIHRoaXMucmVzdGF1cmFudHMgPSBbXTtcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XG4gICAgdWwuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAvLyBSZW1vdmUgYWxsIG1hcCBtYXJrZXJzXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2gobSA9PiBtLnNldE1hcChudWxsKSk7XG4gICAgdGhpcy5tYXJrZXJzID0gW107XG4gICAgdGhpcy5yZXN0YXVyYW50cyA9IHJlc3RhdXJhbnRzTGlzdDtcbiAgfVxuXG4gIC8qKlxuICAgICAqIFVwZGF0ZSBwYWdlIGFuZCBtYXAgZm9yIGN1cnJlbnQgcmVzdGF1cmFudHMuXG4gICAgICovXG4gIHVwZGF0ZVJlc3RhdXJhbnRzKCkge1xuICAgIGNvbnN0IGNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XG4gICAgY29uc3QgblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xuXG4gICAgY29uc3QgY0luZGV4ID0gY1NlbGVjdC5zZWxlY3RlZEluZGV4O1xuICAgIGNvbnN0IG5JbmRleCA9IG5TZWxlY3Quc2VsZWN0ZWRJbmRleDtcblxuICAgIGNvbnN0IGN1aXNpbmUgPSBjU2VsZWN0W2NJbmRleF0udmFsdWU7XG4gICAgY29uc3QgbmVpZ2hib3Job29kID0gblNlbGVjdFtuSW5kZXhdLnZhbHVlO1xuXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZClcbiAgICAgIC50aGVuKHJlc3RhdXJhbnRzTGlzdCA9PiB7XG4gICAgICAgIHRoaXMucmVzZXRSZXN0YXVyYW50cyhyZXN0YXVyYW50c0xpc3QpO1xuICAgICAgICB0aGlzLmZpbGxSZXN0YXVyYW50c0hUTUwoKTtcbiAgICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IG1haW4gPSBuZXcgTWFpbigpO1xuXG4vKipcbiAqIEZldGNoIG5laWdoYm9yaG9vZHMgYW5kIGN1aXNpbmVzIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBtYWluLmZldGNoTmVpZ2hib3Job29kcygpO1xuICBtYWluLmZldGNoQ3Vpc2luZXMoKTtcbn0pO1xuXG4vKipcbiAqIEluaXRpYWxpemUgR29vZ2xlIG1hcCwgY2FsbGVkIGZyb20gSFRNTC5cbiAqL1xud2luZG93LmluaXRNYXAgPSAoKSA9PiB7XG4gIGxldCBsb2MgPSB7XG4gICAgbGF0OiA0MC43MjIyMTYsXG4gICAgbG5nOiAtNzMuOTg3NTAxXG4gIH07XG4gIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgem9vbTogMTIsXG4gICAgY2VudGVyOiBsb2MsXG4gICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gIH0pO1xuICBjb25zdCBsb2FkZWRNYXAgPSBtYXA7XG4gIC8vIGRpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvbiBmb3IgZ29vZ2xlIG1hcHNcbiAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobG9hZGVkTWFwLCAndGlsZXNsb2FkZWQnLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI21hcCBhJykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNtYXAgYXJlYScpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB9KTtcbiAgfSk7XG4gIG1haW4udXBkYXRlUmVzdGF1cmFudHMoKTtcbn07XG5cbiJdfQ==
