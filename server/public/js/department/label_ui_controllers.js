document.addEventListener("DOMContentLoaded", function () {
  const allLabels = document.querySelectorAll(".label");

  allLabels.forEach((label) => {
    label.addEventListener("click", () => {
      allLabels.forEach((label) => label.classList.remove("label-selected"));
      label.classList.add("label-selected");
    });
  });
});

function addRow(button) {
  button.classList.add("disable-button");
  button.setAttribute("disabled", true);
  appendNewRow();
}

function appendNewRow() {
  let newRow = document.createElement("div");
  newRow.className = "label-table-row";
  newRow.setAttribute("new-row", "true");
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
      <input class="edited-field name-field" type="text" id="edited-name-list" oninput="validateInput(this)" placeholder="Tên danh mục"/>

      <div class="tooltip-noti collapse name-tooltip"><p>Vui lòng điền tên danh mục</p></div>
      <i class="bi bi-exclamation-circle-fill name-icon collapse" onmouseover="onHoverWarning(this)" onmouseout="mouseOutWarning(this)"></i>

    </div>
    <div class="edited-field-container">

      <label for="edited-description"></label>
      <input class="edited-field des-field" type="text" id="edited-description" oninput="validateInput(this)" placeholder="Mô tả" />
      
      <div class="tooltip-noti collapse des-tooltip"><p>Vui lòng điền mô tả</p></div>
      <i class="bi bi-exclamation-circle-fill des-icon collapse" onmouseover="onHoverWarning(this)" onmouseout="mouseOutWarning(this)"></i>
    </div>
  </form>
</div>
<div class="created-date-content">
  <p class="created-date">29/10/2023</p>
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

  const labelTable = document.querySelector(".label-table");
  const firstChild = labelTable.children[2];
  labelTable.insertBefore(newRow, firstChild);
}

function editContent(button) {
  const row = button.parentNode.parentNode;
  const nameContent = row.querySelector(".name-content p");
  const descriptionContent = row.querySelector(".description-content p");

  row.querySelector(".name-description").classList.add("collapse");
  row.querySelector(".edited-form").classList.remove("collapse");
  row.querySelector(".label-table-edit").classList.add("collapse");
  row.querySelector(".save-cancel-button").classList.remove("collapse");
  row
    .querySelector("#edited-name-list")
    .setAttribute("value", nameContent.textContent);
  row
    .querySelector("#edited-description")
    .setAttribute("value", descriptionContent.textContent);
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
