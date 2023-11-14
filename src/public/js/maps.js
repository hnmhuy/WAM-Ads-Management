const { Map } = await google.maps.importLibrary("maps");
const { LatLng, LatLngBounds } = await google.maps.importLibrary("core");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
const { PlacesService } = await google.maps.importLibrary("places");
const { MapTypeControlStyle } = await google.maps.importLibrary("maps");

const HCM_Place_id = "ChIJI9kl2-8udTERFHIryt1Uz0s";
const boundStyle = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 3.0,
};

async function fetchConfig() {
    const response = await fetch("public/js/mapConfig.json");
    const config = await response.json();
    return config;
}

function zoomInButton(imgPath, map) {
    const controlButton = document.createElement("button");
    const icon = document.createElement("img");
    controlButton.className = "zoomButton";
    icon.src = imgPath;
    icon.alt = "zoom in";
    controlButton.type = "button";
    controlButton.title = "Zoom in button";
    controlButton.appendChild(icon);
    controlButton.addEventListener("click", () => {
        map.setZoom(map.getZoom() + 0.5);
    });
    return controlButton;
}

function zoomOutButton(imgPath, map) {
    const controlButton = document.createElement("button");
    const icon = document.createElement("img");
    controlButton.className = "zoomButton";
    icon.src = imgPath;
    icon.alt = "zoom out";
    controlButton.type = "button";
    controlButton.title = "Zoom out button";
    controlButton.appendChild(icon);
    controlButton.addEventListener("click", () => {
        map.setZoom(map.getZoom() - 0.5);
    });
    return controlButton;
}

function zoomControl(map) {
    const zoomInBtn = zoomInButton("/public/imgs/plus-lg.svg", map);
    const zoomOutBtn = zoomOutButton("/public/imgs/dash-lg.svg", map);
    const container = document.createElement("div");

    container.className = "zoomContainer";
    container.appendChild(zoomInBtn);
    container.appendChild(zoomOutBtn);

    return container;
}

async function innitMap() {
    const mapConfig = await fetchConfig();
    const center = new LatLng(mapConfig.center[0], mapConfig.center[1]);
    const map = new Map(document.getElementById("map"), {
        center: center,
        zoom: mapConfig.zoom,
        minZoom: mapConfig.zoom,
        maxZoom: mapConfig.zoom + 7,
        mapId: mapConfig.mapid,
        disableDefaultUI: true,
        restriction: {
            latLngBounds: new google.maps.LatLngBounds(
                {
                    lat: mapConfig.restristion1.lat,
                    lng: mapConfig.restristion1.lng,
                },
                {
                    lat: mapConfig.restristion2.lat,
                    lng: mapConfig.restristion2.lng,
                }
            ),
        },
        gestureHandling: mapConfig.gestureHandling,
        tilt: mapConfig.tilt,
    });

    const cityBound = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_1");

    cityBound.style = (params) => {
        if (params.feature.placeId === HCM_Place_id) {
            return boundStyle;
        }
    };
    const zoom = zoomControl(map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoom);
}

innitMap();

//Get map element

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

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.className = "switch";

    container.appendChild(input);
    container.appendChild(label);
    return container;
}

const feedback_filter = createFilterButton("feedback_filter", "Báo cáo");
const ad_filter = createFilterButton("ad_filter", "Bảng QC");

const filter_box = document.createElement("div");
filter_box.className = "filterContainer";
filter_box.appendChild(feedback_filter);
filter_box.appendChild(ad_filter);

mapElement.appendChild(filter_box);
