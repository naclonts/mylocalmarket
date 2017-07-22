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
                reject(new Error('Failed to load the thing - status ' + status));
            }
        });
    });
};
