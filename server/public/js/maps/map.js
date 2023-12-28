mapboxgl.accessToken = "pk.eyJ1IjoiZGV2LWhubWh1eSIsImEiOiJjbHBwYXY3ZW8weTdvMnBxbm85cnV2ZTFvIn0.6e8fwVmpoLxVSkyBWksYBg";

let map;

document.addEventListener("DOMContentLoaded", () => {
    map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/standard",
        center: [106.660172, 10.762622],
        zoom: 14,
        pitch: 22,
        language: 'vi',
        locale: 'vi'
    });

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    function successCallback(position) {
        console.log(position.coords.longitude, position.coords.latitude)
        map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 17,
            speed: 1.2
        });
    }

    function errorCallback(error) {
        console.log(error);
    }

    // add markers to center of the map
    var marker = new mapboxgl.Marker({
        color: "blue",
    }).setLngLat(map.getCenter()).addTo(map);

    map.on('move', () => {
        marker.setLngLat(map.getCenter());
    })

});

