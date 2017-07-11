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


function makeSummaries(markets, parent, numberToAdd) {
    let i = markets.lastDisplayed;
    let added = 0;
    while (added < numberToAdd && i < markets.data.length) {
        const market = markets.data[i];
        i++;
        // skip filtered out markets
        if (market['filters'] > 0) continue;
        addSummary(market, parent);
        added++; // increment number added so far
    }
    markets.lastDisplayed = i;

    // Display button to get more results
    if (markets.hasMore()) {
        $('#more-results').addClass('visible');
    } else {
        $('#more-results').removeClass('visible');
    }
}

function clearSummaries(markets, parent) {
    parent.empty();
    markets.lastDisplayed = 0;
}

function addSummary(market, parent) {
    const summary = $('<div/>').addClass('market-summary');

    // Create header for element
    let name = $('<h3/>').addClass('market-name');
    let link = $('<a/>').attr('href', market['Website'] || "#").text(market['MarketName']);
    name.append(link);

    // make address linking to maps
    const address = document.createElement('p');
    const mapLink = __WEBPACK_IMPORTED_MODULE_0__market_data_js__["c" /* mapsLink */](market);
    const text = __WEBPACK_IMPORTED_MODULE_0__market_data_js__["a" /* address */](market);
    address.innerHTML = '<a href=' + mapLink + '>' + text + '</a>';

    // update DOM
    summary.append(name);
    summary.append(address);
    parent.append(summary);
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
    // Market data singleton
    const markets = {
        data: [],
        lastDisplayed: 0,
        filters: [],
        // hasMore: true if there are more markets to display
        hasMore: function () {
            // can't use arrow function due to 'this' binding
            return this.data != undefined && this.lastDisplayed < this.data.length;
        },
        redraw: function () {
            clearSummaries(this, $('#summary-wrapper'));
            makeSummaries(this, $('#summary-wrapper'), 9);
        },
        update: function (data) {
            this.data = data;
            this.data.map(market => {
                market['filters'] = 0;
            });
        }
    };

    // Listen for zip code search
    $('#submit-search').click(e => {
        // clear old results
        $('.market-summary-wrapper').empty();
        markets.data = {};
        markets.lastDisplayed = 0;

        // generate new results
        __WEBPACK_IMPORTED_MODULE_0__market_data_js__["b" /* local */]($('#zipcode').val()).then(data => {
            markets.update(data);

            // Display market data
            makeSummaries(markets, $('#summary-wrapper'), 9);

            // Functionality for "more results" button(
            $('#more-results').click(e => {
                makeSummaries(markets, $('#summary-wrapper'), 9);
            });

            // Show tags to toggle/filter with
            makeTags(markets, $('#tag-toggle-wrapper'));
        }).catch(err => addError(err, $('#summary-wrapper'), "Looks like we weren't able to find anything in zip " + '"' + ($('#zipcode').val() || 'Zip code') + '".'));
    });
}

$(document).ready(init);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = local;
/* unused harmony export detail */
/* unused harmony export allDetails */
/* harmony export (immutable) */ __webpack_exports__["c"] = mapsLink;
/* harmony export (immutable) */ __webpack_exports__["a"] = address;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__http_promise__ = __webpack_require__(2);
//  Wrapper for calls to retreive market data


const BASE_URL = 'http://127.0.0.1:5000/yourmarket/api';

// Return summary of markets near zip
function local(zip, callback) {
    const url = BASE_URL + '/zip/' + zip;
    return __WEBPACK_IMPORTED_MODULE_0__http_promise__["a" /* get */](url, 'json');
}

// get detailed information for a certain market ID
function detail(id) {
    const url = BASE_URL + '/id/' + id;
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