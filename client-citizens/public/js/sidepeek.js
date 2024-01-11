
// // SHOW ALL SIDEPEEK
// // document.addEventListener("DOMContentLoaded", () => {
// //   // Your code here
// //   const showFeedbackBtn = document.querySelectorAll(".show-feedback-button");
// //   const detailBtns = document.querySelectorAll(".detail-button");
// //   const overlay = document.querySelector(".overlay");

// //   detailBtns.forEach((btn) => {
// //     btn.addEventListener("click", () => {
// //       console.log("CLICKED 1");
// //       document.querySelector(".ad-detail").classList.remove("hidden");
// //       overlay.classList.remove("hidden");
// //     });
// //   });

// //   showFeedbackBtn.forEach((btn) => {
// //     btn.addEventListener("click", () => {
// //       console.log("CLICKED 2");
// //       document
// //         .querySelector(".feedbackDetail-container")
// //         .classList.remove("hidden");
// //       document
// //         .querySelector(".feedbackDetail-container")
// //         .classList.add("feedbackDetail-float");
// //     });
// //   });
// // });

// // Your code here
// document.addEventListener("DOMContentLoaded", () => {
//   const overlay = document.querySelector(".overlay");
//   const adDetail = document.querySelector(".ad-detail");
//   // Add click event listener to hide the overlay
//   overlay.addEventListener("click", () => {
//     console.log("OVERLAY");
//     overlay.classList.add("hidden");
//     adDetail.classList.add("hidden");
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const feedbackBtn = document.querySelectorAll(".feedback-button");
//   const overlay = document.querySelector(".overlay");
//   const adDetail = document.querySelector(".ad-detail");

//   feedbackBtn.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       if (!adDetail.classList.contains("hidden")) {
//         adDetail.classList.add("hidden");
//       }
//       console.log("CLICKED 3");
//       document.querySelector(".feedback-form").classList.remove("hidden");
//       overlay.classList.remove("hidden");
//     });
//   });
//   // document.querySelector('#confirm-button').addEventListener('click', event => {
//   //   event.preventDefault();
//   //   document.querySelector('form').classList.add('hidden');
//   //   document.querySelector('.overlay').classList.add('hidden');
//   // });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const overlay = document.querySelector(".overlay");
//   const feedbackForm = document.querySelector(".feedback-form");
//   // Add click event listener to hide the overlay
//   overlay.addEventListener("click", () => {
//     console.log("OVERLAY FEEDBACK FORM");
//     overlay.classList.add("hidden");
//     feedbackForm.classList.add("hidden");
//   });
// });

// // ------ SEARCHBAR ---------

// // document.querySelector('.icon-searchbar').addEventListener('mouseover', () => {
// //   document.querySelector('.searchbar').style.maxWidth = '100%';
// // });

// // document.querySelector('.icon-searchbar').addEventListener('mouseout', () => {
// //   document.querySelector('.searchbar').style.maxWidth = '0%';
// // });

// // document.addEventListener('DOMContentLoaded', () => {
// //   const iconSearchBar = document.querySelector(
// //     '.searchbar-box .icon-searchbar:first-child'
// //   );
// //   const searchBar = document.querySelector('.searchbar');
// //   const iconCloseSearch = document.querySelector('.searchbar-box .bi-x');

// //   iconSearchBar.addEventListener('click', () => {
// //     searchBar.style.paddingRight = '2.8rem';
// //     searchBar.style.maxWidth = '100%';
// //     iconCloseSearch.style.display = 'block';
// //     iconSearchBar.style.display = 'none';
// //   });

// //   iconCloseSearch.addEventListener('click', () => {
// //     searchBar.style.maxWidth = '';
// //     iconCloseSearch.style.display = 'none';
// //     iconSearchBar.style.display = 'block';
// //     searchBar.style.paddingRight = '0';
// //   });
// // });

// // BUTTON REACTION
// document.addEventListener("DOMContentLoaded", () => {
//   document
//     .querySelector("#sidepeek-ad .bi-x-circle")
//     .addEventListener("click", () => {
//       document.querySelector("#sidepeek-ad").classList.add("hidden");
//     });

//   document
//     .querySelector("#sidepeek-noAd .bi-x-circle")
//     .addEventListener("click", () => {
//       document.querySelector("#sidepeek-noAd").classList.add("hidden");
//     });

//   document
//     .querySelector(".header .bi-chevron-double-left")
//     .addEventListener("click", () => {
//       document.querySelector("#feedback-detail").classList.add("hidden");
//     });

//   document
//     .querySelector(".feedback-form .bi-x-circle")
//     .addEventListener("click", () => {
//       document.querySelector(".feedback-form").classList.add("hidden");
//       document.querySelector(".overlay").classList.add("hidden");
//     });
//   document
//     .querySelector(".ad-detail .bi-x-circle")
//     .addEventListener("click", () => {
//       console.log(321);
//       document.querySelector(".ad-detail").classList.add("hidden");
//       document.querySelector(".overlay").classList.add("hidden");
//     });
// });

// DROPDOWN
// document.addEventListener("DOMContentLoaded", () => {
//   const optionMenu = document.querySelector(".select-menu"),
//     selectBtn = optionMenu.querySelector(".select-btn"),
//     options = optionMenu.querySelectorAll(".option"),
//     optionList = optionMenu.querySelector(".options"),
//     sBtn_text = optionMenu.querySelector(".sBtn-text");

//   selectBtn.addEventListener("click", () => {
//     optionList.classList.toggle("hidden");
//     optionMenu.classList.toggle("active");
//   });

//   options.forEach((option) => {
//     option.addEventListener("click", () => {
//       let selectedOption = option.querySelector(".option-text").innerText;
//       sBtn_text.innerText = selectedOption;
//       optionList.classList.add("hidden");

//       optionMenu.classList.remove("active");
//       selectBtn.style.backgroundColor = "#e8f0fe";
//       selectBtn.style.boxShadow = "0 0 0 0.01rem rgba(13,110,253,.25)";
//       selectBtn.style.border = "0.1px solid #dee2e6";
//     });
//   });
// });

// //UPLOAD FILE
// // document.addEventListener("DOMContentLoaded", () => {
// //   const dropArea = document.querySelector(".drop_box"),
// //     button = dropArea.querySelector("button"),
// //     dragText = dropArea.querySelector("header"),
// //     input = dropArea.querySelector("input");
// //   let file;
// //   var filename;

// //   button.onclick = () => {
// //     input.click();
// //   };

// //   input.addEventListener("change", function (e) {
// //     var fileName = e.target.files[0].name;
// //     let maxFile = e.target.files.length;
// //     console.log(e.target.files);
// //     console.log(e.target.files.length);
// //     if (maxFile < 2) {
// //     } else {
// //       alert("Chỉ được chọn tối đa 2 ảnh");
// //     }
// //     let filedata = `
// //     <form action="" method="post">
// //     <div class="form">
// //     <h4>${fileName}</h4>
// //     <input type="email" placeholder="Enter email upload file">
// //     <button class="btn">Upload</button>
// //     </div>
// //     </form>`;
// //     dropArea.innerHTML = filedata;
// //   });
// // });

//Carousel-swipe
document.addEventListener("DOMContentLoaded", () => {
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: 0.6,
    spaceBetween: 25,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});

// //TEXTAREA

document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.querySelector("#tooltip");

  document.querySelector(".feedback-form").addEventListener("submit", (e) => {
    if (!tinymce.get("mytextarea").getContent().trim()) {
      e.preventDefault();
      document.querySelector("#tooltip").classList.remove("hidden");
      setTimeout(function () {
        tooltip.classList.add("hidden");
      }, 2000);
    }
  });
});


// // Open feedback form handler

function openFeedbackForm(e) {

  closeFeedbackForm();

  const fbForm = document.querySelector(".feedback-form")
  fbForm.classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");

  if(e.hasAttribute("ad-content-id"))
  {
    fbForm.setAttribute("ad-content-id", e.getAttribute("ad-content-id").split("_")[1]);
  }
  else if (e.hasAttribute("ad-place-id"))
  {
    fbForm.setAttribute("ad-place-id", e.getAttribute("ad-place-id"));
  }
  else if (e.hasAttribute("ward-name"))
  {
    fbForm.setAttribute("ward-name", e.getAttribute("ward-name"));
    fbForm.setAttribute("lat-lng", e.getAttribute("lat-lng"));
    fbForm.setAttribute("address", e.getAttribute("address"))
  }
  

}

function closeFeedbackForm() {
  const fbForm = document.querySelector(".feedback-form")
  fbForm.removeAttribute("ad-content-id");
  fbForm.removeAttribute("ad-place-id");
  fbForm.removeAttribute("ward-name");
  fbForm.removeAttribute("lat-lng");
  fbForm.classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");

  const inputFields = document.querySelectorAll(".feedback-form input");
  inputFields.forEach((input) => {
    input.value = "";
  });

  // Clear the textarea
  tinymce.get("mytextarea").setContent("");

  // Reset the dropdown menu
  const dropdown = document.querySelector(".feedback-form .select-menu");
  const selectText = dropdown.querySelector('.sBtn-text')
  selectText.textContent = 'Hình thức báo cáo'; // Reset the displayed text
  const selectBtn = dropdown.querySelector(".select-btn");
  selectBtn.style.backgroundColor = '#fff';
  selectBtn.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)' ;
  
  dropdown.querySelector('.options').classList.add('hidden'); // Hide the dropdown options (if needed)

  // Reset the file input (if any files are selected)
  const uploadField = document.querySelector(".upload-field")
  const fileInput = uploadField.querySelector(".preview");
  const holder = uploadField.querySelector(".holder");
  holder.style.display = "block"
  fileInput.innerHTML = "";
  fileInput.style.display = 'none';

  // Reset the captcha
  grecaptcha.reset();
}

function openFeedbackDetail() {
  const feedbacDetail = document.querySelector(".feedbackDetail-container");
  feedbacDetail.classList.remove("hidden");
  feedbacDetail.classList.add("feedbackDetail-float");
}

async function showAdDetail(e) {
  let id =  e.getAttribute("detail-id").split("_")[1];

  const adDetail = document.querySelector(".ad-detail");
  const carousel = adDetail.querySelector(".carousel-swipe")
  carousel.innerHTML = `<p class="title">Hình ảnh quảng cáo</p>`
  let infoCol2 = adDetail.querySelector(".info-col2");
  infoCol2.innerHTML = `
  <div class="info1">
  <p class="title">Loại bảng quảng cáo</p>
  <p class="content" id="type-ad"></p>
</div>
  `
  let data = await fetch(`http://localhost:4000/api/ad_content/getOne?id=${id}`).then(res => res.json());
  generateAdDetail(adDetail, data.data, carousel)
  const overlay = document.querySelector(".overlay");
  adDetail.classList.remove("hidden");
  adDetail.classList.add("ad-detail-float");
  overlay.classList.remove("hidden");
}

function closeAdDetail() {
  const adDetail = document.querySelector(".ad-detail");
  const overlay = document.querySelector(".overlay");
  adDetail.classList.add("hidden");
  overlay.classList.add("hidden");
}


function generateAdDetail(container, data, carousel)
{
  let companyName = container.querySelector("#ad-name");
  let formatAddress = container.querySelector("#detail-format-address");
  let purpose = container.querySelector("#purpose");
  let typeAd = container.querySelector("#type-ad");
  let start = container.querySelector("#start");
  let end = container.querySelector("#end");
  let infoCol2 = container.querySelector(".info-col2")
  let startDate = formatDate(data.start);
  let endDate = formatDate(data.end);
  let locationType = container.querySelector("#type-location");

  let feedbackDiv = document.createElement("div");
  feedbackDiv.classList.add("info2");
  feedbackDiv.innerHTML = `
    <p class="title">Phản hồi thông tin</p>
    <button type="button" class="btn btn-primary feedback-button" ad-content-id="${data.id} onclick="openFeedbackForm(this)">
      <i class="bi bi-send-fill"></i> Phản hồi
    </button>
  `
  infoCol2.appendChild(feedbackDiv);

  let imgArr = generateImg(data.image1, data.image2);

  //generate swiper container
  let carouselDiv = document.createElement("div");
  carouselDiv.classList.add("swiper-container")

  if(imgArr.length === 0)
  {
    carouselDiv.innerHTML = 'Chưa có hình ảnh cho bảng quảng cáo này.'
  }
  else if (imgArr.length === 1)
  {
    carouselDiv.innerHTML = `
      
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img
          src="http://localhost:4000/${imgArr[0]}"
          alt="pic"
        />
      </div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    `
  }
  else if (imgArr.length === 2)
  {
    carouselDiv.innerHTML = `
      
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img
          src="http://localhost:4000/${imgArr[0]}"
          alt="pic"
        />
      </div>
      <div class="swiper-slide">
        <img
          src="http://localhost:4000/${imgArr[1]}"
          alt="pic"
        />
      </div>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    `
  }

  carousel.appendChild(carouselDiv);
  companyName.textContent = data.company_name;
  formatAddress.textContent = `${data.ad_place.place.address_formated}, ${data.ad_place.place.area.formatedName}`
  purpose.textContent = data.purpose;
  typeAd.textContent = data.category.name;
  start.textContent = startDate;
  end.textContent = endDate;
  locationType.textContent = data.location;

}

function generateImg(image1, image2)
{
    let imgArr = [];
    if (image1)
        imgArr.push(image1);
    if (image2)
        imgArr.push(image2);
    return imgArr;
}


function formatDate(inputDate) {
  const date = new Date(inputDate);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  
  const formattedDate = `Ngày ${day} tháng ${month} năm ${year}`;
  return formattedDate;
}