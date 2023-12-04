import { reverseGeocode } from "./geocode.js";
// import { marker } from "./markers.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGV2LWhubWh1eSIsImEiOiJjbHBwYXY3ZW8weTdvMnBxbm85cnV2ZTFvIn0.6e8fwVmpoLxVSkyBWksYBg";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  center: [106.660172, 10.762622],
  zoom: 10.4,
  pitch: 22,
  language: "vi",
  locale: "vi",
});

const marker = new mapboxgl.Marker({
  color: "blue",
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
// User location
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: false,
  }),
  "bottom-right"
);

let randomContainer = document.querySelector("#random-sidepeek");

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  language: "vi",
  locale: "vi",
  bbox: [106.502, 10.078, 107.081, 10.885],
  marker: false,
});
map.addControl(geocoder);

// Get the Mapbox Geocoding container
var geocoderContainer = document.querySelector(".mapboxgl-ctrl-geocoder");
var headerCitizensDiv = document.querySelector(".search");
headerCitizensDiv.appendChild(geocoderContainer);

map.on("click", (e) => {
  randomContainer.classList.add("hidden");
  marker.remove();
  const clickedLocation = e.lngLat;

  reverseGeocode(clickedLocation, marker, randomContainer, map);
});

geocoder.on("result", (event) => {
  const coordinates = event.result.center;
  const coordinatesObject = {
    lng: coordinates[0],
    lat: coordinates[1],
  };
  randomContainer.classList.add("hidden");
  marker.remove();
  reverseGeocode(coordinatesObject, marker, randomContainer, map);
});

document
  .querySelector(".random-container .delete-random")
  .addEventListener("click", () => {
    marker.remove();
    randomContainer.classList.add("hidden");
  });
