'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} /* eslint-env browser */

/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * Common database helper functions.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */var
DBHelper = function () {function DBHelper() {_classCallCheck(this, DBHelper);}_createClass(DBHelper, null, [{ key: 'fetchRestaurants',











    /**
                                                                                                                                        * Fetch all restaurants.
                                                                                                                                        */value: function fetchRestaurants(
    callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);
      xhr.onload = function () {
        if (xhr.status === 200) {
          // Got a success response from server!
          var json = JSON.parse(xhr.responseText);
          var restaurants = json.restaurants;
          callback(null, restaurants);
        } else {
          // Oops!. Got an error from server.
          var error = 'Request failed. Returned status of ' + xhr.status;
          callback(error, null);
        }
      };
      xhr.send();
    }

    /**
      *
      * Fetch a restaurant by its ID.
      * @param {number} id todo: add description
      * @param {any} callback todo: add description
      */ }, { key: 'fetchRestaurantById', value: function fetchRestaurantById(
    id, callback) {
      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var restaurant = restaurants.find(function (r) {return r.id === id;});
          if (restaurant) {
            // Got the restaurant
            callback(null, restaurant);
          } else {
            // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
          }
        }
      });
    }

    /**
       * Fetch restaurants by a cuisine type with proper error handling.
       */ }, { key: 'fetchRestaurantByCuisine', value: function fetchRestaurantByCuisine(
    cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          var results = restaurants.filter(function (r) {return r.cuisine_type === cuisine;});
          callback(null, results);
        }
      });
    }

    /**
       * Fetch restaurants by a neighborhood with proper error handling.
       */ }, { key: 'fetchRestaurantByNeighborhood', value: function fetchRestaurantByNeighborhood(
    neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          var results = restaurants.filter(function (r) {return r.neighborhood === neighborhood;});
          callback(null, results);
        }
      });
    }

    /**
       * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
       */ }, { key: 'fetchRestaurantByCuisineAndNeighborhood', value: function fetchRestaurantByCuisineAndNeighborhood(
    cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var results = restaurants;
          if (cuisine !== 'all') {// filter by cuisine
            results = results.filter(function (r) {return r.cuisine_type === cuisine;});
          }
          if (neighborhood !== 'all') {// filter by neighborhood
            results = results.filter(function (r) {return r.neighborhood === neighborhood;});
          }
          callback(null, results);
        }
      });
    }

    /**
       * Fetch all neighborhoods with proper error handling.
       */ }, { key: 'fetchNeighborhoods', value: function fetchNeighborhoods(
    callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          var neighborhoods = restaurants.map(function (v, i) {return restaurants[i].neighborhood;});
          // Remove duplicates from neighborhoods
          var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {return neighborhoods.indexOf(v) === i;});
          callback(null, uniqueNeighborhoods);
        }
      });
    }

    /**
       * Fetch all cuisines with proper error handling.
       */ }, { key: 'fetchCuisines', value: function fetchCuisines(
    callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          var cuisines = restaurants.map(function (v, i) {return restaurants[i].cuisine_type;});
          // Remove duplicates from cuisines
          var uniqueCuisines = cuisines.filter(function (v, i) {return cuisines.indexOf(v) === i;});
          callback(null, uniqueCuisines);
        }
      });
    }

    /**
       * Restaurant page URL.
       */ }, { key: 'urlForRestaurant', value: function urlForRestaurant(
    restaurant) {
      return './restaurant.html?id=' + restaurant.id;
    }

    /**
       * Restaurant image URL.
       */ }, { key: 'imageUrlForRestaurant', value: function imageUrlForRestaurant(
    restaurant) {
      return '/img/' + restaurant.photograph;
    }

    /**
       * Map marker for a restaurant.
       */ }, { key: 'mapMarkerForRestaurant', value: function mapMarkerForRestaurant(
    restaurant, map) {
      var marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP });

      return marker;
    } }, { key: 'DATABASE_URL', /**
                                 * Database URL.
                                 * Change this to restaurants.json file location on your server.
                                 */get: function get() {// Change this to your server port
      var port = 3000;return 'http://localhost:' + port + '/data/restaurants.json';} }]);return DBHelper;}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJEQVRBQkFTRV9VUkwiLCJvbmxvYWQiLCJzdGF0dXMiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0IiwicmVzdGF1cmFudHMiLCJlcnJvciIsInNlbmQiLCJpZCIsImZldGNoUmVzdGF1cmFudHMiLCJyZXN0YXVyYW50IiwiZmluZCIsInIiLCJjdWlzaW5lIiwicmVzdWx0cyIsImZpbHRlciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJ2IiwiaSIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsInBob3RvZ3JhcGgiLCJtYXJrZXIiLCJnb29nbGUiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJsYXRsbmciLCJ0aXRsZSIsIm5hbWUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsInBvcnQiXSwibWFwcGluZ3MiOiJ3c0JBQUE7O0FBRUE7OztBQUdNQSxROzs7Ozs7Ozs7Ozs7QUFZSjs7O0FBR3dCQyxZLEVBQVU7QUFDaEMsVUFBSUMsTUFBTSxJQUFJQyxjQUFKLEVBQVY7QUFDQUQsVUFBSUUsSUFBSixDQUFTLEtBQVQsRUFBZ0JKLFNBQVNLLFlBQXpCO0FBQ0FILFVBQUlJLE1BQUosR0FBYSxZQUFNO0FBQ2pCLFlBQUlKLElBQUlLLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUN0QjtBQUNBLGNBQU1DLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1IsSUFBSVMsWUFBZixDQUFiO0FBQ0EsY0FBTUMsY0FBY0osS0FBS0ksV0FBekI7QUFDQVgsbUJBQVMsSUFBVCxFQUFlVyxXQUFmO0FBQ0QsU0FMRCxNQUtPO0FBQ0w7QUFDQSxjQUFNQyxnREFBK0NYLElBQUlLLE1BQXpEO0FBQ0FOLG1CQUFTWSxLQUFULEVBQWdCLElBQWhCO0FBQ0Q7QUFDRixPQVhEO0FBWUFYLFVBQUlZLElBQUo7QUFDRDs7QUFFQTs7Ozs7O0FBTTBCQyxNLEVBQUlkLFEsRUFBVTtBQUN2QztBQUNBRCxlQUFTZ0IsZ0JBQVQsQ0FBMEIsVUFBQ0gsS0FBRCxFQUFRRCxXQUFSLEVBQXdCO0FBQ2hELFlBQUlDLEtBQUosRUFBVztBQUNUWixtQkFBU1ksS0FBVCxFQUFnQixJQUFoQjtBQUNELFNBRkQsTUFFTztBQUNMLGNBQU1JLGFBQWFMLFlBQVlNLElBQVosQ0FBaUIscUJBQUtDLEVBQUVKLEVBQUYsS0FBU0EsRUFBZCxFQUFqQixDQUFuQjtBQUNBLGNBQUlFLFVBQUosRUFBZ0I7QUFDZDtBQUNBaEIscUJBQVMsSUFBVCxFQUFlZ0IsVUFBZjtBQUNELFdBSEQsTUFHTztBQUNMO0FBQ0FoQixxQkFBUywyQkFBVCxFQUFzQyxJQUF0QztBQUNEO0FBQ0Y7QUFDRixPQWJEO0FBY0Q7O0FBRUQ7OztBQUdnQ21CLFcsRUFBU25CLFEsRUFBVTtBQUNqRDtBQUNBRCxlQUFTZ0IsZ0JBQVQsQ0FBMEIsVUFBQ0gsS0FBRCxFQUFRRCxXQUFSLEVBQXdCO0FBQ2hELFlBQUlDLEtBQUosRUFBVztBQUNUWixtQkFBU1ksS0FBVCxFQUFnQixJQUFoQjtBQUNELFNBRkQsTUFFTztBQUNMO0FBQ0EsY0FBTVEsVUFBVVQsWUFBWVUsTUFBWixDQUFtQixxQkFBS0gsRUFBRUksWUFBRixLQUFtQkgsT0FBeEIsRUFBbkIsQ0FBaEI7QUFDQW5CLG1CQUFTLElBQVQsRUFBZW9CLE9BQWY7QUFDRDtBQUNGLE9BUkQ7QUFTRDs7QUFFRDs7O0FBR3FDRyxnQixFQUFjdkIsUSxFQUFVO0FBQzNEO0FBQ0FELGVBQVNnQixnQkFBVCxDQUEwQixVQUFDSCxLQUFELEVBQVFELFdBQVIsRUFBd0I7QUFDaEQsWUFBSUMsS0FBSixFQUFXO0FBQ1RaLG1CQUFTWSxLQUFULEVBQWdCLElBQWhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0w7QUFDQSxjQUFNUSxVQUFVVCxZQUFZVSxNQUFaLENBQW1CLHFCQUFLSCxFQUFFSyxZQUFGLEtBQW1CQSxZQUF4QixFQUFuQixDQUFoQjtBQUNBdkIsbUJBQVMsSUFBVCxFQUFlb0IsT0FBZjtBQUNEO0FBQ0YsT0FSRDtBQVNEOztBQUVEOzs7QUFHK0NELFcsRUFBU0ksWSxFQUFjdkIsUSxFQUFVO0FBQzlFO0FBQ0FELGVBQVNnQixnQkFBVCxDQUEwQixVQUFDSCxLQUFELEVBQVFELFdBQVIsRUFBd0I7QUFDaEQsWUFBSUMsS0FBSixFQUFXO0FBQ1RaLG1CQUFTWSxLQUFULEVBQWdCLElBQWhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBSVEsVUFBVVQsV0FBZDtBQUNBLGNBQUlRLFlBQVksS0FBaEIsRUFBdUIsQ0FBRTtBQUN2QkMsc0JBQVVBLFFBQVFDLE1BQVIsQ0FBZSxxQkFBS0gsRUFBRUksWUFBRixLQUFtQkgsT0FBeEIsRUFBZixDQUFWO0FBQ0Q7QUFDRCxjQUFJSSxpQkFBaUIsS0FBckIsRUFBNEIsQ0FBRTtBQUM1Qkgsc0JBQVVBLFFBQVFDLE1BQVIsQ0FBZSxxQkFBS0gsRUFBRUssWUFBRixLQUFtQkEsWUFBeEIsRUFBZixDQUFWO0FBQ0Q7QUFDRHZCLG1CQUFTLElBQVQsRUFBZW9CLE9BQWY7QUFDRDtBQUNGLE9BYkQ7QUFjRDs7QUFFRDs7O0FBRzBCcEIsWSxFQUFVO0FBQ2xDO0FBQ0FELGVBQVNnQixnQkFBVCxDQUEwQixVQUFDSCxLQUFELEVBQVFELFdBQVIsRUFBd0I7QUFDaEQsWUFBSUMsS0FBSixFQUFXO0FBQ1RaLG1CQUFTWSxLQUFULEVBQWdCLElBQWhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0w7QUFDQSxjQUFNWSxnQkFBZ0JiLFlBQVljLEdBQVosQ0FBZ0IsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLFVBQVVoQixZQUFZZ0IsQ0FBWixFQUFlSixZQUF6QixFQUFoQixDQUF0QjtBQUNBO0FBQ0EsY0FBTUssc0JBQXNCSixjQUFjSCxNQUFkLENBQXFCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSixVQUFVSCxjQUFjSyxPQUFkLENBQXNCSCxDQUF0QixNQUE2QkMsQ0FBdkMsRUFBckIsQ0FBNUI7QUFDQTNCLG1CQUFTLElBQVQsRUFBZTRCLG1CQUFmO0FBQ0Q7QUFDRixPQVZEO0FBV0Q7O0FBRUQ7OztBQUdxQjVCLFksRUFBVTtBQUM3QjtBQUNBRCxlQUFTZ0IsZ0JBQVQsQ0FBMEIsVUFBQ0gsS0FBRCxFQUFRRCxXQUFSLEVBQXdCO0FBQ2hELFlBQUlDLEtBQUosRUFBVztBQUNUWixtQkFBU1ksS0FBVCxFQUFnQixJQUFoQjtBQUNELFNBRkQsTUFFTztBQUNMO0FBQ0EsY0FBTWtCLFdBQVduQixZQUFZYyxHQUFaLENBQWdCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixVQUFVaEIsWUFBWWdCLENBQVosRUFBZUwsWUFBekIsRUFBaEIsQ0FBakI7QUFDQTtBQUNBLGNBQU1TLGlCQUFpQkQsU0FBU1QsTUFBVCxDQUFnQixVQUFDSyxDQUFELEVBQUlDLENBQUosVUFBVUcsU0FBU0QsT0FBVCxDQUFpQkgsQ0FBakIsTUFBd0JDLENBQWxDLEVBQWhCLENBQXZCO0FBQ0EzQixtQkFBUyxJQUFULEVBQWUrQixjQUFmO0FBQ0Q7QUFDRixPQVZEO0FBV0Q7O0FBRUQ7OztBQUd3QmYsYyxFQUFZO0FBQ2xDLHVDQUFnQ0EsV0FBV0YsRUFBM0M7QUFDRDs7QUFFRDs7O0FBRzZCRSxjLEVBQVk7QUFDdkMsdUJBQWdCQSxXQUFXZ0IsVUFBM0I7QUFDRDs7QUFFRDs7O0FBRzhCaEIsYyxFQUFZUyxHLEVBQUs7QUFDN0MsVUFBTVEsU0FBUyxJQUFJQyxPQUFPQyxJQUFQLENBQVlDLE1BQWhCLENBQXVCO0FBQ3BDQyxrQkFBVXJCLFdBQVdzQixNQURlO0FBRXBDQyxlQUFPdkIsV0FBV3dCLElBRmtCO0FBR3BDQyxhQUFLMUMsU0FBUzJDLGdCQUFULENBQTBCMUIsVUFBMUIsQ0FIK0I7QUFJcENTLGFBQUtBLEdBSitCO0FBS3BDa0IsbUJBQVdULE9BQU9DLElBQVAsQ0FBWVMsU0FBWixDQUFzQkMsSUFMRyxFQUF2QixDQUFmOztBQU9BLGFBQU9aLE1BQVA7QUFDRCxLLDJCQTFLRDs7O3VEQUkwQixDQUN4QjtBQUNBLFVBQU1hLE9BQU8sSUFBYixDQUNBLDZCQUEyQkEsSUFBM0IsNEJBQ0QsQyIsImZpbGUiOiJkYmhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG4vKipcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBEQkhlbHBlciB7XG5cbiAgLyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlIHRoaXMgdG8gcmVzdGF1cmFudHMuanNvbiBmaWxlIGxvY2F0aW9uIG9uIHlvdXIgc2VydmVyLlxuICAgKi9cbiAgc3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XG4gICAgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuICAgIGNvbnN0IHBvcnQgPSAzMDAwO1xuICAgIHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L2RhdGEvcmVzdGF1cmFudHMuanNvbmA7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggYWxsIHJlc3RhdXJhbnRzLlxuICAgKi9cbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2spIHtcbiAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIERCSGVscGVyLkRBVEFCQVNFX1VSTCk7XG4gICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgLy8gR290IGEgc3VjY2VzcyByZXNwb25zZSBmcm9tIHNlcnZlciFcbiAgICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnN0IHJlc3RhdXJhbnRzID0ganNvbi5yZXN0YXVyYW50cztcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT29wcyEuIEdvdCBhbiBlcnJvciBmcm9tIHNlcnZlci5cbiAgICAgICAgY29uc3QgZXJyb3IgPSAoYFJlcXVlc3QgZmFpbGVkLiBSZXR1cm5lZCBzdGF0dXMgb2YgJHt4aHIuc3RhdHVzfWApO1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIuc2VuZCgpO1xuICB9XG5cbiAgIC8qKlxuICAgKlxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxuICAgKiBAcGFyYW0ge251bWJlcn0gaWQgdG9kbzogYWRkIGRlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSB7YW55fSBjYWxsYmFjayB0b2RvOiBhZGQgZGVzY3JpcHRpb25cbiAgICovXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuICAgIC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT09IGlkKTtcbiAgICAgICAgaWYgKHJlc3RhdXJhbnQpIHtcbiAgICAgICAgICAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxuICAgICAgICAgIGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09PSBjdWlzaW5lKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PT0gbmVpZ2hib3Job29kKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XG4gICAgICAgIGlmIChjdWlzaW5lICE9PSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxuICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09PSBjdWlzaW5lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmVpZ2hib3Job29kICE9PSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT09IG5laWdoYm9yaG9vZCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuICBzdGF0aWMgZmV0Y2hOZWlnaGJvcmhvb2RzKGNhbGxiYWNrKSB7XG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgIGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XG4gICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xuICAgICAgICBjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PT0gaSk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHVuaXF1ZU5laWdoYm9yaG9vZHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIGFsbCBjdWlzaW5lcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG4gIHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuICAgICAgICBjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKTtcbiAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xuICAgICAgICBjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PT0gaSk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHVuaXF1ZUN1aXNpbmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxuICAgKi9cbiAgc3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuICAgIHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXVyYW50IGltYWdlIFVSTC5cbiAgICovXG4gIHN0YXRpYyBpbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9YCk7XG4gIH1cblxuICAvKipcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxuICAgKi9cbiAgc3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XG4gICAgY29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXG4gICAgICB0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuICAgICAgdXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxuICAgICAgbWFwOiBtYXAsXG4gICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxuICAgICk7XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxuXG59XG4iXX0=
