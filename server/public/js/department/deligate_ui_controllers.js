function handleDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.add("rotate");
    dropdown.classList.add("active");
  } else {
    arrow.classList.remove("rotate");
    dropdown.classList.remove("active");
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

function onClickDropdown(e, id) {
  const container = e.parentNode;
  const warn = container.children[1];
  const warnSelected = warn.children[0];
  const districtValue = e.children[0];
  const optionList = e.querySelectorAll("li");
  const arrow = e.children[1];
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
        warn.style.border = "1px solid rgba(0, 0, 0, 0.2)";
        warnSelected.setAttribute("value", "");
        warnSelected.textContent = "Chọn Phường";
      }
      e.querySelector(".selected-display").innerHTML = o.innerHTML;
      districtValue.setAttribute("value", `${o.getAttribute("value")}`);
    });
  }

  if (districtValue.textContent !== "Chọn Quận") {
    e.style.borderColor = "#4f3ed7";
  }
  console.log("đây là id:", id);

  if (id == "warn") {
    if (districtValue.textContent !== "Chọn Quận") {
      e.style.borderColor = "#4f3ed7";
      warn.classList.remove("disabled");
      warn.setAttribute("onclick", "onClickWarn(this)");
    } else {
      warn.classList.add("disabled");
    }
  }
}

function onClickWarn(e) {
  if (!e.classList.contains("disabled")) {
    onClickDropdown(e);
  }
}

function onClickRadio(e) {
  const createForm = e.parentNode.parentNode.parentNode;
  const districtDropdown = createForm.querySelector("#district-dropdown");
  const districtSelected = districtDropdown.children[0];
  const warnDropdown = createForm.querySelector("#warn-dropdown");
  const warnSelected = warnDropdown.children[0];
  const id = e.getAttribute("id");

  districtDropdown.classList.remove("disabled");

  if (id === "warn") {
    districtDropdown.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    districtSelected.setAttribute("value", "");
    districtSelected.textContent = "Chọn Quận";
    districtDropdown.setAttribute("onclick", "onClickDropdown(this, 'warn')");
  } else {
    warnDropdown.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    warnSelected.setAttribute("value", "");
    warnSelected.textContent = "Chọn Phường";
    districtDropdown.style.border = "1px solid rgba(0, 0, 0, 0.2)";
    districtSelected.setAttribute("value", "");
    districtSelected.textContent = "Chọn Quận";
    warnDropdown.classList.add("disabled");
    districtDropdown.setAttribute("onclick", "onClickDropdown(this, district)");
  }
}

function openAccountForm() {
  const form = document.querySelector("#create-account-form");
  const overlay = document.querySelector(".overlay");
  form.classList.remove("collapse");
  overlay.classList.remove("collapse");
}

function closeAccountForm() {
  const form = document.querySelector("#create-account-form");
  const overlay = document.querySelector(".overlay");
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
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    let arrow = selected.children[1];

    handleStatusDropdown(selected, arrow, false);
  });
}

function handleStatusDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.add("rotate");
    dropdown.classList.add("active");
    console.log("dropdown", dropdown);
  } else {
    arrow.classList.remove("rotate");
    dropdown.classList.remove("active");
  }
}

function onClickStatusDropdown(e) {
  const arrow = e.children[1];
  const optionList = e.querySelectorAll("li");
  const statusValue = e.children[0];
  const selectedDisplay = e.querySelector(".selected-display");

  if (e.classList.contains("active")) {
    // handleStatusDropdown(e, arrow, false);
    arrow.classList.remove("rotate");
    e.classList.remove("active");
  } else {
    // handleStatusDropdown(e, arrow, true);
    arrow.classList.add("rotate");
    e.classList.add("active");
    console.log("e", e);
  }
  for (let o of optionList) {
    o.addEventListener("click", () => {
      let selectedValue = o.getAttribute("value");
      if (selectedValue == "ON") {
        e.style.backgroundColor = "#baf3db";
        selectedDisplay.style.color = "#216e4e";
        arrow.style.color = "#216e4e";
      } else {
        e.style.backgroundColor = "#ffd5d2";
        selectedDisplay.style.color = "#ae2e24";
        arrow.style.color = "#ae2e24";
      }
      selectedDisplay.innerHTML = o.innerHTML;
      statusValue.setAttribute("value", `${o.getAttribute("value")}`);
    });
  }
}

// Dropdonwn UI controller

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

function toggleDropdown(e) {
  const container = e.parentNode;
  if (container.classList.contains("active")) {
    container.classList.remove("active");
    e.nextElementSibling.classList.remove("rotate");
  } else {
    closeAllLocationDropdown();
    container.classList.add("active");
    e.nextElementSibling.classList.add("rotate");
  }
  console.log(2);
}

function optionClick(e) {
  const container = e.parentNode.parentNode;
  const selectedField = container.querySelector(".area-selected-display");
  selectedField.textContent = e.textContent;
  selectedField.setAttribute("data-value", e.getAttribute("data-value"));
  container.classList.remove("active");
  container.children[1].classList.remove("rotate");
}
