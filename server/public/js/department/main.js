function displayNotification(message, type) {
    const color = type === 'success' ? "#C1F2B0" : "#FF6969";
    Toastify({
        text: message,
        duration: 3000,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            color: "#000"
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

// Filter function component

function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterComponent(id_component, filterConfig) {
    let filterComponent = document.querySelector(id_component);
    let addFilterBtn = filterComponent.querySelector(".add-filter");
    let filterList = filterComponent.querySelector(".filter-list");
    let filtersContainter = filterComponent.querySelector(".filters-container");
    // Create filter list
    filterConfig.filters.forEach(filter => {
        filterList.appendChild(createFilterItemForItemList(filter));
    })

    // Triger when click out the filterList to close it
    document.addEventListener("click", (e) => {
        if (!filterList.contains(e.target) && !addFilterBtn.contains(e.target)) {
            filterList.classList.add("collapse");
        }
    });

    // Handle the outside lick to close the filter function
    document.addEventListener("click", (e) => {
        if (!filtersContainter.contains(e.target) && !filterList.contains(e.target)) {
            filtersContainter.querySelectorAll(".filter-item").forEach(filterItem => {
                filterItem.classList.remove("filter-item-selected");
            })
        }
    });

    addFilterBtn.addEventListener("click", () => {
        filterList.classList.toggle("collapse");
        // Close all opening filter function in the filters container
        filtersContainter.querySelectorAll(".filter-item").forEach(filterItem => {
            filterItem.classList.remove("filter-item-selected");
        })
    });
}

function createFilterItemForItemList(filter) {
    let filterItem = document.createElement("div");
    filterItem.id = `${filter.filterId}`;
    filterItem.classList.add("filter-list-item");
    filterItem.setAttribute("data-filter-type", `${filter.filterType}`);
    filterItem.innerHTML = `${filter.filterName}`
    filterItem.addEventListener("click", () => {
        filterItem.classList.add("collapse");
        filterItem.parentNode.classList.add("collapse");
        addNewFilter(filterItem);
    })
    return filterItem;
}

function searchOnFilterList(e) {
    let filterList = e.parentNode;
    let filterItems = filterList.querySelectorAll(".filter-list-item:not(.collapse)");
    let query = e.value;
    filterItems.forEach(filterItem => {
        if (removeDiacritics(filterItem.innerHTML.toLowerCase()).indexOf(removeDiacritics(query.toLowerCase())) > -1) {
            filterItem.style.display = "";
        } else {
            filterItem.style.display = "none";
        }
    })
}

function searchOnFilterChoiceSearch(e) {
    let filterOptions = e.parentNode.parentNode.querySelectorAll(".filter-option:not(.filter-option-selected)");
    let query = e.value;
    filterOptions.forEach(filterOption => {
        if (removeDiacritics(filterOption.querySelector("span").innerHTML.toLowerCase()).indexOf(removeDiacritics(query.toLowerCase())) > -1) {
            filterOption.style.display = "";
        } else {
            filterOption.style.display = "none";
        }
    })
}

function addNewFilter(event) {
    let filterId = event.id;
    let filterName = event.innerHTML;
    let filterType = event.getAttribute("data-filter-type");

    let filtersContainer = event.parentNode.nextElementSibling;

    if (filtersContainer.children.length === 1) {
        filtersContainer.children[0].classList.add("collapse");
    }

    if (filterType === 'choice-check') {
        let filterItem = createChoiceCheck(filterId, filterName);
        filtersContainer.appendChild(filterItem);
        openFilterFunction(filterItem.querySelector(".filter-btn"));
    } else if (filterType === 'choice-search') {
        let filterItem = createChoiceSearch(filterId, filterName);
        filtersContainer.appendChild(filterItem);
        openFilterFunction(filterItem.querySelector(".filter-btn"));
    } else if (filterType === 'date') {
        let filterItem = createFilterDate(filterId, filterName);
        dateFilterHandlers(filterItem);
        filtersContainer.appendChild(filterItem);
    }
}

function createChoiceCheck(filterId, filterName) {
    let filterItem = document.createElement("div");
    filterItem.id = `${filterId}`;
    filterItem.classList.add("filter-item");
    filterItem.setAttribute("data-filter-type", "choice-check");
    filterItem.innerHTML = `
                <div class="filter-btn" onclick="openFilterFunction(this)">
                    <i class="bi bi-check2-circle"></i>
                    <span>${filterName}</span>
                    <span><span>
                    <i class="bi bi-caret-down-fill"></i>
                </div>
                <div class="filter-function-container">
                    <div class="filter-function-header">
                        <strong>${filterName}</strong>
                    </div>
                    <div class="filter-function-content">
                    </div>
                    <div class="filter-function-footer">
                        <button onclick="clearChoiceOption(this)">Bỏ chọn tất cả</button>
                    </div>
                </div>
            `;
    return filterItem;
}

function clearChoiceOption(e) {
    let filterOptions = e.parentNode.parentNode.querySelector(".filter-function-content");
    filterOptions.querySelectorAll("input").forEach(input => {
        input.checked = false;
    })
    e.parentNode.parentNode.parentNode.classList.remove("applied-filter");
    let filterBtn = e.parentNode.parentNode.parentNode.querySelector(".filter-btn");
    filterBtn.children[1].querySelectorAll("span").forEach(span => {
        span.remove();
    });
}

function createChoiceSearch(filterId, filterName) {
    let filterItem = document.createElement("div");
    filterItem.id = `${filterId}`;
    filterItem.classList.add("filter-item");
    filterItem.setAttribute("data-filter-type", "choice-search");
    filterItem.innerHTML = `
                <div class="filter-btn" onclick="openFilterFunction(this)">
                    <i class="bi bi-check2-circle"></i>
                    <span>${filterName}</span>
                    <span><span>
                    <i class="bi bi-caret-down-fill"></i>
                </div>
                <div class="filter-function-container">
                    <div class="filter-function-header">
                        <strong>${filterName}</strong>
                    </div>
                    <div class="filter-function-content">
                        <div class="search-result-container">
                            <label for="filter-function-search-input"></label>
                            <input type="text" class="option-search" id="filter-function-search-input"
                                placeholder="Tìm kiếm..." oninput="searchOnFilterChoiceSearch(this)">
                        </div>
                    </div>
                </div>`;
    return filterItem;
}

function createFilterDate(filterId, filterName) {
    let filterItem = document.createElement("div");
    filterItem.id = `${filterId}`;
    filterItem.classList.add("filter-item");
    filterItem.classList.add("filter-item-date");
    filterItem.classList.add("filter-item-selected");
    filterItem.setAttribute("data-filter-type", "date");
    filterItem.innerHTML = `
                <div class="filter-btn" onclick="openFilterFunction(this)">
                    <i class="bi bi-check2-circle"></i>
                    <span>${filterName}</span>
                    <i class="bi bi-caret-down-fill"></i>
                </div>
                <div class="filter-function-container">
                    <div class="filter-function-header">
                        <strong>${filterName}</strong>
                    </div>
                    <div class="filter-function-content">
                        <div class="form-check form-switch" style="width: 90%; margin-left: 5px">
                            <input class="form-check-input" type="checkbox" role="switch" id="dateRangeCheck">
                            <label class="form-check-label" for="dateRangeCheck">Khoảng thời gian</label>
                        </div>
                        <div class="filter-one-date">
                            <label for="filter-one-date"></label>
                            <input type="date" id="filter-one-date" class="filter-search" placeholder="Chọn một ngày">
                        </div>
                        <div class="filter-date-range collapse">
                            <label for="filter-date-start"></label>
                            <input type="date" id="filter-date-start" class="filter-search" placeholder="Ngày bắt đầu">
                            <label for="filter-date-end"></label>
                            <input type="date" id="filter-date-end" class="filter-search" placeholder="Ngày Kết thúc">
                        </div>

                        <div id="filter-date-picker"></div>
                    </div>
                </div>
            `;

    return filterItem;
}

function openFilterFunction(event) {
    let filtersContainer = event.parentNode.parentNode;
    let filterItems = filtersContainer.querySelectorAll(".filter-item");
    // Colse all opening filter function in the filters container
    filterItems.forEach(filterItem => {
        if (filterItem.classList.contains("filter-item-selected") && filterItem !== event.parentNode) {
            filterItem.classList.remove("filter-item-selected");
        }
    })

    addOptions(event.parentNode, event.parentNode.getAttribute("data-filter-type"));

    event.parentNode.classList.toggle("filter-item-selected");
}

function addOptions(element, filterType) {
    if (filterType === "choice-check") {
        addChoiceCheckOption(element, checkOptions);
    } else if (filterType === "choice-search") {
        addChoiceSearchOption(element, checkOptions);
    }
}

// Filter handler functions

const checkOptions = [
    {
        id: "filter-option-1",
        name: "Lựa chọn 1",
        checked: false
    },
    {
        id: "filter-option-2",
        name: "Option 2",
        checked: false
    },
    {
        id: "filter-option-3",
        name: "Option 3",
        checked: false
    },
    {
        id: "filter-option-4",
        name: "Option 4",
        checked: false
    }
]

function addChoiceCheckOption(filterElement, data) {
    let filterContent = filterElement.querySelector(".filter-function-content");
    let currFilterOptions = filterContent.querySelectorAll(".filter-option");
    data.forEach(option => {
        let isExist = false;
        currFilterOptions.forEach(currOption => {
            if (currOption.id === option.id) {
                isExist = true;
            }
        })

        if (!isExist) {
            let divOption = document.createElement("div");
            divOption.classList.add("filter-option");
            divOption.id = option.id;
            divOption.innerHTML = `
                        <input type="checkbox" name="filter-option" id="${option.id}">
                        <label for="${option.id}">${option.name}</label>
                    `;
            filterContent.appendChild(divOption);

            divOption.querySelector("input").addEventListener("change", (e) => {
                let filterBtn = filterElement.querySelector(".filter-btn span:nth-child(2)");
                let filterBtnText = filterBtn.innerHTML;
                let selectedOptionsAmount = filterElement.querySelectorAll(".filter-option input:checked").length;
                if (e.target.checked) {
                    filterElement.classList.add("applied-filter");
                    filterBtn.innerHTML = `${filterBtnText} <span>| ${option.name}</span>`;
                } else {
                    filterBtn.innerHTML = filterBtnText.replace(`<span>| ${option.name}</span>`, "");
                    if (filterElement.querySelectorAll(".filter-option input:checked").length === 0) {
                        filterElement.classList.remove("applied-filter");
                    }
                }
            });

            divOption.addEventListener("click", (e) => {
                if (e.target.tagName !== "INPUT") {
                    divOption.querySelector("input").click();
                }
            })
        }
    })
}



function addChoiceSearchOption(filterElement, data) {
    console.log('running');
    let filterContent = filterElement.querySelector(".filter-function-content");
    let currFilterOptions = filterContent.querySelectorAll(".filter-option");
    let resultContainer = filterElement.querySelector(".search-result-container")
    let selectedOptions = filterElement.querySelectorAll(".filter-option-selected");
    data.forEach(option => {

        // Using id to check if this option is exist in the filter content
        let isExist = false;
        currFilterOptions.forEach(currOption => {
            if (currOption.id === option.id) {
                isExist = true;
            }
        })

        selectedOptions.forEach(selectedOption => {
            if (selectedOption.id === option.id) {
                isExist = true;
            }
        })

        if (!isExist) {
            let divOption = document.createElement("div");
            divOption.classList.add("filter-option");
            divOption.id = option.id;
            divOption.setAttribute('onclick', "selectSearchOption(this)")
            divOption.innerHTML = `
                    <span>${option.name}</span> <i class="bi bi-x" onclick="unselectSearchOption(this)"></i>
                    `;
            filterContent.appendChild(divOption);
        }
    })
}

function selectSearchOption(e) {
    e.classList.add("filter-option-selected");
    let resultContainer = e.parentNode.querySelector(".search-result-container");
    let item = resultContainer.parentNode.parentNode.parentNode;
    let selectedOptionsAmount = resultContainer.querySelectorAll(".filter-option-selected").length;
    let filterBtn = item.querySelector(".filter-btn span");
    resultContainer.insertBefore(e, resultContainer.firstChild);

    item.classList.add("applied-filter");
    filterBtn.innerHTML = `${filterBtn.innerHTML} <span>| ${e.querySelector("span").innerHTML}</span>`;
    e.onclick = null;
}

function unselectSearchOption(e) {
    let optionsContainer = e.parentNode.parentNode.parentNode;
    let filterItem = optionsContainer.parentNode.parentNode;
    let filterBtn = filterItem.querySelector(".filter-btn span");
    let selectedOptionsAmount = optionsContainer.querySelectorAll(".filter-option-selected").length;
    let divOption = e.parentNode;

    filterBtn.innerHTML = filterBtn.innerHTML.replace(`<span>| ${divOption.querySelector("span").innerHTML}</span>`, "");
    if (selectedOptionsAmount === 1) {
        filterItem.classList.remove("applied-filter");
    }

    divOption.classList.remove("filter-option-selected");
    optionsContainer.insertBefore(divOption, optionsContainer.children[1]);



    divOption.addEventListener("click", (e) => {
        if (e.target.tagName === 'DIV') {
            selectSearchOption(e.target);
        } else if (e.target.tagName === 'SPAN') {
            selectSearchOption(e.target.parentNode);
        }
    })
}


function convertDateFormat(inputDate) {
 
    var dateParts = inputDate.split('/');
    var day = dateParts[0];
    var month = dateParts[1];
    var year = dateParts[2];

    // Create a new Date object using the components
    var formattedDate = new Date(`${year}-${month}-${day}`);

    // Extract the formatted date in "YYYY-MM-DD" format
    var result = formattedDate.toISOString().split('T')[0];

    return result;
}

function dateFilterHandlers(element) {

    let filterBtnText = element.querySelector(".filter-btn span");
    console.log(filterBtnText);

    const defaultBtnText = filterBtnText.innerHTML;
    console.log(defaultBtnText)

    let calendarDiv = element.querySelector("#filter-date-picker");

    let calendar = flatpickr(calendarDiv, {
        mode: "single",
        dateFormat: "d/m/Y",
        inline: true
    });

    let dateRangeCheck = element.querySelector("#dateRangeCheck");
    let filterOneDate = element.querySelector(".filter-one-date");
    let filterDateRange = element.querySelector(".filter-date-range");

    let filterOneDateInput = element.querySelector("#filter-one-date");
    let filterDateStartInput = element.querySelector("#filter-date-start");
    let filterDateEndInput = element.querySelector("#filter-date-end");

    let selectedDates = [];

    calendar.set("onChange", function (selectedDates, dateStr, instance) {
        if (dateStr.length === 0) {
            element.classList.remove("applied-filter");
            filterOneDateInput.value = "";
            return;
        }
        element.classList.add("applied-filter");
        filterBtnText.innerHTML = `${defaultBtnText} <span>| ${dateStr}</span>`;
        filterOneDateInput.value = convertDateFormat(dateStr);
    });

    filterOneDateInput.addEventListener("input", (e) => {
        let inputVal = e.target.value;
        calendar.setDate(new Date(inputVal));
    });

    dateRangeCheck.addEventListener("change", () => {
        if (dateRangeCheck.checked) {
            filterOneDate.classList.add("collapse");
            filterDateRange.classList.remove("collapse");
            calendar.setDate([]);
            calendar.set("mode", "range")

            calendar.set("onChange", function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 0) {
                    element.classList.remove("applied-filter");
                    filterDateStartInput.value = "";
                    filterDateEndInput.value = "";
                    return;
                }
                element.classList.add("applied-filter");
                filterBtnText.innerHTML = `${defaultBtnText} <span>| ${dateStr}</span>`;
                filterDateStartInput.value = convertDateFormat(dateStr.split(" to ")[0]);
                filterDateEndInput.value = convertDateFormat(dateStr.split(" to ")[1]);
            });

            filterDateStartInput.eventListener = null;
            filterDateEndInput.eventListener = null;

            filterDateStartInput.addEventListener("input", (e) => {
                let inputVal = e.target.value;
                selectedDates[0] = new Date(inputVal);
                calendar.setDate(selectedDates);
            });

            filterDateEndInput.addEventListener("input", (e) => {
                let inputVal = e.target.value;
                selectedDates[1] = new Date(inputVal);
                calendar.setDate(selectedDates);
            });

        } else {
            filterOneDate.classList.remove("collapse");
            filterDateRange.classList.add("collapse");
            calendar.setDate([]);
            calendar.set("mode", "single");

            filterOneDateInput.eventListener = null;

            calendar.set("onChange", function (selectedDates, dateStr, instance) {
                if (selectedDates.length === 0) {
                    element.classList.remove("applied-filter");
                    filterOneDateInput.value = "";
                    return;
                }
                element.classList.add("applied-filter");
                filterBtnText.innerHTML = `${defaultBtnText} <span>| ${dateStr}</span>`;
                filterOneDateInput.value = convertDateFormat(dateStr);
            });

            filterOneDateInput.addEventListener("input", (e) => {
                let inputVal = e.target.value;
                calendar.setDate(new Date(inputVal));
            });
        }
    })

}