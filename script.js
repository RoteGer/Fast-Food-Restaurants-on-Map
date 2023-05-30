// class Restaurant {
//     constructor(latlng, name, address, phone) {
//         this.type = "Feature",
//             this.geometry = {
//                 type: "Point",
//                 coordinates: latlng
//             },
//             this.properties = {
//                 name: name,
//                 address: address,
//                 phone: phone,
//             }
//
//     }
// }

let map;
fetch('http://localhost:3000/restaurants')
    .then(response => response.json())
    .then(list => {
        // Usage:
        const restaurantList = createGeoJSON(list);
        // Pass the retrieved restaurantList to the DisplayMarker function
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                success(position, restaurantList); // Pass the position and restaurantList as parameters to the success function

            });
        }
    })
    .catch(error => {
        console.log('Error retrieving restaurant data:', error);
    });

function createGeoJSON(restaurantList) {

    return {
        type: 'FeatureCollection',
        features: restaurantList.map(restaurant => {
            return {
                type: 'Feature',
                properties: {
                    name: restaurant.name,
                    address: restaurant.address,
                    websites: restaurant.websites // Add the website property from your restaurant object
                },
                geometry: {
                    type: 'Point',
                    coordinates: [restaurant.longitude, restaurant.latitude]
                }
            };
        })
    };
}


function DisplayMarker(restaurantList) {
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

function success(position, restaurantList) {
    generateRestaurantList(restaurantList)
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map = L.map('map', {center: [lat, lng], zoom: 1});
    let layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    layer.addTo(map);
    DisplayMarker(restaurantList);

    // event listener
    map.on('click', function (event) {
        let {lat, lng} = event.latlng;
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
    })
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

function generateRestaurantList(restaurantList) {
    let ul = document.querySelector('.restaurant-ul-list');
    let i = 0;
    for (let key in restaurantList) {
        for (let key2 in restaurantList[key]) {
            if (typeof restaurantList[key] !== 'string') {

                let restaurant = restaurantList[key][key2].properties;
                let li = document.createElement('li');
                let div = document.createElement('div');
                div.classList.add('restaurant-item');
                let a = document.createElement('a');
                let p = document.createElement('p');
                a.innerText = restaurant.name;
                a.href = '#';
                a.addEventListener('click', () => {
                    flyToStore(restaurantList[key][key2]);
                })

                p.innerText = restaurant.address;
                div.appendChild(a);
                div.appendChild(p);
                li.appendChild(div);
                ul.appendChild(li);
            }
        }
    }
}


function flyToStore(restaurant) {
    let lat = restaurant.geometry.coordinates[0];
    let lng = restaurant.geometry.coordinates[1];

    map.flyTo([lng, lat], 14, {duration: 1});
}

// When clicking on create restaurant button
document.getElementById('submit-btn').addEventListener('click', function () {
    let lat = document.getElementById('latitude').value;
    let lng = document.getElementById('longitude').value;
    let name = document.getElementById('restaurant-name').value;
    let address = document.getElementById('address').value;

    const restaurantData = {
        name: name,
        address: address,
        lat: lat,
        lng: lng
    };

    // Add new restaurant call
    fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(restaurantData)
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data here
            console.log(data);
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.log(error);
        });
})