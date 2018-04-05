'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} /* eslint-env browser */
/* eslint no-unused-vars: "off"*/

/**
                                   * Common database helper functions.
                                   */var
DBHelper = function () {function DBHelper() {_classCallCheck(this, DBHelper);}_createClass(DBHelper, null, [{ key: 'fetchRestaurants',










    /**
                                                                                                                                        * Fetch all restaurants.
                                                                                                                                        */value: function fetchRestaurants(
    callback) {
      // let xhr = new XMLHttpRequest();
      // xhr.open('GET', DBHelper.DATABASE_URL);
      // xhr.onload = () => {
      //   if (xhr.status === 200) {
      //     // Got a success response from server!
      //     const json = JSON.parse(xhr.responseText);
      //     const restaurants = json.restaurants;
      //     callback(null, restaurants);
      //   } else {
      //     // Oops!. Got an error from server.
      //     const error = (`Request failed. Returned status of ${xhr.status}`);
      //     callback(error, null);
      //   }
      // };
      // xhr.send();

      return fetch(DBHelper.DATABASE_URL).
      then(function (res) {return res.json();}).
      catch(function (error) {return console.log(error);});
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
      return DBHelper.fetchRestaurants().then(function (restaurants) {
        var results = restaurants;
        if (cuisine !== 'all') {// filter by cuisine
          results = results.filter(function (r) {return r.cuisine_type === cuisine;});
        }
        if (neighborhood !== 'all') {// filter by neighborhood
          results = results.filter(function (r) {return r.neighborhood === neighborhood;});
        }
        return results;
      });
    }

    /**
       * Fetch all neighborhoods with proper error handling.
       */ }, { key: 'fetchNeighborhoods', value: function fetchNeighborhoods(
    callback) {
      // Fetch all restaurants
      return DBHelper.fetchRestaurants().then(function (restaurants) {
        // Get all neighborhoods from all restaurants
        var neighborhoods = restaurants.map(function (v, i) {return restaurants[i].neighborhood;});
        // Remove duplicates from neighborhoods
        var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {return neighborhoods.indexOf(v) === i;});
        return uniqueNeighborhoods;
      });
    }

    /**
       * Fetch all cuisines with proper error handling.
       */ }, { key: 'fetchCuisines', value: function fetchCuisines(
    callback) {
      // Fetch all restaurants
      return DBHelper.fetchRestaurants().then(function (restaurants) {
        // Get all cuisines from all restaurants
        var cuisines = restaurants.map(function (v, i) {return restaurants[i].cuisine_type;});
        // Remove duplicates from cuisines
        var uniqueCuisines = cuisines.filter(function (v, i) {return cuisines.indexOf(v) === i;});
        return uniqueCuisines;
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
      var port = 1337;return 'http://localhost:' + port + '/restaurants';} }]);return DBHelper;}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiY2FsbGJhY2siLCJmZXRjaCIsIkRBVEFCQVNFX1VSTCIsInRoZW4iLCJyZXMiLCJqc29uIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiLCJpZCIsImZldGNoUmVzdGF1cmFudHMiLCJyZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsImN1aXNpbmUiLCJyZXN1bHRzIiwiZmlsdGVyIiwiY3Vpc2luZV90eXBlIiwibmVpZ2hib3Job29kIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImluZGV4T2YiLCJjdWlzaW5lcyIsInVuaXF1ZUN1aXNpbmVzIiwicGhvdG9ncmFwaCIsIm1hcmtlciIsImdvb2dsZSIsIm1hcHMiLCJNYXJrZXIiLCJwb3NpdGlvbiIsImxhdGxuZyIsInRpdGxlIiwibmFtZSIsInVybCIsInVybEZvclJlc3RhdXJhbnQiLCJhbmltYXRpb24iLCJBbmltYXRpb24iLCJEUk9QIiwicG9ydCJdLCJtYXBwaW5ncyI6IndzQkFBQTtBQUNBOztBQUVBOzs7QUFHTUEsUTs7Ozs7Ozs7Ozs7QUFXSjs7O0FBR3dCQyxZLEVBQVU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQU9DLE1BQU1GLFNBQVNHLFlBQWY7QUFDSkMsVUFESSxDQUNDLHVCQUFPQyxJQUFJQyxJQUFKLEVBQVAsRUFERDtBQUVKQyxXQUZJLENBRUUseUJBQVNDLFFBQVFDLEdBQVIsQ0FBWUMsS0FBWixDQUFULEVBRkYsQ0FBUDtBQUdEOztBQUVEOzs7Ozs7QUFNMkJDLE0sRUFBSVYsUSxFQUFVO0FBQ3ZDO0FBQ0FELGVBQVNZLGdCQUFULENBQTBCLFVBQUNGLEtBQUQsRUFBUUcsV0FBUixFQUF3QjtBQUNoRCxZQUFJSCxLQUFKLEVBQVc7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QUFpQkgsQ0FBakIsTUFBd0JDLENBQWxDLEVBQWhCLENBQXZCO0FBQ0EsZUFBT0ksY0FBUDtBQUNELE9BTk0sQ0FBUDtBQU9EOztBQUVEOzs7QUFHd0JmLGMsRUFBWTtBQUNsQyx1Q0FBZ0NBLFdBQVdILEVBQTNDO0FBQ0Q7O0FBRUQ7OztBQUc2QkcsYyxFQUFZO0FBQ3ZDLHVCQUFnQkEsV0FBV2dCLFVBQTNCO0FBQ0Q7O0FBRUQ7OztBQUc4QmhCLGMsRUFBWVMsRyxFQUFLO0FBQzdDLFVBQU1RLFNBQVMsSUFBSUMsT0FBT0MsSUFBUCxDQUFZQyxNQUFoQixDQUF1QjtBQUNwQ0Msa0JBQVVyQixXQUFXc0IsTUFEZTtBQUVwQ0MsZUFBT3ZCLFdBQVd3QixJQUZrQjtBQUdwQ0MsYUFBS3ZDLFNBQVN3QyxnQkFBVCxDQUEwQjFCLFVBQTFCLENBSCtCO0FBSXBDUyxhQUFLQSxHQUorQjtBQUtwQ2tCLG1CQUFXVCxPQUFPQyxJQUFQLENBQVlTLFNBQVosQ0FBc0JDLElBTEcsRUFBdkIsQ0FBZjs7QUFPQSxhQUFPWixNQUFQO0FBQ0QsSywyQkFsS0Q7Ozt1REFJMEIsQ0FDeEI7QUFDQSxVQUFNYSxPQUFPLElBQWIsQ0FDQSw2QkFBMkJBLElBQTNCLGtCQUNELEMiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogXCJvZmZcIiovXG5cbi8qKlxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXG4gKi9cbmNsYXNzIERCSGVscGVyIHtcbiAgLyoqXG4gICAqIERhdGFiYXNlIFVSTC5cbiAgICogQ2hhbmdlIHRoaXMgdG8gcmVzdGF1cmFudHMuanNvbiBmaWxlIGxvY2F0aW9uIG9uIHlvdXIgc2VydmVyLlxuICAgKi9cbiAgc3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XG4gICAgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxuICAgIGNvbnN0IHBvcnQgPSAxMzM3O1xuICAgIHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoke3BvcnR9L3Jlc3RhdXJhbnRzYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXG4gICAqL1xuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaykge1xuICAgIC8vIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAvLyB4aHIub3BlbignR0VUJywgREJIZWxwZXIuREFUQUJBU0VfVVJMKTtcbiAgICAvLyB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgIC8vICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgIC8vICAgICAvLyBHb3QgYSBzdWNjZXNzIHJlc3BvbnNlIGZyb20gc2VydmVyIVxuICAgIC8vICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAvLyAgICAgY29uc3QgcmVzdGF1cmFudHMgPSBqc29uLnJlc3RhdXJhbnRzO1xuICAgIC8vICAgICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50cyk7XG4gICAgLy8gICB9IGVsc2Uge1xuICAgIC8vICAgICAvLyBPb3BzIS4gR290IGFuIGVycm9yIGZyb20gc2VydmVyLlxuICAgIC8vICAgICBjb25zdCBlcnJvciA9IChgUmVxdWVzdCBmYWlsZWQuIFJldHVybmVkIHN0YXR1cyBvZiAke3hoci5zdGF0dXN9YCk7XG4gICAgLy8gICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9O1xuICAgIC8vIHhoci5zZW5kKCk7XG5cbiAgICByZXR1cm4gZmV0Y2goREJIZWxwZXIuREFUQUJBU0VfVVJMKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxuICAgKiBAcGFyYW0ge251bWJlcn0gaWQgdG9kbzogYWRkIGRlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSB7YW55fSBjYWxsYmFjayB0b2RvOiBhZGQgZGVzY3JpcHRpb25cbiAgICovXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xuICAgIC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT09IGlkKTtcbiAgICAgICAgaWYgKHJlc3RhdXJhbnQpIHtcbiAgICAgICAgICAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxuICAgICAgICAgIGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09PSBjdWlzaW5lKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PT0gbmVpZ2hib3Job29kKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgIHJldHVybiBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKCkudGhlbihyZXN0YXVyYW50cyA9PiB7XG4gICAgICBsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzO1xuICAgICAgaWYgKGN1aXNpbmUgIT09ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09PSBjdWlzaW5lKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWlnaGJvcmhvb2QgIT09ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2RcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT09IG5laWdoYm9yaG9vZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cbiAgICovXG4gIHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcbiAgICByZXR1cm4gREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygpLnRoZW4ocmVzdGF1cmFudHMgPT4ge1xuICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICBjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpO1xuICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG4gICAgICBjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PT0gaSk7XG4gICAgICByZXR1cm4gdW5pcXVlTmVpZ2hib3Job29kcztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXG4gICAqL1xuICBzdGF0aWMgZmV0Y2hDdWlzaW5lcyhjYWxsYmFjaykge1xuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgIHJldHVybiBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKCkudGhlbihyZXN0YXVyYW50cyA9PiB7XG4gICAgICAvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICBjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKTtcbiAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcbiAgICAgIGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09PSBpKTtcbiAgICAgIHJldHVybiB1bmlxdWVDdWlzaW5lcztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxuICAgKi9cbiAgc3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuICAgIHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXVyYW50IGltYWdlIFVSTC5cbiAgICovXG4gIHN0YXRpYyBpbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9YCk7XG4gIH1cblxuICAvKipcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxuICAgKi9cbiAgc3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XG4gICAgY29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXG4gICAgICB0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuICAgICAgdXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxuICAgICAgbWFwOiBtYXAsXG4gICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QfVxuICAgICk7XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxufVxuXG4iXX0=
