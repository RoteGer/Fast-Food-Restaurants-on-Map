let map;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success)
}

function DisplayMarker() {
    // Icon Option
    let iconOption = {
        iconUrl: 'images/marker.png',
        iconSize: [40, 40]
    }
    let icon = L.icon(iconOption);

    function runForEachFeature(feature, layer) {
        // Implement
        layer.bindPopup(customPopup(feature));
    }

    let restaurantLayer = L.geoJSON(restaurantList, {
        onEachFeature: runForEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: icon});
        }
    });
    restaurantLayer.addTo(map);
}

function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map = L.map('map', {center: [lat, lng], zoom: 1});
    let layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    layer.addTo(map);
    DisplayMarker();
}

function customPopup(restaurant) {
    return `<div>
        <h4>${restaurant.properties.name}</h4>
        <p>${restaurant.properties.address}</p>
        <div>
            <a href="${restaurant.properties.websites}" >Website</a>
        </div>
    </div>`;
}

function generateRestaurantList() {
    let ul = document.querySelector('.restaurant-ul-list');

    restaurantList.forEach(function (restaurant) {
        let li = document.createElement('li');
        let div = document.createElement('div');
        div.classList.add('restaurant-item');
        let a = document.createElement('a');
        let p = document.createElement('p');
        a.innerText = restaurant.properties.name;
        a.href = '#';
        a.addEventListener('click', () => {
            flyToStore(restaurant);
        })

        p.innerText = restaurant.properties.address;
        div.appendChild(a);
        div.appendChild(p);
        li.appendChild(div);
        ul.appendChild(li);
    })
}

generateRestaurantList();

function flyToStore(restaurant) {
    let lat = restaurant.geometry.coordinates[0];
    let lng = restaurant.geometry.coordinates[1];

    map.flyTo([lng, lat], 14, {duration: 1});
}



// DB using class DB
function db_try() {

// Create a new database instance
    const db = new Database();

// Connect to the database
    db.connect();

// Perform database operations
    let res = db.connection.query("SELECT * FROM fast_food_on_map.fast_food_restaurants limit 20")
    console.log(res);
// Disconnect from the database
    db.disconnect();

}

const Database = require('./database.js');

// Create a new database instance
const db = new Database();

// Connect to the database
db.connect();

// Function to execute a query
function executeQuery(query, params, callback) {
    db.connection.query(query, params, (err, results, fields) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, results, fields);
    });
}

const sql = 'SELECT * FROM fast_food_on_map.fast_food_restaurants limit 20';
const params = [];



// Disconnect from the database
db.disconnect();