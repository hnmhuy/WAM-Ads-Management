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
    hidePopup();
  }
});

submit.addEventListener('click', () => {
  hidePopup();
});
close_btn.addEventListener('click', () => {
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
  originalStyles = {}
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

function formatStandardDate(inputDate) {
  const dateObject = new Date(inputDate);

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();

  return `${day}/${month}/${year}`;
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
              <div id="popup-parent-ads">
                <img id="form-img-ads" src="/public/images/form.png" alt="" />
                <div class="popup-ads" id="location-popup-ads">
                  <h2 style="margin-top: 60px">Yêu cầu chỉnh sửa</h2>
                  <button style="position: fixed; right: 10px; top: 10px" type="button" class="btn-close"
                   id="close-edit-request-ads"></button>
                  <hr />

                  <div class="edit-ad-form-officer">
                    <form action="" class="edit-ad-form-officer">
                      <div class="imgs-field">
                      <div class="upload-field" id="upload-img-file-ad-${index}" onclick="imgInputController('upload-img-file-ad-${index}')">
                      <label for="imgFile" class="drag-drop">
                        <input type="file" name="imgFile" id="imgFile" accept=".png, .jpeg, .gif, .jpg" multiple hidden>
                        <div class="holder">
                          <i class="bi bi-cloud-arrow-up-fill"></i>
                          <h4>Kéo và thả ảnh vào đây</h4> hoặc Click để duyệt file
                        </div>
                      </label>
                      <div class="preview" style="display: none;">
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
                          <label for="ads-h">Chiều dài</label>
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
                            ">
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
      hidePopupAds(popup_ads[index], img_ads[index], popup_parent_ads[index]);
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


function createUpdateLocation(request_data, ad_place_id) {

  console.log(request_data)
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
          ad_place_id: ad_place_id
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
          setTimeout(() => {
            console.log("Waiting...");
          }, 1500);
          location.reload();
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
          setTimeout(() => {
            console.log("Waiting...");
          }, 1500);
          location.reload();
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
        setTimeout(() => {
          console.log("Waiting...");
        }, 1500);
        location.reload();
      });
  }, { once: true })
}
function getSpecificLocation(button) {
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

      let resquest_data = {
        capacity: data.data[0].capacity,
        status: data.data[0].status,
        type_ad_id: data.data[0].locationType.id,
        purpose_id: data.data[0].purposeType.id,
      }
      show_popup.addEventListener('click', () => {
        showPopup()
        createUpdateLocation(resquest_data, buttonId)
      }, { once: true })
    })

  fetch(`/api/location/getAds?ad_place_id=${buttonId}`)
    .then(ads => ads.json())
    .then(ads => {
      createAdViewInfo(ads.data)
    })
}


const maxAmountOfFiles = 2;
window.inputFieldArray = [];
window.uploadedFiles = [];

function imgInputController(fieldId) {
  window.inputFieldArray.push(fieldId);
  window.uploadedFiles.push([]);
  let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
  let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
  let previewArea = document.querySelector(`#${fieldId} .preview`);

  console.log(`${fieldId} controller is running`);
  console.log(window.inputFieldArray);
  console.log(window.uploadedFiles);
  imgInputField.addEventListener("change", () => {
    const files = imgInputField.files;
    addImgs(files, previewArea, dragDropArea, fieldId);
  });
  dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("drag-drop-dragging");
  });

  dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.classList.remove("drag-drop-dragging");
  });

  dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropArea.classList.remove("drag-drop-dragging");
    const files = e.dataTransfer.files;
    console.log(files);
    addImgs(files, previewArea, dragDropArea, fieldId);
  });
}

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

function addImgs(files, previewArea, dragDropArea, fieldId) {
  let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
  const fileCount = previewArea.querySelectorAll(".fileHolder").length;
  // Check the file format and size
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let fileName = file.name;
    let fileSize = file.size;
    let fileExtension = fileName.split(".").pop();
    let allowedExtensions = ["png", "jpeg", "jpg", "gif"];
    let maxFileSize = 5 * 1024 * 1024; // 2MB

    if (!allowedExtensions.includes(fileExtension)) {
      alert("File format not supported");
      return;
    } else if (fileSize > maxFileSize) {
      alert("File size is too large");
      return;
    }
  }

  // Check if the preview is not display and hide the hodler
  if (previewArea.style.display === "none") {
    previewArea.style.display = "flex";
    dragDropArea.querySelector(".holder").style.display = "none";
  }
  let tempFileArray = window.uploadedFiles[inputFieldIndex];
  // Check if the file is already in the window.uploadedFiles array
  for (let i = 0; i < files.length; i++) {
    if (tempFileArray.find((file) => file.name === files[i].name)) {
      continue;
    } else if (fileCount + tempFileArray.length > maxAmountOfFiles) {
      alert(`You can only upload ${maxAmountOfFiles} files`);
      return;
    } else {
      tempFileArray.push(files[i]);
    }
  }

  // Check if the amount of files is not more than the max amount of files
  if (tempFileArray.length > maxAmountOfFiles) {
    alert(`You can only upload ${maxAmountOfFiles} files`);
    return;
  } else {
    // store the file into window.uploadedFiles
    window.uploadedFiles[inputFieldIndex] = tempFileArray;
    // Remove all the files from the preview area
    previewArea.querySelectorAll(".fileHolder").forEach((fileHolder) => {
      fileHolder.remove();
    });
    // Loop through the files and display them
    for (let i = 0; i < tempFileArray.length; i++) {
      let file = tempFileArray[i];
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
    };
  }
}

