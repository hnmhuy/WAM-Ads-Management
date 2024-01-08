const swap_button = document.querySelector("#checkbox_toggle");
const location_table = document.querySelector("#location_table");
const tab_bar = document.querySelector(".tab-bar");
const create_button = document.querySelector("#new_location_btn");
const req_create_table = document.querySelector("#req_create_table");
const req_update = document.querySelector("#req_update");
const location_area = document.querySelector("#location-area");
const req_area = document.querySelector("#req-area");
let currpage = swap_button.getAttribute("target");
let geometry = undefined;

function createLoadingHolder() {
    const loadingHolder = document.createElement("div");
    loadingHolder.classList.add("collapsed-content");
    loadingHolder.classList.add("loading");
    loadingHolder.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `;
    return loadingHolder;
}

// Main ui controller
swap_button.addEventListener("click", () => {
    if (swap_button.checked) {
        window.location.href = "/ads/request"
    } else {
        window.location.href = "/ads"
    }
});

document.querySelectorAll("#collapse-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("rotate-btn");
    });
});

const tab_btn = document.querySelectorAll(".tab-btn");

tab_btn[0].addEventListener("click", () => {
    tab_btn[0].classList.add("tab-btn-active");
    tab_btn[1].classList.remove("tab-btn-active");
    req_update.classList.add("collapse");
    req_create_table.classList.remove("collapse");
});

tab_btn[1].addEventListener("click", () => {
    tab_btn[1].classList.add("tab-btn-active");
    tab_btn[0].classList.remove("tab-btn-active");
    req_create_table.classList.add("collapse");
    req_update.classList.remove("collapse");
});


// ------Control the upload image------

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
    if(inputFieldIndex === -1) {
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
    for(file of fileList.files) {
        formData.append('newImgFile', file);
    }
}

// -----Logic for create location form -------
function generateOption(data) {
    let option = document.createElement("option");
    option.value = data.id;
    option.textContent = data.name;
    return option;
}

function fetchAndAddOption(selectElement, kindOfData, placeHolder, idDistrict, selectedValue = undefined) {
    // Implement later
    
    let url = "";
    if (kindOfData === 'district') {
        url = "/api/area/getArea?opts=db&level=1"
    } else if (kindOfData === 'ward') {
        url = `/api/area/getArea?opts=db&level=2&idDistrict=${idDistrict}`
    }
    selectElement.disabled = true;
    selectElement.parentNode.style.border = "1px solid rgba(0, 0, 255, 0.3)";
    selectElement.innerHTML = `
        <option value="">
            <strong>Đang tải dữ liệu ....</strong>
        </option>
    `

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                selectElement.disabled = false;
                if (data.data.length === 0) {
                    selectElement.parentNode.style.border = "1px solid red";
                    selectElement.innerHTML = `
                    <option selected value=""><strong style="color:red;">Không có dữ liệu</strong></option>
                `
                } else {
                    selectElement.parentNode.style.border = "1px solid rgba(0, 0, 0, 0.3)";
                    if (!selectedValue){
                        selectElement.innerHTML = `
                        <option selected value="">${placeHolder}</option>`
                    } else {
                        selectElement.innerHTML = `
                        <option value="">${placeHolder}</option>`
                    }
                }
                data.data.forEach(item => {
                    selectElement.appendChild(generateOption(item));
                    if (selectedValue && selectedValue === item.id) {
                        selectElement.value = item.id;
                    }
                })
            } else {
                console.log(data.message);
            }
        })

    return null;
}


function areaSelectionController(districtSelection, wardSelection, streetSelection, map) {
    let address = "";
    const geocodeBtn = streetSelection.parentNode.querySelector(".inside-btns button:first-child");
    const clearAddressBtn = streetSelection.parentNode.querySelector(".inside-btns button:last-child");
    clearAddressBtn.addEventListener("click", () => {
        streetSelection.value = "";
    });
    geocodeBtn.addEventListener("click", async () => {
        geocodeBtn.disabled = true;
        geocodeBtn.querySelector(".spinner-grow").classList.remove("collapse");
        geocodeBtn.querySelector("i").classList.add("collapse");
        let data = await geocoding(map, address, false, true, 18);
        if (data) {
            geometry = preProcessGeoJson(data.features[0].geometry);
        } else {
            geometry = undefined;
            displayNotification("Không tìm thấy địa chỉ", "error");
        }
        geocodeBtn.disabled = false;
        geocodeBtn.querySelector(".spinner-grow").classList.add("collapse");
        geocodeBtn.querySelector("i").classList.remove("collapse");
    })
    districtSelection.addEventListener("change", () => {
        if (districtSelection.value != "") {
            geocoding(map, districtSelection.options[districtSelection.selectedIndex].text, true);
            updatePolygonByAddress(map, districtSelection.options[districtSelection.selectedIndex].text);
            wardSelection.disabled = false;
            fetchAndAddOption(wardSelection, 'ward', 'Chọn phường/xã', districtSelection.value);
            wardSelection.addEventListener("change", () => {
                if (wardSelection.value != "") {
                    address = `${wardSelection.options[wardSelection.selectedIndex].text}, ${districtSelection.options[districtSelection.selectedIndex].text}`
                    geocoding(map, address, true);
                    updatePolygonByAddress(map, address);
                    streetSelection.disabled = false;
                    geocodeBtn.disabled = false;
                    clearAddressBtn.disabled = false;
                    streetSelection.value = "";
                    streetSelection.addEventListener("input", () => {
                        address = `${streetSelection.value}, ${wardSelection.options[wardSelection.selectedIndex].text}, ${districtSelection.options[districtSelection.selectedIndex].text}`;
                    });
                } else {
                    streetSelection.value = "";
                    streetSelection.disabled = true;
                    geocodeBtn.disabled = true;
                    clearAressBtn.disabled = true;
                }
            });
        } else {
            wardSelection.disabled = true;
            streetSelection.disabled = true;
            geocodeBtn.disabled = true;
            clearAddressBtn.disabled = true;
            wardSelection.value = "";
            streetSelection.value = "";
        }
    });
}

function formControl(form_id, map) {
    const districtSelection = document.querySelector(`#${form_id} select[name="district"]`);
    const wardSelection = document.querySelector(`#${form_id} select[name="ward"]`);
    const streetSelection = document.querySelector(`#${form_id} input[name="street"]`);    
    areaSelectionController(districtSelection, wardSelection, streetSelection, map);
}

// Detail location - edit ad button
function editAd(e) {
    let adCard = e.parentNode.parentNode;
    let company = adCard.querySelector(".ad-detail-card-title")
    company.classList.add("collapse");
    let imgField = adCard.querySelector(".imgs-field .upload-field");
    let imgFieldId = imgField.id;

    //imgInputController(imgFieldId);
    adCard.classList.add("ad-detail-card-editing");
    let overlay = document.querySelector("#detail-location-overlay");
    overlay.classList.remove("collapse");
}

function cancelAdEdit(e) {
    let adCard = e.parentNode.parentNode.parentNode.parentNode.parentNode;
    let company = adCard.querySelector(".ad-detail-card-title")
    company.classList.remove("collapse");
    console.log(adCard);
    let imgFieldId = adCard.querySelector(".imgs-field .upload-field").id;
    adCard.classList.remove("ad-detail-card-editing");
    let overlay = document.querySelector("#detail-location-overlay");
    overlay.classList.add("collapse");
    clearImgInputField(imgFieldId);
}

// Create location form controller

function fetchDropDown(url, element, placeHolder, selectedValue = undefined) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.data.length === 0) {
                element.innerHTML = `
                <option selected value="">Không có dữ liệu</option>
            `
            } else {
                if (selectedValue) {
                    element.innerHTML = `
                    <option value="">${placeHolder}</option>
                    `
                } else {
                    element.innerHTML = `
                    <option selected value="">${placeHolder}</option>
                    `
                }
            }
            data.data.forEach(item => {
                element.appendChild(generateOption(item));
                if (selectedValue && selectedValue === item.id) {
                    element.value = item.id;
                }
            })
        })
}

async function openForm(formId) {
    geometry = {};
    const form = document.getElementById(formId);
    const locationType = form.querySelector("select[name='location-type']");
    const adPurpose = form.querySelector("select[name='purpose-type']");
    const districtSelection = form.querySelector("select[name='district']");
    const wardSelection = form.querySelector("select[name='ward']");
    const streetSelection = form.querySelector("input[name='street']");

    //imgInputController('create-location-form-upload-img');

    await fetchDropDown("/api/category/getCategory?fieldId=T1", locationType, "Chọn loại vị trí");
    await fetchDropDown("/api/category/getCategory?fieldId=T2", adPurpose, "Chọn hình thức quảng cáo");
    await fetchAndAddOption(districtSelection, 'district', 'Chọn quận/huyện');
}

async function deleteLocation(id) {
    let res = await fetch(`/api/ad_place/delete?id=${id}`).then(res => res.json());
    return res.success;
}

async function createLocation(event) {
    const form = document.getElementById('create-location-form');
    if (!form.checkValidity()) {
        return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('.spinner-border').classList.remove('collapse');
    event.preventDefault();
    const formData = new FormData(form);
    let coordinate = mapForCreate.getCenter();
    geometry.coordinates = [coordinate.lng, coordinate.lat];
    geometry.type = "Point";
    formData.append('geometry', JSON.stringify(geometry));

    setImgFileForField(formData, 'create-location-form-upload-img');
    formData.delete('imgFile');


    try {
        let res = await fetch('/api/ad_place/create', {
            method: 'POST',
            body: formData
        })
        res = await res.json();
        if (res.success) {
            btn.disabled = false;
            btn.querySelector('.spinner-border').classList.add('collapse');
            try {
                let newLocation = await fetch(`/api/ad_place/getOne?id=${res.data.ad.id}`).then(res => res.json());
                console.log(newLocation);
                if (newLocation.success) { 
                    let table = document.getElementById("ad-location-table").querySelector("tbody");
                    let row = generateAdPlaceRow(newLocation.data);
                    row.classList.add("new-row");
                    setTimeout(() => {
                        row.classList.remove("new-row");
                    }, 2000);
                    console.log(row);
                    console.log(table);
                    // Append the new to the table as a first row
                    table.insertBefore(row, table.firstChild);
                }
                else {
                    console.log(newLocation.message);
                }
                displayNotification("Tạo vị trí quảng cáo thành công", "success");
                clearForm('create-location-form');
                createLocationCanvas.hide();
            } catch (error) {
                console.log(error);
                displayNotification(error, "error");
            }
        }
    } catch (error) {
        console.log(error);
        btn.disabled = false;
        btn.querySelector('.spinner-border').classList.add('collapse');
        displayNotification(error, "error");
        deleteLocation(res.data.id);
    }
}

function clearForm(formId) {
    let form = document.getElementById(formId);
    form.reset();
    clearImgInputField(`${formId}-upload-img`);
    if (formId === 'create-location-form') {
        createLocationCanvas.hide();
    } else if (formId === 'edit-location-form') {
        updateLocationCanvas.hide();
    }
}
