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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__market_data_js__ = __webpack_require__(1);


// Todo: implement numberToAdd
function summaries(zip, numberToAdd) {
    return __WEBPACK_IMPORTED_MODULE_0__market_data_js__["a" /* local */](zip);
}

function clearSummaries(markets, parent) {
    parent.empty();
    markets.lastDisplayed = 0;
}

function addSummary(market, parent) {
    __WEBPACK_IMPORTED_MODULE_0__market_data_js__["b" /* marketSummary */](market).then(data => {
        const summary = $(data);
        parent.append(summary);
    });
}

function addError(err, parent, message = "Looks like there was an error with this request.") {
    console.log(err);
    const summary = $('<div/>').addClass('market-summary');
    const name = $('<h3/>').addClass('market-name');
    name.text('Oops!');
    summary.append(name);
    summary.append($('<p/>').text(message));

    parent.append(summary);
}

// Create all tag elements to filter by market products, along with the "Clear Tags" option
function makeTags(markets, parent) {
    $('#clear-filters').removeClass('hidden');
    $('#clear-filters').click(e => clearFilters(markets));

    // add market filters (tag elements)
    const market = markets.data[0];
    Object.keys(market).forEach(key => {
        // include yes/no categories as filters
        const value = String(market[key]).toUpperCase();
        if (['Y', 'N', '-'].includes(value)) {
            addTagToggle(key, markets, parent);
        }
    });
}

function addTagToggle(tagText, allMarkets, parent) {
    const tag = $('<button>' + tagText + '</button>').addClass('tag-toggle');
    tag.appendTo(parent);
    tag.click(e => {
        tagPress(tag, allMarkets);
    });
}

function tagPress(tag, allMarkets) {
    var addFilter;
    const tagText = tag.text();

    // already filtered: remove
    if (allMarkets.filters.includes(tagText)) {
        allMarkets.filters.splice(allMarkets.filters.indexOf(tagText), 1);
        addFilter = false;
        // not already filtered - add it
    } else {
        allMarkets.filters.push(tagText);
        addFilter = true;
    }
    tag.toggleClass('selected');
    toggleFilter(allMarkets, tagText, addFilter);
}

// Toggle a specific tag on each market
// @on {Bool} turn filter on (true) or off (false)
function toggleFilter(markets, tag, on) {
    markets.data.map(market => {
        // if this market doesn't include tag, add (or remove) a layer of filter
        if (market[tag] != 'Y') {
            market['filters'] += on ? 1 : -1;
        }
    });

    markets.redraw();
}

// Clear all filters from the market data
function clearFilters(markets) {
    // update markets data
    markets.data.map(market => {
        market['filters'] = 0;
    });
    markets.filters = [];
    markets.redraw();

    // unselect all the tags
    $('#tag-toggle-wrapper').children().each(function (index) {
        $(this).removeClass('selected');
    });
}

function init() {
    // Show button on searchbox click
    $('#search-value').click(e => {
        $('.market-header').addClass('searchbar-selected');
        $(document).click(e => {
            if (!$(e.target).is('input')) {
                $('.market-header').removeClass('searchbar-selected');
            }
        });
    });

    // Listen for zip code search
    $('#submit-search').click(e => {
        // prevent form submission
        e.preventDefault();

        // clear old results
        $('.market-summary-wrapper').empty();
        console.log($('#search-value').val());
        // load new results
        summaries($('#search-value').val(), 9).then(html => {
            $('#summary-wrapper').append($(html));
        }).catch(err => addError(err, $('#summary-wrapper'), "Looks like we weren't able to find anything in zip " + '"' + ($('#zipcode').val() || 'Zip code') + '".'));;
    });
}

$(document).ready(init);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = local;
/* unused harmony export detail */
/* unused harmony export allDetails */
/* unused harmony export mapsLink */
/* unused harmony export address */
/* unused harmony export marketDetailPage */
/* harmony export (immutable) */ __webpack_exports__["b"] = marketSummary;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__http_promise__ = __webpack_require__(2);
//  Wrapper for calls to retreive market data


const BASE_API_URL = 'http://127.0.0.1:5000/yourmarket/api/';
const BASE_SITE_URL = 'http://127.0.0.1:8000/';

// Return summary of markets near zip
function local(zip, callback) {
    const url = BASE_SITE_URL + 'zip/' + zip;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'html');
}

// get detailed information for a certain market ID
function detail(id) {
    const url = BASE_API_URL + 'id/' + id;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'json');
}

// get detailed information for a group of market summaries
function allDetails(marketData) {
    for (var i = 0; i < marketData.length; i++) {
        let market = marketData[i];
        getDetail(market['id']).then(printData);
    }
}

// Get Google Maps link from market detail data
function mapsLink(market) {
    const link = 'https://maps.google.com/?q=' + encodeURI(market['y'] + ',' + market['x'] + ' ("' + market['MarketName'] + '")');
    return link;
}

// return address of market
function address(market) {
    const address = [market['street'], market['city'], market['zip']].join(', ');
    return address;
}

// internal page about a given market
function marketDetailPage(market) {
    let url = BASE_SITE_URL + 'market/' + market['FMID'];
    let link = $('<a/>').attr('href', url).text(market['MarketName']);
    return link;
}

function marketSummary(market) {
    let url = BASE_SITE_URL + 'market/' + market['FMID'];
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'html');
}

/***/ }),
/* 2 */
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
                reject(new Error('Failed to load the thing - status ' + status));
            }
        });
    });
};
/* harmony export (immutable) */ __webpack_exports__["a"] = get;


// Implementation with XMLHttpRequest
const getXMLHttpRequest = function (url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                resolve(request.response);
            } else if (request.readyState == XMLHttpRequest.DONE && (request.status < 200 || request.status > 299)) {
                reject(new Error('Failed to load page - status: ' + request.status));
            }
        };
        request.open('GET', url);
        request.send(null);
    });
};
/* unused harmony export getXMLHttpRequest */


var HttpClient = function () {
    this.get = function (url, callback) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            } else {
                console.log('--------- Error! ---------');
                console.log(request);
            }
        };
        request.open('GET', url, true);
        request.send(null);
    };
};

/***/ })
/******/ ]);