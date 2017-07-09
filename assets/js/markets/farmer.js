import * as api from './market-data.js';


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
    let link = $('<a/>').attr('href', market['Website'] || "#")
                        .text(market['MarketName']);
    name.append(link);

    // make address linking to maps
    const address = document.createElement('p');
    const mapLink = api.mapsLink(market);
    const text = api.address(market);
    address.innerHTML = '<a href=' + mapLink + '>' + text + '</a>';

    // update DOM
    summary.append(name);
    summary.append(address);
    parent.append(summary);
}



// Create all tag elements to filter by market products, along with the "Clear Tags" option
function makeTags(markets, parent) {
    $('#clear-filters').removeClass('hidden');
    $('#clear-filters').click((e) => clearFilters(markets));

    // add market filters (tag elements)
    const market = markets.data[0];
    Object.keys(market).forEach((key) => {
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
    tag.click((e) => {
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
    markets.data.map((market) => {
        // if this market doesn't include tag, add (or remove) filter
        if (market[tag] != 'Y') {
            market['filters'] += on ? 1 : -1;
        }
    });

    markets.redraw();
}

// Clear all filters from the market data
function clearFilters(markets) {
    // update markets data
    markets.data.map((market) => {
        market['filters'] = 0;
    });
    markets.filters = [];
    markets.redraw();

    // unselect all the tags
    $('#tag-toggle-wrapper').children().each(function(index) {
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
        hasMore: function () { // can't use arrow function due to 'this' binding
            return (this.data != undefined && this.lastDisplayed < this.data.length);
        },
        redraw: function() {
            clearSummaries(this, $('#summary-wrapper'));
            makeSummaries(this, $('#summary-wrapper'), 9);
        },
        update: function(data) {
            this.data = data;
            this.data.map((market) => {
                market['filters'] = 0;
            });
        }
    };

    // Listen for zip code search
    $('#submit-search').click((e) => {
        // clear old results
        $('.market-summary-wrapper').empty();
        markets.data = {};
        markets.lastDisplayed = 0;

        // generate new results
        api.local($('#zipcode').val())
            .then((data) => {
                markets.update(data);

                // Display market data
                makeSummaries(markets, $('#summary-wrapper'), 9);

                // Functionality for "more results" button
                $('#more-results').click((e) => {
                    makeSummaries(markets, $('#summary-wrapper'), 9);
                });

                // Show tags to toggle/filter with
                makeTags(markets, $('#tag-toggle-wrapper'));
            })
            .catch((err) => console.log(err));
    });
}

$(document).ready(init);
