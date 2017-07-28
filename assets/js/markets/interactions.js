import * as api from './market-api.js';


function init() {
    // Show button on searchbox click
    $('#search-value').click((e) => {
        $('.market-header').addClass('searchbar-selected');
        // remove extended style when user leaves searchbox
        $(document).focusout((e) => {
            $('.market-header').removeClass('searchbar-selected');
        });
    });

    // Handle clicks to "favorites" button
    $('.market-summary-wrapper').on('click', '.favorite', function(e) {
        let market_id = this.id;
        api.toggleFavorite(market_id).then(() => {
            console.log(market_id);
            $('#' + market_id).toggleClass('favored');
        }).catch((err) => {
            alert('Oops! An error occurred when trying to favorite the market with the id ' + market_id);
            console.log(err);
        });
    });
}

$(document).ready(init);
