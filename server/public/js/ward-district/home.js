// Navigation bar
let sidebar = document.querySelector(".sidebar");
let logOutBtn = document.querySelector("#log_out");

logOutBtn.addEventListener("click", () => {
    window.location.href = "/logout";
});

sidebar.addEventListener("mouseenter", () => {
    sidebar.classList.toggle("open");
});

sidebar.addEventListener("mouseleave", () => {
    sidebar.classList.remove("open");
});

let data = undefined

function reverseGeocode(coordinates, marker, randomContainer, map) {
    marker.remove();
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json`;
    const params = {
        access_token: mapboxgl.accessToken,
        language: "vi", // Set language to Vietnamese
    };

    // Construct URL with parameters
    const urlWithParams = `${apiUrl}?${new URLSearchParams(params)}`;

    fetch(urlWithParams)
        .then((response) => response.json())
        .then((data) => {
            marker.setLngLat(coordinates).addTo(map);
            randomContainer.classList.remove("hidden");

            console.log("Reverse Geocode Result: ", data.features[0]);
            console.log("place name: ", data.features[0].place_name);
            let preProcess = preProcessData(data.features[0]);
            buildRandomMarkerContent(
                randomContainer,
                preProcess.detailAddress,
                preProcess.areaAddress,
                preProcess.latLng
            );

            return data.features[0];
            // You can do further processing with the entire JSON object here
        })
        .catch((error) => {
            console.error("Reverse Geocode Error: ", error);
        });
}

function preProcessData(data) {
    let context = data.context;
    let address = data.properties.address;
    let latLngArray = data.geometry.coordinates;

    let wardArray,
        ward,
        districtArray,
        district,
        city,
        areaAddress,
        detailAddress,
        latLng;

    if (context.length === 5) {
        // ward preprocess
        wardArray = context[0].text_vi.split(" ");
        if (wardArray[0].toLowerCase() === "ward") {
            wardArray[0] = "Phường";
        } else if (wardArray[0].toLowerCase() !== "phường") {
            wardArray.unshift("Phường");
        }
        ward = wardArray.join(" ");

        //district preprocess

        districtArray = context[2].text_vi.split(" ");

        if (districtArray[0].toLowerCase() === "district") {
            districtArray[0] = "Quận";
        } else if (districtArray[0].toLowerCase() !== "quận") {
            districtArray.unshift("Quận");
        }
        district = districtArray.join(" ");

        //city
        city = context[3].text_vi;

        // area address
        areaAddress = `${ward}, ${district}, ${city}`;

        //detail address
        detailAddress = address ? address.split(",")[0] : ward;
    } else {
        district = context[1].text_vi;
        city = context[2].text_vi;
        areaAddress = `${district}, ${city}`;
        detailAddress = address ? address : district;
    }
    latLng = `${latLngArray[1]} - ${latLngArray[0]}`;

    return {
        detailAddress,
        areaAddress,
        latLng,
    };
}

function buildRandomMarkerContent(
    randomContainer,
    detailAddress,
    areaAddress,
    latLng
) {
    let detailContent = randomContainer.querySelector(".detail-address");
    let areaContent = randomContainer.querySelector(".area");
    let coorordinateContent = randomContainer.querySelector(".lat-long");

    detailContent.textContent = detailAddress;
    areaContent.textContent = areaAddress;
    coorordinateContent.textContent = latLng;
}

function newAdMarkerElement(data) {
    let status = data.properties.status;
    let feedbackAmount = data.properties.number_feedback;
    let el = document.createElement('div');
    el.id = data.placeid;
    el.className = 'icon-ad';
    let statusClass = feedbackAmount > 0 ? "icon-ad-reported" : status === "active" ? "icon-ad-active" : "icon-ad-inactive";
    el.classList.add(statusClass);
    el.innerText = status === "active" ? "QC" : "";
    return el;
}

function newFBPopup(data) {
    let el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = `
        <div class="detail-feedback">
            <div class=" detail-feedback-status ${data.status}-shadow">
                <div class="detail-feedback-status-icon">
                    <div class="status-icon-shadow animate-flicker ${data.status}-shadow"></div>
                    <div class="satus-icon-point ${data.status}"></div>
                </div>
                <div class="detail-feedback-status-text">${data.status_VN}</div>
            </div>
            <div class="detail-feedback-type">${data.feedback_type_VN}</div>
        </div> `;
    return el;

}

function newAdPopUp(data) {
    let el = document.createElement('div');
    let statusClass = data.number_feedback > 0 ? "reported" : data.status;
    // let popUpClassName = `popupMarker popupMarker-${statusClass}`;
    el.className = `detail-ad detail-ad-${statusClass}`;
    el.innerHTML = `
        <div class="detail-ad-title">${data.purpose}
            <div class="detail-ad-number-report">${data.number_feedback}</div>
        </div>
        <hr>
        <div class="detail-ad-info">
            <p>${data.address}</p>
            <p><b>Phân loại: </b>${data.type_of_ad}</p>
            <div class="detail-ad-status">${data.status_VN}</div>
        </div>
    `
    return el;
}

function newPopup(data, type) {
    let el = type === "ad" ? newAdPopUp(data) : newFBPopup(data);
    return el;
}

function addMarkers(data, iconName, map) {
    loadMarkerIcon(map, iconName);
    // Add the data soruce to the map
    map.addSource('places', {
        type: 'geojson',
        data: data,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    })

    // Add a layer showing the cluster.
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#219ebc',
                100,
                '#f1f075',
                750,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ],
            'circle-stroke-color': [
                'step',
                ['get', 'point_count'],
                '#219ebc',
                100,
                '#f1f075',
                750,
                '#f28cb1'
            ],
            'circle-stroke-width': 2
        }
    });

    // Add a layer showing the cluster.
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-allow-overlap': true
        },
        paint: {
            'text-color': '#fff'
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'places',
        filter: ['!', ['has', 'point_count']],
        layout: {
            'icon-image': ['get', 'icon'],
            'icon-allow-overlap': true,
            'icon-size': 0.8
        }
    });

    // Handle click event on cluster
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('places').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;
                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });


    // Handle hover event on marker 
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'popupMarker',
        maxWidth: '350px',
        offset: 15,
    });

    map.on('mouseenter', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        map.getCanvas().style.cursor = 'pointer';
        // Convert the properties.detail to JSON object
        const detail = JSON.parse(properties.detail);

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Create popup 
        const tempDiv = newPopup(detail, properties.category);

        popup.setLngLat(coordinates)
            .setDOMContent(tempDiv)
            .addTo(map);
    });

    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        map.flyTo({
            center: coordinates,
            zoom: 16.5,
            speed: 1.2
        })
        openSidePeek(properties);
    });

    map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

}

function loadMarkerIcon(map, iconName) {
    iconName.forEach(icon => {
        let iconPath = `./public/images/markers/${icon}.svg`;
        let img = new Image();
        img.src = iconPath;
        img.onload = () => {
            map.addImage(icon, img, { width: 30, height: 30 });
        }
    });
}

function filterDataSet(data, showAd, showFb) {
    let filteredData = data.features;
    console.log(data);
    if (!showAd && !showFb) {
        filteredData = [];
    } else if (!showAd && showFb) {
        filteredData = filteredData.filter(feature => feature.properties.isReported === true);
    } else if (showAd && !showFb) {
        filteredData = filteredData.filter(feature => feature.properties.category === "ad");
        filteredData.forEach(ad => {
            if (ad.properties.isReported) {
                ad.properties.icon = `ad${ad.properties.status === "active" ? "" : "-none"}`;
            }
        })
    } else {
        // Ensure that the reported ad have the default icon
        filteredData.forEach(ad => {
            if (ad.properties.isReported && ad.properties.category === "ad") {
                ad.properties.icon = `adReported${ad.properties.status === "active" ? "" : "-none"}`;
            }
        })
    }

    return {
        type: "FeatureCollection",
        features: filteredData
    }
}

function updateMarkers(data, map) {
    map.getSource('places').setData(data);
}

// Init maps box and filter box
mapboxgl.accessToken =
    "pk.eyJ1IjoiZGV2LWhubWh1eSIsImEiOiJjbHBwYXY3ZW8weTdvMnBxbm85cnV2ZTFvIn0.6e8fwVmpoLxVSkyBWksYBg";
const map = new mapboxgl.Map({
    container: "mapBox",
    style: "mapbox://styles/mapbox/standard",
    center: [106.660172, 10.762622],
    zoom: 10.4,
    pitch: 22,
    language: 'vi',
    locale: 'vi'
});

map.addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Bản đồ được thiết kế bở WAM Team'
}));

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
    }), 'bottom-right');


const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    language: "vi",
    locale: "vi",
    bbox: [106.502, 10.078, 107.081, 10.885],
    marker: false,
});
map.addControl(geocoder);

const marker = new mapboxgl.Marker({
    color: "blue",
});

// Get the Mapbox Geocoding container
var geocoderContainer = document.querySelector(".mapboxgl-ctrl-geocoder");
var headerCitizensDiv = document.querySelector(".search");
headerCitizensDiv.appendChild(geocoderContainer);

map.on("click", (e) => {
    marker.remove();
    closeAllSidePeek();
    const features = map.queryRenderedFeatures(e.point);
    if (features.length > 0) return;
    randomContainer.classList.add("hidden");
    const clickedLocation = e.lngLat;
    reverseGeocode(clickedLocation, marker, randomContainer, map);

});

geocoder.on("result", (event) => {
    const coordinates = event.result.center;
    const coordinatesObject = {
        lng: coordinates[0],
        lat: coordinates[1],
    };

    console.log("coordinates search", coordinates);
    randomContainer.classList.add("hidden");
    marker.remove();

    // Set the search marker position and add it to the map
    // marker.setLngLat(coordinates);
    // marker.addTo(map);
    reverseGeocode(coordinatesObject, marker, randomContainer, map);

    // You can perform additional actions with the search result data if needed
});

// Get user location
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function successCallback(position) {
    console.log(position.coords.longitude, position.coords.latitude)
    map.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 16,
        speed: 1.2
    });
}

function errorCallback(error) {
    console.log(error);
}