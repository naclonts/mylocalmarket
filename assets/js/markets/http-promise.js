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


// Implementation with XMLHttpRequest
export const getXMLHttpRequest = function(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                resolve(request.response);
            } else if (request.readyState == XMLHttpRequest.DONE &&
                       (request.status < 200 || request.status > 299)) {
                reject(new Error('Failed to load page - status: ' + request.status));
            }
        };
        request.open('GET', url);
        request.send(null);
    })
};



var HttpClient = function() {
    this.get = function(url, callback) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            } else {
                console.log('--------- Error! ---------');
                console.log(request);
            }
        }
        request.open('GET', url, true);
        request.send(null);
    }
};
