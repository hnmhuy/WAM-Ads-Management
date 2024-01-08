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
      console.log("Selected value:", selectedText);
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

  e.preventDefault();
  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse.length > 0) {
    throw new Error("Captcha not complete");
  }

  // const captcha = new FormData();
  // captcha.append("g-recaptcha-response", captchaResponse)
  
  const content = tinymce.get("mytextarea").getContent().trim();
  const type = form.querySelector(".sBtn-text").getAttribute("data-id");
  const fd = new FormData(form);
  
  fd.append("type", type);
  fd.set("mytextarea", content);
  
  const params = new URLSearchParams(fd);


  const res = await fetch("http://localhost:4000/api/feedback/reCaptcha", {
    method: "POST",
    body: params,
  })
  const data = await res.json();


    if (data.captchaSuccess && content) {
      console.log("Validation Successful!");


      const res1 = await fetch("http://localhost:4000/api/feedback/sendFeedback", {
        method: 'POST',
        body: fd, // Convert the object to a JSON string
      });
      const data2 = await res1.json();
      alert("Đã gửi phản hồi thành công");
      document.querySelector("form").classList.add("hidden");
      document.querySelector(".overlay").classList.add("hidden");
    } else {
      console.error("Validation Error!");
    }

});


fetch("http://localhost:4000/api/category/getCategory?fieldId=T4").then((res) => res.json()).then((data) => {
  data.data.forEach((item) => {
    generateOptions(item);
  })
  eventListenerForDropdown();
});

function generateOptions(data)
{
  let li = document.createElement("li");
  li.className = "option";
  li.setAttribute("data-id", data.id);
  li.innerHTML = `<span class="option-text">${data.name}</span>`;
  let ul = feedbackType.querySelector("ul");
  ul.appendChild(li);
}


