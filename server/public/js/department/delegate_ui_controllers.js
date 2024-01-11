let areaLevel = null;
let noDataRow = null;
let loadingRow = null;
let areaData = null;

document.addEventListener("DOMContentLoaded", function () {
  noDataRow = document.querySelector("#nodata");
  loadingRow = document.querySelector("#loading-holder");
});

function handleDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.add("rotate");
    dropdown.classList.add("active");
  } else {
    arrow.classList.remove("rotate");
    dropdown.classList.remove("active");
  }
}

function toggleDropdown(e) {
  const container = e.parentNode;
  closeAllOtherDropdown(container);
  const arrow = container.querySelector("i");
  arrow.classList.toggle("rotate");
  container.classList.toggle("active");  
}

function toggleDropdownForRow(e) {
  toggleDropdown(e);
}

function closeAllOtherDropdown(e) {
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    if (selected !== e) {
      let arrow = selected.children[1];
      handleDropdown(selected, arrow, false);
    }
  });
}

function restoreDropdown(e, content, isDisabled) {
  const selectedField = e.querySelector(".selected-display");
  selectedField.textContent = content;
  if (isDisabled) {
    e.classList.add("disabled");
  } else {
    e.classList.remove("disabled");
  }
  selectedField.setAttribute("data-id", "");
}

function selecteOption(e) {
  const container = e.parentNode.parentNode;
  const selectedField = container.querySelector(".selected-display");
  let id = e.getAttribute("data-id");
  selectedField.textContent = e.textContent;
  selectedField.setAttribute("data-id", id);

  toggleDropdown(container.querySelector("i"));

  let level = container.getAttribute("data-level");
  if(level == 1 && areaLevel != null) {
    if(areaLevel == 2 && id != "") {
      const ward = document.querySelector("#ward-dropdown");  
      restoreDropdown(ward, "Chọn Phường", false);
      ward.classList.remove("disabled");
      fetchAndAppendOptionDropdown(`/api/area/getArea?opts=db&level=2&idDistrict=${id}`, ward.querySelector(".dropdown"));
    }
  }
}

function closeAllDropdown() {
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    let arrow = selected.children[1];
    handleDropdown(selected, arrow, false);
  });
}

window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllDropdown();
  }
});

function generateOptionDropdown(data) {
  let option = document.createElement("li");
  option.setAttribute("data-id", data.id);
  option.innerHTML = data.name;
  option.setAttribute("onclick", "selecteOption(this)");
  return option;
}

function fetchAndAppendOptionDropdown(url, dropdown) {
  dropdown.innerHTML = `
  <div class="spinner-border" role="status" style="display: flex; justify-content: center">
    <span class="sr-only"></span>
  </div>
  `;

  fetch(url).then(res => res.json()).then(data => {
    let optionData = data.data;
    dropdown.innerHTML = "";
    if(optionData.length === 0) {
      dropdown.innerHTML = `
      <li style="color: red">Không có dữ liệu</li>
      `
      return;
    }
    optionData.forEach(item => {
      dropdown.appendChild(generateOptionDropdown(item));
    })
  })
}

function onClickDropdown(e, id) {
  const container = e.parentNode;
  const ward = container.children[1];
  const wardSelected = ward.children[0];
  const districtValue = e.children[0];
  const optionList = e.querySelectorAll("li");
  const arrow = e.children[1];
  let newValue;
  if (e.classList.contains("active")) {
    handleDropdown(e, arrow, false);
  } else {
    let currentActive = document.querySelector(".wrapper-dropdown.active");
    if (currentActive) {
      let anotherArrow = currentActive.children[1];
      handleDropdown(currentActive, anotherArrow, false);
    }
    handleDropdown(e, arrow, true);
  }
  for (let o of optionList) {
    o.addEventListener("click", () => {
      if (e.id === "district-dropdown") {
        ward.style.border = "1px solid rgba(0, 0, 0, 0.2)";
        wardSelected.setAttribute("value", "");
        wardSelected.textContent = "Chọn Phường";
      }
      e.querySelector(".selected-display").innerHTML = o.innerHTML;
      districtValue.setAttribute("data-id", `${o.getAttribute("data-id")}`);
    });
  }

  if (districtValue.textContent !== "Chọn Quận") {
    e.style.borderColor = "#4f3ed7";
    let idDistrict = districtValue.getAttribute("data-id");
    fetchAndAppendOptionDropdown(`/api/area/getArea?opts=db&level=2&idDistrict=${idDistrict}`, ward.querySelector(".dropdown"));
  }

  if (id == "ward") {
    if (districtValue.textContent !== "Chọn Quận") {
      e.style.borderColor = "#4f3ed7";
      ward.classList.remove("disabled");
      ward.setAttribute("onclick", "onClickWard(this)");
    } else {
      ward.classList.add("disabled");
    }
  }
}

function onClickWard(e) {
  if (!e.classList.contains("disabled")) {
    onClickDropdown(e);
  }
}

function onClickRadio(e) {
  const createForm = e.parentNode.parentNode.parentNode;
  const districtDropdown = createForm.querySelector("#district-dropdown");
  const wardDropdown = createForm.querySelector("#ward-dropdown");
  const id = e.getAttribute("id");

  districtDropdown.classList.remove("disabled");
  restoreDropdown(districtDropdown, "Chọn Quận", false);
  restoreDropdown(wardDropdown, "Chọn Phường", true);

  if (id === "district") {
    areaLevel = 1;
  } else if (id === "ward") {
    areaLevel = 2;
  }
}

function openAccountForm() {
  const form = document.querySelector("#create-account-form");
  const overlay = document.querySelector(".overlay");
  form.classList.remove("collapse");
  overlay.classList.remove("collapse");
  fetchAndAppendOptionDropdown("/api/area/getArea?opts=db&level=1", document.querySelector('#district-dropdown .dropdown'));
}

function resetForm() {
  const form = document.querySelector('#register-account');
  form.reset();
  restoreDropdown(document.querySelector("#district-dropdown"), "Chọn Quận", true);
  restoreDropdown(document.querySelector("#ward-dropdown"), "Chọn Phường", true);
}

function closeAccountForm() {
  const form = document.querySelector("#create-account-form");
  const overlay = document.querySelector(".overlay");
  resetForm();
  form.classList.add("collapse");
  overlay.classList.add("collapse");
}

function hoverRow(e) {
  e.querySelector(".bi-pencil-fill").style.visibility = "visible";
}

function outRow(e) {
  e.querySelector(".bi-pencil-fill").style.visibility = "hidden";
}

window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllStatusDropdown();
  }
});

function closeAllStatusDropdown() {
  const selectedAll = document.querySelectorAll(".status-wrapper-dropdown");
  selectedAll.forEach((selected) => {
    let arrow = selected.children[1];

    handleDropdown(selected, arrow, false);
  });
}

function selectStatus(container, selectedDisplay, value) {
  if (value === "ON") {
    container.classList.remove("block");
    container.classList.add("on");
  } else if (value === "BLOCK") {
    container.classList.add("block");
    container.classList.remove("on");
  }

  selectedDisplay.innerHTML = container.querySelector(`.status-item[value='${value}'`).innerHTML;
  selectedDisplay.setAttribute("value", value);
}

async function upadteStatusAccount(element, newStatus, originalStatus, uid) {
  const container = element.parentNode.parentNode;
  const selectedDisplay = container.querySelector(".selected-display");
  const url = "/api/delegate/updateOfficer";
  let dbStatus;
  if (newStatus === 'ON') {
    dbStatus = 'active';
  } else if (newStatus === 'BLOCK') {
    dbStatus = 'blocked';
  }
  const formData = new FormData();
  formData.set("opt", "status");
  formData.set("uid", uid);
  formData.set("status", dbStatus);

  selectStatus(container, selectedDisplay, newStatus)

  fetch(url, {
    method: "POST",
    body: formData,
  }).then(res => {
    if(res.status === 200) {
      return res.json();
    }
    selectStatus(container, selectedDisplay, originalStatus);
    displayNotification("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
    throw new Error(res.statusText);
  }).then(data => {
    if(data.message === 'success') {
      displayNotification("Cập nhật thành công", "success");
    } else if (data.message === 'error') {
      selectStatus(container, selectedDisplay, originalStatus);
      console.log(data);
      displayNotification("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
    }
  }).catch(err => {
    selectStatus(container, selectedDisplay, originalStatus);
    displayNotification(err, "error");
    console.log(err);
  })

  closeStatusDropdown(container);
}

function closeStatusDropdown(container) {
  container.classList.remove("active");
  container.querySelector(".status-icon").classList.remove("rotate");
}

function onclickStatusDropdown(e) {
  const container = e.parentNode;
  const arrow = container.querySelector(".status-icon");
  const currentActive = document.querySelector(".status-wrapper-dropdown.active");
  if(currentActive && currentActive !== container) {
    closeStatusDropdown(currentActive);
  }
  container.classList.toggle("active");
  arrow.classList.toggle("rotate");
}

// Dropdown UI controller
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterDropdown(e) {
  const list = e.parentNode.parentNode.querySelectorAll(".item");
  list.forEach((item) => {
    if (
      removeDiacritics(item.textContent.toLowerCase()).indexOf(
        removeDiacritics(e.value.toLowerCase())
      ) > -1
    ) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

window.addEventListener("click", function (e) {
  if (e.target.closest(".area-wrapper-dropdown") === null) {
    closeAllLocationDropdown();
  }
});

function closeAllLocationDropdown() {
  document.querySelectorAll(".area-wrapper-dropdown").forEach((item) => {
    item.classList.remove("active");
    item.children[1].classList.remove("rotate");
  });
}

function optionClick(e) {
  const container = e.parentNode.parentNode;
  const selectedField = container.querySelector(".area-selected-display");
  selectedField.textContent = e.textContent;
  selectedField.setAttribute("data-value", e.getAttribute("data-value"));
  selectedField.setAttribute("data-currName", e.textContent);
  container.classList.remove("active");
  container.children[1].classList.remove("rotate");
}

//EDIT area

function generateAreaOption(data) {
  const li = document.createElement("li");
  li.classList.add("item");
  li.setAttribute("data-value", data.id);
  li.setAttribute("onclick", "optionClick(this)");
  li.innerHTML = data.formatedName;
  return li;
}

async function generateDropdownArea(dropdownElement) {
  console.log(dropdownElement);
  const optionList = dropdownElement.querySelector(".area-dropdown");
  // Default option is loading holder
  optionList.innerHTML = `
    <li class="area-dropdown-search">
    <input
      type="text"
      class=""
      placeholder="Tìm kiếm...."
      oninput="filterDropdown(this)"
    /></li>
    <li class="item">
      <div class="spinner-border" role="status" style="display: flex; justify-content: center">
        <span class="sr-only"></span>
      </div>
    </li>
  `

  await fetch("api/area/getArea?opts=hierarchy&includeOfficer=false")
  .then(res => res.json())
  .then(data => {
      optionList.innerHTML = `
        <li class="area-dropdown-search">
        <input
          type="text"
          class=""
          placeholder="Tìm kiếm...."
          oninput="filterDropdown(this)"
        /></li>
      `
      data.forEach(item => {
        optionList.appendChild(generateAreaOption(item.district));
        item.commune.forEach(commune => {
        optionList.appendChild(generateAreaOption(commune));
      })
    })
  })
}

async function onClickPen(e) {
  const row = e.parentNode.parentNode.parentNode;
  // const overlay = row.parentNode.parentNode.querySelector(".table-overlay");\
  const deligateTable = row.parentNode.parentNode.parentNode;
  const overlay = deligateTable.querySelector(".table-overlay");
  const statusDropdown = row.querySelector(".status-wrapper-dropdown");
  const container = e.parentNode.parentNode;
  const dropdownIconContainer = container.children[0];
  const editLocation = container.children[1];

  row.classList.add("absolute");
  row.style.border = "1px solid rgba(0,0,0,1)";
  overlay.classList.remove("collapse");

  statusDropdown.classList.add("disabled-dropdown");
  editLocation.classList.add("collapse");
  dropdownIconContainer.classList.remove("collapse");
  await generateDropdownArea(dropdownIconContainer.querySelector(".area-wrapper-dropdown"));  
}

function addAccount(event) {
  const form = document.getElementById("register-account");
  const confirmBtn = form.querySelector(".button-confirm");
  if(form.checkValidity() === false) {
    return;
  }
  confirmBtn.disabled = true;
  confirmBtn.classList.add("loading");
  event.preventDefault();
  const formData = new FormData(form);
  const areaLevel = formData.get("areaLevel");

  if(areaLevel != null) {
    if(areaLevel == 1) {
      const delegation = form.querySelector("#district-select").getAttribute("data-id");
      formData.append("delegation", delegation);
    } else if(areaLevel == 2) {
      const delegation = form.querySelector("#ward-select").getAttribute("data-id");
      formData.append("delegation", delegation);
    }
  } else {
    formData.append("areaLevel", "-1");
    formData.append("delegation", "");
  }
  
  const url = "/register";

  fetch(url, {
    method: "POST",
    body: formData,
  }).then(res => {
    if(res.status === 200) {
      return res.json();
    }
    displayNotification("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
  }).then(data => {
    if(data.message === "success") {
      closeAccountForm();
      addNewRow(data.data);
      displayNotification("Thêm tài khoản thành công", "success");
    } else {
      displayNotification(data.data[0].message, "error");
    }
    confirmBtn.disabled = false;
    confirmBtn.classList.remove("loading");
  }).catch(err => {
    displayNotification("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
    confirmBtn.disabled = false;
    confirmBtn.classList.remove("loading");
  })
}

function generateAccountRow(data) {
  const row = document.createElement("tr");
  row.setAttribute("onmouseover", "hoverRow(this)");  
  row.setAttribute("onmouseout", "outRow(this)");
  row.setAttribute("data-id", data.id);
  row.innerHTML = `
  <td>
    <div class="name">
      <i class="bi bi-person-circle"></i>
      <p>${data.last_name} ${data.first_name}</p>
    </div>
  </td>
  <td>${data.email}</td>
  <td>${data.phone}</td>
  <td>
    <div class="dropdown-icon collapse">
      <div
        class="wrapper-dropdown area-wrapper-dropdown"
      >
        <span
          class="area-selected-display"
          id="district-selection"
          data-value="${data.area ? data.area.id : ""}"
          data-id = "${data.area ? data.area.id : ""}"
          data-name = "${data.area ? data.area.formatedName: ""}"
          data-currName = "${data.area ? data.area.formatedName : ""}"
          onclick="toggleDropdownForRow(this)"
        >${data.area ? data.area.formatedName : "Chọn khu vực quản lý"}</span>
        <i class="bi bi-chevron-down"></i>
        <ul class="area-dropdown dropdown-with-search">
          <li class="area-dropdown-search"><input
              type="text"
              class=""
              placeholder="Tìm kiếm...."
              oninput="filterDropdown(this)"
            /></li>
          <li class="item loading" style="display: flex; justify-content: center">
            <div class="spinner-border" role="status">
              <span class="sr-only"></span>
             </div>
          </li>

        </ul>
      </div>
      <div class="save-cancel-button">
        <div class="save-button">
          <button type="button" id="save" onclick="saveEdition(this)">
            <i class="bi bi-check2-circle"></i>
            <p>Lưu</p>
          </button>
        </div>
        <div class="cancel-button">
          <button type="button" id="cancel" onclick="cancelEdition(this)">
            <i class="bi bi-ban"></i>
            <p>Hủy</p>
          </button>
        </div>
      </div>
    </div>
    <div class="edit-location"><p class="area-content">${data.area ? data.area.formatedName : "Chưa phân công khu vực"}</p>
      <i
        class="bi bi-pencil-fill"
        onclick="onClickPen(this)"
      ></i>
    </div>
  </td>
  <td>
    <div
      class="wrapper-dropdown status-wrapper-dropdown ${data.status === 'active' ? "on" : data.status === 'blocked' ? "block" : ""}"
    >
      <span class="selected-display ${data.status === 'active' ? "on" : data.status === 'blocked' ? "block" : ""}" id="status" value="${data.status === 'active' ? "ON" : data.status === 'blocked' ? "BLOCK" : ""}" 
        onclick="onclickStatusDropdown(this)"
      >
      ${data.status === 'active' ? "Đang hoạt động" : data.status === 'blocked' ? "Đã khóa" : ""}
      </span>
      <i class="bi bi-chevron-down status-icon" onclick="onclickStatusDropdown(this)"></i>
      <ul class="status-dropdown">
        <li class="status-item" value="ON" onclick="upadteStatusAccount(this, 'ON', 'BLOCK', '${data.id}')"><p class="on status">Đang hoạt
            động</p></li>
        <li class="status-item" value="BLOCK" onclick="upadteStatusAccount(this, 'BLOCK', 'ON', '${data.id}')"><p class="block status">Đã
            khóa</p></li>
      </ul>

    </div></td>
  <td>${new Date(data.createdAt).toLocaleDateString("vn-VN")}</td>
  `
  return row;
}

function addNewRow(data) {
  if(!noDataRow.classList.contains("collapse")) {
    noDataRow.classList.add("collapse");
  }
  const tableBody = document.querySelector(".deligate-table tbody");
  tableBody.insertBefore(generateAccountRow(data), tableBody.children[1]);
}

fetch("/api/delegate/getOfficer").then(res => res.json()).then(data => {
  if(data.status === 'success') {
    loadingRow.classList.add("collapse");
    if(data.data.length === 0) {
      noDataRow.classList.remove("collapse");
    }
    data.data.forEach(item => {
      addNewRow(item);
    })
  }
})

function editButtonControl(element, isDisabled) {
  const container = element.parentNode.parentNode;
  container.querySelectorAll("button").forEach(item => {
    item.disabled = isDisabled;
  })
}

async function updateOfficer(uid, areaId) {
  const url = "/api/delegate/updateOfficer";
  const formData = new FormData();
  formData.set("opt", "area");  
  formData.set("uid", uid);
  formData.set("areaId", areaId);

  fetch(url, {
    method: "POST",
    body: formData
  }).then(res => {
    if(res.status === 200) {
      return res.json();
    } else {
      displayNotification("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
      throw new Error(res.statusText);
    }
  }).then(data => {
    if(data.status === "success") {
      displayNotification("Cập nhật thành công", "success");
      finishEdit(document.querySelector(`tr[data-id="${uid}"]`), true);
    } else if (data.status === "error") {
      finishEdit(document.querySelector(`tr[data-id="${uid}"]`), false);
      displayNotification("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
    }
  });
}

function finishEdit(row, isSucess) {
  updateAreaDisplay(row, isSucess)
  row.classList.remove("absolute");
  row.querySelector(".dropdown-icon").classList.add("collapse");
  row.style.border = "none";
  document.querySelector(".table-overlay").classList.add("collapse");
  row.querySelector(".status-wrapper-dropdown").classList.remove("disabled-dropdown");
  row.querySelector(".edit-location").classList.remove("collapse");
}

function updateAreaDisplay(row, isSucess) {
  const selectedField = row.querySelector(".area-selected-display");
  if(isSucess) {
    // Update the data-id and data-name
    selectedField.setAttribute("data-id", selectedField.getAttribute("data-value"));
    selectedField.setAttribute('data-name', selectedField.getAttribute("data-currName"));
    row.querySelector(".edit-location .area-content").textContent = selectedField.getAttribute("data-currName");
  } else {
    // Restore the data-value and data-currName
    selectedField.setAttribute("data-value", selectedField.getAttribute("data-id"));
    selectedField.setAttribute('data-currName', selectedField.getAttribute("data-name"));
    selectedField.textContent = selectedField.getAttribute("data-name");
  }
}

async function saveEdition(element) {
  editButtonControl(element, true);
  const row = element.parentNode.parentNode.parentNode.parentNode.parentNode;
  const uid = row.getAttribute('data-id');
  const dropdown = row.querySelector(".area-wrapper-dropdown");
  const areaId = dropdown.querySelector(".area-selected-display").getAttribute("data-value");
  await updateOfficer(uid, areaId);
  editButtonControl(element, false);
}

function cancelEdition(element) {
  console.log('cancel');
  editButtonControl(element, true);
  finishEdit(element.parentNode.parentNode.parentNode.parentNode.parentNode, false);
  editButtonControl(element, false);
}