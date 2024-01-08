let permissionMap = undefined;
let adPlaceData = {
    type: "FeatureCollection",
    features: []
}
let pin = undefined;
let locationId = undefined;

document.addEventListener("DOMContentLoaded", () => {
    permissionMap = initMap('permission-map', false);
    permissionMap.on('load', () => {
        addDataLayer(permissionMap, adPlaceData, 'ad-place', 'ad-place-points', getAdLocationData);
    })
    pin = new mapboxgl.Marker({
       color: 'blue' 
    })
})

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

let dropdown = document.querySelector(".permission-dropdown");
dropdown.addEventListener('click', () => {
    dropdown.classList.toggle('active');
})

function showType(e) {
    const input_type = document.getElementById('adType');
    input_type.value = e.textContent;
    const input_id = document.getElementById('adTypeId');
    input_id.value = e.id;
}

let popup_ = document.getElementById("location-popup")
let img_ = document.getElementById("form-img")
let submit_ = document.getElementById("submit-request")
let popup_parent_ = document.getElementById("popup-parent")
let close_btn_ = document.getElementById("close-edit-request")
let originalStyles_ = {}
let originalImg_ = {}

popup_parent_.addEventListener('click', (event) => {
    if (event.target.id === 'popup-parent') {
        Swal.fire({
            title: "Bạn muốn thoát khỏi biểu mẫu?",
            showCancelButton: true,
            confirmButtonText: "Có",
            denyButtonText: `Không`
            }).then((result) => {
            if (result.isConfirmed) {
                hidePopup();
            }
        });
    }
});

close_btn_.addEventListener('click', () => {
    Swal.fire({
        title: "Bạn muốn thoát khỏi biểu mẫu?",
        showCancelButton: true,
        confirmButtonText: "Có",
        denyButtonText: `Không`
        }).then((result) => {
        if (result.isConfirmed) {
            hidePopup();
        }
    });
});

// let countries = [];
// const menu_div = document.querySelector(".menu_div"),
//     selectBtn = menu_div.querySelector(".select-btn"),
//     searchInp = menu_div.querySelector("input"),
//     options = menu_div.querySelector(".options");

// function addCountry(selectedCountry) {
//     options.innerHTML = "";
//     countries.forEach(country => {
//         let isSelected = country.name == selectedCountry ? "selected" : "";
//         let li = `<li class="selectedAddress" onclick="updateName(this)" class="${isSelected}">${country.name}
//         <input style="display: none" id="${country.id}" name="${countries.id}">
//       </li>`;
//         options.insertAdjacentHTML("beforeend", li);
//     });
// }

// function updateName(selectedLi) {
//     searchInp.value = "";
//     addCountry(selectedLi.innerText);
//     menu_div.classList.remove("active");
//     selectBtn.firstElementChild.value = selectedLi.innerText;
//     const idSelected = selectBtn.querySelector("#idAddressOfAd");
//     console.log(selectedLi.firstElementChild);
//     idSelected.value = selectedLi.firstElementChild.id;
//     console.log(idSelected.value);
// }
// searchInp.addEventListener("keyup", () => {
//     let arr = [];
//     let searchWord = searchInp.value.toLowerCase();
//     arr = countries.filter(data => {
//         return data.toLowerCase().startsWith(searchWord);
//     }).map(data => {
//         let isSelected = data == selectBtn.firstElementChild.innerText ? "selected" : "";
//         return `<li class="selectedAddressOfAd" onclick="updateName(this)" class="${isSelected}">${data}</li>`;
//     }).join("");
//     options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! Country not found</p>`;
// });
// selectBtn.addEventListener("click", () => menu_div.classList.toggle("active"));

async function updateAdPlace(areaId) {
    let res = await fetch(`api/ad_place/getGeojson?areaId=${areaId}`);
    let data = await res.json();
    if(data.success) {
        console.log(data.data); 
        let geojson = data.data;
        permissionMap.getSource('ad-place').setData(geojson);
    } else {
        console.log(data.message);
    }
}

function getAdLocationData(event) {
    const coordinate = event.features[0].geometry.coordinates.slice();
    const properties = event.features[0].properties;
    permissionMap.flyTo({
        center: coordinate,
        zoom: 16.5,
        speed: 1.2
    })
    pin.setLngLat(coordinate).addTo(permissionMap);
    updateLngLatDisplay('permission-map', coordinate[0].toFixed(6), coordinate[1].toFixed(6));
    properties.area = JSON.parse(properties.area);
    let address = properties.address_formated + ", " + properties.area.formatedName;
    document.getElementById("ad-location").value = address;
    locationId = properties.id;
}

async function showPopup(delegation) {
    // await fetch(`api/ad_place/get?areaId=${delegation}`).then(res => res.json()).then(
    //     data => data.data.rows.forEach((item) => {
    //         countries.push({ name: item.place.address_formated, id: item.id });
    //     })
    // )
    // addCountry();
    await updateAdPlace(delegation);
    // console.log(countries)
    fetch('api/category/getCategory?fieldId=T3').then(res => res.json()).then(
        data => data.data.forEach((item) => {
            const div = document.createElement("div");
            div.classList.add("permission-dropdown-option-content");
            div.textContent = item.name;
            div.id = item.id;
            div.onclick = function () {
                showType(this);
            };
            document.querySelector(".permission-dropdown-option").appendChild(div);
        })
    )

    imgInputController("upload-img-request");
    document.querySelector('body').style.overflowY = 'hidden';
    originalStyles_.visibility = popup_.style.visibility || '';
    originalStyles_.top = popup_.style.top || '';
    originalStyles_.left = popup_.style.left || '';
    originalStyles_.transform = popup_.style.transform || '';

    originalImg_.marginBottom = img_.style.marginBottom || '';
    originalImg_.transform = img_.style.transform || '';
    img_.style.marginBottom = '45%';
    img_.style.transform = 'translate(-50%, -50%) scale(1)';
    img_.style.visibility = 'visible';

    popup_parent_.style.visibility = 'visible';
    popup_.style.visibility = 'visible';
    popup_.style.top = '50%';
    popup_.style.left = '50%';
    popup_.style.transform = 'translate(-50%, -50%) scale(1)';
}
function hidePopup(){
    let inputs = document.querySelectorAll("input");
    inputs.forEach((input)=>{
        input.value = "";
    })
    let textArea = document.querySelector("textarea");
    textArea.value="";
    const div_list = document.querySelectorAll(".permission-dropdown-option-content");
    div_list.forEach((item) => {
        item.parentNode.removeChild(item);
    })
    locationId = undefined;
    document.querySelector('body').style.overflowY = 'auto';
    img_.style.marginBottom = originalImg_.marginBottom || '';
    img_.style.visibility = originalImg_.visibility || '';
    img_.style.transform = originalImg_.transform || '';
    popup_parent_.style.visibility = 'hidden';
    popup_.style.visibility = originalStyles_.visibility || '';
    popup_.style.top = originalStyles_.top || '';
    popup_.style.left = originalStyles_.left || '';
    popup_.style.transform = originalStyles_.transform || '';
    // const up = document.querySelector('.uploaded-area');
    // up.remove();
    // const form_to_display = document.querySelector(".upload");
    clearImgInputField("upload-img-request");
    form_to_display.style.display = 'flex';
}

const maxAmountOfFiles = 2;
window.inputFieldArray = [];
window.uploadedFiles = [];

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
}

function imgInputController(fieldId) {
    window.inputFieldArray.push(fieldId);
    window.uploadedFiles.push([]);
    let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
    let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
    let previewArea = document.querySelector(`#${fieldId} .preview`);
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

async function submitForm(event) {
    const form = document.getElementById('create-request-form');
    if (!form.checkValidity()) {
        return;
    }
    const start = new Date(document.getElementById("startDate").value);
    const end = new Date(document.getElementById("endDate").value);
    const ad_place = document.getElementById("ad-location").value;
    const adType = document.getElementById("adType").value;
    if(start >= end){
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
          onClick: function(){} // Callback after click
        }).showToast();
        event.preventDefault();

    } else if (!ad_place) {
        Toastify({
          text: "Hãy chọn vị trí điểm đặt quảng cáo",
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
        event.preventDefault();
    } else if (!adType){
        Toastify({
          text: "Hãy chọn loại bảng quảng cáo",
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
        event.preventDefault();
    } else {
        event.preventDefault();
        const fd = new FormData(form);
        fd.set("locationId", locationId);
        let res = await fetch('/permission', {
            method: "POST",
            body: fd
        })
        res = await res.json();
        console.log(res);
        if(res.message == "Success"){
            let request = res.request;
            let ad_content = res.ad_content;
            let address = res.address;
            let type = res.type;
            let tr = document.createElement("tr");
            if(request.status === "sent"){
                request.status = "Đã gửi"
            } else if (request.status === "approved"){
                request.status = "Đã cấp phép"
            } else {
                request.status = "Đã từ chối"
            }
            tr.innerHTML = `
            <td>
                <p class="text-align-center table-cell-type">${ad_content.company_name}</p>
            </td>
            <td>
                <p class="table-cell-type">${address}</p>
            </td>
            <td>
                <p class="table-cell-type">${type}</p>
            </td>
            <td class="d-flex justify-content-center align-items-center">
                <p class="mx-0 status delivered">${request.status}</p>
            </td>
            <td>
                <div class="last-cell">
                <div>
                    <i role="button" onclick="showPopup_review(this)" class="bi bi-arrow-up-right-square" style="color: black" data-id ="${ad_content.id}" data-company-name = "${ad_content.company_name}" data-email = "${ad_content.company_email}" data-height = "${ad_content.height}" data-status="sent" data-width="${ad_content.width}" data-location = "${ad_content.company_address}" data-start = "${ad_content.start}" data-end="${ad_content.end}" data-type="${type}" data-ad-place="${address}" data-description = ${ad_content.description} data-img1="${ad_content.image1}" data-img2="${ad_content.image2}" data-request-id="${request.id}"></i>
                </div>
                </div>
            </td>
            `
            
            tr.id= request.id
            tr.class="tr_in_table_in_location"
            let tbody = document.querySelector("tbody");
            tbody.insertBefore(tr, tbody.firstElementChild);
            document
                .querySelectorAll("tbody tr:not(.hide)")
                .forEach((visible_row, i) => {
                    console.log(i);
                    visible_row.style.backgroundColor =
                        i % 2 == 0 ? "transparent" : "rgba(79, 62, 215, 0.1)";
                });
        }
        hidePopup();
    }
}