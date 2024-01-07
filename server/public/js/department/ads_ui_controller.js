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
let createLocationCanvas = undefined;

let mapForCreate = null;
let mapForUpdate = null;

document.addEventListener("DOMContentLoaded", () => {
    mapForCreate = initMap("map-for-create");
    mapForUpdate = initMap("map-for-update");

    mapForCreate.on('move', () => {
        let coordinate = mapForCreate.getCenter();
        updateLngLatDisplay('map-for-create', coordinate.lng.toFixed(6), coordinate.lat.toFixed(6));
    })

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    let createLocation = document.getElementById('location_create');
    let updateLocation = document.getElementById('location_edit');
    let detailLocation = document.getElementById('location_extend');
    createLocationCanvas = new bootstrap.Offcanvas(createLocation);
    updateLocationCanvas = new bootstrap.Offcanvas(updateLocation);
    detailLocationCanvas = new bootstrap.Offcanvas(detailLocation);
    formControl("create-location-form", mapForCreate);
    formControl("edit-location-form", mapForUpdate);

});

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

// ------Controller for detial content of create request table ------
function unseletedAll() {
    document
        .querySelectorAll("#collapse-req-create-table .selected-row")
        .forEach((row) => {
            row.classList.remove("selected-row");
        });
}

function selectARow() {
    document
        .querySelectorAll("#collapse-req-create-table tbody tr button")
        .forEach((btn) => {
            btn.addEventListener("click", (e) => {
                unseletedAll();
                e.target.parentElement.parentElement.parentElement.classList.add(
                    "selected-row"
                );
            });
        });
}

function reqCreateContentGenerate() {
    let div = document.createElement("div");
    div.classList.add("collapsed-content");
    div.innerHTML = `
    <div class="content-table">
        <div class="table-container">
            <table class="table table-hover" id="collapse-req-create-table">
                <thead>
                    <tr>
                        <th scope="col">Mã yêu cầu </th>
                        <th scope="col">Thời gian gửi</th>
                        <th scope="col">Người gửi</th>
                        <th scope="col" style="width: 50px"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="rc001" class="">
                        <td>RC001</td>
                        <td>11:57 22/11/2023</td>
                        <td>ABC</td>
                        <td style="width: 50px">
                            <button>
                                <i class="bi bi-chevron-bar-right"></i>
                            </button>
                        </td>
                    </tr>

                    <tr id="rc001" class="">
                        <td>RC001</td>
                        <td>11:57 22/11/2023</td>
                        <td>ABC</td>
                        <td style="width: 50px">
                            <button>
                                <i class="bi bi-chevron-bar-right"></i>
                            </button>
                        </td>
                    </tr>

                    <tr id="rc001" class="">
                        <td>RC001</td>
                        <td>11:57 22/11/2023</td>
                        <td>ABC</td>
                        <td style="width: 50px">
                            <button>
                                <i class="bi bi-chevron-bar-right"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="content-detail">
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
            <button>Phê duyệt</button>
            <button>Từ chối</button>
        </div>
    </div>
            `;
    return div;
}

// Common controller functions for tables
function handleCopplaseContent(e) {
    let parentTable =
        e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    let tableId = parentTable.id;
    let tableRow = e.parentNode.parentNode.parentNode.parentNode.parentNode;
    let collpaseDiv = tableRow.children[1];
    if (tableId === "req_create_table") {
        //Call another function to generate the content
        if (collpaseDiv.getAttribute("showed") === "false") {
            let content = reqCreateContentGenerate();
            setTimeout(
                (collpaseDiv) => {
                    collpaseDiv.innerHTML = "";
                    collpaseDiv.appendChild(content);
                    collpaseDiv.setAttribute("showed", "true");
                },
                1000,
                collpaseDiv
            );
        } else {
            collpaseDiv.innerHTML = "";
            collpaseDiv.appendChild(createLoadingHolder());
            collpaseDiv.setAttribute("showed", "false");
        }
    }
}

// ------Control the upload image------


// ------Control the upload image------

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

function clearImgInputField(fieldId) {
    console.log(`Clearing ${fieldId}`);
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
    console.log(window.inputFieldArray);
    console.log(window.uploadedFiles);
}


// Detail location - edit ad button
function editAd(e) {
    let adCard = e.parentNode.parentNode;
    let company = adCard.querySelector(".ad-detail-card-title")
    company.classList.add("collapse");
    let imgField = adCard.querySelector(".imgs-field .upload-field");
    let imgFieldId = imgField.id;

    imgInputController(imgFieldId);
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

    imgInputController('create-location-form-upload-img');

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
    formData.append('geometry', JSON.stringify(geometry));
    console.log(formData.get('imgFile'))
    try {
        let res = await fetch('/api/ad_place/create', {
            method: 'POST',
            body: formData
        })
        res = await res.json();
        if (res.success) {
            btn.disabled = false;
            btn.querySelector('.spinner-border').classList.add('collapse');
            console.log(res.data);
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
