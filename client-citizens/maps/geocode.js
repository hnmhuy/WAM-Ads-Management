import { openSidePeek } from "./mapUIControl.js";

export function reverseGeocode(coordinates, marker, randomContainer, map) {
  marker.remove();
  // const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json`;
  // const params = {
  //   access_token: mapboxgl.accessToken,
  //   language: "vi", // Set language to Vietnamese
  // };

  // // Construct URL with parameters
  // const urlWithParams = `${apiUrl}?${new URLSearchParams(params)}`;
  const urlWithParams = `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${coordinates.lat}&lon=${coordinates.lng}&accept-language=vi-VN&countrycodes=VN`;
   
  fetch(urlWithParams)
    .then((response) => response.json())
    .then((data) => {
      console.log("CLICK: ", data);
      marker.setLngLat(coordinates).addTo(map);
      randomContainer.classList.remove("hidden");

      // console.log("Reverse Geocode Result: ", data.features[0]);
      // console.log("place name: ", data.features[0].place_name);
      let preProcess = preProcessData(data.features[0]);
      buildRandomMarkerContent(
        randomContainer,
        preProcess.detailAddress,
        preProcess.areaAddress,
        preProcess.latLng,
        preProcess.coordinates,
      );

      // return data.features[0];
      // You can do further processing with the entire JSON object here
    })
    .catch((error) => {
      console.error("Reverse Geocode Error: ", error);
    });
}

function preProcessData(data)
{
  let display = data.properties.display_name.split(", ");
  
  let geometry = data.geometry.coordinates;
  let detailAddress;
  let areaAddress = `${display[display.length - 5]}, ${display[display.length - 4]}, ${display[display.length - 3]}`
  if(display.length <= 5)
  {
    detailAddress = `${display[display.length - 5]}, ${display[display.length - 4]}`;
  }
  else
  {
    let displayStr = data.properties.display_name;
    let indexOfWard = displayStr.indexOf(', Phường');
    let result = displayStr.substring(0, indexOfWard);
    detailAddress = `${result}`

  }
  let latLng = `${geometry[0].toFixed(6)} - ${geometry[1].toFixed(6)}`;

  return {
        detailAddress,
        areaAddress,
        latLng,
        coordinates: [`${geometry[0]}`, `${geometry[1]}`]
      };
}


// function preProcessData(data) {
//   let context = data.context;
//   let address = data.properties.address;
//   let latLngArray = data.geometry.coordinates;

//   let wardArray,
//     ward,
//     districtArray,
//     district,
//     city,
//     areaAddress,
//     detailAddress,
//     latLng;

//   if (context.length === 5) {
//     // ward preprocess
//     wardArray = context[0].text_vi.split(" ");
//     if (wardArray[0].toLowerCase() === "ward") {
//       wardArray[0] = "Phường";
//     } else if (wardArray[0].toLowerCase() !== "phường") {
//       wardArray.unshift("Phường");
//     }
//     ward = wardArray.join(" ");

//     //district preprocess

//     districtArray = context[2].text_vi.split(" ");

//     if (districtArray[0].toLowerCase() === "district") {
//       districtArray[0] = "Quận";
//     } else if (districtArray[0].toLowerCase() !== "quận") {
//       districtArray.unshift("Quận");
//     }
//     district = districtArray.join(" ");

//     //city
//     city = context[3].text_vi;

//     // area address
//     areaAddress = `${ward}, ${district}, ${city}`;

//     //detail address
//     detailAddress = address ? address.split(",")[0] : ward;
//   } else {
//     district = context[1].text_vi;
//     city = context[2].text_vi;
//     areaAddress = `${district}, ${city}`;
//     detailAddress = address ? address : district;
//   }
//   latLng = `${latLngArray[1]} - ${latLngArray[0]}`;

//   return {
//     detailAddress,
//     areaAddress,
//     latLng,
//   };
// }

function buildRandomMarkerContent(
  randomContainer,
  detailAddress,
  areaAddress,
  latLng,
  coordinates
) {
  let detailContent = randomContainer.querySelector(".detail-address");
  let areaContent = randomContainer.querySelector(".area");
  let coorordinateContent = randomContainer.querySelector(".lat-long");
  let feedbackBtn = randomContainer.querySelector("button");
  feedbackBtn.setAttribute("ward-name",areaAddress.split(",")[0])
  feedbackBtn.setAttribute("lat-lng", `${coordinates[0]} - ${coordinates[1]}`);
  feedbackBtn.setAttribute("address", detailAddress);

  detailContent.textContent = detailAddress;
  areaContent.textContent = areaAddress;

  coorordinateContent.textContent = latLng;
}
