// Implementation with jQuery
export const get = function(url, dataType='text') {
    // return new pending promise
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: dataType,
            async: true,
            statusCode: {
                404: (response) => reject(new Error('404 error - response: ' + response)),
                200: (response) => resolve(response)
            },
            error: (jqXHR, status, error) => {
                reject(new Error(error));
            }
        });
    });
};

// Implementation with jQuery
export const post = function(url) {
    const token = getCookie('csrftoken');
    // return new pending promise
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            headers: { 'X-CSRFToken': token },
            statusCode: {
                404: (response) => reject(new Error('404 error - response: ' + response)),
                200: (response) => resolve(response)
            },
            error: (jqXHR, status, error) => {
                reject(new Error('Failed to POST the thing - status ' + status));
            }
        });
    });
};

// Get a cookie. Used to obtain CSRF token.
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
