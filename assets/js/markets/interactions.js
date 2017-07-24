function init() {
    // Show button on searchbox click
    $('#search-value').click((e) => {
        $('.market-header').addClass('searchbar-selected');
        // remove extended style when user leaves searchbox
        $(document).focusout((e) => {
            $('.market-header').removeClass('searchbar-selected');
        });
    });
}

$(document).ready(init);
