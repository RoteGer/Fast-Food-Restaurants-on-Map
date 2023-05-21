let map;
fetch('http://localhost:3000/restaurants')
    .then(response => response.json())
    .then(list  => {
        // Usage:
        const restaurantList = createGeoJSON(list);
        console.log(restaurantList)
        // Pass the retrieved restaurantList to the DisplayMarker function
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                success(position, restaurantList); // Pass the position and restaurantList as parameters to the success function

            });
        }
    })
    .catch(error => {
        console.error('Error retrieving restaurant data:', error);
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
                    coordinates: [restaurant.latitude, restaurant.longitude]
                }
            };
        })
    };
}



function DisplayMarker(restaurantList) {
    console.log(restaurantList)
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

    restaurantList.forEach(function (restaurant) {
        let li = document.createElement('li');
        let div = document.createElement('div');
        div.classList.add('restaurant-item');
        let a = document.createElement('a');
        let p = document.createElement('p');
        a.innerText = restaurant.name;
        a.href = '#';
        a.addEventListener('click', () => {
            flyToStore(restaurant);
        })

        p.innerText = restaurant.address;
        div.appendChild(a);
        div.appendChild(p);
        li.appendChild(div);
        ul.appendChild(li);
    })
}


function flyToStore(restaurant) {
    let lat = restaurant.latitude;
    let lng = restaurant.longitude;

    map.flyTo([lng, lat], 14, {duration: 1});
}
