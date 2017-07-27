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
    $('.market-summary-wrapper').on('click', '.favorite-wrapper', function(e) {
        let market_id = this.id;
        api.toggleFavorite(market_id).then(() => {
            console.log('complete!')
        })
        .catch((err) => {
            console.log('----error!----');
            console.log(err);
        });
    });
    console.log('inited');
}

$(document).ready(init);
