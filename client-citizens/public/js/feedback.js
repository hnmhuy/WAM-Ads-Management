let type;
document.addEventListener("DOMContentLoaded", () =>{
// Get the custom dropdown container
  const customDropdown = document.getElementById("customDropdown");

  // Attach click event listeners to each option
  const optionElements = customDropdown.querySelectorAll(".option");
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



const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse.length > 0) {
    throw new Error("Captcha not complete");
  }

  const content = tinymce.get("mytextarea").getContent().trim();
  const captcha = new FormData();
  captcha.append("g-recaptcha-response", captchaResponse)

  const email = document.querySelector("form #email").value;
  const name = document.querySelector("form #name").value;
  const phone = document.querySelector("form #phone").value;
  const file = document.querySelector("form #file");
  const fd = new FormData();

  fd.append("type", type);
  fd.append("email", email);
  fd.append("name", name);
  fd.append("phone", phone);
  fd.append("content", content);
  fd.append("file", file.files[0]);
  console.log(fd.get("file"));
  // const blob = new Blob([content], { type: "text/xml" });
  // fd.append("content", blob);
  

  // fd.type = type
  // fd.email = email
  // fd.name = name
  // fd.phone = phone
  // fd.content= content

  // console.log(fd);


  const params = new URLSearchParams(captcha);
  // console.log(params.toString());

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
      console.log(data2.message);
      console.log(res1);

      alert("Đã gửi phản hồi thành công");
      document.querySelector("form").classList.add("hidden");
      document.querySelector(".overlay").classList.add("hidden");
    } else {
      console.error("Validation Error!");
    }

});


