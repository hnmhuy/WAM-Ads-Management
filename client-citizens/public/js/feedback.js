import { getFeedbackGeoJson, processStorageData } from "../../maps/maps.js"; 
let type;
let feedbackType;
document.addEventListener("DOMContentLoaded", () =>{
// Get the custom dropdown container
  feedbackType = document.getElementById("feedback-type");

  // Attach click event listeners to each option
  const optionElements = feedbackType.querySelectorAll(".option");
  optionElements.forEach(function (option) {
    option.addEventListener("click", function () {
      // Get the text content of the selected option
      const selectedText = option.querySelector(".option-text").textContent;
      type = selectedText;
      // Log the selected value
     // console.log("Selected value:", selectedText);
    });
  });
})

function eventListenerForDropdown()
{
  const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    optionList = optionMenu.querySelector(".options"),
    sBtn_text = optionMenu.querySelector(".sBtn-text");

  selectBtn.addEventListener("click", () => {
    optionList.classList.toggle("hidden");
    optionMenu.classList.toggle("active");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      let selectedOption = option.querySelector(".option-text").innerText;
      sBtn_text.innerText = selectedOption;
      sBtn_text.setAttribute("data-id", option.getAttribute("data-id"));
      optionList.classList.add("hidden");
      optionMenu.classList.remove("active");
      selectBtn.style.backgroundColor = "#e8f0fe";
      selectBtn.style.boxShadow = "0 0 0 0.01rem rgba(13,110,253,.25)";
      selectBtn.style.border = "0.1px solid #dee2e6";
    });
  });
  
}


const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  
  let keyArr = [];
  let fbAttribute = getFormAttribute(form);
  let locationType = fbAttribute.type;
  let submitBtn = form.querySelector("button[type='submit']");

  e.preventDefault();
  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse.length > 0) {
    swal("Thông báo", "Vui lòng xác nhận CAPTCHA", "error");
    throw new Error("Captcha not complete");
  }

  // const captcha = new FormData();
  // captcha.append("g-recaptcha-response", captchaResponse)

  let spinner = submitBtn.querySelector(".spinner-border");
  spinner.classList.remove("hidden");
  submitBtn.disabled = true;
  
  const content = tinymce.get("mytextarea").getContent().trim();
  const type = form.querySelector(".sBtn-text").getAttribute("data-id");
  const fd = new FormData(form);

  if(locationType === "place")
  {
    fd.append("ad_place", fbAttribute.id);
  }
  else if(locationType === "content")
  {
    fd.append("ad_content", fbAttribute.id);
  }
  else if(locationType === "random")
  {
    // console.log("fb: ", fbAttribute.address);
    fd.append("ward", fbAttribute.wardName);
    fd.append("geometry", JSON.stringify(fbAttribute.geometry));
    fd.append("formatedAddress",fbAttribute.address);
  }

  fd.append("type", type);
  fd.set("mytextarea", content);

  if (!type) {
    swal("Thông báo", "Vui lòng chọn loại phản hồi", "error");
    spinner.classList.add("hidden");
    submitBtn.disabled = false;
    return;
  }
  
  const params = new URLSearchParams(fd);

  const res = await fetch("http://localhost:4000/api/feedback/reCaptcha", {
    method: "POST",
    body: params,
  })
  const data = await res.json();

  if (data.captchaSuccess && content) {
    try {
      const res1 = await fetch("http://localhost:4000/api/feedback/sendFeedback", {
        method: 'POST',
        body: fd, // Convert the object to a JSON string
      });
      const feedbackData = await res1.json();
      if(feedbackData.success) {
        storeFeedbackData(feedbackData.data);
        let req = [feedbackData.data];
        await getFeedbackGeoJson(req);
        processStorageData();
        swal("Thông báo", "Đã gửi phản hồi thành công", "success");
      } else {
        swal("Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
      }
      document.querySelector("form").classList.add("hidden");
      document.querySelector(".overlay").classList.add("hidden");
    } catch (error) {
      swal("Thông báo", "Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
      console.log(error);
    }
    clearImgInputField("feedback-upload-img");
  } else {
    swal("Thông báo", "CAPTCHA không hợp lệ!", "error")
  }

  spinner.classList.add("hidden");
  submitBtn.disabled = false;
});


document.addEventListener("DOMContentLoaded", () =>{
fetch("http://localhost:4000/api/category/getCategory?fieldId=T4").then((res) => res.json()).then((data) => {
  data.data.forEach((item) => {
    generateOptions(item);
  })
  eventListenerForDropdown();
});
})

function generateOptions(data)
{
  let li = document.createElement("li");
  li.className = "option";
  li.setAttribute("data-id", data.id);
  li.innerHTML = `<span class="option-text">${data.name}</span>`;
  let ul = feedbackType.querySelector("ul");
  ul.appendChild(li);
}


function getFormAttribute(form)
{
  if(form.hasAttribute("ad-content-id"))
  {
    return {type: "content", id: form.getAttribute("ad-content-id")};
  }
  else if (form.hasAttribute("ad-place-id"))
  {
    return {type: "place", id: form.getAttribute("ad-place-id")};

  }
  else if (form.hasAttribute("ward-name"))
  {
    let latLng = form.getAttribute("lat-lng").split(" - ");
    let address = form.getAttribute("address");
    return {
      type:"random",
      wardName : form.getAttribute("ward-name"),
      geometry: {
        type: "Point",
        coordinates: [latLng[0], latLng[1]],
      },
      address: address,
    }
  }
}

function storeFeedbackData(data) {
  let feedbackData = JSON.parse(localStorage.getItem("feedbackData"));
  if(feedbackData)
  {
    feedbackData.push(data);
    localStorage.setItem("feedbackData", JSON.stringify(feedbackData));
  }
  else
  {
    localStorage.setItem("feedbackData", JSON.stringify([data]));
  }
}


// async function getFeedbackGeoJson(feedbackList)
// {
//     let fd = new FormData();
//     fd.append("feedbackList", JSON.stringify(feedbackList));
//     let response = await fetch("http://localhost:4000/api/mapData/restoreUserFeedback", {
//         method: "POST",
//         body: fd
//     });
//     let fbData = await response.json();
//     // Push new point to data
//     data.features.push(...fbData.data.features);
//     console.log(data);
//     map.getSource('places').setData(data);
// }