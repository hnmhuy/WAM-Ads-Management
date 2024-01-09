const tableId = "req_create_table";
const url = "/api/create_request/getAmountByAdPlace";
document.addEventListener("DOMContentLoaded", async () => {
    let res = await fetch(url);
    let data = await res.json();
    let holder = document.querySelector('#create-req-loading');
    if(data.success) {
        holder.classList.add("hide");

        addRowToCreateReqTable(data.data);
    } else {
        displayNotification(data.message, 'error');
    }
})

function generateCarouselItem(url) {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    item.innerHTML = `
        <img src="/${url}" alt="...">
    `;
    return item;
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
// ------Controller for detial content of create request table ------

async function selectACreateRequest(e) {
    let reqId = e.getAttribute("data-req-id");
    let url = `/api/create_request/getOneRequest?id=${reqId}`;
    let res = await fetch(url);
    let data = await res.json();
    if(data.success) {
        updateCreateReqDetail(data.data);
    } else {
        displayNotification(data.message, 'error');
    }
}

function addRowToCreateReqTable(data) {
    let table = document.querySelector('#req_create_table')
    if (data.length === 0) {
        let row = document.createElement("tr");
        row.innerHTML = `
        <div class="table-row" id="create-req-loading">
            <table class="table">
                <tbody>
                    <tr>
                        <td colspan="8">
                            Không có yêu cầu nào
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        `
        table.appendChild(row);
        return;
    }
    data.forEach((item) => {
        table.appendChild(createReqRow(item));
    })
}

function createReqRow(data) {
    const ward = data.place.place.area.name;
    // Substring the formated name to get the district name
    const district = data.place.place.area.formatedName.substring(ward.length + 2);
    const statusClass = data.place.status ? "active" : "pending";
    const statusText = data.place.status ? "Đã quy hoạch" : "Chưa quy hoạch";
    const row = document.createElement("div");
    row.id = `rcr-${data.id}`; // row-create-request-id
    row.className = 'table-row';
    row.innerHTML = `
        <table class="table">
            <tbody>
                <tr>
                    <td scope="row" style="width: 10%;">${district}</td>
                    <td scope="row" style="width: 10%;">${ward}</td>
                    <td scope="row" style="width: 20%;">${data.place.place.address_formated}</td>
                    <td scope="row" style="width: 20%;">${data.place.location_type_name}</td>
                    <td scope="row" style="width: 10%;">${data.amount_req}</td>
                    <td scope="row" style="width: 10%;">${data.place.purpose_name}</td>
                    <td style="width: 10%;">
                        <div class="table-status
                                status-location-${statusClass}">
                            ${statusText}
                        </div>
                    </td>
                <td class="extend-btn" style="text-align: right; width: 10%;">
                    <button 
                        id="collapse-btn" 
                        class="btn collapsed" 
                        type="button" 
                        data-placeId = ${data.id}
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapse-${data.id}" 
                        aria-expanded="false" 
                        aria-controls="collapse-${data.id}" 
                        onclick="handleCopplaseContent(this)">
                        <i class="bi bi-chevron-down"></i>
                    </button>
                </td>
                </tr>
            </tbody>
        </table>
        <div class="collapse" id="collapse-${data.id}" style="width: 100%;" showed="false">
            <div class="collapsed-content loading">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    `
    return row;
}

function generateCreateRequestRow(item) {
    let row = document.createElement("tr");
    row.id = item.id;
    row.innerHTML = `
    <td>${new Date(item.createdAt).toLocaleString('vi-VN')}</td>
    <td>${item.account.last_name} ${item.account.first_name}</td>
    <td style="width: 50px">
        <button data-req-id=${item.id} onclick="selectACreateRequest(this)">
            <i class="bi bi-chevron-bar-right"></i>
        </button>
    </td>
    `

    return row;
}

async function fetchCreateRequest(placID) {
    const url = `/api/create_request/getListOfRequest?placeId=${placID}`;
    let res = await fetch(url);
    let data = await res.json();
    return data;
}

function adRowToReqList(data, placeId) {
    console.log(`#collapse-req-${placeId} tbody`);
    let tbody = document.querySelector(`#collapse-req-${placeId} tbody`);
    tbody.innerHTML = "";
    if (data.length === 0) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="3" style="text-align: center">Không có yêu cầu nào</td>
        `
        tbody.appendChild(row);
        return;
    }
    data.forEach(item => {
        tbody.appendChild(generateCreateRequestRow(item));
    })
}

function processAdStatus(data) {
    let res = {}
    if (data.status === null) {
        res.class = 'status-location-pending';
        res.text = "Chờ xác nhận";
    } else if (data.status ===  true) {
        let today = new Date();
        let startDate = new Date(data.start);
        let endDate = new Date(data.end);
        if (today < startDate) {
            res.class = 'status-ad-accepted';
            res.text = "Chờ quảng cáo";
        } else if (today > endDate) {
            res.class = 'status-ad-expired';
            res.text = "Hết hạn";
        } else {
            res.class = 'status-ad-accepted';
            res.text = "Đang hoạt động";
        }

    } else {
        res.class = 'status-ad-rejected'
        res.text = "Từ chối";
    }
    return res
}

async function acceptRequest(e) {
    let reqId = e.getAttribute("data-req-id");
    let adId = e.getAttribute("data-ad-id");
    let fd = new FormData();
    fd.append('reqId', reqId);
    fd.append('adId', adId);
    fd.append('isApproved', true);
    let res = await fetch('/api/create_request/resolveRequest', {
        method: 'POST',
        body: fd
    });
    let data = await res.json();
    if(data.success) {
        // Remove the row from the table
        let row = document.querySelector(`#${reqId}`);
        row.remove();
        displayNotification(data.message, 'success');
    } else {
        displayNotification(data.message, 'error');
    }
}

async function rejectRequest(e) {
    let reqId = e.getAttribute("data-req-id");
    let adId = e.getAttribute("data-ad-id");
    let fd = new FormData();
    fd.append('reqId', reqId);
    fd.append('adId', adId);
    fd.append('isApproved', false);
    let res = await fetch('/api/create_request/resolveRequest', {
        method: 'POST',

        body: fd
    });
    let data = await res.json();
    if(data.success) {
        displayNotification(data.message, 'success');
    } else {
        displayNotification(data.message, 'error');
    }
}

function updateCreateReqDetail(data) {
    let status = processAdStatus(data.ad_content);
    let detail = document.querySelector(`#detail-req-${data.ad_content.ad_place_id}`);
    let holder = document.querySelector(`#holder-req-${data.ad_content.ad_place_id}`);
    detail.querySelectorAll(".placeholder-glow").forEach(item => { item.classList.add("hide")});
    holder.classList.add("hide");
    detail.classList.remove("hide");

    let attributes = detail.querySelectorAll(".atribute-data"); 
    let statusDiv = detail.querySelector(".table-status");
    statusDiv.classList.remove("hide");
    statusDiv.classList.add(status.class);
    statusDiv.innerHTML = status.text;
    attributes[1].querySelector('.content').innerHTML = data.ad_content.company_name;
    attributes[2].querySelector('.content').innerHTML = data.ad_content.company_email;
    attributes[3].querySelector('.content').innerHTML = data.ad_content.company_address;
    attributes[4].querySelector('.content').innerHTML = `${data.ad_content.height}m x ${data.ad_content.width}m`;
    attributes[5].querySelector('.content').innerHTML = new Date(data.ad_content.start).toLocaleDateString('vi-VN');
    attributes[6].querySelector('.content').innerHTML = new Date(data.ad_content.end).toLocaleDateString('vi-VN');

    let description = detail.querySelector(".content-detail-description div");
    description.innerHTML = data.ad_content.description;
    console.log(data.ad_content)
    let acceptBtn = detail.querySelector("#accept-btn-"+data.ad_content.ad_place_id);
    let rejectBtn = detail.querySelector("#reject-btn-"+data.ad_content.ad_place_id);
    acceptBtn.setAttribute("data-req-id", data.id);
    acceptBtn.setAttribute("data-ad-id", data.ad_id);
    rejectBtn.setAttribute("data-req-id", data.id);
    rejectBtn.setAttribute("data-ad-id", data.ad_id);
    let carousel = detail.querySelector(`#req_imgs-${data.ad_content.ad_place_id}`);
    console.log(carousel);
    updateCarouselInner(data.ad_content, carousel);
    carousel.classList.remove("collapse");
    carousel.parentElement.querySelector(".placeholder-wave").classList.add("collapse");
}

function reqCreateContentGenerate(placeId) {
    let div = document.createElement("div");
    div.classList.add("collapsed-content");
    div.innerHTML = `
    <div class="content-table">
        <div class="table-container">
            <table class="table table-hover" id="collapse-req-${placeId}">
                <thead>
                    <tr>
                        <th scope="col">Thời gian gửi</th>
                        <th scope="col">Người gửi</th>
                        <th scope="col" style="width: 50px"></th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    <div class="content-detail" id="holder-req-${placeId}">
        <div style="height: 100%; width: 100%; text-align: center; line-height: 100%">
            Chon yêu cầu để xem chi tiết
        </div>
    </div>
    <div class="content-detail hide" id="detail-req-${placeId}">
        <div class="content-detail-header">
            <h5>Thông tin chi tiết yêu cầu</h5>
        </div>
        <div class="content-detail-info">
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Trạng thái
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <div class="table-status hide">
                    </div>
                </div>
            </div>
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Công ty
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <span class="content"></span>
                </div>
            </div>
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Email Công ty
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <span class="content"></span>
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Địa chỉ công ty
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <span class="content"></span>
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Kích thước
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <span class="content"></span>
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Ngày bắt đầu
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <span class="content"></span>
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Ngày kết thúc
                </div>
                <div class="atribute-data">
                    <p class="placeholder-glow">
                        <span class="placeholder col-12"></span>
                    </p>
                    <span class="content"></span>
                </div>
            </div>
        
        </div>
        <div class="content-detail-imgs">
            <div class="mb-6 placeholder-wave" id="img-holder-ad-detail" style="height: 100%; width: 100%;">
                <span class="placeholder" style="height: 100%; width: 100%; display: block"></span>
            </div>
            <div id="req_imgs-${placeId}" class="carousel slide hide" data-bs-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-bs-target="#req_imgs-${placeId}" data-bs-slide-to="0" class="active" aria-current="true"
                        aria-label="First slide"></li>
                    <li data-bs-target="#req_imgs-${placeId}" data-bs-slide-to="1" aria-label="Second slide"></li>
                </ol>
                <div class="carousel-inner" role="listbox">
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#req_imgs-${placeId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#req_imgs-${placeId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <div class="content-detail-description">
            <div>
                Lorem ipsum dolor sit amet    
            </div>
        </div>
        <div class="content-detail-btns">
            <button type="button" id="accept-btn-${placeId}" onclick="acceptRequest(this)">Phê duyệt</button>
            <button type="button" id="reject-btn-${placeId}" onclick="rejectRequest(this)">Từ chối</button>
        </div>
    </div>
            `;
    return div;
}

// Common controller functions for tables
async function handleCopplaseContent(e) {
    let placeId = e.getAttribute("data-placeId");
    let parentTable =
        e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    let tableId = parentTable.id;
    let tableRow = e.parentNode.parentNode.parentNode.parentNode.parentNode;
    let collpaseDiv = tableRow.children[1];
    if (tableId === "req_create_table") {
        //Call another function to generate the content
        if (collpaseDiv.getAttribute("showed") === "false") {
            let content = reqCreateContentGenerate(placeId);            
            collpaseDiv.innerHTML = "";
            collpaseDiv.appendChild(content);
            let data = await fetchCreateRequest(placeId);
            if (data.success) {
                adRowToReqList(data.data, placeId);
            } else {
                displayNotification(data.message, 'error');
            }
            collpaseDiv.setAttribute("showed", "true");
            // setTimeout(
            //     (collpaseDiv) => {
            //         collpaseDiv.innerHTML = "";
            //         collpaseDiv.appendChild(content);
            //         collpaseDiv.setAttribute("showed", "true");
            //     },
            //     1000,
            //     collpaseDiv
            // );
        } else {
            collpaseDiv.innerHTML = "";
            collpaseDiv.appendChild(createLoadingHolder());
            collpaseDiv.setAttribute("showed", "false");
        }
    }
}
