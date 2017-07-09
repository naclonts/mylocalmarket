//  Wrapper for calls to retreive market data

import * as http from './http-promise';
const BASE_URL = 'http://127.0.0.1:5000/yourmarket/api';

// Return summary of markets near zip
export function local(zip, callback) {
    const url = BASE_URL + '/zip/' + zip;
    return http.get(url, 'json');
}

// get detailed information for a certain market ID
export function detail(id) {
    const url = BASE_URL + '/id/' + id;
    return http.get(url, 'json');
}

// get detailed information for a group of market summaries
export function allDetails(marketData) {
    for (var i=0; i < marketData.length; i++) {
        let market = marketData[i];
        getDetail(market['id']).then(printData);
    }
}

// Get Google Maps link from market detail data
export function mapsLink(market) {
    const link = 'https://maps.google.com/?q=' +
                 encodeURI(market['y'] + ',' + market['x'] +
                           ' ("' + market['MarketName'] + '")');
    return (link);
}

// return address of market
export function address(market) {
    const address = [market['street'], market['city'], market['zip']].join(', ');
    return (address);
}
