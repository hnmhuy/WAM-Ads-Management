// Dropdonwn UI controller
const table = document.querySelector('#area-table');
const table_body = table.querySelector('#tableBody');
const holderRow = table.querySelector('#holder');
const emptyRow = table.querySelector('#empty-row'); 

function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterDropdown(e) {
    const list = e.parentNode.parentNode.querySelectorAll(".item");
    list.forEach(item => {
        if (removeDiacritics(item.textContent.toLowerCase()).indexOf(removeDiacritics(e.value.toLowerCase())) > -1) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    })
}

window.addEventListener("click", function (e) {
    if (e.target.closest(".wrapper-dropdown") === null) {
        closeAllDropdown();
    }
});

function closeAllDropdown() {
    document.querySelectorAll(".wrapper-dropdown").forEach(item => {
        item.classList.remove("active");
        item.children[1].classList.remove("rotate");
    });
}

function toggleDropdown(e) {
    const container = e.parentNode
    if (container.classList.contains("active")) {
        container.classList.remove("active");
        e.nextElementSibling.classList.remove("rotate");
    } else {
        closeAllDropdown();
        container.classList.add("active");
        e.nextElementSibling.classList.add("rotate");
    }
}

function optionClick(e) {
    const container = e.parentNode.parentNode;
    const selectedField = container.querySelector(".selected-display");
    selectedField.textContent = e.textContent;
    selectedField.setAttribute("data-value", e.getAttribute("data-value"));
    selectedField.setAttribute("data-name", e.textContent);
    container.classList.remove("active");
    container.children[1].classList.remove("rotate");
}

// Create new area form control

const areaForm = document.querySelector("#add-new-area-form");
const areaLevel = document.getElementById("area-level-selection");
const districtSelection = document.getElementById("district-selection");
const wardSelection = document.getElementById("ward-selection");
const observerConfig = { attributes: true };

function restoreDefaultDropdown(element, value) {
    element.textContent = value;
    element.setAttribute("data-value", "");
}

function fetchAndRenderOption(element, url, idName) {
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(res => {
            let data = res.data;
            // Sort data by idDistrict
            data.sort((a, b) => {
                return a[idName] < b[idName];
            });


            element.innerHTML = "";
            element.innerHTML = `
                <li class="dropdown-search"><input type="text" placeholder="Tìm kiếm...." oninput="filterDropdown(this)"></li>
                `;
            data.forEach(item => {
                let option = document.createElement("li");
                option.classList.add("item");
                option.setAttribute("data-value", item[idName]);
                option.textContent = item.name;
                option.setAttribute("onclick", "optionClick(this)");
                element.appendChild(option);
            })
        })
}

let urlL1 = null;
let urlL2 = null;

//Observer for area level selection
const areaLevelObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        let type = null;
        if (mutation.attributeName === "data-value") {
            const value = mutation.target.getAttribute("data-value");
            if (value === "L1") {
                urlL1 = '/api/area/getArea?opts=uncreated&level=1'; // Get uncreated district
                type = 'idDistrict';
                areaForm.querySelector('#district-dropdown').classList.remove("collapse");
                areaForm.querySelector('#ward-dropdown').classList.add("collapse");
                areaForm.querySelector('#district-dropdown').parentNode.classList.remove("collapse");
                areaForm.querySelector('#ward-dropdown').parentNode.classList.add("collapse");
            } else if (value === "L2") {
                urlL1 = '/api/area/getArea?opts=db&level=1'; // Get all district
                urlL2 = '/api/area/getArea?opts=uncreated&level=2'; // Get uncreated commune
                type = 'id';
                areaForm.querySelector('#district-dropdown').classList.remove("collapse");
                areaForm.querySelector('#ward-dropdown').classList.remove("collapse");
                areaForm.querySelector('#district-dropdown').parentNode.classList.remove("collapse");
                areaForm.querySelector('#ward-dropdown').parentNode.classList.remove("collapse");
            } else if (value === "") {
                areaForm.querySelector('#district-dropdown').classList.add("collapse");
                areaForm.querySelector('#ward-dropdown').classList.add("collapse");
                areaForm.querySelector('#district-dropdown').parentNode.classList.add("collapse");
                areaForm.querySelector('#ward-dropdown').parentNode.classList.add("collapse");
            }
            restoreDefaultDropdown(districtSelection, "Chọn quận/huyện");
            restoreDefaultDropdown(wardSelection, "Chọn phường/xã");            

            fetchAndRenderOption(districtSelection.nextElementSibling.nextElementSibling, urlL1, type);
        }
    });
});

const districtSelectionObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-value") {
            const value = mutation.target.getAttribute("data-value");
            if (value !== "") {
                areaForm.querySelector('#ward-dropdown').classList.remove("disabled");
                fetchAndRenderOption(wardSelection.nextElementSibling.nextElementSibling, `${urlL2}&idDistrict=${value}`, "idCommune");
            } else {
                areaForm.querySelector('#ward-dropdown').classList.add("disabled");
            }
            restoreDefaultDropdown(wardSelection, "Chọn phường/xã");
        }
    });
});


areaLevelObserver.observe(areaLevel, observerConfig);
districtSelectionObserver.observe(districtSelection, observerConfig);

function cancelAddArea() {
    restoreDefaultDropdown(areaLevel, "Chọn cấp khu vực");
    areaForm.classList.add("collapse");
    document.querySelector(".overlay").classList.add("collapse");
}

function openAddAreaForm() {
    areaForm.classList.remove("collapse");
    document.querySelector(".overlay").classList.remove("collapse");
}

function rowHover(e) {
    e.querySelector(".extend-btn i:first-child").style.display = 'block';
}

function rowLeave(e) {
    e.querySelector(".extend-btn i:first-child").style.display = 'none';
}

function expendRow(e) {
    if (e.classList.contains("extend-btn-rotate")) {
        e.classList.remove("extend-btn-rotate");
        let row = e.parentNode.parentNode.parentNode;
        row.classList.remove("extend-row")
        document.querySelectorAll(`tr[parent-id="${row.id}"]`).forEach(item => {
            item.classList.add("collapse");
        });
    } else {
        e.classList.add("extend-btn-rotate");
        let row = e.parentNode.parentNode.parentNode;
        row.classList.add("extend-row")
        document.querySelectorAll(`tr[parent-id="${row.id}"]`).forEach(item => {
            item.classList.remove("collapse");
        });
    }
}

function createArea(e) {
    const level = document.getElementById('area-level-selection').getAttribute("data-value");
    let data = null;
    if(level === 'L1') {
        data = {
            id: document.getElementById('district-selection').getAttribute('data-value'),
            name: document.getElementById('district-selection').getAttribute('data-name'),
            parent_id: null
        }
    } else if (level === 'L2') {
        data = {
            id: document.getElementById('ward-selection').getAttribute('data-value'),
            name: document.getElementById('ward-selection').getAttribute('data-name'),
            parent_id: document.getElementById('district-selection').getAttribute('data-value')
        }
    }
    fetch('/api/area/createArea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        if(res.status === 200) return res.json()
        else {
            displayNotification("Có lỗi xảy ra", 'error');
            throw new Error(res.message);
        }
    })
    .then(res => {
        if(res.status === 'success') {
            let data = res.data;
            data.officer = [];
            let newRow = addNewArea(data);
            newRow.classList.add("new-row");
            // Set timeout to remove new-row class
            setTimeout(() => {
                newRow.classList.remove("new-row");
            }, 3000);
            cancelAddArea();
            displayNotification("Thêm khu vực thành công", 'success');
        } else if (res.status === 'error') {
            displayNotification(res.message, 'error');
        }
    }).catch(err => {
        displayNotification(err.message, 'error');
    })
} 

function generateOfficerGroup(data) {
    let officerGroup = document.createElement("div");
    officerGroup.className = "officer-group";
    if(data.officer.length === 0) {
        let officer = document.createElement("div");
        officer.className = "officer";
        officer.innerHTML = `
            <span>Chưa có cán bộ phụ trách</span>
        `;
        officerGroup.appendChild(officer);
    } else {
        data.officer.forEach(item => {
            let officer = document.createElement("div");
            officer.className = "officer";
            officer.innerHTML = `
                <div class="officer-img">
                    <i class="bi bi-person-circle"></i>
                </div>
                <span>${item.last_name} ${item.first_name}</span>
            `;
            officerGroup.appendChild(officer);
        })
    
    }

    return officerGroup;
}

function generateRow(data) {
    let row = document.createElement("tr");
    row.id = data.id;
    row.setAttribute('parent-id', data.parent_id);
    row.setAttribute('onmouseover', 'rowHover(this)');  
    row.setAttribute('onmouseleave', 'rowLeave(this)');
    row.className = data.parent_id ? "collapse" : "";
    row.innerHTML = `
        <td>${data.name}</td>
        <td>${new Date(data.createdAt).toLocaleDateString("vn-VN")}</td>
        <td>${data.parent_id ? "Phường/ Xã" : "Quận/ Huyện"}</td>
        <td style="width: 20%">
        </td>
        <td style="width: 200px;">
            <div class="extend-btn">
                <i title="Xóa" class="bi bi-trash2"></i>
                <i title="Xem khu vực trực thuộc" class="bi bi-chevron-compact-down collapse" onclick="expendRow(this)"></i>
            </div>
        </td>
    `

    let officerGroup = generateOfficerGroup(data);

    row.children[3].appendChild(officerGroup);
    return row;
}

function addNewArea(data) {
    let row = generateRow(data);
    emptyRow.classList.add("collapse");
    if(data.parent_id) {
        let parentRow = document.getElementById(data.parent_id);
        row.classList.remove("collapse");
        if(parentRow) {
            let extendBtn = parentRow.querySelector(".extend-btn i:last-child");
            if(extendBtn.classList.contains("collapse")) {
                extendBtn.classList.remove("collapse");
            }
            extendBtn.classList.remove("extend-btn-rotate");
            expendRow(extendBtn);
            parentRow.after(row);
        }
        table_body.insertBefore(row, parentRow.nextSibling);
    } else {
        table_body.appendChild(row);
    }
    return row;
}

fetch('api/area/getArea?opts=hierarchy').then(res => res.json()).then(data => {

    if(data.length === 0) {
        emptyRow.classList.remove("collapse");
    }

    data.forEach(item => {
        let row = generateRow(item.district);
        // Insert before holder row
        table_body.insertBefore(row, holderRow);
        if(item.commune.length > 0) {
            row.querySelector(".extend-btn i:last-child").classList.remove("collapse");
            item.commune.forEach(item => {
                let row = generateRow(item);
                table_body.insertBefore(row, holderRow);
            })
        }       
    })
    holderRow.remove();
})