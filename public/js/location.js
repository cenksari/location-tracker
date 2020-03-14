$(() => {
    $('body').on('click', '.location-permission', function () {
        setMyLocation();
    });
});

/**
 * Set players location.
 */
setMyLocation = () => {
    getMyLocation().then(location => {
        myLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };

        writeLog('Location successfully claimed. Please sign in with Google.', 'info');

        $('.locationp').addClass('hidden');
        $('.signinp').removeClass('hidden');
    }).catch(error => {
        showLocationError(error);
    });
};

/**
 * Get players location.
 */
getMyLocation = () => {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
            });
        });
    } else {
        writeLog('Geolocation is not supported for this browser.', 'error');
    }
};

/**
 * Show location errors.
 * 
 * @param {object} error - Error object
 */
showLocationError = error => {
    $('.locationp').removeClass('hidden');

    switch(error.code) {
        case error.PERMISSION_DENIED:
            writeLog('User denied the request for Geolocation.', 'error');
            break;
        case error.POSITION_UNAVAILABLE:
            writeLog('Location information is unavailable.', 'error');
            break;
        case error.TIMEOUT:
            writeLog('The request to get user location timed out.', 'error');
            break;
        case error.UNKNOWN_ERROR:
            writeLog('An unknown error occurred.', 'error');
            break;
    }
};
