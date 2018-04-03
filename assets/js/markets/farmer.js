require('leaflet.markercluster');
import Vue from 'vue';
import MarketSummary from '../components/market-summary.vue';

import * as api from './market-api.js';

// HTML for summaries of markets near a given zip code
async function summaries(zip, numberToAdd) {
    let response = await api.local(zip);
    return response;
}

// Post an error message when search fails
function addError(err, parent, message="Looks like there was an error with this request.") {
    console.log(err);
    const summary = $('<div/>').addClass('market-summary');
    const name = $('<h3/>').addClass('market-name');
    name.text('Oops!');
    summary.append(name);
    summary.append($('<p/>').text(message));

    parent.append(summary);
}


// Draw the Leaflet map with search results
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

// Zoom in on a given area in the map
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

// Put together the search results when the page loads
function init() {
    // Listen for zip code search
    $('#submit-search').click((e) => {
        // const zipcode = $('#search-value').val();

        // prevent form submission and full-page reload
        // to give that "single-page app" feel
        e.preventDefault();

        // clear old results
        // $('.market-summary-wrapper').empty();
        //
        // // load new results
        // summaries(zipcode, 9).then((html) => {
        //     $('#summary-wrapper').append($(html));
        //
        //     // update
        //     api.latLonFromZip(zipcode).then((coords) => setMapCoords(map, coords));
        // })
        // // show an error message if no results come back
        // .catch((err) => addError(err,
        //                         $('#summary-wrapper'),
        //                         "Looks like we weren't able to find anything in zip " +
        //                             '"' + (zipcode || 'Zip code') + '".'));
    });

    // simulate initial search
    $('#submit-search').click();

    const map = initMap();
}

$(document).ready(init);


function startVue() {
    let vm = new Vue({
        delimiters: ['[[', ']]'],
        el: '#app',
        components: {
            'market-summary': MarketSummary
        },
        data: {
            markets: []
        },
        beforeMount: async function() {
            this.markets = await summaries('80526');
            console.log(this.markets);
        }
    })
}
window.onload = startVue;
