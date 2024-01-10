let popup = document.getElementById("location-popup_")
let img = document.getElementById("form-img_")
let popup_parent = document.getElementById("popup-parent_")
let close_btn = document.getElementById("close-edit-request_")
let originalStyles = {}
let originalImg = {}
popup_parent.addEventListener('click', (event) => {
    if (event.target.id === 'popup-parent_') {
        hidePopup_review();
    }
});

close_btn.addEventListener('click', () => {
    hidePopup_review();
});

function showPopup_review(btn) {
    // document.querySelector('#id').value = btn.dataset.id;    document.querySelector('#id').value = btn.dataset.id;
    console.log(btn.dataset)
    document.getElementById("review_company_name").value = btn.dataset.companyName;
    document.getElementById("review_height").value = btn.dataset.height;
    document.getElementById("review_width").value = btn.dataset.width;
    const inputStart = new Date(btn.dataset.start)
    const formattedStart = inputStart.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const inputEnd = new Date(btn.dataset.end)
    const formattedEnd = inputEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    document.getElementById("review_start").value = formattedStart;
    document.getElementById("review_end").value = formattedEnd;
    document.getElementById("review_type").value = btn.dataset.type;
    document.getElementById("review_ad_place").value = btn.dataset.adPlace;
    document.getElementById("review_description").value = btn.dataset.description;
    document.getElementById("review_email").value = btn.dataset.email;
    document.getElementById("review_location").value = btn.dataset.location;
    document.getElementById("ad-content").value = btn.dataset.id;
    document.getElementById("request-id").value = btn.dataset.requestId;
    if(btn.dataset.status === "accept"){
        document.getElementById("delete-request").style.display = "none";
    }
    if(btn.dataset.img1){
        const originalString  = btn.dataset.img1;
        const converted_string = originalString.replace(/\\/g, "/")
        document.getElementById("image1").value = converted_string;
        const img1Div = document.createElement("div");
        img1Div.classList.add("carousel-item");
        img1Div.classList.add("active");
        img1Div.innerHTML = `<img id="review_img1" src="${converted_string}" class="h-100 w-100" alt="">`
        document.querySelector(".carousel-inner").appendChild(img1Div);
    }
    if(btn.dataset.img2){
        console.log(btn.dataset.img2);
        const originalString  = btn.dataset.img2;
        const converted_string = originalString.replace(/\\/g, "/")
        document.getElementById("image2").value = converted_string;
        const img2Div = document.createElement("div");
        img2Div.classList.add("carousel-item");
        img2Div.innerHTML = `<img id="review_img1" src="${converted_string}" class="h-100 w-100" alt="">`
        document.querySelector(".carousel-inner").appendChild(img2Div);
    }
    // document.getElementById("review_image1").src = btn.dataset.image1 ? "public/";
    // document.getElementById("review_image2").src = btn.dataset.image2;

    document.querySelector('body').style.overflowY = 'hidden';
    originalStyles.visibility = popup.style.visibility || '';
    originalStyles.top = popup.style.top || '';
    originalStyles.left = popup.style.left || '';
    originalStyles.transform = popup.style.transform || '';

    originalImg.marginBottom = img.style.marginBottom || '';
    originalImg.transform = img.style.transform || '';
    img.style.marginBottom = '45%';
    img.style.transform = 'translate(-50%, -50%) scale(1)';
    img.style.visibility = 'visible';

    popup_parent.style.visibility = 'visible';
    popup.style.visibility = 'visible';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
}
function hidePopup_review() {
    document.querySelector('body').style.overflowY = 'auto';
    img.style.marginBottom = originalImg.marginBottom || '';
    img.style.visibility = originalImg.visibility || '';
    img.style.transform = originalImg.transform || '';
    popup_parent.style.visibility = 'hidden';
    popup.style.visibility = originalStyles.visibility || '';
    popup.style.top = originalStyles.top || '';
    popup.style.left = originalStyles.left || '';
    popup.style.transform = originalStyles.transform || '';
}

document
    .querySelectorAll("tbody tr:not(.hide)")
    .forEach((visible_row, i) => {
        visible_row.style.backgroundColor =
            i % 2 == 0 ? "rgba(ff, ff, ff, 1)" : "rgba(79, 62, 215, 0.1)";
    });

table_headings = document.querySelectorAll("thead th");
document.querySelector("#search_functionality").onsubmit = searchTable;

function searchTable(event) {
    let table_rows = document.querySelectorAll("tbody .tr_in_table_in_location");
    const search = document.getElementById("input-search-hehe");
    event.preventDefault();
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();
        row.classList.toggle("hide", table_data.indexOf(search_data) < 0);
    });

    document
        .querySelectorAll("tbody tr:not(.hide)")
        .forEach((visible_row, i) => {
            visible_row.style.backgroundColor =
                i % 2 == 0 ? "transparent" : "rgba(79, 62, 215, 0.1)";
        });
}

async function deleteForm(e) {
    e.preventDefault();
    let form = document.getElementById("delete-form");
    const fd = new FormData(form);
    let res = await fetch('/permission', {
        method: "delete",
        body: fd
    })
    res = await res.json();
    console.log(res);
    if(res.success){
        Toastify({
            text: res.message,
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#0dbc79",
                color: "#000"
            },
            onClick: function(){} // Callback after click
        }).showToast();
        console.log(res.id);
        document.getElementById(`${res.id}`).style.display = "none";
        hidePopup_review();
    } else {
        Toastify({
            text: res.message,
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#FF6969",
                color: "#000"
            },
            onClick: function(){} // Callback after click
        }).showToast();
    }
}

async function getPermission(btn){

    console.log(btn.dataset)
    let res = await fetch(`api/permission/get?id=${btn.dataset.id}&area=${btn.dataset.area}`);
    let data = await res.json();
    const tbody = document.querySelector("tbody")
    if(data.success) {
        data.data.forEach((item)=>{
        let tr = document.createElement("tr");
        tr.id = item.requestId;
        tr.classList.add("tr_in_table_in_location");
        let status;
        if(item.status === "sent"){
            status = `<p class="mx-0 status sent">Đã gửi</p>`
        } else if (item.status === "accepted") {
            status = `<p class="mx-0 status delivered">Phê duyệt</p>`
        } else if ( item.status === "cancelled"){
            status =`<p class="mx-0 status cancelled">Từ chối</p>`
        }
        tr.innerHTML = `
          <td>${btn.dataset.name}</td>
          <td>
            <p class="text-align-center table-cell-type">${item.company_name}</p>
          </td>
          <td>
            <p class="table-cell-type">${item.address_formated}</p>
          </td>
          <td>
            <p class="table-cell-type">${item.name}</p>
          </td>
          <td class="d-flex justify-content-center align-items-center">` + status + `
          </td>
          <td>
            <div class="last-cell">
              <div>
                <i role="button" onclick="showPopup_review(this)" class="bi bi-arrow-up-right-square" style="color: black" data-id ="${item.id}" data-company-name = "${item.company_name}" data-email = "${item.company_email}" data-height = "${item.height}" data-status="${item.status}" data-width="${item.width}" data-location = "${item.company_address}" data-start = "${item.start}" data-end="${item.end}" data-type="${item.name}" data-ad-place="${item.address_formated}" data-description = "${item.description}" data-img1="${item.image1}" data-img2="${item.image2}" data-request-id="${item.request_id}" ></i>
              </div>
            </div>
          </td>`;
        if(tbody.firstElementChild)
            tbody.insertBefore(tr, tbody.firstElementChild);
        else tbody.appendChild(tr);
        document
        .querySelectorAll("tbody tr:not(.hide)")
        .forEach((visible_row, i) => {
            visible_row.style.backgroundColor =
                i % 2 == 0 ? "transparent" : "rgba(79, 62, 215, 0.1)";
        });
        })
    } else {
        console.log(data.message);
    }
}