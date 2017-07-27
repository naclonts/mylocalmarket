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
        api.toggleFavorite(market_id).then((d) => {
            console.log(market_id);
            return api.get_svg_favorite_icon(market_id);
        }).then((svg_data) => {
            $('#' + market_id + ' svg').empty();
            $('#' + market_id).append(svg_data);
        })
        .catch((err) => {
            console.log('----error!----');
            console.log(err);
        });
    });
    console.log('inited');
}

$(document).ready(init);
