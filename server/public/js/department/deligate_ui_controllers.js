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

function confirmCreateAcc() 
{
}