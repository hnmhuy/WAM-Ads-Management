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

let popup = document.getElementById("location-popup")
let img = document.getElementById("form-img")
let submit = document.getElementById("submit-request")
let popup_parent = document.getElementById("popup-parent")
let close_btn = document.getElementById("close-edit-request")
let originalStyles = {}
let originalImg = {}
let originalStyles_ads = {}
let originalImg_ads = {}


popup_parent.addEventListener('click', (event) => {
  if (event.target.id === 'popup-parent') {
    if (confirm('Bạn muốn thoát khỏi biểu mẫu?'))
      hidePopup();
  }
});

submit.addEventListener('click', () => {
  hidePopup();
});
close_btn.addEventListener('click', () => {
  if (confirm('Bạn muốn thoát khỏi biểu mẫu?'))
    hidePopup();
});


function showPopup() {
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
function hidePopup() {
  img.style.marginBottom = originalImg.marginBottom || '';
  img.style.visibility = originalImg.visibility || '';
  img.style.transform = originalImg.transform || '';
  popup_parent.style.visibility = 'hidden';
  popup.style.visibility = originalStyles.visibility || '';
  popup.style.top = originalStyles.top || '';
  popup.style.left = originalStyles.left || '';
  popup.style.transform = originalStyles.transform || '';

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
    <div class="view-info">
      <div class="view-info-attribute">
        <span>Công ty</span>
        ${ad.company_name}
      </div>
      <div class="view-info-attribute">
        <span>Kích thước</span> ${ad.height}m x ${ad.width}m
      </div>
      <div class="view-info-attribute">
        <span>Bắt đầu</span> ${formatDate(ad.start)}
      </div>
      <div class="view-info-attribute">
        <span>Kết thúc</span> ${formatDate(ad.end)}
      </div>
      <div class="view-info-attribute">
        <span>Trạng thái</span> ${status}
      </div>


      <div class="d-flex justify-content-end w-100 align-item">
              <div class="btn btn-outline-secondary" id="update-ad">
                <i class="bi bi-pencil-square"></i>
              </div>
              <div id="popup-parent-ads">
                <img id="form-img-ads" src="/public/images/form.png" alt="" />
                <div class="popup-ads" id="location-popup-ads">
                  <h2 style="margin-top: 60px">Yêu cầu chỉnh sửa</h2>
                  <button style="position: fixed; right: 10px; top: 10px" type="button" class="btn-close"
                    onclick="hidePopupAds()" id="close-edit-request-ads"></button>
                  <hr />

                  <div class="edit-ad-form-officer">
                    <form action="" class="edit-ad-form-officer">
                      <div class="imgs-field">
                        <div class="upload-field" id="edit-ad-form-img-c001">
                          <label for="imgFile" class="drag-drop">
                            <input type="file" name="imgFile" id="imgFile" accept=".png, .jpeg, .gif" multiple hidden>
                            <div class="holder">
                              <i class="bi bi-cloud-arrow-up-fill"></i>
                              <h4>Kéo và thả ảnh vào đây</h4> hoặc Click để duyệt file
                            </div>
                          </label>
                          <div class="preview">
                          </div>
                        </div>
                      </div>
                      <div class="info-field">
                        <div class="ads-amount">
                          <label for="ad-w">Chiều rộng</label>
                          <input type="number" id="ad-w" placeholder="0" required value="${ad.width}">
                          <p>m</p>
                        </div>
                        <div class="ads-amount">
                          <label for="ad-h">Chiều dài</label>
                          <input type="number" id="ads-h" placeholder="0" value="${ad.height}"required>
                          <p>m</p>
                        </div>
                        <div class="form-field">
                          <label for="start-date">Bắt đầu</label>
                          <input type="date" id="start-date" placeholder="" value="${formatDate(ad.start)}" required>
                        </div>
                        <div class="form-field">
                          <label for="end-date">Kết thúc</label>
                          <input type="date" id="end-date" value="${formatDate(ad.end)}" placeholder="" required>
                        </div>
                      </div>
                    </form>
                  </div>

                  <button id="submit-request-ads" style="
                              width: 100%;
                              outline: none;
                              border: 0;
                              padding: 10px;
                              border-radius: 5px;
                              background-color: #262058;
                              color: white;
                              margin-top: 50px;
                            " onclick="hidePopupAds()">
                    <h5 style="margin: 0">Gửi yêu cầu</h5>
                  </button>
                </div>
              </div>
            </div>
      `
    ad_card.innerHTML = html;
    ad_cards.appendChild(ad_card)


  })


  let submit_ads = document.querySelectorAll("#submit-request-ads")
  let popup_parent_ads = document.querySelectorAll("#popup-parent-ads")
  let close_btn_ads = document.querySelectorAll("#close-edit-request-ads")
  let popup_ads = document.querySelectorAll("#location-popup-ads")
  let img_ads = document.querySelectorAll("#form-img-ads")
  let update_ad = document.querySelectorAll('#update-ad')

  update_ad.forEach((item, index) => {
    item.addEventListener('click', () => {
      showPopupAds(popup_ads[index], img_ads[index], popup_parent_ads[index]);
    });
  })
  popup_parent_ads.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      if (event.target.id === 'popup-parent-ads') {
        if (confirm('Bạn muốn thoát khỏi biểu mẫu?'))
          hidePopupAds(popup_ads[index], img_ads[index], popup_parent_ads[index]);
      }
    });
  })
  submit_ads.forEach((item, index) => {
    item.addEventListener('click', () => {
      hidePopupAds(popup_ads[index], img_ads[index], popup_parent_ads[index]);
    });
  })

  close_btn_ads.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (confirm('Bạn muốn thoát khỏi biểu mẫu?'))
        hidePopupAds(popup_ads[index], img_ads[index], popup_parent_ads[index]);
    });
  })
  // const update_ad = document.querySelectorAll('.update-ad');
  // update_ad.forEach(item => {
  //   item.addEventListener('click', () => {
  //     showPopupAds()
  //   })
  // })
}





function createUpdateLocation(request_data, officer, ad_place_id) {
  console.log(request_data)
  console.log(officer)
  console.log(ad_place_id)

  const ads_amount = document.getElementById('ads-amount')
  ads_amount.placeholder = request_data.capacity
  ads_amount.value = request_data.capacity

  const location_type_selection = document.getElementById('location-type-selection');
  fetch(`/api/category/getCategory?fieldId=T1`)
    .then(res => res.json())
    .then(res => {
      res.data.forEach(item => {
        var newOption = document.createElement('option')
        newOption.value = item.id;
        newOption.textContent = item.name;
        if (item.id === request_data.type_ad_id) {
          newOption.selected = true;
        }
        location_type_selection.appendChild(newOption)
      })
    })

  const purpose_type_selection = document.getElementById('purpose-type-selection');
  fetch(`/api/category/getCategory?fieldId=T2`)
    .then(res => res.json())
    .then(res => {
      res.data.forEach(item => {
        var newOption = document.createElement('option')
        newOption.value = item.id;
        newOption.textContent = item.name;
        if (item.id === request_data.purpose_id) {
          newOption.selected = true;
        }
        purpose_type_selection.appendChild(newOption)
      })
    })

  const ads_type = document.getElementById('ads-type');
  fetch(`/api/category/getCategory?fieldId=T3`)
    .then(res => res.json())
    .then(res => {
      res.data.forEach(item => {
        var newOption = document.createElement('option')
        newOption.value = item.id;
        newOption.textContent = item.name;
        if (item.id === request_data.ad_id) {
          newOption.selected = true;
        }
        ads_type.appendChild(newOption)
      })
    })
}
function getSpecificLocation(button) {
  let buttonId = button.id;
  let officer = 'bfd79bdc-a150-40f3-b429-468600bf4efc'
  fetch(`/api/location/getLocationById?ad_place_id=${buttonId}`)
    .then(res => res.json())
    .then(data => {


      const address = document.getElementById('address_formated')
      address.textContent = data.data[0].place.address_formated

      const capacity = document.getElementById('capacity')
      capacity.textContent = `${data.data[0].capacity} bảng/điểm`

      const type_id = document.getElementById('type_id')
      type_id.textContent = data.data[0].TypeAds.name

      const purpose = document.getElementById('purpose_id')
      purpose.textContent = data.data[0].PurposeAds.name

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

      const ad_id = document.getElementById('ad_id');
      ad_id.textContent = data.data[0].Ads.name;
      const show_popup = document.getElementById('showPopUp');

      let resquest_data = {
        capacity: data.data[0].capacity,
        status: data.data[0].status,
        type_ad_id: data.data[0].TypeAds.id,
        purpose_id: data.data[0].PurposeAds.id,
        ad_id: data.data[0].Ads.id
      }

      show_popup.addEventListener('click', () => {
        showPopup()
        createUpdateLocation(resquest_data, officer, data.data[0].id)
      })
    })

  fetch(`/api/location/getAds?ad_place_id=${buttonId}`)
    .then(ads => ads.json())
    .then(ads => {
      createAdViewInfo(ads.data)
    })
}