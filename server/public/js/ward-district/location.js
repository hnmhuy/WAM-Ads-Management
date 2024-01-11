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

let originalStyles = {}
let originalImg = {}
let originalStyles_ads = {}
let originalImg_ads = {}
let originalStyles_create = {}
let originalImg_create = {}


function showPopup() {
  let popup = document.getElementById("location-popup")
  let img = document.getElementById("form-img")
  let close_btn = document.getElementById("close-edit-request")
  let popup_parent = document.getElementById("popup-parent")
  let submit = document.getElementById("submit-request")

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
  originalStyles = {}
}

function hidePopup(resquest_data = "", buttonId = "") {

  let popup = document.getElementById("location-popup")
  let img = document.getElementById("form-img")
  let close_btn = document.getElementById("close-edit-request")
  let popup_parent = document.getElementById("popup-parent")
  let submit = document.getElementById("submit-request")

  img.style.marginBottom = originalImg.marginBottom || '';
  img.style.visibility = originalImg.visibility || '';
  img.style.transform = originalImg.transform || '';
  popup_parent.style.visibility = 'hidden';
  popup.style.visibility = originalStyles.visibility || '';
  popup.style.top = originalStyles.top || '';
  popup.style.left = originalStyles.left || '';
  popup.style.transform = originalStyles.transform || '';
  const show_popup = document.getElementById('showPopUp');
  show_popup.removeEventListener('click', () => {
    showPopup()
    clearImgInputField('upload-img-file')
    createUpdateLocation(resquest_data, buttonId)
  })
}

function showPopupCreate() {
  let popup_create = document.getElementById("location-popup-create")
  let img_create = document.getElementById("form-img-create")
  let close_btn_create = document.getElementById("close-edit-request-create")
  let popup_parent_create = document.getElementById("popup-parent-create")
  let submit_create = document.getElementById("submit-request-create")

  originalStyles_create.visibility = popup_create.style.visibility || '';
  originalStyles_create.top = popup_create.style.top || '';
  originalStyles_create.left = popup_create.style.left || '';
  originalStyles_create.transform = popup_create.style.transform || '';

  originalImg_create.marginBottom = img_create.style.marginBottom || '';
  originalImg_create.transform = img_create.style.transform || '';
  img_create.style.marginBottom = '45%';
  img_create.style.transform = 'translate(-50%, -50%) scale(1)';
  img_create.style.visibility = 'visible';

  popup_parent_create.style.visibility = 'visible';
  popup_create.style.visibility = 'visible';
  popup_create.style.top = '50%';
  popup_create.style.left = '50%';
  popup_create.style.transform = 'translate(-50%, -50%) scale(1)';
  originalStyles_create = {}
}

function hidePopupCreate(resquest_data = "", buttonId = "") {

  let popup_create = document.getElementById("location-popup-create")
  let img_create = document.getElementById("form-img-create")
  let close_btn_create = document.getElementById("close-edit-request-create")
  let popup_parent_create = document.getElementById("popup-parent-create")
  let submit_create = document.getElementById("submit-request-create")

  img_create.style.marginBottom = originalImg_create.marginBottom || '';
  img_create.style.visibility = originalImg_create.visibility || '';
  img_create.style.transform = originalImg_create.transform || '';
  popup_parent_create.style.visibility = 'hidden';
  popup_create.style.visibility = originalStyles_create.visibility || '';
  popup_create.style.top = originalStyles_create.top || '';
  popup_create.style.left = originalStyles_create.left || '';
  popup_create.style.transform = originalStyles_create.transform || '';
  const show_popup = document.getElementById('showPopUpCreate');
  show_popup.removeEventListener('click', () => {
    showPopupCreate()
    clearImgInputField('upload-img-file-create')
    createAdReq()
  })
}


function showPopupAds(popup_ads, img_ads, popup_parent_ads) {
  originalStyles_ads.visibility = popup_ads.style.visibility || '';
  originalStyles_ads.top = popup_ads.style.top || '';
  originalStyles_ads.left = popup_ads.style.left || '';
  originalStyles_ads.transform = popup_ads.style.transform || '';

  originalImg_ads.marginBottom = img_ads.style.marginBottom || '';
  originalImg_ads.transform = img_ads.style.transform || '';
  img_ads.style.marginBottom = '45%';
  img_ads.style.transform = 'translate(-50%, -50%) scale(1)';
  img_ads.style.visibility = 'visible';

  popup_parent_ads.style.visibility = 'visible';
  popup_ads.style.visibility = 'visible';
  popup_ads.style.top = '50%';
  popup_ads.style.left = '50%';
  popup_ads.style.transform = 'translate(-50%, -50%) scale(1)';
}
function hidePopupAds(popup_ads, img_ads, popup_parent_ads) {
  img_ads.style.marginBottom = originalImg_ads.marginBottom || '';
  img_ads.style.visibility = originalImg_ads.visibility || '';
  img_ads.style.transform = originalImg_ads.transform || '';
  popup_parent_ads.style.visibility = 'hidden';
  popup_ads.style.visibility = originalStyles_ads.visibility || '';
  popup_ads.style.top = originalStyles_ads.top || '';
  popup_ads.style.left = originalStyles_ads.left || '';
  popup_ads.style.transform = originalStyles_ads.transform || '';

  document.body.removeChild(popup_parent_ads)
  originalStyles = {}
  originalImg = {}
  originalStyles_ads = {}
  originalImg_ads = {}
  clearImgInputField('upload-img-file-ad')
}
document
  .querySelectorAll("tbody tr:not(.hide)")
  .forEach((visible_row, i) => {
    visible_row.style.backgroundColor =
      i % 2 == 0 ? "rgba(ff, ff, ff, 1)" : "rgba(79, 62, 215, 0.1)";
  });
table_rows = document.querySelectorAll("tbody .tr_in_table_in_location");
table_headings = document.querySelectorAll("thead th");
// search.addEventListener('input', searchTable);
document.querySelector("#search_functionality").onsubmit = searchTable;

function searchTable(event) {
  event.preventDefault();
  const search = document.getElementById("input-search-hehe");
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

function checkStatusDate(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date()
  if (current < start) {
    return "Chờ quảng cáo"
  }
  else if (current >= start && current <= end) {
    return "Đang quảng cáo"
  }
  else {
    return "Hết hạn"
  }
}

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();

  return `${year}-${month}-${day}`;
}

function formatStandardDate(inputDate) {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();

  return `${day}/${month}/${year}`;
}

function updateAdReq(adItem) {
  const height = document.getElementById('ads-h')
  const width = document.getElementById('ad-w')
  const start = document.getElementById('start-date')
  const end = document.getElementById('end-date')
  console.log(adItem)
  height.value = adItem[0].height;
  width.value = adItem[0].width;
  start.value = formatDate(adItem[0].start);
  end.value = formatDate(adItem[0].end);

  let formData = document.querySelector('.edit-ad-form-officer')

  console.log(formData.firstChild.nextSibling);

  formData.addEventListener('submit', (event) => {
    event.preventDefault()
    const form = new FormData(formData.firstChild.nextSibling);
    console.log(form)
    fetch('/location/uploadUpdatePlace', {
      method: 'POST',
      body: form
    })
      .then(response => response.json())
      .then(data => {
        let request_data = {}
        request_data.height = data.others.height;
        request_data.width = data.others.width;
        request_data.start = data.others.start;
        request_data.end = data.others.end;
        request_data.image = []
        data.files.forEach(file => {
          request_data.image.push(file.path)
        })

        request_data = JSON.stringify(request_data)
        let status = false;

        let dataCreate = {
          request_data: request_data,
          status: status,
          ad_place_id: null,
          ad_id: adItem[0].id
        }

        createUpdateRequest(dataCreate)
        if (data.status === 500) {
          Toastify({
            text: "Cập nhật thất bại",
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#FF6969",
              color: "#000"
            },
            onClick: function () { } // Callback after click
          }).showToast();
        }
        else {
          Toastify({
            text: "Cập nhập thành công",
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#C1F2B0",
              color: "#000"
            },
            onClick: function () { } // Callback after click
          }).showToast();
        }
      })
      .catch(error => {
        console.log("Error: ", error)
        Toastify({
          text: "Có lỗi xảy ra",
          duration: 3000,
          close: false,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#FF6969",
            color: "#000"
          },
          onClick: function () { } // Callback after click
        }).showToast();
      });
  })
}


function createAdViewInfo(adsList) {

  const ad_cards = document.querySelector('.ad-detail-info-container')
  while (ad_cards.firstChild) {
    ad_cards.removeChild(ad_cards.firstChild);
  }

  adsList.forEach((ad, index) => {
    const ad_card = document.createElement('div')
    ad_card.classList.add('ad-detail-card')
    let status = checkStatusDate(ad.start, ad.end)

    const html = `<div class="view">
    <div id="${ad.id}" class="carousel slide view-imgs" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button data-bs-target="#${ad.id}" data-bs-slide-to="0" class="active" aria-current="true"
          aria-label="First slide"></button>
        <button data-bs-target="#${ad.id}" data-bs-slide-to="1"
          aria-label="Second slide"></button>
        <button data-bs-target="#${ad.id}" data-bs-slide-to="2" aria-label="Third slide"></button>
      </div>
      <div class="carousel-inner" role="listbox">
        <div class="carousel-item active">
          <img src="${ad.image1 == null ? '' : ad.image1}"
            class="w-100 d-block" alt="First slide">
        </div>
        <div class="carousel-item">
          <img src="${ad.image2 == null ? '' : ad.image2}"
            class="w-100 d-block" alt="Second slide">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${ad.id}"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${ad.id}"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="view-info" id="${ad.id}">
      <div class="view-info-attribute">
        <span>Công ty</span>
        ${ad.company_name}
      </div>
      <div class="view-info-attribute">
        <span>Kích thước</span> ${ad.height}m x ${ad.width}m
      </div>
      <div class="view-info-attribute">
        <span>Bắt đầu</span> ${formatStandardDate(ad.start)}
      </div>
      <div class="view-info-attribute">
        <span>Kết thúc</span> ${formatStandardDate(ad.end)}
      </div>
      <div class="view-info-attribute">
        <span>Trạng thái</span> ${status}
      </div>


      <div class="d-flex justify-content-end w-100 align-item">
              <div class="btn btn-outline-secondary" id="update-ad">
                <i class="bi bi-pencil-square"></i>
              </div>
              
            </div>

      `
    ad_card.innerHTML = html;
    ad_cards.appendChild(ad_card)
    clearImgInputField('upload-img-file')
  })


  let update_ad = document.querySelectorAll('#update-ad')

  update_ad.forEach((item, index) => {

    item.addEventListener('click', () => {

      ad_id = item.parentNode.parentNode.id

      let adItem = adsList.filter((ad) => {
        return ad.id == ad_id
      })

      const form = `<div id="popup-parent-ads">
      <img id="form-img-ads" src="/public/images/form.png" alt="" />
      <div class="popup-ads" id="location-popup-ads">
        <h2 style="margin-top: 60px">Yêu cầu chỉnh sửa</h2>
        <button style="position: fixed; right: 10px; top: 10px" type="button" class="btn-close"
         id="close-edit-request-ads"></button>
        <hr />

        <div class="edit-ad-form-officer">
          <form action="#" class="edit-ad-form-officer">
          <div style="width: 100%; height: 200px">
          <div class="upload-field" id="upload-img-file-ad">
            <label for="imgFile-for-ad" class="drag-drop" ondragover="dragoverHandler(event)"
              ondragleave="dragleaveHandler(event)" ondrop="dropHandler(event)">
              <div class="holder">
                <i class="bi bi-cloud-arrow-up-fill"></i>
                <h4>Kéo và thả ảnh vào đây</h4> hoặc Click để duyệt file
              </div>
            </label>
            <input type="file" name="imgFile" id="imgFile-for-ad" accept=".png, .jpeg, .gif, .jpg"
              multiple hidden onchange="inputChangeHandler(event)">
            <div class="preview" style="display: none;">
            </div>
          </div>
        </div>
            <div class="info-field">
              <div class="ads-amount">
                <label for="ad-w">Chiều rộng</label>
                <input type="number" id="ad-w" placeholder="0" name="width" required value="">
                <p>m</p>
              </div>
              <div class="ads-amount">
                <label for="ads-h">Chiều dài</label>
                <input type="number" name="height" id="ads-h" placeholder="0" value=""required>
                <p>m</p>
              </div>
              <div class="form-field">
                <label for="start-date">Bắt đầu</label>
                <input type="date" id="start-date" name ="start" placeholder="" value="" required>
              </div>
              <div class="form-field">
                <label for="end-date">Kết thúc</label>
                <input type="date" id="end-date" value="" placeholder="" name="end" required>
              </div>
            </div>
            <p style="
                  text-align: left;
                  font-weight: bold;
                  margin-top: 25px;
                ">
              Lý do chỉnh sửa
            </p>
            <textarea style="width: 100%; padding: 12px; border-radius: 12px;" name="reasonUpdate" id="" cols="30"
              rows="5"></textarea>
            <button id="submit-request-ads" style="
                        width: 100%;
                        outline: none;
                        border: 0;
                        padding: 10px;
                        border-radius: 5px;
                        background-color: #262058;
                        color: white;
                        margin-top: 50px;
                      ">
              <h5 style="margin: 0">Gửi yêu cầu</h5>
            </button>
          </form>
        </div>
        
      </div>
    </div>`
      item.parentNode.insertAdjacentHTML('beforeend', form);
      clearImgInputField('upload-img-file')

      let submit_ads = document.querySelector("#submit-request-ads")
      let popup_parent_ads = document.querySelector("#popup-parent-ads")
      let close_btn_ads = document.querySelector("#close-edit-request-ads")
      let popup_ads = document.querySelector("#location-popup-ads")
      let img_ads = document.querySelector("#form-img-ads")

      showPopupAds(popup_ads, img_ads, popup_parent_ads);
      updateAdReq(adItem);
      popup_parent_ads.addEventListener('click', (event) => {
        if (event.target.id === 'popup-parent-ads') {
          hidePopupAds(popup_ads, img_ads, popup_parent_ads);
          clearImgInputField('upload-img-file')
        }
      });
      submit_ads.addEventListener('click', () => {
        hidePopupAds(popup_ads, img_ads, popup_parent_ads);
        clearImgInputField('upload-img-file')
      });

      close_btn_ads.addEventListener('click', () => {
        hidePopupAds(popup_ads, img_ads, popup_parent_ads);
        clearImgInputField('upload-img-file')
      });
    });
  })


}

function createUpdateRequest(data) {
  fetch('/api/update_request/createUpdateRequestAdPlace', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json())
    .then(data => {
      console.log(data)
      console.log("Updated Successfully!")
    }).catch((err) => {
      console.error('Error:', err);
    })
}

let popup = document.getElementById("location-popup")
let img = document.getElementById("form-img")
let close_btn = document.getElementById("close-edit-request")
let popup_parent = document.getElementById("popup-parent")
let submit = document.getElementById("submit-request")

function createUpdateLocation(request_data, ad_place_id) {

  let close_btn = document.getElementById("close-edit-request")
  let popup_parent = document.getElementById("popup-parent")
  let submit = document.getElementById("submit-request")
  close_btn.addEventListener('click', () => {
    hidePopup(request_data, ad_place_id)
    clearImgInputField('upload-img-file')
    return
  });

  submit.addEventListener('click', () => {
    hidePopup(request_data, ad_place_id)
    return
  });
  const ads_amount = document.getElementById('ads-amount')
  ads_amount.placeholder = request_data.capacity
  ads_amount.value = request_data.capacity

  const location_type_selection = document.getElementById('location-type-selection');
  fetch(`/api/category/getCategory?fieldId=T1`)
    .then(res => res.json())
    .then(res => {
      while (location_type_selection.firstChild) {
        location_type_selection.removeChild(location_type_selection.firstChild);
      }
      res.data.forEach(item => {
        var newOption = document.createElement('option')
        newOption.value = item.name;
        newOption.textContent = item.name;
        if (item.id === request_data.type_ad_id) {
          newOption.selected = true;
        }
        location_type_selection.appendChild(newOption)
      })
    })

  const status_selection = document.getElementById('status-selection')
  if (request_data.status) {
    status_selection.options[0].selected = true;
  } else {
    status_selection.options[1].selected = true;
  }

  const purpose_type_selection = document.getElementById('purpose-type-selection');

  fetch(`/api/category/getCategory?fieldId=T2`)
    .then(res => res.json())
    .then(res => {
      while (purpose_type_selection.firstChild) {
        purpose_type_selection.removeChild(purpose_type_selection.firstChild);
      }
      res.data.forEach(item => {
        var newOption = document.createElement('option')
        newOption.value = item.name;
        newOption.textContent = item.name;
        if (item.id === request_data.purpose_id) {
          newOption.selected = true;
        }
        purpose_type_selection.appendChild(newOption)
      })
    })


  let formData = purpose_type_selection.parentElement
  while (formData && formData.tagName !== 'FORM') {
    formData = formData.parentNode
  }
  formData.addEventListener('submit', (event) => {
    event.preventDefault();
    const ad_place_form = new FormData(document.getElementById('updateAdPlaceForm'))
    console.log(ad_place_form)
    fetch('/location/uploadUpdatePlace', {
      method: 'POST',
      body: ad_place_form
    })
      .then(response => response.json())
      .then(data => {
        let request_data = {}
        request_data.capacity = data.others.capacity;
        request_data.locationType = data.others.locationType;
        request_data.purposeType = data.others.purposeType;
        request_data.reasonUpdate = data.others.reasonUpdate;
        request_data.status = data.others.status
        request_data.image = []
        data.files.forEach(file => {
          request_data.image.push(file.path)
        })

        request_data = JSON.stringify(request_data)
        let status = false;

        let dataCreate = {
          request_data: request_data,
          status: status,
          ad_place_id: ad_place_id,
          ad_id: null
        }


        setImgFileForField(formData, 'upload-img-file');
        formData.delete('imgFile');
        createUpdateRequest(dataCreate)
        if (data.status === 500) {
          Toastify({
            text: "Cập nhật thất bại",
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#FF6969",
              color: "#000"
            },
            onClick: function () { } // Callback after click
          }).showToast();
        }
        else {
          Toastify({
            text: "Cập nhập thành công",
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#C1F2B0",
              color: "#000"
            },
            onClick: function () { } // Callback after click
          }).showToast();
        }
      })
      .catch(error => {
        console.log("Error: ", error)
        Toastify({
          text: "Có lỗi xảy ra",
          duration: 3000,
          close: false,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#FF6969",
            color: "#000"
          },
          onClick: function () { } // Callback after click
        }).showToast();
      });
  },)
}

function createAdContentAndRequest(dataCreate) {
  fetch(`/api/ad_content/createAdContent`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataCreate),
  }).then(res => res.json())
    .then(data => {
      let ad_id = data.data.id;
      let req = {
        ad_id: ad_id
      }
      fetch(`/api/ad_content/createRequest`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
    })

}

function createAdReq(ad_place_id) {
  let popup = document.getElementById("location-popup-create")
  let img = document.getElementById("form-img-create")
  let close_btn = document.getElementById("close-edit-request-create")
  let popup_parent = document.getElementById("popup-parent-create")
  let submit = document.getElementById("submit-request-create")

  close_btn.addEventListener('click', () => {
    hidePopupCreate()
    clearImgInputField('upload-img-file')
    return
  });

  submit.addEventListener('click', () => {
    hidePopupCreate()
    clearImgInputField('upload-img-file')
    return
  });

  const ad_place = document.getElementById('ad_place_field')
  fetch(`/api/location/getLocationById?ad_place_id=${ad_place_id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      ad_place.value = data.data[0].place.address_formated.trim()
    })

  const locationType = {}
  const location_type_selection = document.getElementById('location-type-selection');
  fetch(`/api/category/getCategory?fieldId=T1`)
    .then(res => res.json())
    .then(res => {
      while (location_type_selection.firstChild) {
        location_type_selection.removeChild(location_type_selection.firstChild);
      }
      res.data.forEach(item => {
        locationType[`${item.name}`] = item.id;
        var newOption = document.createElement('option')
        newOption.value = item.name;
        newOption.textContent = item.name;
        location_type_selection.appendChild(newOption)
      })
    })
  const form = document.getElementById('createForm');


  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      return;
    }

    const start = new Date(document.getElementById("startDate").value);
    const end = new Date(document.getElementById("endDate").value);


    if (start >= end) {
      Toastify({
        text: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
        duration: 3000,
        close: false,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#FF6969",
          color: "#000"
        },
        onClick: function () { } // Callback after click
      }).showToast();
    } else {
      let formData = new FormData(form);
      fetch('/location/uploadUpdatePlace', {
        method: 'POST',
        body: formData
      }).then(res => res.json())
        .then(data => {

          let image = [null, null]
          data.files.forEach((file, index) => {
            image[index] = (file.path)
          })
          console.log(data)

          let dataCreate = {
            companyName: data.others.inputName,
            companyAdress: data.others.address,
            companyEmail: data.others.email,
            width: data.others.width,
            height: data.others.height,
            description: data.others.content,
            start: data.others.startDate,
            end: data.others.endDate,
            image1: image[0],
            image2: image[1],
            ad_place_id: ad_place_id,
            ad_type: locationType[`${data.others.locationType}`],
          }
          console.log(dataCreate)
          createAdContentAndRequest(dataCreate)

        })
    }

  })
}
function closeOffcanvas() {
  originalStyles = {}
  originalImg = {}
  originalStyles_ads = {}
  originalImg_ads = {}
  var offcanvas = document.getElementById('location_extend');
  offcanvas.parentNode.removeChild(offcanvas);

  const html = `  <div class="offcanvas offcanvas-end sidepeek-location" data-bs-scroll="true" tabindex="-1" id="location_extend"
  aria-labelledby="Location extend information" width="50%">
  <div class="offcanvas-header sidepeek-location-header">
    <button type="button" class="btn-close" onclick="closeOffcanvas()" data-bs-dismiss="offcanvas"
      aria-label="Close"></button>
    <h5 class="offcanvas-title" id="location_extend_header">Thông tin chi tiết điểm đặt quảng cáo</h5>
  </div>
  <div class="offcanvas-body">
    <div class="fluid-container mb-3">
      <div class="row">
        <div class="col-6">
          <div id="ad-detail-img" class="carousel slide mb-6"
            style="border-radius: 10px; overflow: hidden; width: 100%" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#ad-detail-img" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#ad-detail-img" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="https://www.ecommerce-nation.com/wp-content/uploads/2018/10/404-error.jpg"
                  class="h-100 w-100" alt="404 Not Found" id="image1">
              </div>
              <div class="carousel-item">
                <img src="https://www.ecommerce-nation.com/wp-content/uploads/2018/10/404-error.jpg"
                  class="h-100 w-100" alt="" id="image2">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#ad-detail-img" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#ad-detail-img" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div class="col-6">
          <table style="padding: 0;" id="info-ad-location" class="table" id="inf-table">
            <tr>
              <th><i class="bi bi-geo-alt"> Địa chỉ</i></th>
              <td id="address_formated">47, Đ. Điện Biên Phủ, P. Đa Kao, Quận 1</td>
            </tr>
            <tr>
              <th><i class="bi bi-hash"></i> Số lượng</th>
              <td id="capacity">2 bảng/điểm</td>
            </tr>
            <tr>
              <th><i class="bi bi-tag"></i> Loại vị trí</th>
              <td id="type_id">Nhà riêng</td>
            </tr>
            <tr>
              <th><i class="bi bi-activity"></i> Trạng thái</th>
              <td id="status">Chưa quy hoạch</td>
            </tr>
            <tr>
              <th><i class="bi bi-bullseye"></i> Mục đích</th>
              <td id="purpose_id">Thương mại</td>
            </tr>
          </table>
        </div>

        <div class="d-flex justify-content-end w-100 align-item">
  <div class="btn btn-outline-secondary" id="showPopUpCreate">
    <i class="bi bi-pencil-square"></i> Yêu cầu cấp phép
  </div>
  <div id="popup-parent-create">
  <img id="form-img-create" src="/public/images/form.png" alt="" />
  <div class="popup-create" id="location-popup-create">
    <h2 style="margin-top: 60px">Yêu cầu cấp phép</h2>
    <button
      style="position: fixed; right: 10px; top: 10px"
      type="button"
      class="btn-close"
      id="close-edit-request-create"
    ></button>
    <hr />
    <form action="#" method="post" id="createForm">

    <div style="text-align: left;">
  <label for="content" style="text-align: left; font-weight: bold;margin:15px 0px">Địa điểm</label>
  <input class="form-control" name="ad_place" id="ad_place_field" readonly></input>
</div>
      <div class="row">
        <div class="col-6">
          <div style="text-align: left">
            <label style="font-weight: bold" for="inputName" class="form-label"
              >Tên công ty</label
            >
            <input
              tabindex="1"
              name="inputName"
              type="text"
              class="form-control"
              id="inputName"
              required
              placeholder="Công ty"
            />
          </div>

          <div style="text-align: left; margin-top: 30px">
            <label style="font-weight: bold" for="size" class="form-label"
              >Kích thước</label
            >
            <div class="d-flex justify-content-center align-items-center">
              <input
                style="margin-right: 10px"
                type="number"
                class="form-control"
                tabindex="3"
                id="height"
                name="height"
                required
                placeholder="Cao"
              />
              x
              <input
                style="margin-left: 10px"
                type="number"
                class="form-control"
                tabindex="4"
                id="width"
                name="width"
                required
                placeholder="Rộng"
              />
            </div>
          </div>
          <div style="text-align: left; margin-top: 30px">
            <label style="font-weight: bold" for="startDate" class="form-label"
              >Ngày bắt đầu</label
            >
            <input
              type="date"
              class="form-control"
              tabindex="6"
              id="startDate"
              name="startDate"
              required
            />
          </div>
        </div>
        <div class="col-6">
          <div style="text-align: left">
            <label style="font-weight: bold" for="email" class="form-label"
              >Email</label
            >
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              tabindex="2"
              required
              placeholder="Email"
            />
          </div>

          <div style="text-align: left; margin-top: 30px">
            <label style="font-weight: bold" for="address" class="form-label"
              >Địa chỉ công ty</label
            >
            <input
              type="text"
              class="form-control"
              tabindex="5"
              id="address"
              name="address"
              required
              placeholder="Địa chỉ"
            />
          </div>
          <div style="text-align: left; margin-top: 30px">
            <label style="font-weight: bold" for="endDate" class="form-label"
              >Ngày kết thúc</label
            >
            <input
              type="date"
              class="form-control"
              tabindex="7"
              id="endDate"
              name="endDate"
              required
            />
          </div>
        </div>
      </div>
      <div class="form-field-col" style="width: 100%">
        <label for="location-type-selection">Loại ví trị</label>
        <select
          name="locationType"
          id="location-type-selection"
          required
        ></select>
      </div>

      <div style="text-align: left">
        <label
          for="content"
          style="text-align: left; font-weight: bold; margin: 15px 0px"
          >Mô tả bảng quảng cáo</label
        >
        <textarea
          class="form-control"
          name="content"
          id="content"
          rows="4"
        ></textarea>
      </div>

      <div style="width: 100%; height: 200px">
        <div class="upload-field" id="upload-img-file">
          <label
            for="imgFile-for-create"
            class="drag-drop"
            ondragover="dragoverHandler(event)"
            ondragleave="dragleaveHandler(event)"
            ondrop="dropHandler(event)"
          >
            <div class="holder">
              <i class="bi bi-cloud-arrow-up-fill"></i>
              <h4>Kéo và thả ảnh vào đây</h4>
              hoặc Click để duyệt file
            </div>
          </label>
          <input
            type="file"
            name="imgFile"
            id="imgFile-for-create"
            accept=".png, .jpeg, .gif, .jpg"
            multiple
            hidden
            onchange="inputChangeHandler(event)"
          />
          <div class="preview" style="display: none"></div>
        </div>
      </div>

      <button
        id="submit-request-create"
        style="
          width: 100%;
          outline: none;
          padding: 10px;
          border-radius: 12px;
          background-color: #262058;
          color: white;
          margin-top: 50px;
        "
      >
        <h5 style="margin: 0">Gửi yêu cầu</h5>
      </button>
    </form>
  </div>
</div>
</div>


        <div class="d-flex justify-content-end w-100 align-item">
          <div class="btn btn-outline-secondary" id="showPopUp">
            <i class="bi bi-pencil-square"></i> Yêu cầu chỉnh sửa
          </div>
          <div id="popup-parent">
            <img id="form-img" src="/public/images/form.png" alt="" />
            <div class="popup" id="location-popup">
              <h2 style="margin-top: 60px">Yêu cầu chỉnh sửa</h2>
              <button style="position: fixed; right: 10px; top: 10px" type="button" class="btn-close"
                id="close-edit-request"></button>
              <hr />
              <form action="#" method="post" id="updateAdPlaceForm">
                <div class="ads-info">
                  <div class="form-field-col" style="width: 100%">
                    <label for="location-type-selection">Loại ví trị</label>
                    <select name="locationType" id="location-type-selection" required>
                    </select>
                  </div>
                  <div class="form-field-col">
                    <label for="purpose-type-selection">Hình thức quảng cáo</label>
                    <select name="purposeType" id="purpose-type-selection" required>
                    </select>
                  </div>
                  <div class="form-field-col">
                    <label for="status-selection">Trạng thái</label>
                    <select name="status" id="status-selection" required>
                      <option value="1">Đã quy hoạch</option>
                      <option value="0">Chưa quy hoạch</option>
                    </select>
                  </div>
                  <div class="ads-amount">
                    <label for="ads-amount">Số lượng</label>
                    <input type="number" name="capacity" id="ads-amount" min="1" max="10" placeholder="0" required>
                    <p>bảng / địa điểm</p>
                  </div>
                  <div style="width: 100%; height: 200px">
                    <div class="upload-field" id="upload-img-file">
                      <label for="imgFile-for-create" class="drag-drop" ondragover="dragoverHandler(event)"
                        ondragleave="dragleaveHandler(event)" ondrop="dropHandler(event)">
                        <div class="holder">
                          <i class="bi bi-cloud-arrow-up-fill"></i>
                          <h4>Kéo và thả ảnh vào đây</h4> hoặc Click để duyệt file
                        </div>
                      </label>
                      <input type="file" name="imgFile" id="imgFile-for-create" accept=".png, .jpeg, .gif, .jpg"
                        multiple hidden onchange="inputChangeHandler(event)">
                      <div class="preview" style="display: none;">
                      </div>
                    </div>
                  </div>
                </div>

                <p style="
                      text-align: left;
                      font-weight: bold;
                      margin-top: 25px;
                    ">
                  Lý do chỉnh sửa
                </p>
                <textarea style="width: 100%; padding: 12px; border-radius: 12px;" name="reasonUpdate" id="" cols="30"
                  rows="5"></textarea>
                <button id="submit-request" style="
                      width: 100%;
                      outline: none;
                      border-color;
                      padding: 10px;
                      border-radius: 12px;
                      background-color: #262058;
                      color: white;
                      margin-top: 50px;
                    ">
                  <h5 style="margin: 0">Gửi yêu cầu</h5>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overlay collapse" id="detail-location-overlay"></div>

    <div class="ad-detail-info-container">

    </div>
  </div>
</div>
`

  document.querySelector('.tmp-pop-up').innerHTML = html;
}

function handlePopUp(button) {
  let buttonId = button.id;
  fetch(`/api/location/getLocationById?ad_place_id=${buttonId}`)
    .then(res => res.json())
    .then(data => {

      const address = document.getElementById('address_formated')
      address.textContent = data.data[0].place.address_formated

      const capacity = document.getElementById('capacity')
      capacity.textContent = `${data.data[0].capacity} bảng/điểm`

      const type_id = document.getElementById('type_id')
      type_id.textContent = data.data[0].locationType.name

      const purpose = document.getElementById('purpose_id')
      purpose.textContent = data.data[0].purposeType.name

      const status = document.getElementById('status')
      status.textContent = data.data[0].status == true ? "Đã quy hoạch" : "Chưa quy hoạch"

      const image1 = document.getElementById('image1');
      if (data.data[0].image1 != null) {
        image1.src = data.data[0].image1
      }

      const image2 = document.getElementById('image2');
      if (data.data[0].image2 != null) {
        image2.src = data.data[0].image2
      }


      const show_popup = document.getElementById('showPopUp');
      const show_popup_create = document.getElementById('showPopUpCreate');

      let resquest_data = {
        capacity: data.data[0].capacity,
        status: data.data[0].status,
        type_ad_id: data.data[0].locationType.id,
        purpose_id: data.data[0].purposeType.id,
      }


      show_popup.addEventListener('click', () => {
        const html = `<div id="popup-parent">
        <img id="form-img" src="/public/images/form.png" alt="" />
        <div class="popup" id="location-popup">
          <h2 style="margin-top: 60px">Yêu cầu chỉnh sửa</h2>
          <button style="position: fixed; right: 10px; top: 10px" type="button" class="btn-close"
            id="close-edit-request"></button>
          <hr />
          <form action="#" method="post" id="updateAdPlaceForm">
            <div class="ads-info">
              <div class="form-field-col" style="width: 100%">
                <label for="location-type-selection">Loại ví trị</label>
                <select name="locationType" id="location-type-selection" required>
                </select>
              </div>
              <div class="form-field-col">
                <label for="purpose-type-selection">Hình thức quảng cáo</label>
                <select name="purposeType" id="purpose-type-selection" required>
                </select>
              </div>
              <div class="form-field-col">
                <label for="status-selection">Trạng thái</label>
                <select name="status" id="status-selection" required>
                  <option value="1">Đã quy hoạch</option>
                  <option value="0">Chưa quy hoạch</option>
                </select>
              </div>
              <div class="ads-amount">
                <label for="ads-amount">Số lượng</label>
                <input type="number" name="capacity" id="ads-amount" min="1" max="10" placeholder="0" required>
                <p>bảng / địa điểm</p>
              </div>
              <div style="width: 100%; height: 200px">
                <div class="upload-field" id="upload-img-file">
                  <label for="imgFile-for-create" class="drag-drop" ondragover="dragoverHandler(event)"
                    ondragleave="dragleaveHandler(event)" ondrop="dropHandler(event)">
                    <div class="holder">
                      <i class="bi bi-cloud-arrow-up-fill"></i>
                      <h4>Kéo và thả ảnh vào đây</h4> hoặc Click để duyệt file
                    </div>
                  </label>
                  <input type="file" name="imgFile" id="imgFile-for-create" accept=".png, .jpeg, .gif, .jpg"
                    multiple hidden onchange="inputChangeHandler(event)">
                  <div class="preview" style="display: none;">
                  </div>
                </div>
              </div>
            </div>

            <p style="
                  text-align: left;
                  font-weight: bold;
                  margin-top: 25px;
                ">
              Lý do chỉnh sửa
            </p>
            <textarea style="width: 100%; padding: 12px; border-radius: 12px;" name="reasonUpdate" id="" cols="30"
              rows="5"></textarea>
            <button id="submit-request" style="
                  width: 100%;
                  outline: none;
                  border-color;
                  padding: 10px;
                  border-radius: 12px;
                  background-color: #262058;
                  color: white;
                  margin-top: 50px;
                ">
              <h5 style="margin: 0">Gửi yêu cầu</h5>
            </button>
          </form>
        </div>
      </div>`
        show_popup.parentNode.insertAdjacentHTML('beforeend', html);
        clearImgInputField('upload-img-file')
        showPopup()
        createUpdateLocation(resquest_data, buttonId)
      })



      show_popup_create.addEventListener('click', () => {
        const html = `<div id="popup-parent-create">
        <img id="form-img-create" src="/public/images/form.png" alt="" />
        <div class="popup-create" id="location-popup-create">
          <h2 style="margin-top: 60px">Yêu cầu cấp phép</h2>
          <button
            style="position: fixed; right: 10px; top: 10px"
            type="button"
            class="btn-close"
            id="close-edit-request-create"
          ></button>
          <hr />
          <form action="#" method="post" id="createForm">
      
          <div style="text-align: left;">
        <label for="content" style="text-align: left; font-weight: bold;margin:15px 0px">Địa điểm</label>
        <input class="form-control" name="ad_place" id="ad_place_field" readonly></input>
      </div>
            <div class="row">
              <div class="col-6">
                <div style="text-align: left">
                  <label style="font-weight: bold" for="inputName" class="form-label"
                    >Tên công ty</label
                  >
                  <input
                    tabindex="1"
                    name="inputName"
                    type="text"
                    class="form-control"
                    id="inputName"
                    name="inputName"
                    required
                    placeholder="Công ty"
                  />
                </div>
      
                <div style="text-align: left; margin-top: 30px">
                  <label style="font-weight: bold" for="size" class="form-label"
                    >Kích thước</label
                  >
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      style="margin-right: 10px"
                      type="number"
                      class="form-control"
                      tabindex="3"
                      id="height"
                      name="height"
                      required
                      placeholder="Cao"
                    />
                    x
                    <input
                      style="margin-left: 10px"
                      type="number"
                      class="form-control"
                      tabindex="4"
                      id="width"
                      name="width"
                      required
                      placeholder="Rộng"
                    />
                  </div>
                </div>
                <div style="text-align: left; margin-top: 30px">
                  <label style="font-weight: bold" for="startDate" class="form-label"
                    >Ngày bắt đầu</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    tabindex="6"
                    id="startDate"
                    name="startDate"
                    required
                  />
                </div>
              </div>
              <div class="col-6">
                <div style="text-align: left">
                  <label style="font-weight: bold" for="email" class="form-label"
                    >Email</label
                  >
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    tabindex="2"
                    required
                    placeholder="Email"
                  />
                </div>
      
                <div style="text-align: left; margin-top: 30px">
                  <label style="font-weight: bold" for="address" class="form-label"
                    >Địa chỉ công ty</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    tabindex="5"
                    id="address"
                    name="address"
                    required
                    placeholder="Địa chỉ"
                  />
                </div>
                <div style="text-align: left; margin-top: 30px">
                  <label style="font-weight: bold" for="endDate" class="form-label"
                    >Ngày kết thúc</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    tabindex="7"
                    id="endDate"
                    name="endDate"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="form-field-col" style="width: 100%">
              <label for="location-type-selection">Loại ví trị</label>
              <select
                name="locationType"
                id="location-type-selection"
                required
              ></select>
            </div>
      
            <div style="text-align: left">
              <label
                for="content"
                style="text-align: left; font-weight: bold; margin: 15px 0px"
                >Mô tả bảng quảng cáo</label
              >
              <textarea
                class="form-control"
                name="content"
                id="content"
                rows="4"
              ></textarea>
            </div>
      
            <div style="width: 100%; height: 200px">
              <div class="upload-field" id="upload-img-file">
                <label
                  for="imgFile-for-create"
                  class="drag-drop"
                  ondragover="dragoverHandler(event)"
                  ondragleave="dragleaveHandler(event)"
                  ondrop="dropHandler(event)"
                >
                  <div class="holder">
                    <i class="bi bi-cloud-arrow-up-fill"></i>
                    <h4>Kéo và thả ảnh vào đây</h4>
                    hoặc Click để duyệt file
                  </div>
                </label>
                <input
                  type="file"
                  name="imgFile"
                  id="imgFile-for-create"
                  accept=".png, .jpeg, .gif, .jpg"
                  multiple
                  hidden
                  onchange="inputChangeHandler(event)"
                />
                <div class="preview" style="display: none"></div>
              </div>
            </div>
      
            <button
              id="submit-request-create"
              style="
                width: 100%;
                outline: none;
                padding: 10px;
                border-radius: 12px;
                background-color: #262058;
                color: white;
                margin-top: 50px;
              "
            >
              <h5 style="margin: 0">Gửi yêu cầu</h5>
            </button>
          </form>
        </div>
      </div>`
        show_popup_create.parentNode.insertAdjacentHTML('beforeend', html);
        clearImgInputField('upload-img-file')
        showPopupCreate()
        createAdReq(buttonId)
      })
    })

  fetch(`/api/location/getAds?ad_place_id=${buttonId}`)
    .then(ads => ads.json())
    .then(ads => {
      console.log(ads.data)
      let adsList = ads.data.filter(item => {
        return item.status == true
      })
      createAdViewInfo(adsList)
    })
}


function getSpecificLocation(button) {
  handlePopUp(button)
}
const maxAmountOfFiles = 2;
window.inputFieldArray = [];
window.uploadedFiles = [];

function dragoverHandler(e) {
  e.preventDefault();
  e.target.classList.add("drag-drop-dragging");
}

function dragleaveHandler(e) {
  e.target.classList.remove("drag-drop-dragging");
}

function dropHandler(e) {
  e.preventDefault();
  e.target.classList.remove("drag-drop-dragging");
  let previewArea = e.target.parentNode.querySelector(".preview");
  let fieldId = e.target.parentNode.id;
  const files = e.dataTransfer.files;
  addImgs(files, previewArea, e.target, fieldId);
}

function inputChangeHandler(e) {
  let previewArea = e.target.parentNode.querySelector(".preview");
  let fieldId = e.target.parentNode.id;
  let dragDropArea = e.target.parentNode.querySelector(".drag-drop");
  const files = e.target.files;
  addImgs(files, previewArea, dragDropArea, fieldId);
}

// function imgInputController(fieldId) {
//     window.inputFieldArray.push(fieldId);
//     window.uploadedFiles.push([]);
//     let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
//     let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
//     let previewArea = document.querySelector(`#${fieldId} .preview`);
//     imgInputField.addEventListener("change", () => {
//         const files = imgInputField.files;

//         addImgs(files, previewArea, dragDropArea, fieldId);
//     });
//     dragDropArea.addEventListener("dragover", (e) => {
//         e.preventDefault();
//         dragDropArea.classList.add("drag-drop-dragging");
//     });

//     dragDropArea.addEventListener("dragleave", () => {
//         dragDropArea.classList.remove("drag-drop-dragging");
//     });

//     dragDropArea.addEventListener("drop", (e) => {
//         e.preventDefault();
//         dragDropArea.classList.remove("drag-drop-dragging");
//         const files = e.dataTransfer.files;
//         addImgs(files, previewArea, dragDropArea, fieldId);
//     });
// }

function removeImg(index, fieldId) {
  let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
  let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
  let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
  let previewArea = document.querySelector(`#${fieldId} .preview`);
  let fileHolder = previewArea.querySelector(
    `.fileHolder[data-target="${index}"]`
  );
  // Find the index of the file in the window.uploadedFiles array
  let fileIndex = window.uploadedFiles[inputFieldIndex].findIndex(
    (file) => file.name === fileHolder.dataset.target
  );
  // Remove the file from the window.uploadedFiles array
  window.uploadedFiles[inputFieldIndex].splice(fileIndex, 1);
  fileHolder.remove();
  imgInputField.value = null;
  if (
    window.uploadedFiles[inputFieldIndex].length === 0 &&
    previewArea.querySelectorAll(".fileHolder").length === 0
  ) {
    previewArea.style.display = "none";
    dragDropArea.querySelector(".holder").style.display = "block";
  }
}

function checkValidFile(file) {
  let fileName = file.name;
  let fileSize = file.size;
  let fileExtension = fileName.split(".").pop();
  let allowedExtensions = ["png", "jpeg", "jpg", "gif"];
  let maxFileSize = 5 * 1024 * 1024; // 2MB

  if (!allowedExtensions.includes(fileExtension)) {
    alert("File format not supported");
    return false;
  } else if (fileSize > maxFileSize) {
    alert("File size is too large");
    return false;
  } else {
    return true;
  }
}

function addImgIntoPreview(file, previewArea, dragDropArea, fieldId) {
  if (previewArea.style.display === "none") {
    previewArea.style.display = "flex";
    dragDropArea.querySelector(".holder").style.display = "none";
  }
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    let fileHolder = document.createElement("div");
    fileHolder.classList.add("fileHolder");
    fileHolder.setAttribute("data-target", file.name);
    fileHolder.innerHTML = `
            <img src="${fileReader.result}" alt="img">
            <button type="button" onclick="removeImg('${file.name}', '${fieldId}')"><i class="bi bi-x"></i></button>
        `;
    previewArea.appendChild(fileHolder);
  };
}

function checkCapacity(fieldId) {
  let index = window.inputFieldArray.indexOf(fieldId);
  let amount = window.uploadedFiles[index].length;
  if (amount >= maxAmountOfFiles) {
    return false;
  } else {
    return true;
  }
}

function checkExist(file, fieldId) {
  let index = window.inputFieldArray.indexOf(fieldId);
  if (window.uploadedFiles[index].find((item) => item.name === file.name)) {
    return true;
  } else {
    return false;
  }
}

function addImg(file, previewArea, dragDropArea, fieldId) {
  let index = window.inputFieldArray.indexOf(fieldId);
  if (checkValidFile(file)) {
    if (checkCapacity(fieldId)) {
      if (!checkExist(file, fieldId)) {
        window.uploadedFiles[index].push(file);
        addImgIntoPreview(file, previewArea, dragDropArea, fieldId);
      } else {
        alert("File already exist");
      }
    } else {
      alert(`You can only upload ${maxAmountOfFiles} files`);
    }
  }
}

function addImgs(files, previewArea, dragDropArea, fieldId) {
  // Find the index of the input field in window.inputFieldArray
  let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
  if (inputFieldIndex === -1) {
    window.inputFieldArray.push(fieldId);
    window.uploadedFiles.push([]);
  }
  for (let i = 0; i < files.length; i++) {
    addImg(files[i], previewArea, dragDropArea, fieldId);
  }
}

function clearImgInputField(fieldId) {
  let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
  if (inputFieldIndex === -1) {
    return;
  }
  //Remove all the files in the preview area
  let previewArea = document.querySelector(`#${fieldId} .preview`);
  previewArea.innerHTML = "";
  previewArea.style.display = "none";
  document.querySelector(`#${fieldId} .holder`).style.display = "block";
  // Remove this in window.inputFieldArray
  window.inputFieldArray.splice(inputFieldIndex, 1);
  // Remove this in window.uploadedFiles
  window.uploadedFiles.splice(inputFieldIndex, 1);
  // Clear the input field
  let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
  imgInputField.files = null;
}

function setImgFileForField(formData, fieldId) {
  let inputImgIndex = window.inputFieldArray.indexOf(fieldId);
  if (inputImgIndex === -1) {
    formData.append('newImgFile', null);
    return;
  }
  let files = window.uploadedFiles[inputImgIndex];
  // convert the files to filelist
  let fileList = new DataTransfer();
  for (let i = 0; i < files.length; i++) {
    fileList.items.add(files[i]);
  }
  // Add the filelist to the form data
  for (file of fileList.files) {
    formData.append('newImgFile', file);
  }
}

