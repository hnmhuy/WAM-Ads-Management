export function reverseGeocode(coordinates, marker, randomContainer, map) {
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
    console.log(districtArray);

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
