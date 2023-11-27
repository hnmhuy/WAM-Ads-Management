window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllDropdown();
  }
});

function closeAllDropdown() {
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    const optionsContainer = selected.children[2];
    let arrow = selected.children[1];

    handleDropdown(selected, arrow, false);
  });
}

function handleDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.add("rotate");
    dropdown.classList.add("active");
  } else {
    arrow.classList.remove("rotate");
    dropdown.classList.remove("active");
  }
}

function onClickDropdown(e) {
  const container = e.parentNode;
  const warn = container.children[3];
  const warnValue = warn.children[0];
  const stepArrow = container.children[2];
  const districtValue = e.children[0];
  const optionList = e.querySelectorAll("li");
  const arrow = e.children[1];
  const mainContainer = e.parentNode.parentNode;
  const noLocation = mainContainer.querySelector(".no-location");
  const feedbackTable = mainContainer.querySelector(".feedback-table");
  const feedbackDetailContainer = mainContainer.querySelector(".feedback-detail");

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
      districtValue.setAttribute("value",`${o.getAttribute("value")}`);
    });
  }

  if (districtValue.textContent !== "Chọn Quận") {
    e.style.borderColor = "#4f3ed7";
    warn.classList.remove("disabled");
    stepArrow.classList.add("active-arrow");
  } else {
    warn.classList.add("disabled");
    stepArrow.classList.remove("active-arrow");

  }

  if (warnValue.textContent !== "Chọn Phường") {
    e.classList.add("done");
  }

  if (e.classList.contains("done")) {
    noLocation.classList.add("collapse");
    feedbackTable.classList.remove("collapse");
    feedbackDetailContainer.classList.remove("collapse");
  }
}

function onClickWarn(e) {
  if (!e.classList.contains("disabled")) {
    onClickDropdown(e);
  }
}

function onClickFeedback(e) {
  const allFeedbacksContainer =
    e.parentNode.parentNode.parentNode.parentNode.parentNode;

  const noFeedback = allFeedbacksContainer.querySelector(".no-feedback");
  const feedback = allFeedbacksContainer.querySelector(".feedback-respond");
  const arrow = e.querySelector("i");

  noFeedback.classList.add("collapse");

  if (e.classList.contains(".active-row")) {
    handleFeedback(e, arrow, feedback, false);
  } else {
    let currentActive = document.querySelector(".active-row");
    console.log(currentActive);
    if (currentActive) {
      let anotherArrow = currentActive.querySelector("i");
      handleFeedback(currentActive, anotherArrow, feedback, false);
    }
    handleFeedback(e, arrow, feedback, true);
  }
}

function handleFeedback(row, arrow, feedback, open) {
  if (open) {
    console.log("handle", arrow);
    arrow.classList.remove("collapse");
    row.classList.add("active-row");
    feedback.classList.remove("collapse");
  } else {
    arrow.classList.add("collapse");
    row.classList.remove("active-row");
    feedback.classList.remove("collapse");
  }
}
