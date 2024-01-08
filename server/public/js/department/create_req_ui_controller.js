const tableId = "req_create_table";
const url = "/api/create_request/getAmountByAdPlace";
document.addEventListener("DOMContentLoaded", async () => {
    let res = await fetch(url);
    let data = await res.json();
    if(data.success) {
        addRowToCreateReqTable(data.data);
    } else {
        displayNotification(data.message, 'error');
    }
})

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
    let attributes = detail.querySelectorAll(".atribute-data"); 
    attributes[0].innerHTML = `
    <div class="table-status ${status.class}">
        ${status.text}
    </div>
    `
    attributes[1].innerHTML = data.ad_content.company_name;
    attributes[2].innerHTML = data.ad_content.company_email;
    attributes[3].innerHTML = data.ad_content.company_address;
    attributes[4].innerHTML = `${data.ad_content.height}m x ${data.ad_content.width}m`;
    attributes[5].innerHTML = new Date(data.ad_content.start).toLocaleDateString('vi-VN');
    attributes[6].innerHTML = new Date(data.ad_content.end).toLocaleDateString('vi-VN');

    let description = detail.querySelector(".content-detail-description div");
    description.innerHTML = data.ad_content.description;
    let acceptBtn = detail.querySelector("#accept-btn-"+data.ad_content.ad_place_id);
    let rejectBtn = detail.querySelector("#reject-btn-"+data.ad_content.ad_place_id);
    acceptBtn.setAttribute("data-req-id", data.id);
    acceptBtn.setAttribute("data-ad-id", data.ad_id);
    rejectBtn.setAttribute("data-req-id", data.id);
    rejectBtn.setAttribute("data-ad-id", data.ad_id);
}

function reqCreateContentGenerate() {
    let div = document.createElement("div");
    div.classList.add("collapsed-content");
    div.innerHTML = `
    <div class="content-table">
        <div class="table-container">
            <table class="table table-hover" id="collapse-req-id">
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
    <div class="content-detail" id="detail-req-id">
        <div class="content-detail-header">
            <h5>Thông tin chi tiết yêu cầu</h5>
        </div>
        <div class="content-detail-info">
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Trạng thái
                </div>
                <div class="atribute-data">
                    <div class="table-status status-location-pending">
                        Chờ xác nhận
                    </div>
                </div>
            </div>
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Công ty
                </div>
                <div class="atribute-data">
                    Lorem ipsum dolor sit amet.
                </div>
            </div>
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Email Công ty
                </div>
                <div class="atribute-data">
                    Lorem ipsum dolor sit amet.
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Địa chỉ công ty
                </div>
                <div class="atribute-data">
                    Lorem ipsum dolor sit amet.
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Kích thước
                </div>
                <div class="atribute-data">
                    10m x 20m
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Ngày bắt đầu
                </div>
                <div class="atribute-data">
                    11/11/2023
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Ngày kết thúc
                </div>
                <div class="atribute-data">
                    12/12/2023
                </div>
            </div>
        
        </div>
        <div class="content-detail-imgs">
            <div id="req_imgs" class="carousel slide" data-bs-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-bs-target="#req_imgs" data-bs-slide-to="0" class="active" aria-current="true"
                        aria-label="First slide"></li>
                    <li data-bs-target="#req_imgs" data-bs-slide-to="1" aria-label="Second slide"></li>
                    <li data-bs-target="#req_imgs" data-bs-slide-to="2" aria-label="Third slide"></li>
                </ol>
                <div class="carousel-inner" role="listbox">
                    <div class="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            class="w-100 d-block" alt="First slide">
                    </div>
                    <div class="carousel-item">
                        <img src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3De"
                            class="w-100 d-block" alt="Second slide">
                    </div>
                    <div class="carousel-item">
                        <img src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            class="w-100 d-block" alt="Third slide">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#req_imgs" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#req_imgs" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <div class="content-detail-description">
            <div>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In magni nihil, veritatis cupiditate distinctio iure voluptas facilis qui consequatur repellat voluptate. Eius cumque fuga facere velit ipsam fugiat blanditiis eveniet iusto ad corrupti, quidem repellat consectetur quod molestiae fugit dolorem error, soluta beatae doloribus pariatur! Incidunt enim harum at esse rerum aliquid, quisquam iusto obcaecati, velit fuga expedita amet ab necessitatibus similique accusantium. Eius itaque asperiores excepturi doloremque laudantium optio similique voluptas reiciendis. Ab quidem assumenda explicabo nobis esse laudantium, amet provident quaerat, veritatis odit autem adipisci eos voluptates quo vitae tempora enim, dolorem nostrum vero neque! Sequi tempora facere nisi ab. Ab, suscipit? Vitae dolorem debitis cum facere eum dolore maxime, porro reprehenderit architecto natus cupiditate quod dolores fugit ad, libero consectetur atque. Quis fugit, voluptatibus nesciunt, provident molestiae eveniet aliquid nemo impedit et alias ipsum natus, illo cupiditate ducimus? Accusamus, consectetur veniam et hic accusantium sit placeat nisi provident cum explicabo dicta at veritatis, aperiam debitis nemo eligendi! Eius sed laudantium voluptas ad magnam ipsam deleniti dolorum velit voluptate sit maxime mollitia et earum, nobis est qui excepturi debitis fugit molestias adipisci laboriosam ullam voluptatem? Magnam, corrupti provident id sint illo consequuntur veritatis necessitatibus soluta, unde accusantium eum autem magni eius ut quae fugit consequatur. A, praesentium quam, explicabo itaque pariatur placeat deleniti rerum aspernatur commodi ipsum consequuntur, obcaecati fugit maiores? Eveniet molestiae corrupti quo deserunt dignissimos quibusdam excepturi voluptatem culpa nulla, alias sit, ipsam consequatur error ratione numquam ullam reiciendis porro similique omnis. Minus alias quibusdam nam, adipisci quasi unde debitis iusto repellat ullam molestiae dolorum assumenda deleniti accusantium esse quam omnis saepe, ad voluptatem consequuntur. Soluta, nostrum repellat! Omnis repellat quam, deleniti ducimus, sed odit architecto tempora expedita nostrum quas maiores cumque numquam ab facere, sapiente possimus similique excepturi incidunt dolorum consequuntur. At obcaecati officia, cupiditate rem ipsam ex pariatur. Provident, ea eaque cum mollitia esse repudiandae distinctio natus, placeat quos, nobis deleniti! Nisi mollitia iure quas beatae minus deserunt nulla in. Perspiciatis itaque totam exercitationem odit ducimus sequi quidem qui ipsum quibusdam accusamus aperiam sunt, quam, voluptatem architecto quisquam optio ea voluptas, praesentium doloremque magnam quod et. Mollitia ad molestias dignissimos doloremque repudiandae corrupti delectus! Necessitatibus impedit nostrum error eveniet saepe modi aut facere voluptatem explicabo rerum eligendi, odio officiis dolore ullam at omnis pariatur eum deleniti quasi libero expedita vitae blanditiis totam. Totam repellat doloremque libero obcaecati aperiam eligendi, nisi molestias labore ducimus velit qui maiores voluptatem exercitationem blanditiis. Consectetur, corporis accusamus. Ullam, magni. Est deleniti, ullam distinctio possimus, adipisci tempore explicabo quidem corporis aliquid harum maiores id repellat numquam reiciendis assumenda minima aut optio? Expedita nam dolorem reiciendis itaque, fugit maxime ratione voluptatum rem esse reprehenderit facere quia voluptas accusamus odit non sunt necessitatibus aut assumenda blanditiis! Natus, iusto minus error dignissimos blanditiis exercitationem dolores molestiae, modi ea assumenda quas molestias. Id iure consequatur quidem debitis odit! Fugiat suscipit reprehenderit in nesciunt delectus ipsa rem, rerum voluptatibus vero? Ex velit corporis commodi libero ratione enim nobis, nam vitae perspiciatis officia, molestiae, non debitis fuga? Dolor necessitatibus impedit culpa sit, porro qui nostrum suscipit molestiae voluptatem quas dolore magni, similique id harum deserunt omnis libero autem rerum! Quibusdam dicta iusto dolores animi expedita ipsum ab voluptatibus? Aut repudiandae corrupti eum iure deserunt asperiores eius totam numquam dolore temporibus, id beatae, sequi, blanditiis culpa? Voluptates amet facilis corporis architecto doloribus dolorem officiis quidem fugiat consequatur laboriosam repellat unde fugit, ad in, et eius nisi necessitatibus numquam voluptatum ipsam cupiditate eos! Molestiae sint quasi neque unde exercitationem sunt repellendus nemo. Officiis quod aliquid dolores nisi placeat voluptatum blanditiis sunt quo ipsam consequatur culpa dolorum, veritatis qui!
            </div>
        </div>
        <div class="content-detail-btns">
            <button type="button" id="acccept-btn" onclick="acceptRequest(this)">Phê duyệt</button>
            <button type="button" id="reject-btn" onclick="rejectRequest(this)">Từ chối</button>
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
            let content = reqCreateContentGenerate();
            // update table id 
            content.querySelector(".content-table table").id = `collapse-req-${placeId}`;
            content.querySelector(".content-detail").id = `detail-req-${placeId}`;
            content.querySelector("#acccept-btn").id=`accept-btn-${placeId}`;
            content.querySelector("#reject-btn").id=`reject-btn-${placeId}`;

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
