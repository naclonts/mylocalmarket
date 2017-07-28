/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = local;
/* unused harmony export detail */
/* unused harmony export allDetails */
/* harmony export (immutable) */ __webpack_exports__["c"] = toggleFavorite;
/* harmony export (immutable) */ __webpack_exports__["a"] = latLonFromZip;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__http_promise__ = __webpack_require__(1);
//  Wrapper for calls to retreive market data


const BASE_SITE_URL = 'http://127.0.0.1:8000/';

// Return summary of markets near zip
function local(zip, callback) {
    const url = BASE_SITE_URL + 'zip/' + zip;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'html');
}

// get detailed information for a certain market ID
function detail(id) {
    const url = BASE_SITE_URL + 'market/' + id;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'html');
}

// get detailed information for a group of market summaries
function allDetails(marketData) {
    for (var i = 0; i < marketData.length; i++) {
        let market = marketData[i];
        getDetail(market['id']).then(printData);
    }
}

// Favorite a particular farmers market
function toggleFavorite(id) {
    let url = BASE_SITE_URL + 'favorite/' + id;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["b" /* post */](url);
}

function latLonFromZip(zip) {
    let url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zip;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'json').then(data => {
        let lat = data['results'][0]['geometry']['location']['lat'];
        let lon = data['results'][0]['geometry']['location']['lng'];
        return { 'lat': lat, 'lon': lon };
    });
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Implementation with jQuery
const get = function (url, dataType = 'text') {
    // return new pending promise
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: dataType,
            async: true,
            statusCode: {
                404: response => reject(new Error('404 error - response: ' + response)),
                200: response => resolve(response)
            },
            error: (jqXHR, status, error) => {
                reject(new Error('Failed to GET the thing - status ' + status));
            }
        });
    });
};
/* harmony export (immutable) */ __webpack_exports__["a"] = get;


// Implementation with jQuery
const post = function (url) {
    const token = getCookie('csrftoken');
    // return new pending promise
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            headers: { 'X-CSRFToken': token },
            statusCode: {
                404: response => reject(new Error('404 error - response: ' + response)),
                200: response => resolve(response)
            },
            error: (jqXHR, status, error) => {
                reject(new Error('Failed to POST the thing - status ' + status));
            }
        });
    });
};
/* harmony export (immutable) */ __webpack_exports__["b"] = post;


// Get a cookie. Used to obtain CSRF token.
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__market_api_js__ = __webpack_require__(0);


function init() {
    // Show button on searchbox click
    $('#search-value').click(e => {
        $('.market-header').addClass('searchbar-selected');
        // remove extended style when user leaves searchbox
        $(document).focusout(e => {
            $('.market-header').removeClass('searchbar-selected');
        });
    });

    // Handle clicks to "favorites" button
    $('.market-summary-wrapper').on('click', '.favorite', function (e) {
        let market_id = this.id;
        __WEBPACK_IMPORTED_MODULE_0__market_api_js__["c" /* toggleFavorite */](market_id).then(() => {
            console.log(market_id);
            $('#' + market_id).toggleClass('favored');
        }).catch(err => {
            alert('Oops! An error occurred when trying to favorite the market with the id ' + market_id);
            console.log(err);
        });
    });
}

$(document).ready(init);

/***/ })
/******/ ]);