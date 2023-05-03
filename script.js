// Geolocation API
// navigator.geolocation object provides current location of user

if(navigator.geolocation) {
    // Your browser supports Geolocation API
    navigator.geolocation.getCurrentPosition(success, error, {
        maximumAge: 10*60*1000,
        timeout: 1000,
    });

} else {
    // Your browser does not support Geolocation API
    error();
}

function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    // console.log(lat,lng);
    // console.log('https://www.google.co.in/maps/@$(lat),$(lng), 12z');

    let mapOptions = {
        center:[lat,lng],
        zoom:[13]
    }

    // Create a map
    var map = L.map('map', mapOptions);

    // Create a tile layer
    let layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

    // Add layer to map
    layer.addTo(map);
}

function error (error) {
    alert ('We could not get your current location');
}

const watcher = navigator.geolocation.watchPosition(success);

setTimeout(() => {
    navigator.geolocation.clearWatch(watcher)
},15000);
