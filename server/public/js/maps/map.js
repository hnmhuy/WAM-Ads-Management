mapboxgl.accessToken = "pk.eyJ1IjoiZGV2LWhubWh1eSIsImEiOiJjbHBwYXY3ZW8weTdvMnBxbm85cnV2ZTFvIn0.6e8fwVmpoLxVSkyBWksYBg";

let mapForCreate = null;
let mapForUpdate = null;

function initMap(elementId) {
    let map = new mapboxgl.Map({
        container: elementId,
        style: "mapbox://styles/mapbox/standard",
        center: [106.660172, 10.762622],
        zoom: 14,
        pitch: 22,
        language: 'vi',
        locale: 'vi'
    });

    map.addControl(new mapboxgl.AttributionControl({
        customAttribution: 'Bản đồ được thiết kế bở WAM Team'
    }));

    return map;
}

document.addEventListener("DOMContentLoaded", () => {

    // Create map
    mapForCreate = initMap("map-for-create");
    mapForUpdate = initMap("map-for-update");

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    function successCallback(position) {
        console.log(position.coords.longitude, position.coords.latitude)
        mapForCreate.flyTo({
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
    }).setLngLat(mapForCreate.getCenter()).addTo(mapForCreate);

    mapForCreate.on('move', () => {
        marker.setLngLat(mapForCreate.getCenter());
    })

    // mapForCreate.on('moveend', () => {
    //     let coordinates = marker.getLngLat();
    //     // document.getElementById("lat").textContent = `Lat: ${coordinates.lat}`;
    //     // document.getElementById("lng").textContent = `Lng: ${coordinates.lng}`;
    //     revGeocoding(mapForCreate, coordinates.lng, coordinates.lat);
    // })

});

async function revGeocoding(map, lng, lat, fitToBound = false, flyTo = false, zoom = undefined) {
    // Using the openstreetmap api
    const url = `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lng}&accept-language=vi-VN&countrycodes=VN`;
    await fetch(url, {
        cors: "no-cors",
    }).then(res => res.json()).then(data => {
        console.log(data);
        // document.getElementById("address").textContent = data.features[0].properties.display_name;
        if (fitToBound) {
            console.log(data.features[0].bbox);
        }
        if (flyTo && zoom) {
            map.flyTo({
                center: [lng, lat],
                zoom: zoom,
                speed: 1.2
            });
        } else if (flyTo) {
            map.flyTo({
                center: [lng, lat],
                speed: 1.2
            });
        }
        return data;
    })
}

async function geocoding(map, address, fitBounds = false, flyTo = false, zoom = undefined) {
    // Using the openstreetmap api
    address = address + ", Thành phố Hồ Chí Minh"
    const encodeAdress = address.replaceAll(" ", "+");
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeAdress}&format=geojson&accept-language=vi-VN&countrycodes=VN&limit=1&addressdetails=1`;
    try {
        let data = await fetch(url, {
            cors: "no-cors",
        })
        data = await data.json();
        let coordinate = data.features[0].geometry.coordinates;
        let lat = coordinate[1];
        let lng = coordinate[0];
        if (fitBounds) {
            const southWest = new mapboxgl.LngLat(data.features[0].bbox[0], data.features[0].bbox[1]);
            const northEast = new mapboxgl.LngLat(data.features[0].bbox[2], data.features[0].bbox[3]);
            const bounds = new mapboxgl.LngLatBounds(southWest, northEast);
            map.fitBounds(bounds);
        }

        if (flyTo && zoom) {
            map.flyTo({
                center: [lng, lat],
                zoom: zoom,
                speed: 1.2
            });
        } else if (flyTo) {
            map.flyTo({
                center: [lng, lat],
                zoom: 18,
                speed: 1.2
            });
        }
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


function preProcessGeoJson(geoJson) {
    const res = {};
    if(geoJson) {
        res.geometry = geoJson.geometry;
        res.properties = {};
        res.properties.formatedAddress = geoJson.properties.display_name;
        res.properties.address = {}
        res.properties.address.street = geoJson.properties.address.road;
        res.properties.address.ward = geoJson.properties.address.suburb;
        res.properties.address.district = geoJson.properties.address.quarter;
        res.properties.address.city = geoJson.properties.address.city;
        res.properties.address.amenity = geoJson.properties.address.amenity;
        res.properties.name = geoJson.properties.name;
        res.bbox = geoJson.bbox;
    }
    return res;
}