require('leaflet.markercluster');
import Vue from 'vue';
import L from 'leaflet';
import MarketSummary from '../components/market-summary.vue';

import * as api from './market-api.js';


// Draw the Leaflet map with search results
function initMap() {
    var map = L.map('search-map').setView([38.63, -90.23], 12);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoia29rb3BlbGxpIiwiYSI6ImNqNWVydWVtNzBwMDMzM28yY2RybGljanMifQ.xxJlxPb32b4GkiDv-ubL2w'
    }).addTo(map);
    return map;
}

// Zoom in on a given area in the map
function setMapCoords(map, coords, data, zoom=11) {
    map.setView([coords.lat, coords.lon], zoom);
    var m = L.marker([coords.lat, coords.lat]).addTo(map);

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
    return map;
}


function countProducts(market) {
    return Object.keys(market).filter((field) => {
        return (field.substr(0,4) == 'has_' && market[field] == True);
    }).length;
}


// JSON of markets near a given zip code
async function marketData(zip, numberToAdd) {
    let response = await api.local(zip);
    return response;
}



let vm = new Vue({
    delimiters: ['[[', ']]'],
    el: '#app',
    components: {
        'market-summary': MarketSummary
    },
    data: {
        markets: [],
        coords: {},
        map: null
    },
    mounted: async function() {
        this.map = initMap();
        try {
            await this.searchZip(this.zipCode);
        } catch (err) {
            console.log(err);
            this.markets = [];
        }
    },
    methods: {
        searchZip: async function(zipCode) {
            let markets = await marketData(zipCode);
            markets.sort((a, b) => {
                return countProducts(a) < countProducts(b) ? -1 : 1
            });
            this.markets = markets;
            this.coords = await api.latLonFromZip(zipCode);
            this.map = setMapCoords(this.map, this.coords, this.markets);

        }
    },
    computed: {
        zipCode: function() {
            return $('#search-value').val();
        },
        errorMarket: function() {
            return {
                name: "Whoops",
                address_street: `We couldn't find any markets in ${this.zipCode}.`
            };
        }
    }
});
