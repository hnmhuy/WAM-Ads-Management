let selectedLabelId = null;
let labelTable = null;
let rowHolder = null;
let noDataRow = null;

document.addEventListener("DOMContentLoaded", function () {
  rowHolder = document.getElementById("row-holder");
  noDataRow = document.getElementById("no-data");
  console.log(noDataRow);
  const allLabels = document.querySelectorAll(".label");
  labelTable = document.querySelector(".label-table");
  allLabels.forEach((label) => {
    label.addEventListener("click", () => {
      allLabels.forEach((label) => label.classList.remove("label-selected"));
      label.classList.add("label-selected");
      selectedLabelId = label.id;
      console.log(selectedLabelId);
      // Reset table label content
      clearTableLabelContent();
      getCategory(selectedLabelId);
      openTable();
    });
  });

});

function clearTableLabelContent() {
  const notification = labelTable.children[0];
  const tableHeader = labelTable.children[1];
  labelTable.innerHTML = ``;
  labelTable.appendChild(notification);
  labelTable.appendChild(tableHeader);
  labelTable.appendChild(rowHolder);
  labelTable.appendChild(noDataRow);
}

function openTable() {
  document.querySelector(".notification").classList.add("collapse");
  rowHolder.classList.remove("collapse");
  noDataRow.classList.add("collapse");
  document.querySelector(".label-table-header").classList.remove("collapse");
}

function addRow(button) {
  button.classList.add("disable-button");
  button.setAttribute("disabled", true);
  appendNewRow();
}

function generateRow(data) {
  let divContainer = document.createElement("div");
  let date = new Date(data.createdAt);
  let createdDate = date.toLocaleDateString("vn-VN");
  divContainer.setAttribute('data-id', data.id);
  divContainer.setAttribute('data-field-id', data.field_id);
  divContainer.setAttribute('new-row', 'false');
  divContainer.className = "label-table-row";
  divContainer.innerHTML = `
    <div class="name-description">
      <div class="name-content">
        <p>${data.name}</p>
      </div>
      <div class="description-content">
        <p>${data.description}</p>
      </div>
    </div>
    <div class="edited-form collapse">
      <form action="">
        <div class="edited-field-container">
          <label for="edited-name-list"></label>
          <textarea class="edited-field name-field" type="text" id="edited-name-list" oninput="validateInput(this)" placeholder="Tên danh mục"></textarea>

          <div class="tooltip-noti collapse name-tooltip"><p>Vui lòng điền tên danh mục</p></div>
          <i class="bi bi-exclamation-circle-fill name-icon collapse" onmouseover="onHoverWarning(this)" onmouseout="mouseOutWarning(this)"></i>

        </div>
        <div class="edited-field-container">

          <label for="edited-description"></label>
          <textarea class="edited-field des-field" type="text" id="edited-description" oninput="validateInput(this)" placeholder="Mô tả" ></textarea>
          
          <div class="tooltip-noti collapse des-tooltip"><p>Vui lòng điền mô tả</p></div>
          <i class="bi bi-exclamation-circle-fill des-icon collapse" onmouseover="onHoverWarning(this)" onmouseout="mouseOutWarning(this)"></i>
        </div>
      </form>
    </div>
    <div class="created-date-content">
      <p class="created-date">${createdDate}</p>
    </div>
    <div class="label-table-edit">
      <button type="button" id="edit" onclick="editContent(this)">
        <i class="bi bi-pencil-fill"></i>
        <p>Chỉnh sửa<p>
      </button>
      <i class="bi bi-trash3" onclick="deleteRow(this)"></i>
    </div>
    <div class="save-cancel-button collapse">
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
  `
  return divContainer;
}

function appendNewRow() {
  let newRow = document.createElement("div");
  newRow.className = "label-table-row";
  newRow.setAttribute("new-row", "true");
  let today = new Date().toLocaleDateString("vn-VN");
  newRow.innerHTML = `
  <div class="name-description collapse">
  <div class="name-content">
    <p>Đất công</p>
  </div>
  <div class="description-content">
    <p>Đất thuộc sở hữu của nhà nước</p>
  </div>
  </div>
  <div class="edited-form">
    <form action="">
      <div class="edited-field-container">
        <label for="edited-name-list"></label>
        <textarea class="edited-field name-field" type="text" id="edited-name-list" oninput="validateInput(this)" placeholder="Tên danh mục"></textarea>

        <div class="tooltip-noti collapse name-tooltip"><p>Vui lòng điền tên danh mục</p></div>
        <i class="bi bi-exclamation-circle-fill name-icon collapse" onmouseover="onHoverWarning(this)" onmouseout="mouseOutWarning(this)"></i>

      </div>
      <div class="edited-field-container">

        <label for="edited-description"></label>
        <textarea class="edited-field des-field" type="text" id="edited-description" oninput="validateInput(this)" placeholder="Mô tả" ></textarea>
        
        <div class="tooltip-noti collapse des-tooltip"><p>Vui lòng điền mô tả</p></div>
        <i class="bi bi-exclamation-circle-fill des-icon collapse" onmouseover="onHoverWarning(this)" onmouseout="mouseOutWarning(this)"></i>
      </div>
    </form>
  </div>
  <div class="created-date-content">
    <p class="created-date">${today}</p>
  </div>
  <div class="label-table-edit collapse">
    <button type="button" id="edit" onclick="editContent(this)">
      <i class="bi bi-pencil-fill"></i>
      <p>Chỉnh sửa<p>
    </button>
    <i class="bi bi-trash3" onclick="deleteRow(this)"></i>
  </div>
  <div class="save-cancel-button ">
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
  `;

  const firstChild = labelTable.children[2];
  labelTable.insertBefore(newRow, firstChild);
}

function editContent(button) {
  const row = button.parentNode.parentNode;
  const table = row.parentNode;
  const addButton = document.getElementById("add-row");

  const nameContent = row.querySelector(".name-content p");
  const descriptionContent = row.querySelector(".description-content p");

  row.querySelector(".name-description").classList.add("collapse");
  row.querySelector(".edited-form").classList.remove("collapse");
  row.querySelector(".label-table-edit").classList.add("collapse");
  row.querySelector(".save-cancel-button").classList.remove("collapse");
  row.querySelector(".name-field").textContent = nameContent.textContent;
  row.querySelector(".des-field").textContent = descriptionContent.textContent;

  addButton.classList.add("disable-button");
  addButton.setAttribute("disabled", true);
}

function saveEdition(button) {
  const row = button.parentNode.parentNode.parentNode;
  const nameIcon = row.querySelector(".name-icon");
  const desIcon = row.querySelector(".des-icon");
  const nameEdited = row.querySelector(".name-field");
  const descriptionEdited = row.querySelector(".des-field");
  const inputName = row.querySelector(".name-content p");
  const inputDescription = row.querySelector(".description-content p");
  const addButton = document.getElementById("add-row");
  // tooltipWarning(row, inputName, inputDescription);

  if (nameEdited.value.trim() !== "" && descriptionEdited.value.trim() !== "") {
    inputName.textContent = nameEdited.value;
    inputDescription.textContent = descriptionEdited.value;

    let newRow = row.getAttribute("new-row");
    if(newRow === "true") {
      let data = {
        name: nameEdited.value,
        description: descriptionEdited.value,
        field_id: selectedLabelId
      }
      let res = createCategory(data);
    } else {
      let data = {
        id: row.getAttribute("data-id"),
        name: nameEdited.value,
        description: descriptionEdited.value,
      }
      let res = updateCategory(data);
    }

    row.querySelector(".name-description").classList.remove("collapse");
    row.querySelector(".edited-form").classList.add("collapse");
    row.querySelector(".label-table-edit").classList.remove("collapse");
    row.querySelector(".save-cancel-button").classList.add("collapse");

    if (addButton.classList.contains("disable-button")) {
      addButton.classList.remove("disable-button");
      addButton.removeAttribute("disabled");
    }
  } else if (nameEdited.value.trim() === "") {
    nameIcon.classList.remove("collapse");
    nameEdited.classList.add("empty-field");
  } else if (descriptionEdited.value.trim() === "") {
    desIcon.classList.remove("collapse");
    descriptionEdited.classList.add("empty-field");
  }
}

function cancelEdition(button) {
  const row = button.parentNode.parentNode.parentNode;
  const addButton = document.getElementById("add-row");

  console.log(addButton);
  console.log(row);
  if (row.getAttribute("new-row") === "true") {
    console.log(13);
    row.remove();
    addButton.classList.remove("disable-button");
    addButton.removeAttribute("disabled");
  } else {
    row.querySelector(".name-description").classList.remove("collapse");
    row.querySelector(".edited-form").classList.add("collapse");
    row.querySelector(".label-table-edit").classList.remove("collapse");
    row.querySelector(".save-cancel-button").classList.add("collapse");

    if (addButton.classList.contains("disable-button")) {
      addButton.classList.remove("disable-button");
      addButton.removeAttribute("disabled");
    }
  }
}

function onHoverWarning(e) {
  let container = e.parentNode;
  let tooltip = container.children[2];

  if (!e.classList.contains("collapse")) {
    tooltip.classList.remove("collapse");
  }
}

function mouseOutWarning(e) {
  let container = e.parentNode;
  let tooltip = container.children[2];

  tooltip.classList.add("collapse");
}

function validateInput(e) {
  let container = e.parentNode;
  let icon = container.children[3];
  let input = container.children[1];

  if (e.value.trim() === "") {
    input.classList.add("empty-field");
    icon.classList.remove("collapse");
  } else {
    input.classList.remove("empty-field");
    icon.classList.add("collapse");
  }
}

function deleteRow(button) {
  const row = button.parentNode.parentNode;
  row.remove();
}

// Data functions
function createCategory(data) {
  fetch('/api/category/createCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      if(data.status === 500){
        console.error('Error:', data.message);
        Toastify({
          text: "Tạo danh mục thất bại",
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
        return null;
      } else {
        noDataRow.classList.add("collapse");
        Toastify({
          text: "Tạo danh mục thành công",
          duration: 3000,
          close: false,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#C1F2B0",
            color: "#000"
          },
          onClick: function(){} // Callback after click
        }).showToast();
        return data.data;
      }
    })
    .catch((err) => {
      console.error('Error:', err);
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
        onClick: function(){} // Callback after click
      }).showToast();
    })
}

function getCategory(fieldID) {
  fetch(`/api/category/getCategory?fieldId=${fieldID}`)
    .then(res => res.json())
    .then(res => {
      console.log(res.data);
      if(res.data.length === 0) {
        noDataRow.classList.remove("collapse");
        rowHolder.classList.add("collapse");
        return;
      }
      rowHolder.classList.add("collapse");
      res.data.forEach(item => {
        let row = generateRow(item);
        labelTable.appendChild(row);
      })
    })
}

function updateCategory(data) {
  fetch('/api/category/updateCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      if(data.status === 500){
        console.error('Error:', data.message);
        Toastify({
          text: "Cập nhật danh mục thất bại",
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
        return;
      } else {
        Toastify({
          text: "Cập nhật danh mục thành công",
          duration: 3000,
          close: false,
          gravity: "bottom",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "#C1F2B0",
            color: "#000"
          },
          onClick: function(){} // Callback after click
        }).showToast();
        return data.data;
      }
    }).catch((err) => {
      console.error('Error:', err);
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
        onClick: function(){} // Callback after click
      }).showToast();
    })
}