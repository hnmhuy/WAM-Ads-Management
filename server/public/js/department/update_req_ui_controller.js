let canvasEl = undefined
let canvasController = undefined;
let currData = undefined;

document.addEventListener("DOMContentLoaded", () => {
    canvasEl = document.getElementById("update_detail");
    canvasController = new bootstrap.Offcanvas(canvasEl);
})

function showLoading() {
    canvasEl.querySelector(".loading-overlay").classList.remove("collapse");    
}

function hideLoading() {
    canvasEl.querySelector(".loading-overlay").classList.add("collapse");
}

function updateCommonTable(data) {
    let moreBtn = document.getElementById("more-location-info");
    moreBtn.classList.add("collapse");
    let table = canvasEl.querySelector(".req-update-common-info");
    let rows = table.querySelectorAll("tr td:last-child");  
    rows[0].innerHTML = data.address;
    rows[1].innerHTML = data.officer.last_name + " " + data.officer.first_name;
    rows[2].innerHTML = new Date(data.createdAt).toLocaleDateString('vi-VN');
    rows[3].innerHTML = data.type === "ad_place" ? "Điểm đặt" : data.type === "ad_content" ? "Bảng quảng cáo" : "Không xác định";
    // if (data.type === "ad_place") {
    //     moreBtn.classList.add("collapse");
    // } else if (data.type === "ad_content") {
    //     moreBtn.classList.remove("collapse");
    // }
}

function generateCompareRow(before, after, title) {
    let row = document.createElement("tr");
    row.innerHTML = `<th>${title}</th><td></td>`
    if (before === after) {
        let div = document.createElement("div");
        div.className = "ru-table-cell";
        div.innerHTML = `
            <div title="Thông tin hiện tại">
                <span>${before}</span>
            </div>
        `
        row.querySelector("td").appendChild(div);
    } else {
        let div = document.createElement("div");
        div.className = "ru-table-cell ru-table-cell-changing";
        div.innerHTML = `
            <div title="Thông tin hiện tại">
                <span class="badge text-bg-primary">Hiện tại</span> <span>${before}</span>
            </div>
            <div title="Thông tin cập nhật">
                <span class="badge text-bg-success">Sẽ cập nhật</span> <span>${after}</span>
            </div>
        `
        row.querySelector("td").appendChild(div);
    }
    return row;
}

function generateCompareRowAdPlace(data) {
    let table = document.querySelector(".req-update-detail-info table tbody");
    table.innerHTML = "";
    table.appendChild(generateCompareRow(data.before.capacity, data.after.capacity, "Sức chứa"));
    table.appendChild(generateCompareRow(data.before.locationType, data.after.locationType, "Loại vị trí"));
    table.appendChild(generateCompareRow(data.before.purposeType, data.after.purposeType, "Mục đích"));
    let beforeStatus = data.before.status ? "Đã quy hoạch" : "Chưa quy hoạch";
    let afterStatus = data.after.status ? "Đã quy hoạch" : "Chưa quy hoạch";
    table.appendChild(generateCompareRow(beforeStatus, afterStatus, "Trạng thái"));
}

function generateCompareRowAdContent(data) {
    let table = document.querySelector(".req-update-detail-info table tbody");
    table.innerHTML = "";
    table.appendChild(generateCompareRow(data.before.height, data.after.height, "Chiều cao"));
    table.appendChild(generateCompareRow(data.before.width, data.after.width, "Chiều rộng"));
    table.appendChild(generateCompareRow(data.before.start, data.after.start, "Ngày bắt đầu"));
    table.appendChild(generateCompareRow(data.before.end, data.after.end, "Ngày kết thúc"));
}

function updateRequestContent(data) {
    let detailContainer = canvasEl.querySelector(".req-update-detail-info");
    let reason = detailContainer.querySelector(".ru-reason");
    reason.innerHTML = data.reason ? data.reason : "Không có";
    if (data.type === "ad_place") {
        generateCompareRowAdPlace(data);
    } else if (data.type === "ad_content") {
        generateCompareRowAdContent(data);
    }
}

function updateCanvas(data) {
    if (data.status != 'sent') {
        // Disable accept and reject button
        canvasEl.querySelectorAll(".req-update-btns button").forEach(btn => {
            btn.disabled = true;
        })
    } else {
        canvasEl.querySelectorAll(".req-update-btns button").forEach(btn => {
            btn.disabled = false;
        })
    }
    updateCommonTable(data);
    updateRequestContent(data);
}

async function openSidePeek(element) {
    showLoading();
    let reqId = element.getAttribute("data-id");
    try {
        let response = await fetch(`/api/update_request/getUpdateRequest?updateRequestId=${reqId}`);
        let req = await response.json();
        currData = req.request;
        updateCanvas(currData);
        hideLoading();
    } catch (err) {
        console.log(err);
        hideLoading();
    }
}

async function rejectUpdate(element) {
    try {
        element.disavled = true;
        element.querySelector(".spinner-border").classList.remove("collapse");
        let res = await fetch("/api/update_request/rejectUpdateRequest", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currData)
        })
        let data = await res.json();
        if (data.success) {
            displayNotification("Từ chối yêu cầu cập nhật thành công", "success");
            canvasController.hide();
            window.location.reload();
        } else {
            displayNotification("Có lỗi xảy ra khi từ chối yêu cầu cập nhật! " + data.message , "error");    
        }
        element.disavled = false;
        element.querySelector(".spinner-border").classList.add("collapse");
    } catch (err) {
        console.log(err);
        element.disavled = false;
        element.querySelector(".spinner-border").classList.add("collapse");
        displayNotification("Có lỗi xảy ra khi từ chối yêu cầu cập nhật!" + data.message, "error");    
    }
}

async function acceptUpdate(element) { 
    try {
        element.disavled = true;
        element.querySelector(".spinner-border").classList.remove("collapse");
        let res = await fetch("/api/update_request/acceptUpdateRequest", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currData)
        })
        let data = await res.json();
        if (data.success) {
            displayNotification("Chấp nhận yêu cầu cập nhật thành công", "success");
            canvasController.hide();
            window.location.reload();
        } else {
            displayNotification("Có lỗi xảy ra khi chấp nhận yêu cầu cập nhật! " + data.message , "error");    
        }
        element.disavled = false;
        element.querySelector(".spinner-border").classList.add("collapse");
    } catch (err) {
        console.log(err);
        element.disavled = false;
        element.querySelector(".spinner-border").classList.add("collapse");
        displayNotification("Có lỗi xảy ra khi chấp nhận yêu cầu cập nhật!" + err, "error");
    }
 }