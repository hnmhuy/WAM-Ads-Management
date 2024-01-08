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
        <img src="${url}" alt="...">
    `;
    return item;

}

function updateCarousel(data, element) {
    console.log(element)
    const carouselInner = element.querySelector(".carousel-inner");
    carouselInner.innerHTML = "";
    carouselInner.parentNode.classList.remove("collapse");
    if (data.image1) {
        carouselInner.appendChild(generateCarouselItem(data.image1));
    }
    if (data.image2) {
        carouselInner.appendChild(generateCarouselItem(data.image2));
    }
    if(data.image1 && data.image2) {
        element.querySelector('.carousel-indicators').classList.remove("collapse");
        element.querySelector('.carousel-control-prev').classList.remove("collapse");
        element.querySelector('.carousel-control-next').classList.remove("collapse");
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
    console.log(img);
    updateCarousel(data, img);
}

function showLoadingAdInfoCanvas() {
    let imgDiv = document.querySelector('#ad-place-img');
    let tableInfo = document.getElementById("info-ad-location");
    imgDiv.querySelector("#img-holder-ad-detail").classList.remove("collapse");
    imgDiv.querySelector("#no-img-ad-detail").classList.add("collapse");
    imgDiv.querySelector("#ad-detail-img").classList.add("collapse");
    imgDiv.querySelector(".carousel-indicators").classList.add("collapse");
    imgDiv.querySelector(".carousel-control-prev").classList.add("collapse");
    imgDiv.querySelector(".carousel-control-next").classList.add("collapse");
    tableInfo.querySelectorAll(".placeholder-glow").forEach((element) => {
        element.classList.remove("collapse");
    });
}

async function showLocationDetail(adPlaceId) {
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

    await fetchAndAddAdCard(adPlaceId);
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
    //imgInputController('edit-location-form-upload-img');
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

function updateCarouselInner(data, element) {
    let carouselInner = element.querySelector(".carousel-inner");
    carouselInner.innerHTML = "";
    if(data.image1){
        carouselInner.appendChild(generateCarouselItem(data.image1));
    }
    if(data.image2) {
        carouselInner.appendChild(generateCarouselItem(data.image2));
    }

    if(!data.image1 && !data.image2) {
        carouselInner.appendChild(generateCarouselItem("/public/images/No data-pana.svg"))
    }

    carouselInner.firstElementChild.classList.add("active");
}

function generateCarouselForAdCard(data) {
    let carousel = document.createElement("div");
    carousel.className = "carousel slide view-imgs";
    carousel.setAttribute("data-bs-ride", "carousel");
    carousel.id = `carousel-${data.id}`;
    carousel.innerHTML = `
    <div class="carousel-indicators">
        <button data-bs-target="#ad-detail-card-imgs-c001" data-bs-slide-to="0" class="active"
            aria-current="true" aria-label="First slide"></button>
        <button data-bs-target="#ad-detail-card-imgs-c001" data-bs-slide-to="1"
            aria-label="Second slide"></button>
        <button data-bs-target="#ad-detail-card-imgs-c001" data-bs-slide-to="2"
            aria-label="Third slide"></button>
    </div>
    <div class="carousel-inner" role="listbox">
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#ad-detail-card-imgs-c001"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#ad-detail-card-imgs-c001"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    `
    updateCarouselInner(data, carousel);
    
    return carousel;
}

function formatDate(date) {
    let year = date.getFullYear();   
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if(month < 10) {
        month = `0${month}`;
    }
    if(day < 10) {
        day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
}

function updateAdForm(data) {
    let form = document.getElementById(`eform-${data.id}`);
    let start = new Date(data.start);
    let end = new Date(data.end);
    form.querySelector("#w-" + data.id).value = data.width;
    form.querySelector("#h-" + data.id).value = data.height;
    form.querySelector("#start-" + data.id).value = formatDate(start);
    form.querySelector("#end-" + data.id).value = formatDate(end);
    form.querySelector("#company-" + data.id).value = data.company_name;
    form.querySelector("#res-" + data.id).value = String(data.status);
}

function updateAdCard(data) {
    let card = document.getElementById(`ad-${data.id}`);
    let start = new Date(data.start);
    let end = new Date(data.end);
    card.querySelector(".ad-detail-card-title").textContent = data.company_name;
    card.querySelector(".view-info-attribute:nth-child(1)").innerHTML = `<span>Kích thước</span> ${data.width}m x ${data.height}m`;
    card.querySelector(".view-info-attribute:nth-child(2)").innerHTML = `<span>Bắt đầu</span> ${start.toLocaleDateString('vi-VN')}`;
    card.querySelector(".view-info-attribute:nth-child(3)").innerHTML = `<span>Kết thúc</span> ${end.toLocaleDateString('vi-VN')}`;
    card.querySelector(".view-info-status").textContent = "Đang quảng cáo";
    card.querySelector(".edit-ad-form").classList.add("collapse");
    card.querySelector(".view").classList.remove("collapse");
    updateCarouselInner(data, card.querySelector(".view-imgs"));

}

function generateAdCard(data) {
    let card = document.createElement("div");
    card.className = 'ad-detail-card';
    card.id = `ad-${data.id}`
    let start = new Date(data.start);
    let end = new Date(data.end);
    card.innerHTML = `
    <div class="ad-detail-card-title">${data.company_name}</div>
    <div class="view">
        <div class="view-info">
            <div class="view-info-attribute">
                <span>Kích thước</span> ${data.width}m x ${data.height}m
            </div>
            <div class="view-info-attribute">
                <span>Bắt đầu</span> ${start.toLocaleDateString('vi-VN')}
            </div>
            <div class="view-info-attribute">
                <span>Kết thúc</span> ${end.toLocaleDateString('vi-VN')}
            </div>
            <div class="view-info-status">
                Đang quảng cáo
            </div>
        </div>
        <button class="edit-ad-btn" id="" type="button" title="Chỉnh sửa" onclick="editAd(this)">
            <i class="bi bi-pencil-fill"></i>
        </button>
    </div>
    <div class="edit-ad-form">
        <form class="edit-ad-form" id="eform-${data.id}" enctype="multipart/form-data">
            <div class="imgs-field">
                <div class="upload-field" id="imgField-${data.id}">
                    <label for="iimg-${data.id}" class="drag-drop" ondragover="dragoverHandler(event)" ondragleave="dragleaveHandler(event)" ondrop="dropHandler(event)">
                        <div class="holder">
                            <i class="bi bi-cloud-arrow-up-fill"></i>
                            <h4>Kéo và thả ảnh vào đây</h4> hoặc Click để duyệt file
                        </div>
                    </label>
                    <input type="file" name="imgFile" id="iimg-${data.id}" accept=".png, .jpeg, .gif, .jpg"
                        multiple hidden onchange="inputChangeHandler(event)">
                    <div class="preview" style="display: none;">
                    </div>
                </div>
            </div>
            <div class="info-field">
                <div class="ads-amount">
                    <label for="w-${data.id}">Chiều rộng</label>
                    <input name="width" type="number" id="w-${data.id}" placeholder="0" required value=${data.width}>
                    <p>m</p>
                </div>
                <div class="ads-amount">
                    <label for="h-${data.id}">Chiều dài</label>
                    <input name="height" type="number" id="h-${data.id}" placeholder="0" required value=${data.height}>
                    <p>m</p>
                </div>
                <div class="form-field">
                    <label for="start-${data.id}">Bắt đầu</label>
                    <input name="start" type="date" id="start-${data.id}" placeholder="" required value="${formatDate(start)}">
                </div>
                <div class="form-field">
                    <label for="end-${data.id}">Kết thúc</label>
                    <input name="end" type="date" id="end-${data.id}" placeholder="" required value="${formatDate(end)}">
                </div>
                <div class="form-field">
                    <label for="company-${data.id}">Công ty</label>
                    <input name="company_name" type="text" id="company-${data.id}" placeholder="" required value="${data.company_name}">
                </div>
                <div class="form-field">
                    <label for="res-${data.id}">Yêu cầu</label>
                    <select id="res-${data.id}" name="res" required>
                        <option value="true" selected>Phê duyệt</option>
                        <option value="false">Từ chối</option>
                    </select>
                </div>
                <div class="submit-btn">
                    <button type="button" class="btn btn-secondary"
                        onclick="cancelAdEdit(this)">Hủy</button>
                    <button type="submit" class="btn btn-primary" data-adid="${data.id}" onclick="updateAd(event)">Xác nhận</button>
                </div>
            </div>
        </form>
    </div>
    `;

    let view = card.querySelector(".view");
    view.insertBefore(generateCarouselForAdCard(data), view.firstElementChild);

    return card;
}

async function fetchAndAddAdCard(adPlaceId) {
    let data = await fetch(`/api/ad_content/get?adPlaceId=${adPlaceId}`);
    data = await data.json();
    if(data.success) {
        let adCardContainer = document.getElementById("ad-card-container");
        adCardContainer.innerHTML = "";
        data.data.forEach(ad => {
            adCardContainer.appendChild(generateAdCard(ad));
        })
    }
}

async function updateAd(e) {
    let adId = e.target.getAttribute("data-adid");
    let closeBtn = e.target.parentNode.querySelector("button:first-child");
    const form = document.getElementById(`eform-${adId}`);
    if(!form.checkValidity()) {
        return;
    }
    e.preventDefault();
    const formData = new FormData(form);
    formData.append("id", adId);
    const url = "/api/ad_content/update";
    fetch(url, {
        method: "POST",
        body: formData
    }).then(res => res.json()).then(data => {
        if(data.success) {
            displayNotification("Cập nhật quảng cáo thành công", "success");
        } else {
            displayNotification("Cập nhật quảng cáo thất bại", "error");
            console.error(data.message);
        }
        cancelAdEdit(closeBtn);
    });
}