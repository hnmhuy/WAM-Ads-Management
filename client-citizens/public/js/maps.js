const { Map } = await google.maps.importLibrary("maps");
const { LatLng, LatLngBounds } = await google.maps.importLibrary("core");
const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
const { PlacesService } = await google.maps.importLibrary("places");
const { MapTypeControlStyle } = await google.maps.importLibrary("maps");

const RANDOM_LOCATION = 1;
const AD_LOCATION = 2;
const ad_markers = [];
const random_markers = [];
// Testing data

const data = [
  {
    place_id: "1111",
    type: AD_LOCATION,
    properties: {
      address: "181/37, Âu Dương Lân, Phường 2, Quận 8",
      location: {
        lat: 10.740453,
        lng: 106.6869059,
      },
      status: true, //Đã quy hoạch
      status_text: "Đã quy hoạch",
      purpose: "Cổ động chính trị",
      type_of_ad: "Màn hình led",
      number_feedback: 0,
    },
  },
  {
    place_id: "1111",
    type: AD_LOCATION,
    properties: {
      address: "181/37, Âu Dương Lân, Phường 2, Quận 8",
      location: {
        lat: 10.745289,
        lng: 106.684242,
      },
      status: true, //Đã quy hoạch
      status_text: "Đã quy hoạch",
      purpose: "Cổ động chính trị",
      type_of_ad: "Màn hình led",
      number_feedback: 1,
    },
  },
  {
    place_id: "1111",
    type: AD_LOCATION,
    properties: {
      address: "181/37, Âu Dương Lân, Phường 2, Quận 8",
      location: {
        lat: 10.7461741,
        lng: 106.6835541,
      },
      status: false, //Đã quy hoạch
      status_text: "Chưa quy hoạch",
      purpose: "Cổ động chính trị",
      type_of_ad: "Màn hình led",
      number_feedback: 0,
    },
  },
  {
    place_id: "1111",
    type: AD_LOCATION,
    properties: {
      address: "181/37, Âu Dương Lân, Phường 2, Quận 8",
      location: {
        lat: 10.125773,
        lng: 107.245741,
      },
      status: false, //Đã quy hoạch
      status_text: "Chưa quy hoạch",
      purpose: "Cổ động chính trị",
      type_of_ad: "Màn hình led",
      number_feedback: 1,
    },
  },
  {
    place_id: "1111",
    type: RANDOM_LOCATION,
    properties: {
      feedback_id: "F001",
      feedback_type_EN: "report",
      feedback_type_VN: "Tố giác sai phạm",
      status: "inprocess", //"done" or "sent",
      status_VN: "Đang xử lý",
      location: {
        lat: 10.750008,
        lng: 106.685537,
      },
    },
  },
  {
    place_id: "1111",
    type: RANDOM_LOCATION,
    properties: {
      feedback_id: "F001",
      feedback_type_EN: "feedback",
      feedback_type_VN: "Đóng góp ý kiến",
      status: "done", //"done" or "sent",
      status_VN: "Đã xử lý",
      location: { lat: 10.748959, lng: 106.683081 },
    },
  },
  {
    place_id: "1111",
    type: RANDOM_LOCATION,
    properties: {
      feedback_id: "F001",
      feedback_type_EN: "registry",
      feedback_type_VN: "Đăng ký nội dung",
      status: "sent", //"done" or "sent",
      status_VN: "Đã gửi",
      location: { lat: 10.744827, lng: 106.675366 },
    },
  },
  {
    place_id: "1111",
    type: RANDOM_LOCATION,
    properties: {
      feedback_id: "F001",
      feedback_type_EN: "question",
      feedback_type_VN: "Giải đáp thắc mắc",
      status: "inprocess", //"done" or "sent",
      status_VN: "Đang xử lý",
      location: { lat: 10.744177, lng: 106.678205 },
    },
  },
];

//////

const HCM_Place_id = "ChIJI9kl2-8udTERFHIryt1Uz0s";
const boundStyle = {
  strokeColor: "#810FCB",
  strokeOpacity: 1.0,
  strokeWeight: 3.0,
};

async function fetchConfig() {
  const response = await fetch("./public/js/mapConfig.json");
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
  const zoomInBtn = zoomInButton("./public/images/plus-lg.svg", map);
  const zoomOutBtn = zoomOutButton("./public/images/dash-lg.svg", map);
  const container = document.createElement("div");

  container.className = "zoomContainer";
  container.appendChild(zoomInBtn);
  container.appendChild(zoomOutBtn);

  return container;
}

function buildMarkerContent(item) {
  if (item.type === AD_LOCATION) {
    const properties = item.properties;
    const container = document.createElement("div");
    container.className = "marker";
    container.innerHTML = `
            <div class="detail-ad hidden">
                <div class="detail-ad-title">${properties.purpose}
                    <div class="detail-ad-number-report">${properties.number_feedback
      }</div>
                </div>
                <hr>
                <div class="detail-ad-info">
                    <p>${properties.address}</p>
                    <p><b>Phân loại: </b> ${properties.type_of_ad}</p>
                    <div class="detail-ad-status">${properties.status_text
      }</div>
                </div>
            </div>
            <div class="icon-ad">${properties.status ? "QC" : ""}</div>
        `;

    if (!properties.status) {
      container.querySelector(".detail-ad-status").style.backgroundColor =
        "#fff3f0";
      container.querySelector(".detail-ad-status").style.color = "#feaf9d";
      container.querySelector(".detail-ad").style.borderColor = "#feaf9d";
      container.querySelector(".icon-ad").style.backgroundColor = "#feaf9d";
    } else {
      container.querySelector(".detail-ad-status").style.backgroundColor =
        "#f5f3ff";
      container.querySelector(".detail-ad-status").style.color = "#262058";
      container.querySelector(".detail-ad").style.borderColor = "#4f3ed7";
      container.querySelector(".icon-ad").style.backgroundColor = "#787ae8";
    }

    if (properties.number_feedback === 0) {
      container
        .querySelector(".detail-ad-number-report")
        .classList.add("hidden");
    } else {
      container.querySelector(".icon-ad").style.backgroundColor = "#fa0707";
      container.querySelector(".detail-ad-status").style.backgroundColor =
        "#fff3f0";
      container.querySelector(".detail-ad-status").style.color = "#fa0707";
      container.querySelector(".detail-ad").style.borderColor = "#fa0707";
    }

    container.querySelector(".icon-ad").addEventListener("mouseover", () => {
      container.querySelector(".detail-ad").classList.remove("hidden");
      container.parentNode.parentNode.style.zIndex = 100000000;
    });

    container.querySelector(".icon-ad").addEventListener("mouseout", () => {
      container.querySelector(".detail-ad").classList.add("hidden");
      container.parentNode.parentNode.style.zIndex = null;
    });

    return container;
  } else if (item.type === RANDOM_LOCATION) {
    const container = document.createElement("div");
    const properties = item.properties;
    container.className = "marker";
    container.style.flexDirection = "row";
    container.style.alignContent = "center";
    container.innerHTML = `
            <div class="icon-feedback">
                <img src="./public/images/${properties.feedback_type_EN}.svg" alt="${properties.feedback_type_EN} icon"/>
            </div>
            <div class="detail-feedback hidden">
                <div class="detail-feedback-status ${properties.status}-shadow">
                    <div class="detail-feedback-status-icon">
                        <div class="status-icon-shadow animate-flicker ${properties.status}-shadow"></div>
                        <div class="satus-icon-point ${properties.status}"></div>
                    </div>
                    <div class="detail-feedback-status-text">${properties.status_VN}</div>
                </div>
                <div class="detail-feedback-type">${properties.feedback_type_VN}</div>
            </div>
        `;

    container.addEventListener("mouseover", () => {
      container.querySelector(".icon-feedback").classList.toggle("hidden");
      container.querySelector(".detail-feedback").classList.toggle("hidden");
      container.querySelector(".detail-feedback").style.transform =
        "translate(calc(50% - 20px) , 0%)";
      container.parentNode.parentNode.style.zIndex = 100000000;
    });

    container.addEventListener("mouseout", () => {
      container.querySelector(".icon-feedback").classList.toggle("hidden");
      container.querySelector(".detail-feedback").classList.toggle("hidden");
      container.querySelector(".detail-feedback").style.transform =
        "translate(calc(-50% + 20px), 0%)";
      container.parentNode.parentNode.style.zIndex = null;
    });

    return container;
  }
}

let randomMarker;
let geocoder;
let randomContainer = document.querySelector("#random-sidepeek");

async function innitMap() {
  const mapConfig = await fetchConfig();
  const center = new LatLng(mapConfig.center[0], mapConfig.center[1]);
  const map = new Map(document.getElementById("map"), {
    center: center,
    zoom: mapConfig.zoom,
    minZoom: mapConfig.zoom,
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
  let markers = addMarker(data, map);
  const markerCluster = new markerClusterer.MarkerClusterer({ markers, map });

  //RANDOM MAKER
  geocoder = new google.maps.Geocoder();
  randomMarker = new google.maps.Marker({});
  map.addListener("click", (e) => {
    geocode({ location: e.latLng }, map);
  });
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

function addMarker(data, map) {
  const allMarkers = [];
  for (const item of data) {
    const marker = new AdvancedMarkerElement({
      map,
      content: buildMarkerContent(item),
      position: item.properties.location,
    });
    marker.addEventListener("gmp-click", () => {
      clear();
      let id;
      let positionClass;
      if (item.type == AD_LOCATION) {
        id = item.properties.status ? "#sidepeek-ad " : "#sidepeek-noAd";
        positionClass =
          item.properties.number_feedback == 0 ? "float" : "sticky-left";
      } else {
        id = "#feedback-detail";
        positionClass = "float";
      }

      document.querySelector("#sidepeek-ad").classList.add("hidden");
      document.querySelector("#sidepeek-noAd").classList.add("hidden");
      document.querySelector("#feedback-detail").classList.add("hidden");
      document.querySelector(id).classList.remove("float");
      document.querySelector(id).classList.remove("sticky-left");
      document
        .querySelector("#feedback-detail")
        .classList.remove("feedbackDetail-float");
      document.querySelector(".show-feedback-button").classList.add("hidden");
      document.querySelector(".feedback-button").classList.remove("hidden");
      console.log(positionClass);
      console.log(id);

      if (positionClass == "sticky-left") {
        console.log(123);
        document
          .querySelector(".show-feedback-button")
          .classList.remove("hidden");
        document.querySelector(".feedback-button").classList.add("hidden");
        document.querySelector(id).classList.remove("hidden");
        document.querySelector(id).classList.add(positionClass);
      }

      document.querySelector(id).classList.remove("hidden");
      document.querySelector(id).classList.add(positionClass);
      console.log(document.querySelector(id));

      map.panTo(marker.position);
    });
    allMarkers.push(marker);
  }
  return allMarkers;
}

function clear() {
  randomMarker.setMap(null);
  randomContainer.classList.add("hidden");
}

function preProcessAddress(result) {
  let addressDetail = {};
  let addressArea = {};
  let components = result.address_components;
  let wordToCheck, isWordInComponents;
  let formattedAddress = result.formatted_address;
  let latLong = JSON.stringify(result.geometry.location, null, 2);
  latLong = JSON.parse(latLong);

  // addressDetail["formatted_address"] = formattedAddress;
  let array = formattedAddress.split(", ");
  if (array.length >= 4) {
    wordToCheck = array[array.length - 4];
    isWordInComponents = components.some((component) => {
      return (
        component.long_name.includes(wordToCheck) &&
        !component.types.includes("sublocality")
      );
    });
    if (!isWordInComponents) {
      addressArea["ward"] = wordToCheck;
    }
  }
  components.forEach((component) => {
    let componentTypes = component.types;

    if (
      componentTypes.includes("street_number") ||
      componentTypes.includes("route") ||
      componentTypes.includes("plus_code")
    ) {
      // Check if the type is street_number or route
      addressDetail[componentTypes[0]] = component.short_name;
    }

    if (
      componentTypes.includes("administrative_area_level_2") ||
      componentTypes.includes("administrative_area_level_1")
    ) {
      // Check if the type is administrative_area_level_2 or administrative_area_level_1
      addressArea[componentTypes[0]] = component.long_name;
    }
  });

  return {
    addressDetail,
    addressArea,
    latLong,
  };
}

function geocode(request, map) {
  document.querySelector("#sidepeek-ad").classList.add("hidden");
  document.querySelector("#sidepeek-noAd").classList.add("hidden");
  document.querySelector("#feedback-detail").classList.add("hidden");
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
      const preProcess = preProcessAddress(results[0]);
      randomContainer.classList.remove("hidden");
      map.panTo(results[0].geometry.location);

      randomMarker = new google.maps.Marker({
        position: results[0].geometry.location,
      });
      randomMarker.setMap(map);
      buildRandomMarkerContent(
        preProcess.addressDetail,
        preProcess.addressArea,
        preProcess.latLong
      );
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function buildRandomMarkerContent(addressDetail, addressArea, latLong) {
  let detailContent = randomContainer.querySelector(".detail-address");
  let areaContent = randomContainer.querySelector(".area");
  let coorordinateContent = randomContainer.querySelector(".lat-long");
  let district = addressArea.administrative_area_level_2;
  let city = addressArea.administrative_area_level_1;
  let streetNumber = addressDetail.street_number
    ? addressDetail.street_number
    : addressDetail.plus_code;

  if (!addressDetail.plus_code && !addressDetail.street_number) {
    streetNumber = "";
  }

  let area = addressArea.ward ? addressArea.ward : district;
  console.log("area:", area);
  let streetRoute = addressDetail.route ? addressDetail.route : area;

  detailContent.textContent = `${streetNumber} ${streetRoute}`;
  if (addressArea.ward) {
    areaContent.textContent = `${addressArea.ward}, ${district}, ${city}`;
  } else {
    areaContent.textContent = `${district}, ${city}`;
  }
  coorordinateContent.textContent = `${latLong.lat} - ${latLong.lng}`;
}
