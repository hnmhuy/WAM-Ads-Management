mapboxgl.accessToken = "pk.eyJ1IjoiZGV2LWhubWh1eSIsImEiOiJjbHBwYXY3ZW8weTdvMnBxbm85cnV2ZTFvIn0.6e8fwVmpoLxVSkyBWksYBg";

function initMap(elementId, centerMaker = true) {
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

    if(centerMaker) {
        var marker = new mapboxgl.Marker({
            color: "blue",
        }).setLngLat(map.getCenter()).addTo(map);

        // Add event listener for marker
        marker.on("onclick", () => {
            let coordinates = marker.getLngLat();
        });

        map.on('move', () => {
            marker.setLngLat(map.getCenter());
        })
    }
    map.on('load', () =>{
        map.addSource('polygon', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: []
                }
            }
        })

        map.addLayer({
            'id': 'outline',
            'type': 'line',
            'source': 'polygon',
            'layout': {},
            'paint': {
                'line-color': '#0080ff',
                'line-width': 2
            }
        })
    })

    document.getElementById(elementId).appendChild(generateLngLatDisplay());

    return map;
}

function successCallback(position) {
    console.log(position.coords.longitude, position.coords.latitude)
    mapForCreate.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 17,
        speed: 1.2
    });
}

function addDataLayer(map, geojson, sourceId, layerId, callBackFunction = undefined) {
    map.addSource(sourceId, {
        type: 'geojson',
        data: geojson
    })

    map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
            'circle-radius': 6,
            'circle-color': '#B42222'
        }
    })

    map.on('mouseenter', layerId, (e) => {
        map.getCanvas().style.cursor = 'pointer';
    })

    map.on('mouseleave', layerId, (e) => {
        map.getCanvas().style.cursor = '';
    });

    if(callBackFunction) {
        map.on('click', layerId, callBackFunction);
    } 
}

async function updatePolygonByAddress(map, address) {
    const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=geojson&accept-language=vi-VN&countrycodes=VN&limit=1&addressdetails=1&polygon_geojson=1`;
    try {
        let data = await fetch(url, {
            cors: "no-cors",
        })
        data = await data.json();
        console.log(data);
        map.getSource('polygon').setData({
            type: 'Feature',
            geometry: data.features[0].geometry
        }); 
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


function errorCallback(error) {
    console.log(error);
}

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

function generateLngLatDisplay() {
    let div = document.createElement("div");
    div.innerHTML = `
    <div class="lng-lat-display" style="position: absolute; top: 2px; right: 2px; display: flex; justify-content: space-around; background-color: rgba(255, 255, 255, 0.8); width: 220px; padding: 5px; border-radius: 5px;">
        <div>
            <span style="font-weight: 800; width: 100px;">Kinh độ: </span>
            <span>102.332321</span>
        </div>
        <div>
            <span style="font-weight: 800; width: 100px;">Vĩ độ: </span>
            <span>102.332321</span>
        </div>
    </div>
    `
    return div.children[0];
}

function updateLngLatDisplay(mapId, lng, lat) {
    let display = document.querySelector(`#${mapId} .lng-lat-display`)
    display.children[0].children[1].textContent = lng;
    display.children[1].children[1].textContent = lat;
}

function preProcessGeoJson(geoJson) {
    const res = {};
    if(geoJson) {
        res.type = geoJson.type ? geoJson.type : "Point";
        res.coordinates = geoJson.coordinates;
    }
    return res;
}