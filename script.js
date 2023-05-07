let map;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success)

}

function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map = L.map('map', {center: [lat, lng], zoom: 1});
    let layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
    layer.addTo(map);


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