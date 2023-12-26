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
    console.log(districtValue.getAttribute("data-id"));
    let idDistrict = districtValue.getAttribute("data-id");
    console.log(idDistrict);
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

function onClickStatusDropdown(e) {
  const arrow = e.children[1];
  const optionList = e.querySelectorAll("li");
  const statusValue = e.children[0];
  const selectedDisplay = e.querySelector(".selected-display");

  if (e.classList.contains("active")) {
    handleDropdown(e, arrow, false);
  } else {
    let currentActive = document.querySelector(
      ".status-wrapper-dropdown.active"
    );
    if (currentActive) {
      let anotherArrow = currentActive.children[1];
      handleDropdown(currentActive, anotherArrow, false);
    }
    handleDropdown(e, arrow, true);
  }
  for (let o of optionList) {
    o.addEventListener("click", () => {
      let selectedValue = o.getAttribute("value");  

      if (selectedValue === "ON") {
        e.classList.remove("block");
        e.classList.add("on");
      } else if (selectedValue === "BLOCK") {
        e.classList.add("block");
        e.classList.remove("on");
      }
      selectedDisplay.innerHTML = o.innerHTML;
      statusValue.setAttribute("value", `${o.getAttribute("value")}`);
    });
  }
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

// function toggleDropdown(e) {
//   const container = e.parentNode;
//   if (container.classList.contains("active")) {
//     container.classList.remove("active");
//     e.nextElementSibling.classList.remove("rotate");
//   } else {
//     closeAllLocationDropdown();
//     container.classList.add("active");
//     e.nextElementSibling.classList.add("rotate");
//   }
//   console.log(2);
// }

function optionClick(e) {
  const container = e.parentNode.parentNode;
  const selectedField = container.querySelector(".area-selected-display");
  selectedField.textContent = e.textContent;
  selectedField.setAttribute("data-value", e.getAttribute("data-value"));
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
  const optionList = dropdownElement.querySelector(".area-dropdown .dropdown-with-search");
  // Default option is loading holder
  optionList.innerHTML = `
    <li class="area-dropdown-search">
    <input
      type="text"
      class=""
      placeholder="Tìm kiếm...."
      oninput="filterDropdown(this)"
    /></li>
  `

  await fetch("api/area/getArea?opts=hierarchy&includeOfficer=false")
    .then(res => res.json())
    .then(data => {
      optionList.innerHTML = ``;
      data.forEach(item => {
        optionList.appendChild(generateAreaOption(item.district));
        data.commune.forEach(commune => {
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
  console.log(dropdownIconContainer.querySelector(".area-wrapper-dropdown"));
  await generateDropdownArea(dropdownIconContainer.querySelector(".area-wrapper-dropdown"));  
}

function addAccount(event) {
  const form = document.getElementById("register-account");
  if(form.checkValidity() === false) {
    return;
  }
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
  }).then(res => console.log(res));

}

function generateAccountRow(data) {
  console.log(data);
  const row = document.createElement("tr");
  row.setAttribute("onmouseover", "hoverRow(this)");  
  row.setAttribute("onmouseout", "outRow(this)");
  row.setAttribute("data-id", data.id);
  row.innerHTML = `
  <td>
    <div class="name">
      <i class="bi bi-person-circle"></i>
      <p>${data.first_name} ${data.last_name}</p>
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
          data-value="${data.area.id}"
          onclick="toggleDropdownForRow(this)"
        >${data.area.formatedName}</span>
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
    <div class="edit-location"><p class="area-content">${data.area.formatedName}</p>
      <i
        class="bi bi-pencil-fill"
        onclick="onClickPen(this)"
      ></i>
    </div>
  </td>
  <td>
    <div
      class="wrapper-dropdown status-wrapper-dropdown ${data.status === 'active' ? "on" : data.status === 'blocked' ? "block" : ""}"
      onclick="onClickStatusDropdown(this)"
    >
      <span class="selected-display ${data.status === 'active' ? "on" : data.status === 'blocked' ? "block" : ""}" id="status" value="${data.status === 'active' ? "ON" : data.status === 'blocked' ? "BLOCK" : ""}">\
      ${data.status === 'active' ? "Đang hoạt động" : data.status === 'blocked' ? "Đã khóa" : ""}
      </span>
      <i class="bi bi-chevron-down status-icon"></i>
      <ul class="status-dropdown">
        <li class="status-item" value="ON"><p class="on status">Đang hoạt
            động</p></li>
        <li class="status-item" value="BLOCK"><p class="block status">Đã
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
  tableBody.appendChild(generateAccountRow(data));
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