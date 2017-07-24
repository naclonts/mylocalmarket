require('leaflet.markercluster');

import * as api from './market-data.js';

const SITE_BASE_URL = '127.0.0.1:8000';

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



function initMap() {
    var map = L.map('search-map');
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoia29rb3BlbGxpIiwiYSI6ImNqNWVydWVtNzBwMDMzM28yY2RybGljanMifQ.xxJlxPb32b4GkiDv-ubL2w'
    }).addTo(map);
    return map;
}

function setMapCoords(map, coords, zoom=11) {
    map.setView([coords.lat, coords.lon], zoom);
    var m = L.marker([coords.lat, coords.lat]).addTo(map);

    // Load farmers market data
    let string = $('#market-data').text();
    let data = JSON.parse(string);

    // Marker clustering handler
    const markers = L.markerClusterGroup();

    // Create each marker, then add them to the map
    for (let i=0; i < data.length; i++) {
        const market = data[i]['fields'];
        let m = L.marker([market['latitude'], market['longitude']], { title: market['name'] });
        m.bindPopup(market['name']);
        markers.addLayer(m);
    }
    map.addLayer(markers);

    // Clear JSON DOM element
    $('#market-data').empty();
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
        const zipcode = $('#search-value').val();

        // prevent form submission and full-page reload
        // to give the "single-page app" feel
        e.preventDefault();

        // clear old results
        $('.market-summary-wrapper').empty();

        // load new results
        summaries(zipcode, 9).then((html) => {
            $('#summary-wrapper').append($(html));

            // update
            api.latLonFromZip(zipcode).then((coords) => setMapCoords(map, coords));
        })
        // show an error message if no results come back
        .catch((err) => addError(err,
                                $('#summary-wrapper'),
                                "Looks like we weren't able to find anything in zip " +
                                    '"' + (zipcode || 'Zip code') + '".'));
    });

    // simulate initial search
    // $('#search-value').val(80526);
    $('#submit-search').click();

    const map = initMap();
}

$(document).ready(init);
