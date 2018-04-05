'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} /* eslint-env browser */

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
}var

RestarauntInfo = function () {
  function RestarauntInfo() {_classCallCheck(this, RestarauntInfo);
    this.restaurant = null;
  }

  /**
     * Get current restaurant from page URL.
     * @param {*} callback todo add desc
     */_createClass(RestarauntInfo, [{ key: 'fetchRestaurantFromURL', value: function fetchRestaurantFromURL(
    callback) {var _this = this;
      if (this.restaurant) {
        // restaurant already fetched!
        callback(null, this.restaurant);
        return;
      }
      var id = this.getParameterByName('id');
      var idNotFound = !id;
      if (idNotFound) {
        // no id found in URL
        var error = 'No restaurant id in URL';
        callback(error, null);
      } else {
        DBHelper.fetchRestaurantById(id, function (error, restaurant) {
          _this.restaurant = restaurant;
          if (!restaurant) {
            console.error(error);
            return;
          }
          _this.fillRestaurantHTML();
          callback(null, restaurant);
        });
      }
    }

    /**
       * Create restaurant HTML and add it to the webpage
       * @param {*} restaurant todo add desc
       */ }, { key: 'fillRestaurantHTML', value: function fillRestaurantHTML()
    {var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.restaurant;
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
        this.fillRestaurantHoursHTML();
      }
      // fill reviews
      this.fillReviewsHTML();
    }

    /**
       * Create restaurant operating hours HTML table and add it to the webpage.
       * @param {*} operatingHours todo add desc
       */ }, { key: 'fillRestaurantHoursHTML', value: function fillRestaurantHoursHTML()
    {var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.restaurant.operating_hours;
      var hours = document.getElementById('restaurant-hours');
      for (var key in operatingHours) {
        if (key) {
          var row = document.createElement('tr');

          var day = document.createElement('td');
          day.innerHTML = key;
          row.appendChild(day);

          var time = document.createElement('td');
          time.innerHTML = operatingHours[key];
          row.appendChild(time);

          hours.appendChild(row);
        }
      }
    }

    /**
       * Create all reviews HTML and add them to the webpage.
       * @param {*} reviews todo add desc
       */ }, { key: 'fillReviewsHTML', value: function fillReviewsHTML()
    {var _this2 = this;var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.restaurant.reviews;
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
        ul.appendChild(_this2.createReviewHTML(review));
      });
      container.appendChild(ul);
    }

    /**
       * Create review HTML and add it to the webpage.
       * @param {*} review todo add desc
       * @return {*} li todo add desc
       */ }, { key: 'createReviewHTML', value: function createReviewHTML(
    review) {
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
    }

    /**
      * Add restaurant name to the breadcrumb navigation menu
      * @param {*} restaurant todo add desc
      */ }, { key: 'fillBreadcrumb', value: function fillBreadcrumb()
    {var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.restaurant;
      var breadcrumb = document.getElementById('breadcrumb');
      var li = document.createElement('li');
      li.innerHTML = restaurant.name;
      li.setAttribute('aria-current', 'page');
      breadcrumb.appendChild(li);
    }

    /**
       * Get a parameter by name from page URL.
       * @param {*} name todo add desc
       * @param {*} url todo add desc
       * @return {*} todo add return
       */ }, { key: 'getParameterByName', value: function getParameterByName(
    name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      var results = regex.exec(url);
      if (!results) {
        return null;
      }
      if (!results[2]) {
        return '';
      }
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    } }]);return RestarauntInfo;}();


var restarauntInfo = new RestarauntInfo();

/**
                                            * Initialize Google map, called from HTML.
                                            */
window.initMap = function () {
  restarauntInfo.fetchRestaurantFromURL(function (error, restaurant) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false });

      restarauntInfo.fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(restarauntInfo.restaurant, map);
    }
  });
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJuYXZpZ2F0b3IiLCJzZXJ2aWNlV29ya2VyIiwicmVnaXN0ZXIiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImNhdGNoIiwiZXJyIiwiUmVzdGFyYXVudEluZm8iLCJyZXN0YXVyYW50IiwiY2FsbGJhY2siLCJpZCIsImdldFBhcmFtZXRlckJ5TmFtZSIsImlkTm90Rm91bmQiLCJlcnJvciIsIkRCSGVscGVyIiwiZmV0Y2hSZXN0YXVyYW50QnlJZCIsImZpbGxSZXN0YXVyYW50SFRNTCIsIm5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiYWRkcmVzcyIsImltYWdlIiwiY2xhc3NOYW1lIiwic3JjIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiYWx0IiwiY3Vpc2luZSIsImN1aXNpbmVfdHlwZSIsIm9wZXJhdGluZ19ob3VycyIsImZpbGxSZXN0YXVyYW50SG91cnNIVE1MIiwiZmlsbFJldmlld3NIVE1MIiwib3BlcmF0aW5nSG91cnMiLCJob3VycyIsImtleSIsInJvdyIsImNyZWF0ZUVsZW1lbnQiLCJkYXkiLCJhcHBlbmRDaGlsZCIsInRpbWUiLCJyZXZpZXdzIiwiY29udGFpbmVyIiwidGl0bGUiLCJub1Jldmlld3MiLCJ1bCIsImZvckVhY2giLCJjcmVhdGVSZXZpZXdIVE1MIiwicmV2aWV3IiwibGkiLCJyZXZpZXdUaXRsZSIsImRhdGUiLCJyZXZpZXdDb250ZW50IiwicmF0aW5nIiwiY29tbWVudHMiLCJicmVhZGNydW1iIiwic2V0QXR0cmlidXRlIiwidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwicmVwbGFjZSIsInJlZ2V4IiwiUmVnRXhwIiwicmVzdWx0cyIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJyZXN0YXJhdW50SW5mbyIsImluaXRNYXAiLCJmZXRjaFJlc3RhdXJhbnRGcm9tVVJMIiwibWFwIiwiZ29vZ2xlIiwibWFwcyIsIk1hcCIsInpvb20iLCJjZW50ZXIiLCJsYXRsbmciLCJzY3JvbGx3aGVlbCIsImZpbGxCcmVhZGNydW1iIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCJdLCJtYXBwaW5ncyI6IndzQkFBQTs7QUFFQTs7O0FBR0EsSUFBSSxtQkFBbUJBLFNBQXZCLEVBQWtDO0FBQ2hDQSxZQUFVQyxhQUFWO0FBQ0dDLFVBREgsQ0FDWSxTQURaO0FBRUdDLE1BRkgsQ0FFUSxZQUFNO0FBQ1ZDLFlBQVFDLEdBQVIsQ0FBWSw0QkFBWjtBQUNELEdBSkg7QUFLR0MsT0FMSCxDQUtTLGVBQU87QUFDWkYsWUFBUUMsR0FBUixDQUFZRSxHQUFaO0FBQ0QsR0FQSDtBQVFELEM7O0FBRUtDLGM7QUFDSiw0QkFBYztBQUNaLFNBQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDRDs7QUFFRDs7OztBQUl1QkMsWSxFQUFVO0FBQy9CLFVBQUksS0FBS0QsVUFBVCxFQUFxQjtBQUNyQjtBQUNFQyxpQkFBUyxJQUFULEVBQWUsS0FBS0QsVUFBcEI7QUFDQTtBQUNEO0FBQ0QsVUFBTUUsS0FBSyxLQUFLQyxrQkFBTCxDQUF3QixJQUF4QixDQUFYO0FBQ0EsVUFBTUMsYUFBYSxDQUFDRixFQUFwQjtBQUNBLFVBQUlFLFVBQUosRUFBZ0I7QUFDZDtBQUNBLFlBQU1DLFFBQVEseUJBQWQ7QUFDQUosaUJBQVNJLEtBQVQsRUFBZ0IsSUFBaEI7QUFDRCxPQUpELE1BSU87QUFDTEMsaUJBQVNDLG1CQUFULENBQTZCTCxFQUE3QixFQUFpQyxVQUFDRyxLQUFELEVBQVFMLFVBQVIsRUFBdUI7QUFDdEQsZ0JBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsY0FBSSxDQUFDQSxVQUFMLEVBQWlCO0FBQ2ZMLG9CQUFRVSxLQUFSLENBQWNBLEtBQWQ7QUFDQTtBQUNEO0FBQ0QsZ0JBQUtHLGtCQUFMO0FBQ0FQLG1CQUFTLElBQVQsRUFBZUQsVUFBZjtBQUNELFNBUkQ7QUFTRDtBQUNGOztBQUVEOzs7O0FBSWlELFNBQTlCQSxVQUE4Qix1RUFBakIsS0FBS0Es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YXVyYW50X2luZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuLyoqXG4gKiBBZGQgc2VydmljZSB3b3JrZXIgdG8gcmVzdGFyYXVudCBpbmZvIHBhZ2VcbiAqL1xuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcbiAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXJcbiAgICAucmVnaXN0ZXIoJy4vc3cuanMnKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXJ2aWNlIHdvcmtlciByZWdpc3RlcmVkIScpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufVxuXG5jbGFzcyBSZXN0YXJhdW50SW5mbyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzdGF1cmFudCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgcmVzdGF1cmFudCBmcm9tIHBhZ2UgVVJMLlxuICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrIHRvZG8gYWRkIGRlc2NcbiAgICovXG4gIGZldGNoUmVzdGF1cmFudEZyb21VUkwoY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5yZXN0YXVyYW50KSB7XG4gICAgLy8gcmVzdGF1cmFudCBhbHJlYWR5IGZldGNoZWQhXG4gICAgICBjYWxsYmFjayhudWxsLCB0aGlzLnJlc3RhdXJhbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpZCA9IHRoaXMuZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICAgIGNvbnN0IGlkTm90Rm91bmQgPSAhaWQ7XG4gICAgaWYgKGlkTm90Rm91bmQpIHtcbiAgICAgIC8vIG5vIGlkIGZvdW5kIGluIFVSTFxuICAgICAgY29uc3QgZXJyb3IgPSAnTm8gcmVzdGF1cmFudCBpZCBpbiBVUkwnO1xuICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICAgICAgdGhpcy5yZXN0YXVyYW50ID0gcmVzdGF1cmFudDtcbiAgICAgICAgaWYgKCFyZXN0YXVyYW50KSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsbFJlc3RhdXJhbnRIVE1MKCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZVxuICAgKiBAcGFyYW0geyp9IHJlc3RhdXJhbnQgdG9kbyBhZGQgZGVzY1xuICAgKi9cbiAgZmlsbFJlc3RhdXJhbnRIVE1MKHJlc3RhdXJhbnQgPSB0aGlzLnJlc3RhdXJhbnQpIHtcbiAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICAgIG5hbWUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xuXG4gICAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWFkZHJlc3MnKTtcbiAgICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcblxuICAgIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaW1nJyk7XG4gICAgaW1hZ2UuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnQtaW1nJztcbiAgICBpbWFnZS5zcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gICAgaW1hZ2UuYWx0ID0gYFJlc3RhdXJhbnQ6ICR7cmVzdGF1cmFudC5uYW1lfWA7XG5cbiAgICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtY3Vpc2luZScpO1xuICAgIGN1aXNpbmUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGU7XG5cbiAgICAvLyBmaWxsIG9wZXJhdGluZyBob3Vyc1xuICAgIGlmIChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycykge1xuICAgICAgdGhpcy5maWxsUmVzdGF1cmFudEhvdXJzSFRNTCgpO1xuICAgIH1cbiAgICAvLyBmaWxsIHJldmlld3NcbiAgICB0aGlzLmZpbGxSZXZpZXdzSFRNTCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gICAqIEBwYXJhbSB7Kn0gb3BlcmF0aW5nSG91cnMgdG9kbyBhZGQgZGVzY1xuICAgKi9cbiAgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwob3BlcmF0aW5nSG91cnMgPSB0aGlzLnJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG4gICAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xuICAgIGZvciAobGV0IGtleSBpbiBvcGVyYXRpbmdIb3Vycykge1xuICAgICAgaWYgKGtleSkge1xuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXG4gICAgICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgIGRheS5pbm5lckhUTUwgPSBrZXk7XG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xuXG4gICAgICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICB0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XG4gICAgICAgIHJvdy5hcHBlbmRDaGlsZCh0aW1lKTtcblxuICAgICAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYWxsIHJldmlld3MgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gICAqIEBwYXJhbSB7Kn0gcmV2aWV3cyB0b2RvIGFkZCBkZXNjXG4gICAqL1xuICBmaWxsUmV2aWV3c0hUTUwocmV2aWV3cyA9IHRoaXMucmVzdGF1cmFudC5yZXZpZXdzKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtY29udGFpbmVyJyk7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuICAgIHRpdGxlLmlubmVySFRNTCA9ICdSZXZpZXdzJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gICAgaWYgKCFyZXZpZXdzKSB7XG4gICAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBub1Jldmlld3MuaW5uZXJIVE1MID0gJ05vIHJldmlld3MgeWV0ISc7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9SZXZpZXdzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1saXN0Jyk7XG4gICAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgICB1bC5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVJldmlld0hUTUwocmV2aWV3KSk7XG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAgICogQHBhcmFtIHsqfSByZXZpZXcgdG9kbyBhZGQgZGVzY1xuICAgKiBAcmV0dXJuIHsqfSBsaSB0b2RvIGFkZCBkZXNjXG4gICAqL1xuICBjcmVhdGVSZXZpZXdIVE1MKHJldmlldykge1xuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCByZXZpZXdUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJldmlld1RpdGxlLmNsYXNzTmFtZSA9ICdyZXZpZXctdGl0bGUgcmV2aWV3LWRldGFpbHMnO1xuICAgIGxpLmFwcGVuZENoaWxkKHJldmlld1RpdGxlKTtcblxuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbmFtZS5pbm5lckhUTUwgPSByZXZpZXcubmFtZTtcbiAgICBuYW1lLmNsYXNzTmFtZSA9ICdyZXZpZXdlci1uYW1lJztcbiAgICByZXZpZXdUaXRsZS5hcHBlbmRDaGlsZChuYW1lKTtcblxuICAgIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgZGF0ZS5pbm5lckhUTUwgPSByZXZpZXcuZGF0ZTtcbiAgICBkYXRlLmNsYXNzTmFtZSA9ICdyZXZpZXctZGF0ZSc7XG4gICAgcmV2aWV3VGl0bGUuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgICBjb25zdCByZXZpZXdDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmV2aWV3Q29udGVudC5jbGFzc05hbWUgPSAncmV2aWV3LWNvbnRlbnQgcmV2aWV3LWRldGFpbHMnO1xuICAgIGxpLmFwcGVuZENoaWxkKHJldmlld0NvbnRlbnQpO1xuXG4gICAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHJhdGluZy5pbm5lckhUTUwgPSBgUmF0aW5nOiAke3Jldmlldy5yYXRpbmd9YDtcbiAgICByYXRpbmcuY2xhc3NOYW1lID0gJ3Jldmlldy1yYWl0aW5nIHVwcGVyY2FzZSc7XG4gICAgcmV2aWV3Q29udGVudC5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gICAgY29uc3QgY29tbWVudHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgY29tbWVudHMuaW5uZXJIVE1MID0gcmV2aWV3LmNvbW1lbnRzO1xuICAgIHJldmlld0NvbnRlbnQuYXBwZW5kQ2hpbGQoY29tbWVudHMpO1xuXG4gICAgcmV0dXJuIGxpO1xuICB9XG5cbiAgLyoqXG4gICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAgKiBAcGFyYW0geyp9IHJlc3RhdXJhbnQgdG9kbyBhZGQgZGVzY1xuICAqL1xuICBmaWxsQnJlYWRjcnVtYihyZXN0YXVyYW50ID0gdGhpcy5yZXN0YXVyYW50KSB7XG4gICAgY29uc3QgYnJlYWRjcnVtYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVhZGNydW1iJyk7XG4gICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcbiAgICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcsICdwYWdlJyk7XG4gICAgYnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgcGFyYW1ldGVyIGJ5IG5hbWUgZnJvbSBwYWdlIFVSTC5cbiAgICogQHBhcmFtIHsqfSBuYW1lIHRvZG8gYWRkIGRlc2NcbiAgICogQHBhcmFtIHsqfSB1cmwgdG9kbyBhZGQgZGVzY1xuICAgKiBAcmV0dXJuIHsqfSB0b2RvIGFkZCByZXR1cm5cbiAgICovXG4gIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lLCB1cmwpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgfVxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKTtcbiAgICBjb25zdCByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICAgIGlmICghcmVzdWx0cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICghcmVzdWx0c1syXSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICB9XG59XG5cbmNvbnN0IHJlc3RhcmF1bnRJbmZvID0gbmV3IFJlc3RhcmF1bnRJbmZvKCk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBHb29nbGUgbWFwLCBjYWxsZWQgZnJvbSBIVE1MLlxuICovXG53aW5kb3cuaW5pdE1hcCA9ICgpID0+IHtcbiAgcmVzdGFyYXVudEluZm8uZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCgoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIC8vIEdvdCBhbiBlcnJvciFcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xuICAgICAgICB6b29tOiAxNixcbiAgICAgICAgY2VudGVyOiByZXN0YXVyYW50LmxhdGxuZyxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJlc3RhcmF1bnRJbmZvLmZpbGxCcmVhZGNydW1iKCk7XG4gICAgICBEQkhlbHBlci5tYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhcmF1bnRJbmZvLnJlc3RhdXJhbnQsIG1hcCk7XG4gICAgfVxuICB9KTtcbn07XG4iXX0=
