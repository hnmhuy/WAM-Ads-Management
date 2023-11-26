document.addEventListener("DOMContentLoaded", function () {
  const allLabels = document.querySelectorAll(".label");

  allLabels.forEach((label) => {
    label.addEventListener("click", () => {
      allLabels.forEach((label) => label.classList.remove("label-selected"));
      label.classList.add("label-selected");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const allCancelButtons = document.querySelectorAll("#cancel");
  const allSaveButtons = document.querySelectorAll("#save");
  const allEditButtons = document.querySelectorAll("#edit");
  const addButton = document.querySelector("#add-row");

  allEditButtons.forEach((editButton) => {
    editButton.addEventListener("click", () => {
      const row = editButton.parentNode.parentNode;
      const nameContent = row.querySelector(".name-content p");
      const descriptionContent = row.querySelector(".description-content p");

      console.log(editButton.parentNode.parentNode);
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
    });
  });

  allSaveButtons.forEach((saveButton) => {
    saveButton.addEventListener("click", () => {
      const row = saveButton.parentNode.parentNode.parentNode;
      const nameEdited = row.querySelector("#edited-name-list").value;
      const descriptionEdited = row.querySelector("#edited-description").value;
      const inputName = row.querySelector(".name-content p");
      const inputDescription = row.querySelector(".description-content p");

      inputName.textContent = nameEdited;
      inputDescription.textContent = descriptionEdited;

      row.querySelector(".name-description").classList.remove("collapse");
      row.querySelector(".edited-form").classList.add("collapse");
      row.querySelector(".label-table-edit").classList.remove("collapse");
      row.querySelector(".save-cancel-button").classList.add("collapse");
    });
  });

  //   allCancelButtons.forEach((cancelButton) => {
  //     cancelButton.addEventListener("click", () => {
  //       const row = cancelButton.parentNode.parentNode.parentNode;
  //       cancelEdition(row);
  //     });
  //   });

  addButton.addEventListener("click", () => {
    appendNewRow();
  });
});

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
            <label for="edited-name-list"></label>
            <input class="edited-field" type="text" id="edited-name-list" />
            <label for="edited-description"></label>
            <input class="edited-field" type="text" id="edited-description" />
        </form>
      </div>
      <div class="created-date-content">
        <p class="created-date">29/10/2023</p>
      </div>
      <div class="label-table-edit collapse">
        <button type="button" id="edit">
          <i class="bi bi-pencil-fill"></i>
          <p>Chỉnh sửa<p>
        </button>
      </div>
      <div class="save-cancel-button">
        <div class="save-button">
          <button type="button" id="save">
            <i class="bi bi-check2-circle"></i>
            <p>Lưu</p>
          </button>
        </div>
        <div class="cancel-button">
          <button type="button" id="cancel" onclick="cancelEdition(this.parentNode.parentNode.parentNode)">
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

function cancelEdition(row) {
  console.log(row);
  if (row.getAttribute("new-row") === "true") {
    console.log(13);
    row.remove();
  } else {
    row.querySelector(".name-description").classList.remove("collapse");
    row.querySelector(".edited-form").classList.add("collapse");
    row.querySelector(".label-table-edit").classList.remove("collapse");
    row.querySelector(".save-cancel-button").classList.add("collapse");
  }
}
