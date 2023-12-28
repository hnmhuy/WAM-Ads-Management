let areaLevel = null;

window.addEventListener("click", function (e) {
  if (e.target.closest(".wrapper-dropdown") === null) {
    closeAllDropdown();
  }
});

function handleDropdown(dropdown, arrow, open) {
  if (open) {
    arrow.classList.toggle("rotate");
    dropdown.classList.toggle("active");
  } else {
    arrow.classList.remove("rotate");
    dropdown.classList.remove("active");
  }
}

function closeAllDropdown(e) {
  const selectedAll = document.querySelectorAll(".wrapper-dropdown");
  selectedAll.forEach((selected) => {
    if (selected !== e)
    {
      let arrow = selected.children[1];
      handleDropdown(selected, arrow, false);
    }
  });
}

function onClickDropdown(e)
{
  const arrow = e.parentNode.querySelector("i");
  const id = e.getAttribute("data-id");
  
  console.log(arrow);
  closeAllDropdown(e);
  handleDropdown(e.parentNode, arrow, true);
  
  if (e.id === "district")
  {
    areaLevel = 1;
    onClickDistrictDropdown(e);
  }
  else if (e.id === "ward")
  {
    areaLevel = 2;
  }
}

function selecteOption(e)
{
  const table = document.querySelector("table");
  const container = e.parentNode.parentNode;
  const stepArrow = container.parentNode.querySelector(".bi-chevron-right");
  const arrow = container.querySelector("i");
  const selectedField = container.querySelector(".selected-display");
  const noLocation = document.querySelector(".no-location");
  const feedbackDetail = document.querySelector(".feedback-detail");
  const noFeedback = feedbackDetail.querySelector(".no-feedback");
  let id = e.getAttribute("data-id");
  selectedField.textContent = e.textContent;
  selectedField.setAttribute("data-id", id);

  handleDropdown(container, arrow, false);
  
  

  if(areaLevel === 1) {
    if(id != "") {
      container.style.borderColor = "#4f3ed7";
      stepArrow.classList.add("active-arrow");

      const ward = document.querySelector("#ward-dropdown");  
      restoreDropdown(ward, "Chọn Phường", false);
      ward.classList.remove("disabled");
      fetchAndAppendOptionDropdown(`/api/area/getArea?opts=db&level=2&idDistrict=${id}`, ward.querySelector(".dropdown"));
    }
  }
  else if (areaLevel === 2)
  {
    if (id !== "")
    {
      container.style.borderColor = "#4f3ed7";
      noLocation.classList.add("collapse");
      feedbackDetail.classList.remove("collapse");
      noFeedback.classList.remove("collapse")
      restoreFeedbackTable(table);
      getFeedbackList(id);
      
    }
  }
}

function onClickDistrictDropdown(e)
{
  e.style.borderColor = "#4f3ed7";
  fetchAndAppendOptionDropdown("/api/area/getArea?opts=db&level=1", document.querySelector('#district-dropdown .dropdown'));
}


function fetchAndAppendOptionDropdown(url, dropdown)
{
  dropdown.innerHTML = `
  <div class="spinner-border" role="status" style="display: flex; justify-content: center">
    <span class="sr-only"></span>
  </div>`;
  fetch(url).then(res=> res.json()).then(data =>
    {
      let optionData = data.data;
      dropdown.innerHTML = "";
      if (optionData.length === 0)
      {
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

function generateOptionDropdown(data) {
  let option = document.createElement("li");
  option.setAttribute("data-id", data.id);
  option.innerHTML = data.name;
  option.setAttribute("onclick", "selecteOption(this)");
  return option;
}


function restoreDropdown(e, content, isDisabled) {
  const selectedField = e.querySelector(".selected-display");
  selectedField.textContent = content;
  if (isDisabled) {
    e.classList.add("disabled");
  } else {
    e.style.border = "1px solid rgba(0,0,0,0.2)"
    e.classList.remove("disabled");
  }
  selectedField.setAttribute("data-id", "");
}


// function onClickDropdown(e) {
//   const container = e.parentNode;
//   const warn = container.children[3];
//   const warnValue = warn.children[0];
//   const stepArrow = container.children[2];
//   const districtValue = e.children[0];
//   const optionList = e.querySelectorAll("li");
//   const arrow = e.children[1];
//   const mainContainer = e.parentNode.parentNode;
//   const noLocation = mainContainer.querySelector(".no-location");
//   const feedbackTable = mainContainer.querySelector(".feedback-table");
//   const feedbackDetailContainer = mainContainer.querySelector(".feedback-detail");

//   if (e.classList.contains("active")) {
//     handleDropdown(e, arrow, false);
//   } else {
//     let currentActive = document.querySelector(".wrapper-dropdown.active");
//     if (currentActive) {
//       let anotherArrow = currentActive.children[1];
//       handleDropdown(currentActive, anotherArrow, false);
//     }
//     handleDropdown(e, arrow, true);
//   }
//   for (let o of optionList) {
//     o.addEventListener("click", () => {
//       e.querySelector(".selected-display").innerHTML = o.innerHTML;
//       districtValue.setAttribute("value",`${o.getAttribute("value")}`);
//     });
//   }

//   if (districtValue.textContent !== "Chọn Quận") {
//     e.style.borderColor = "#4f3ed7";
//     warn.classList.remove("disabled");
//     stepArrow.classList.add("active-arrow");
//   } else {
//     warn.classList.add("disabled");
//     stepArrow.classList.remove("active-arrow");

//   }

//   if (warnValue.textContent !== "Chọn Phường") {
//     e.classList.add("done");
//   }

//   if (e.classList.contains("done")) {
//     noLocation.classList.add("collapse");
//     feedbackTable.classList.remove("collapse");
//     feedbackDetailContainer.classList.remove("collapse");
//   }
// }

async function getFeedbackList(id)
{
  const container = document.querySelector(".feedback-table");
  container.classList.remove("collapse");
  const table = container.querySelector("table tbody");
  const loading = table.querySelector(".loading");
  const nodata = table.querySelector(".nodata");
  loading.classList.remove("collapse");
  await fetch(`/api/feedback/getFeedback?opts=list&areaId=${id}`).then(res => res.json()).then(data => {
    loading.classList.add("collapse")
    
    if(data.length == 0)
    {   
      nodata.classList.remove("collapse")
    }
    else
    {
      data.forEach(feedback =>
        {
          const row = generateFeedbackRow(feedback);
          table.appendChild(row);
        });
    }
  })
}

function generateFeedbackRow(data)
{
  const row = document.createElement("tr");
  row.setAttribute("onclick", "onClickFeedback(this)");
  row.setAttribute("feedback-id", data.id);
  const solvedClass = data.status === "done" ? "solved" : "not-solved";
  const status = data.status === "done" ? "Đã giải quyết" : "Chưa giải quyết";
  row.innerHTML =
  `
  <td>${data.createdAt}</td>
  <td>${data.category.name}</td>
  <td class="status">
    <p class="status-tag ${solvedClass}">${status}</p></td>
  <td><i class="bi bi-chevron-bar-right collapse"></i></td>
  `
  return row;
}


function restoreFeedbackTable(table)
{
  table.innerHTML = `
      <tr>
      <th>Thời gian</th>
      <th>Loại phản ánh</th>
      <th class="status">Trạng thái xử lý</th>
      <th> </th>
    </tr>
    <tr class="loading collapse">
      <td colspan="4">
        <div>
          <div class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
      </td>
    </tr>
    <tr class="nodata collapse">
      <td colspan="4">
        <p>Không có phản ảnh nào</p>
      </td>
    </tr>
  `

}

async function selectFeedback (e, loading, feedbackDetail)
{
  let id = e.getAttribute('feedback-id');
  console.log("Feedback ID: ", id);
  fetch(`/api/feedback/getFeedback?id=${id}`).then(res => res.json()).then(data => 
    {
      loading.classList.add("collapse");
      feedbackDetail.classList.remove("collapse")
      generateFeedbackDetail(data);

    })
}

async function onClickFeedback(e) {
  const allFeedbacksContainer =
    e.parentNode.parentNode.parentNode.parentNode.parentNode;

  const noFeedback = allFeedbacksContainer.querySelector(".no-feedback");
  const feedback = allFeedbacksContainer.querySelector(".feedback-respond");
  const arrow = e.querySelector("i");
  const loading = allFeedbacksContainer.querySelector(".feedback-loading");
  const feedbackDetail = allFeedbacksContainer.querySelector(".feedback-info");

  noFeedback.classList.add("collapse");

  closeAllFeedbackRow();
  handleFeedback(e, arrow, feedback, true);
  selectFeedback(e, loading, feedbackDetail);

  
  

  // if (e.classList.contains(".active-row")) {
  //   handleFeedback(e, arrow, feedback, false);
  // } else {
  //   let currentActive = document.querySelector(".active-row");
  //   if (currentActive) {
  //     let anotherArrow = currentActive.querySelector("i");
  //     handleFeedback(currentActive, anotherArrow, feedback, false);
  //   }
  //   handleFeedback(e, arrow, feedback, true);
  // }

  
}

function generateFeedbackDetail(data)
{
  let container = document.querySelector(".feedback-info");
  let content = container.querySelectorAll(".tag-content");
  let description = container.querySelector(".feedback-content");
  content[0].textContent = data.name;
  content[1].textContent = data.phone;
  content[2].textContent = data.email;
  content[3].textContent = data.category.name;
  description.innerHTML = data.content;
  
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


function closeAllFeedbackRow(e)
{
  let feedbackRows = document.querySelectorAll("[feedback-id]");
  feedbackRows.forEach(row => {
    if(e !== row)
    {
      const arrow = row.querySelector("i");
      arrow.classList.remove("collapse");
      row.classList.remove("active-row");
    }
  });
}