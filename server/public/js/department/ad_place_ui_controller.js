let detailOffCanvas = undefined;
let currAdPlaceData = undefined;

document.addEventListener("DOMContentLoaded", () => {
    let detailOffCanvasElement = document.getElementById("location_extend");
    detailOffCanvas = new bootstrap.Offcanvas(detailOffCanvasElement);
    fetchAndAddRowAdPlace();
});

function updateAdPlaceRow(data) {
    const row = document.getElementById(data.id);
    const ward = data.place.area.name;
    let district = data.place.area.formatedName.replace(`${ward}, `, "")

    const statusClass = data.status ? "active" : "pending"
    const statusText = data.status ? "Đã quy hoạch" : "Chưa quy hoạch"
    row.innerHTML = `
        <td scope="col">${district}</td>
        <td scope="col">${ward}</td>
        <td scope="col">${data.place.address_formated}</td>
        <td scope="col">${data.location_type}</td>
        <td scope="col">${data.capacity}</td>
        <td>
            <div class="table-status status-location-${statusClass}">
                ${statusText}
            </div>
        </td>
        <td style="width: 60px" id="r001">
            <button
                title="Xem chi tiết"
                class="btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#location_extend"
                aria-controls="location_extend"
                data-location-id="${data.id}"
                onclick = "showLocationDetail('${data.id}')"
            ><i class="bi bi-three-dots"></i></button>
        </td>
    `;
}

function generateAdPlaceRow(data) {
    const row = document.createElement("tr");
    const ward = data.place.area.name;
    let district = data.place.area.formatedName.replace(`${ward}, `, "")

    const statusClass = data.status ? "active" : "pending"
    const statusText = data.status ? "Đã quy hoạch" : "Chưa quy hoạch"
    row.id = data.id;
    row.innerHTML = `
        <td scope="col">${district}</td>
        <td scope="col">${ward}</td>
        <td scope="col">${data.place.address_formated}</td>
        <td scope="col">${data.location_type}</td>
        <td scope="col">${data.capacity}</td>
        <td>
            <div class="table-status status-location-${statusClass}">
                ${statusText}
            </div>
        </td>
        <td style="width: 60px" id="r001">
            <button
                title="Xem chi tiết"
                class="btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#location_extend"
                aria-controls="location_extend"
                data-location-id="${data.id}"
                onclick = "showLocationDetail('${data.id}')"
            ><i class="bi bi-three-dots"></i></button>
        </td>
    `;

    return row;
}

async function fetchAndAddRowAdPlace(page = undefined) {
    const url = `/api/ad_place/get?limit=20&${page ? `page=${page}` : ""}`;
    const table = document.getElementById("ad-location-table").querySelector("tbody");
    let data;
    try {
        data = await fetch(url).then((res) => res.json());  
        table.querySelector(".loading").classList.add("collapse");
        if(data.success) {
            if(data.data.rows.length === 0) {
                table.querySelector(".nodata").classList.remove("collapse");
            }
            data.data.rows.forEach((row) => {
                table.appendChild(generateAdPlaceRow(row));
            })
        } else {
            console.log(data.message);
        }

    } catch (error) {
        console.log(error);
        return;
    }
}

function generateCarouselItem(url) {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    item.innerHTML = `
        <img src="${url}" class="d-block w-100" alt="...">
    `;
    return item;

}

function updateCarousel(data, element) {
    const carouselInner = element.querySelector(".carousel-inner");
    carouselInner.innerHTML = "";
    carouselInner.parentNode.classList.remove("collapse");
    if (data.image1) {
        carouselInner.appendChild(generateCarouselItem(data.image1));
    }
    if (data.image2) {
        carouselInner.appendChild(generateCarouselItem(data.image2));
    }
    element.querySelector("#img-holder-ad-detail").classList.add("collapse");
    if(!data.image1 && !data.image2) {
        element.querySelector("#no-img-ad-detail").classList.remove("collapse");
    } else {
        carouselInner.firstElementChild.classList.add("active");
    }
}

function updateInfoRow(newString, element) {
    element.querySelector(".placeholder-glow").classList.add("collapse");
    element.querySelector("td>span").textContent = newString;  
}

function updateAdInfoOffCanvas(data) {
    const tableInfo = document.getElementById("info-ad-location");
    const rows = tableInfo.querySelectorAll("tr");
    updateInfoRow(`${data.place.address_formated}, ${data.place.area.formatedName}`, rows[0]);
    updateInfoRow(data.capacity, rows[1]);
    updateInfoRow(data.location_type, rows[2]);
    updateInfoRow(`${data.status ? "Đã quy hoạch" : "Chưa quy hoạch"}`, rows[3]);
    updateInfoRow(data.purpose, rows[4]);
    const img = document.querySelector('#ad-place-img');
    updateCarousel(data, img);
}

function showLoadingAdInfoCanvas() {
    let imgDiv = document.querySelector('#ad-place-img');
    let tableInfo = document.getElementById("info-ad-location");
    imgDiv.querySelector("#img-holder-ad-detail").classList.remove("collapse");
    imgDiv.querySelector("#no-img-ad-detail").classList.add("collapse");
    imgDiv.querySelector("#ad-detail-img").classList.add("collapse");
    tableInfo.querySelectorAll(".placeholder-glow").forEach((element) => {
        element.classList.remove("collapse");
    });
}

function showLocationDetail(adPlaceId) {
    const editBtn = document.getElementById("edit-location-btn");
    editBtn.setAttribute("data-location-id", adPlaceId);
    editBtn.disabled = true;
    const url = `/api/ad_place/getOne?id=${adPlaceId}`;
    showLoadingAdInfoCanvas();
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if(data.success) {
                currAdPlaceData = data.data;
                updateAdInfoOffCanvas(data.data);
            } else {
                console.log(data.message);
            }
            editBtn.disabled = false;
        })
        .catch((err) => console.log(err));
}

async function fillEditAdPlaceForm(data, formElement) {
    let street = formElement.querySelector('#street-for-edit')
    const geocodeBtn = street.parentNode.querySelector(".inside-btns button:first-child");
    const clearAddressBtn = street.parentNode.querySelector(".inside-btns button:last-child");
    let district = formElement.querySelector("#district-for-edit");
    let ward = formElement.querySelector("#ward-for-edit");
    let locationType = formElement.querySelector("#location-type-for-edit");
    let adPurpose = formElement.querySelector("#purpose-for-edit");
    await fetchDropDown("/api/category/getCategory?fieldId=T1", locationType, "Chọn loại vị trí", data.locationTypeId);
    await fetchDropDown("/api/category/getCategory?fieldId=T2", adPurpose, "Chọn hình thức quảng cáo", data.purposeId);
    await fetchAndAddOption(district, 'district', 'Chọn quận/ huyện',null, data.place.area.parent_id);
    await fetchAndAddOption(ward, 'ward', 'Chọn phường/ xã', data.place.area.parent_id, data.place.area.id);
    street.value = data.place.address_formated;
    street.disabled = false;
    geocodeBtn.disabled = false;
    clearAddressBtn.disabled = false;
    formElement.querySelector('#ads-amount-for-edit').value = data.capacity;
    formElement.querySelector('#location-status').value = String(data.status);
    let lng = data.place.geometry.coordinates[0];
    let lat = data.place.geometry.coordinates[1];
    mapForUpdate.flyTo({
        center: [lng, lat],
        zoom: 16.5,
        speed: 1.2
    });
}

async function openEditForm() {
    let form = document.getElementById("edit-location-form");
    await fillEditAdPlaceForm(currAdPlaceData, form);
}

async function updateAdPlace(e) {
    let form = document.getElementById("edit-location-form");
    if(!form.checkValidity()) {
        return;
    }
    e.preventDefault();
    let spinner = form.querySelector(".spinner-border");
    spinner.classList.remove("collapse");
    let btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    let formData = new FormData(form);
    formData.append("id", currAdPlaceData.id);
    let coordinate = mapForUpdate.getCenter();
    let geometry = {
        type: "Point",
        coordinates: [coordinate.lng, coordinate.lat]
    }
    formData.append("geometry", JSON.stringify(geometry));
    formData.append('place_id', currAdPlaceData.place.id);
    let url = "/api/ad_place/update";
    fetch(url, {
        method: "POST",
        body: formData
    }).then((res) => res.json()).then(data => {
        if(data.success) {
            clearForm('edit-location-form');
            currAdPlaceData = data.data;
            updateAdInfoOffCanvas(currAdPlaceData);
            updateAdPlaceRow(currAdPlaceData);
            detailLocationCanvas.show();
            displayNotification("Cập nhật vị trí quảng cáo thành công", "success");
        } else {
            displayNotification("Cập nhật vị trí quảng cáo thất bại", "error");
        }
        spinner.classList.add("collapse");
        btn.disabled = false;
    })
}