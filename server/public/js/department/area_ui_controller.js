// Dropdonwn UI controller

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
    fetch(url)
        .then(res => res.json())
        .then(data => {
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

//Observer for area level selection
const areaLevelObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-value") {
            const value = mutation.target.getAttribute("data-value");
            if (value === "L1") {
                areaForm.querySelector('#district-dropdown').classList.remove("collapse");
                areaForm.querySelector('#ward-dropdown').classList.add("collapse");
                areaForm.querySelector('#district-dropdown').parentNode.classList.remove("collapse");
                areaForm.querySelector('#ward-dropdown').parentNode.classList.add("collapse");
            } else if (value === "L2") {
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
            fetchAndRenderOption(districtSelection.nextElementSibling.nextElementSibling, `/data/area`, "idDistrict");
        }
    });
});

const districtSelectionObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-value") {
            const value = mutation.target.getAttribute("data-value");
            if (value !== "") {
                areaForm.querySelector('#ward-dropdown').classList.remove("disabled");
                fetchAndRenderOption(wardSelection.nextElementSibling.nextElementSibling, `/data/area/?districtId=${value}`, "idCommune");
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