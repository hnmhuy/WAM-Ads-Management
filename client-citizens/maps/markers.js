import { openSidePeek } from "./mapUIControl.js";

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

export function newPopup(data, type) {
    let el = type === "ad" ? newAdPopUp(data) : newFBPopup(data);
    return el;
}

export function addMarkers(data, iconName, map) {
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

export function loadMarkerIcon(map, iconName) {
    iconName.forEach(icon => {
        let iconPath = `./public/images/markers/${icon}.svg`;
        let img = new Image();
        img.src = iconPath;
        img.onload = () => {
            map.addImage(icon, img, { width: 30, height: 30 });
        }
    });
}

export function filterDataSet(data, showAd, showFb) {
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

export function updateMarkers(data, map) {
    map.getSource('places').setData(data);
}

