import * as api from './market-data.js';

// Todo: implement numberToAdd
function summaries(zip, numberToAdd) {
    return api.local(zip);
}

function clearSummaries(markets, parent) {
    parent.empty();
    markets.lastDisplayed = 0;
}

function addSummary(market, parent) {
    api.marketSummary(market).then((data) => {
        const summary = $(data);
        parent.append(summary);
    });
}

function addError(err, parent, message="Looks like there was an error with this request.") {
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
    // Show button on searchbox click
    $('#search-value').click((e) => {
        $('.market-header').addClass('searchbar-selected');
        $(document).click((e) => {
            if (!$(e.target).is('input')) {
                $('.market-header').removeClass('searchbar-selected');
            }
        });
    });

    // Listen for zip code search
    $('#submit-search').click((e) => {
        // prevent form submission
        e.preventDefault();

        // clear old results
        $('.market-summary-wrapper').empty();
        
        // load new results
        summaries($('#search-value').val(), 9).then((html) => {
            $('#summary-wrapper').append($(html));
        })
        .catch((err) => addError(err,
                                $('#summary-wrapper'),
                                "Looks like we weren't able to find anything in zip " +
                                    '"' + ($('#zipcode').val() || 'Zip code') + '".'));;
    })
}

$(document).ready(init);
