# Location tracker
Track your predefined teammates or anyone real time in the application. This app refreshes every 10 seconds, gets your geoposition and writes firebase database. If you or others don't logged in 12 hours (configurable), app removes the person marker from map. You need firebase account and google maps api key before using the application. Change variables.js for configuration.

Features
--------

* Firebase support
* Google authentication
* Google maps api
* Geolocation
* Browser storage
* Internet connection checker

Installation & usage
------------

* clone/download this repo,
* open public/varibles.js your favorite code editor,
* enter firebase credentials and database url to firebaseConfig,
* open map.html your favorite code editor,
* enter google maps api key to {ENTER_YOUR_GOOGLE_MAPS_APIKEY} variable,
* start app from localhost,
* grant permission to geolocation dialog,
* sign in from google account.