import { geocode } from "./geocode.js";
import { filterContainerHandler } from "./mapUIControl.js";
import { addMarkers } from "./markers.js";

//Sample data
import { data } from "./sampleData.js";

// Init maps box and filter box
mapboxgl.accessToken = "pk.eyJ1IjoiZGV2LWhubWh1eSIsImEiOiJjbHBwYXY3ZW8weTdvMnBxbm85cnV2ZTFvIn0.6e8fwVmpoLxVSkyBWksYBg";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/standard",
    center: [106.660172, 10.762622],
    zoom: 10.4,
    minZoom: 9,
    pitch: 22,
    language: 'vi',
    locale: 'vi',
});

map.addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Map design by WAM Team'
}));

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
// User location
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
}), 'bottom-right');

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

// Add filter box
const mapElement = document.querySelector(".map-container");

function createFilterButton(id, title_content) {
    const container = document.createElement("div");
    container.className = "switchContainer";

    const title = document.createElement("p");
    title.textContent = title_content;

    container.appendChild(title);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;

    // Set the default value for checkbox (checked)
    input.checked = true;

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.className = "switch";

    container.appendChild(input);
    container.appendChild(label);
    return container;
}

const feedback_filter = createFilterButton("fb-filter", "Báo cáo");
const ad_filter = createFilterButton("ad-filter", "Bảng QC");

const filter_box = document.createElement("div");
filter_box.className = "filterContainer";
filter_box.appendChild(feedback_filter);
filter_box.appendChild(ad_filter);

mapElement.appendChild(filter_box);

map.on('style.load', () => {
    map.setConfigProperty('basemap', 'showTransitLabels', false);
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
})

// Start process in the map.on('load') event
const iconName = ['ad', 'ad-none', 'adReported-none', 'adReported', 'fb-feedback', 'fb-question', 'fb-registry', 'fb-report'];

map.on('load', () => {
    //navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    addMarkers(data, iconName, map);
    filterContainerHandler(data, map);
})
