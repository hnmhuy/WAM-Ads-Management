
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
async function showAdDetail(e) {
    let id = e.getAttribute("detail-id").split("_")[1];

    const adDetail = document.querySelector(".ad-detail");
    const carousel = adDetail.querySelector(".carousel-swipe")
    carousel.innerHTML = `<p class="title">Hình ảnh quảng cáo</p>`
    let data = await fetch(`/api/ad_content/getOne?id=${id}`).then(res => res.json());
    generateAdDetail(adDetail, data.data, carousel)
    const overlay = document.querySelector(".overlay");
    adDetail.classList.remove("hidden");
    adDetail.classList.add("ad-detail-float");
    overlay.classList.remove("hidden");
}

function closeAdDetail() {
    const adDetail = document.querySelector(".ad-detail");
    const overlay = document.querySelector(".overlay");
    adDetail.classList.add("hidden");
    overlay.classList.add("hidden");
}

function generateAdDetail(container, data, carousel) {
    let companyName = container.querySelector("#ad-name");
    let formatAddress = container.querySelector("#detail-format-address");
    let purpose = container.querySelector("#purpose");
    let typeAd = container.querySelector("#type-ad");
    let start = container.querySelector("#start");
    let end = container.querySelector("#end");
    let infoCol2 = container.querySelector(".info-col2")
    let startDate = formatDate(data.start);
    let endDate = formatDate(data.end);
    let locationType = container.querySelector("#type-location");

    let feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("info2");
    feedbackDiv.innerHTML = `
    <p class="title">Phản hồi thông tin</p>
    <button type="button" class="btn btn-primary feedback-button" ad-content-id="${data.id} onclick="openFeedbackForm(this)">
      <i class="bi bi-send-fill"></i> Phản hồi
    </button>
  `
    infoCol2.appendChild(feedbackDiv);

    let imgArr = generateImg(data.image1, data.image2);

    //generate swiper container
    let carouselDiv = document.createElement("div");
    carouselDiv.classList.add("swiper-container")

    if (imgArr.length === 0) {
        carouselDiv.innerHTML = 'Chưa có hình ảnh cho bảng quảng cáo này.'
    }
    else if (imgArr.length === 1) {
        carouselDiv.innerHTML = `
      
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img
          src="/${imgArr[0]}"
          alt="pic"
        />
      </div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    `
    }
    else if (imgArr.length === 2) {
        carouselDiv.innerHTML = `
      
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img
          src="/${imgArr[0]}"
          alt="pic"
        />
      </div>
      <div class="swiper-slide">
        <img
          src="/${imgArr[1]}"
          alt="pic"
        />
      </div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    `
    }

    carousel.appendChild(carouselDiv);
    companyName.textContent = data.company_name;
    formatAddress.textContent = `${data.ad_place.place.address_formated}, ${data.ad_place.place.area.formatedName}`
    purpose.textContent = data.purpose;
    typeAd.textContent = data.category.name;
    start.textContent = startDate;
    end.textContent = endDate;
    locationType.textContent = data.location;

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


let data = undefined;

// Init maps box and filter box
mapboxgl.accessToken = token;

const map = new mapboxgl.Map({
    container: "map",
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
// User location
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
    }), 'bottom-right');

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

map.on('load', async () => {
    console.log("Loading data");
    let response = await fetch("/api/mapData/getData");
    response = await response.json();
    if (response.success) {
        console.log("Data loaded");
        data = response.data;
        addMarkers(data, iconName, map);
    }
    //navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    filterContainerHandler(data, map);
})

document
    .querySelector(".random-container .delete-random")
    .addEventListener("click", () => {
        marker.remove();
        randomContainer.classList.add("hidden");
    });

const adSidePeek = document.querySelector('#sidepeek-ad');
const noAdSidePeek = document.querySelector('#sidepeek-noAd');
const fbDetail = document.querySelector('#feedback-detail');
const randomSidePeek = document.querySelector('#random-sidepeek');

const category = ["ad", "fb"];

function filterContainerHandler(data, map) {
    const adFilterBtn = document.querySelector('#ad-filter');
    const fbFilterBtn = document.querySelector('#fb-filter');

    function applyFilters() {
        const showAd = adFilterBtn.checked;
        const showFb = fbFilterBtn.checked;

        let filteredData = filterDataSet(data, showAd, showFb);

        updateMarkers(filteredData, map);
    }

    adFilterBtn.addEventListener('change', applyFilters);
    fbFilterBtn.addEventListener('change', applyFilters);
}

function closeAllSidePeek() {
    adSidePeek.classList.add('hidden');
    noAdSidePeek.classList.add('hidden');
    fbDetail.classList.add('hidden');
    randomSidePeek.classList.add('hidden');
}

async function openSidePeek(data) {
    console.log("DTA: ", data);
    closeAllSidePeek();
    let category = data.category;
    let status = data.status;
    let isReported = data.isReported;
    let sampleData = JSON.parse(data.detail);


    if (category === 'ad') {
        let sidepeek = status === 'active' ? adSidePeek : noAdSidePeek;
        sidepeek.querySelector('.area-icon .bi-x-circle').onclick = closeAllSidePeek
        sidepeek.className = 'sidepeek-container';
        sidepeek.classList.add(`${isReported ? 'sticky-left' : 'float'}`);
        let adContentContainer = sidepeek.querySelector(".ad-content");
        let locationContent = sidepeek.querySelector(".location-content");
        locationContent.innerHTML =
            `
        <div>
        <p class="title">Số lượng bảng (bảng/vị trí)</p>
        <p class="content-field" id="capacity"></p>
      </div>
      <div>
        <p class="title">Hình thức quảng cáo</p>
        <p class="content-field" id="purpose"></p>
      </div>
      <div>
        <p class="title">Loại vị trí</p>
        <p class="content-field" id="type-location">
        </p>
      </div>
        `
        adContentContainer.innerHTML = "";
        let adId = JSON.parse(data.detail).dataid;
        // console.log("THIS IS DTAA DETAIL:", JSON.parse(data.detail));
        // console.log("THIS IS ID:", adId);
        let dataAdPlace = await fetch(`/api/ad_place/getOne?id=${adId}&includeAdContent=true`).then(res => res.json());
        // console.log("THISS IS DATA PLACE: ", dataAdPlace );
        // let dataAdPlace = await fetch(`/api/ad_place/getOne?id=e295a4ee-5591-4270-9c7f-922b33fb7d72&includeAdContent=true`).then(res => res.json());
        generateSidepeekAd(sidepeek, dataAdPlace, sampleData);

    } else if (category === 'fb') {
        fbDetail.querySelector('.header .bi-chevron-double-left').onclick = closeFeedbackDetail
        fbDetail.className = 'feedbackDetail-container';
        fbDetail.classList.add('float');
        let content = fbDetail.querySelector("#feedback-content");
        let locationImgDiv = fbDetail.querySelector(".location-img");
        locationImgDiv.innerHTML = `<p>Hình ảnh đính kèm</p>`

        // let status = fbDetail.querySelector("#status");
        content.innerHTML = "";
        // status.innerHTML = `<p class="title">Trạng thái phản hồi</p>`
        let fbId = JSON.parse(data.detail).dataid;
        let fbData = await fetch(`/api/feedback/getFeedback?id=${fbId}`).then(res => res.json());
        generateFeedbackSidepeek(fbDetail, fbData, sampleData)

    }


}

function generateSidepeekAd(sidepeek, data) {
    let areaAddress = sidepeek.querySelector("#area");
    let formatAddress = sidepeek.querySelector("#format-address");
    let capacity = sidepeek.querySelector("#capacity");
    let purpose = sidepeek.querySelector("#purpose");
    let typeLocation = sidepeek.querySelector("#type-location");
    let adContentContainer = sidepeek.querySelector(".ad-content");


    areaAddress.textContent = data.data.place.area.formatedName;
    if (sidepeek === adSidePeek) {
        let locationImgDiv = sidepeek.querySelector(".location-img");
        locationImgDiv.innerHTML = "<p>Hình ảnh điểm đặt quảng cáo</p>";
        locationImgDiv.appendChild(generateCarousel(data.data, data.data.image1, data.data.image2));
        let adCard = data.data.adContents;
        if (adCard.length !== 0) {
            adContentContainer.innerHTML = `<h5 id="num-ad">Thông tin bảng quảng cáo (${data.data.adContentCapacity})</h5>`
            adCard.forEach(card => {
                adContentContainer.appendChild(generateAdCard(sidepeek, card));
            })
        }
        else {
            adContentContainer.innerHTML = `
                <h5 id="num-ad">Thông tin bảng quảng cáo (0)</h5>
                <img src="./public/images/no-data.png" alt="not found" />
                <p class="notification">Chưa có dữ liệu!</p>
                <p class="notification">Vui lòng chọn điểm trên bản đồ để xem</p>
                `
        }
    }
    else {
        adContentContainer.innerHTML = `
            <h5 id="num-ad">Thông tin bảng quảng cáo (0)</h5>
            <img src="./public/images/no-data.png" alt="not found" />
            <p class="notification">Chưa có dữ liệu!</p>
            <p class="notification">Vui lòng chọn điểm trên bản đồ để xem</p>
            `
    }

    formatAddress.textContent = `${data.data.place.address_formated}, ${data.data.place.area.formatedName}`;
    capacity.textContent = `${data.data.capacity} bảng`;
    purpose.textContent = data.data.purpose;
    typeLocation.textContent = data.data.location_type;
}

function generateCarousel(data, image1, image2) {
    let imgArr = generateImg(image1, image2);
    data.id = `_${data.id}`

    let carouselDiv = document.createElement("div");
    let indicator = document.createElement("div");
    let carouselInner = document.createElement("div");
    carouselDiv.classList.add("carousel", "slide");
    carouselDiv.setAttribute("id", data.id);
    carouselDiv.setAttribute("data-bs-ride", "carousel");
    indicator.classList.add("carousel-indicators")
    carouselInner.classList.add("carousel-inner");
    carouselInner.setAttribute("id", "imageList");
    carouselInner.setAttribute("role", 'listbox');

    let buttonPrev = document.createElement("button");
    let buttonNext = document.createElement("button");

    buttonPrev.classList.add("carousel-control-prev")
    buttonPrev.setAttribute("type", "button");
    buttonPrev.setAttribute("data-bs-target", `#${data.id}`);
    buttonPrev.setAttribute("data-bs-slide", "prev");
    buttonPrev.innerHTML = `
            <span
            class="carousel-control-prev-icon"
            aria-hidden="true"
        ></span>
        <span class="visually-hidden">Previous</span>
        `

    buttonNext.classList.add("carousel-control-next");
    buttonNext.setAttribute("type", "button");
    buttonNext.setAttribute("data-bs-target", `#${data.id}`);
    buttonNext.setAttribute("data-bs-slide", "next");
    buttonNext.innerHTML = `
                <span
                class="carousel-control-next-icon"
                aria-hidden="true"
            ></span>
            <span class="visually-hidden">Next</span>
        `
    if (imgArr.length === 0) {
        carouselDiv.innerHTML = `
                Chưa có hình ảnh quảng cáo
            `
    }
    else if (imgArr.length === 1) {
        indicator.innerHTML = `
            <div
            data-bs-target="#${data.id}"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="First slide"
            ></div>`
        carouselInner.innerHTML = `
            <div class="carousel-item active">
            <img
            src="/${imgArr[0]}"
            class="w-100 d-block"
            alt="First slide"
            style="width:371px; height:208px"
            />
        </div>
            `
    }
    else if (imgArr.length === 2) {
        indicator.innerHTML =
            `
            <div
            data-bs-target="#${data.id}"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="First slide"
            ></div>
            <div
            data-bs-target="#${data.id}"
            data-bs-slide-to="1"
            aria-label="Second slide"
            ></div>
            `
        carouselInner.innerHTML = `
            <div class="carousel-item active">
            <img
                src="/${imgArr[0]}"
                class="w-100 d-block"
                alt="First slide"
                style="width:371px; height:208px"
            />
            </div>
            <div class="carousel-item">
            <img
                src="/${imgArr[1]}"
                class="w-100 d-block"
                alt="Second slide"
                style="width:371px; height:208px"
            />
            </div>
            `
    }

    carouselDiv.appendChild(indicator);
    carouselDiv.appendChild(carouselInner);
    carouselDiv.appendChild(buttonPrev);
    carouselDiv.appendChild(buttonNext);

    imgArr = [];


    return carouselDiv;
}

function generateAdCard(sidepeek, data) {
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("adcard-container");
    let formatDateEnd = formatDate(data.end);
    let formatDateStart = formatDate(data.start);

    cardContainer.innerHTML = `
                <div class="header">
                <h5 id="ad-name">${data.company_name}</h5>
                <i class="bi bi-exclamation-octagon-fill icon hidden"></i>
            </div>
    
            <div class="size">
                <b>Kích thước</b>
                <p id="ad-size">${data.width}m x ${data.height}m</p>
            </div>
    
            <div class="contrast">
                <p><b>Thời hạn hợp đồng</b></p>
                <div class="date-container">
                <img src="./public/images/Line 7.png" alt="Not found!" />
                <div class="date">
                    <p id="start">${formatDateStart}</p>
                    <p id="end" style="margin: 0">${formatDateEnd}</p>
                </div>
                </div>
            </div>
        `
    cardContainer.appendChild(generateCarousel(data, data.image1, data.image2));

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-container");
    buttonDiv.innerHTML = `
    <button type="button" class="btn btn-primary detail-button" detail-id="${data.id}" onclick="showAdDetail(this)">
        <i class="bi bi-info-circle"></i> Chi tiết
    </button>

    `
    cardContainer.appendChild(buttonDiv);

    return cardContainer;

}

function generateImg(image1, image2) {
    let imgArr = [];
    if (image1)
        imgArr.push(image1);
    if (image2)
        imgArr.push(image2);
    return imgArr;
}

function closeFeedbackDetail() {
    fbDetail.classList.add('hidden');
}

function formatDate(inputDate) {
    const date = new Date(inputDate);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    const formattedDate = `Ngày ${day} tháng ${month} năm ${year}`;
    return formattedDate;
}

function generateFeedbackSidepeek(fbDetail, data, sampleData) {
    let locationImgDiv = fbDetail.querySelector(".location-img");
    let formatAddress = fbDetail.querySelector("#format-address");
    let fbType = fbDetail.querySelector("#feedbackType");
    let time = fbDetail.querySelector("#feedback-time");
    let name = fbDetail.querySelector("#name");
    let email = fbDetail.querySelector("#email");
    let phoneNumber = fbDetail.querySelector("#phone-number");
    let content = fbDetail.querySelector("#feedback-content");
    let status = fbDetail.querySelector(".detail-feedback-status");
    let statusIcon = status.querySelector(".status-icon-shadow");
    let statusIconPoint = status.querySelector(".satus-icon-point");
    let statusText = status.querySelector(".detail-feedback-status-text");

    status.className = `detail-feedback-status ${sampleData.status}-shadow`
    statusIcon.className = `status-icon-shadow animate-flicker ${sampleData.status}-shadow`
    statusIconPoint.className = `satus-icon-point ${sampleData.status}`
    statusText.textContent = sampleData.status_VN;

    locationImgDiv.appendChild(generateCarousel(data, data.image1, data.image2));
    formatAddress.textContent = `${data.place.address_formated}, ${data.place.area.formatedName}`;
    fbType.textContent = sampleData.feedback_type_VN;
    time.textContent = formatDate(data.createdAt, true);
    name.textContent = data.name;
    email.textContent = data.email;
    phoneNumber.textContent = data.phone;
    content.innerHTML =
        `
        ${data.content}
    `


}

