import { filterDataSet, updateMarkers } from "./markers.js";

const adSidePeek = document.querySelector('#sidepeek-ad');
const noAdSidePeek = document.querySelector('#sidepeek-noAd');
const fbDetail = document.querySelector('#feedback-detail');
const randomSidePeek = document.querySelector('#random-sidepeek');

const category = ["ad", "fb"];

export function filterContainerHandler(data, map) {
    const adFilterBtn = document.querySelector('#ad-filter');
    const fbFilterBtn = document.querySelector('#fb-filter');

    function applyFilters() {
        const showAd = adFilterBtn.checked;
        const showFb = fbFilterBtn.checked;

        let filteredData = filterDataSet(data, showAd, showFb);

        updateMarkers(filteredData, map);
    }

    adFilterBtn.addEventListener('change', applyFilters);
    fbFilterBtn.addEventListener('change', applyFilters);
}

export function closeAllSidePeek() {
    adSidePeek.classList.add('hidden');
    noAdSidePeek.classList.add('hidden');
    fbDetail.classList.add('hidden');
    randomSidePeek.classList.add('hidden');
}

export async function openSidePeek(data) {
    console.log("DTA: ", data);
    closeAllSidePeek();
    let category = data.category;
    let status = data.status;
    let isReported = data.isReported;
    let sampleData = JSON.parse(data.detail);


    if (category === 'ad') {
        let sidepeek = status === 'active' ? adSidePeek : noAdSidePeek;
        sidepeek.querySelector('.area-icon .bi-x-circle').onclick = closeAllSidePeek
        sidepeek.className = 'sidepeek-container';
        sidepeek.classList.add(`${isReported ? 'sticky-left' : 'float'}`);
        let adContentContainer = sidepeek.querySelector(".ad-content");
        let locationContent = sidepeek.querySelector(".location-content");
        locationContent.innerHTML = 
        `
        <div>
        <p class="title">Số lượng bảng (bảng/vị trí)</p>
        <p class="content" id="capacity"></p>
      </div>
      <div>
        <p class="title">Hình thức quảng cáo</p>
        <p class="content" id="purpose"></p>
      </div>
      <div>
        <p class="title">Loại vị trí</p>
        <p class="content" id="type-location">
        </p>
      </div>
        `
        adContentContainer.innerHTML = "";
        let adId = JSON.parse(data.detail).dataid;
        // console.log("THIS IS DTAA DETAIL:", JSON.parse(data.detail));
        // console.log("THIS IS ID:", adId);
        let dataAdPlace = await fetch(`http://localhost:4000/api/ad_place/getOne?id=${adId}&includeAdContent=true`).then(res => res.json());
        // console.log("THISS IS DATA PLACE: ", dataAdPlace );
        // let dataAdPlace = await fetch(`http://localhost:4000/api/ad_place/getOne?id=e295a4ee-5591-4270-9c7f-922b33fb7d72&includeAdContent=true`).then(res => res.json());
        generateSidepeekAd(sidepeek, dataAdPlace, sampleData, isReported);

    } else if (category === 'fb') {
        fbDetail.querySelector('.header .bi-chevron-double-left').onclick = closeFeedbackDetail
        fbDetail.className = 'feedbackDetail-container';
        fbDetail.classList.add('float');
        let content = fbDetail.querySelector("#feedback-content");
        let locationImgDiv = fbDetail.querySelector(".location-img");
        locationImgDiv.innerHTML = `<p>Hình ảnh đính kèm</p>`

        // let status = fbDetail.querySelector("#status");
        content.innerHTML = "";
        // status.innerHTML = `<p class="title">Trạng thái phản hồi</p>`
        let fbId = JSON.parse(data.detail).dataid;
        let fbData = await fetch(`http://localhost:4000/api/feedback/getFeedback?id=${fbId}`).then(res => res.json());
        generateFeedbackSidepeek(fbDetail, fbData, sampleData)

    }

    
}

function generateSidepeekAd(sidepeek, data, sampleData, isReported)
{
    let localData = JSON.parse(localStorage.getItem("feedbackData"));
    console.log("isReported", isReported);
    let areaAddress = sidepeek.querySelector("#area");
    let formatAddress = sidepeek.querySelector("#format-address");
    let capacity = sidepeek.querySelector("#capacity");
    let purpose = sidepeek.querySelector("#purpose");
    let typeLocation = sidepeek.querySelector("#type-location");
    let adContentContainer = sidepeek.querySelector(".ad-content");
    let locationContent = sidepeek.querySelector(".location-content");
    
    let feedbackBtn = document.createElement("button");
    feedbackBtn.setAttribute("type","button");
    feedbackBtn.className = `btn btn-primary feedback-button hidden`;
    feedbackBtn.setAttribute("onclick", "openFeedbackForm(this)");
    feedbackBtn.setAttribute("ad-place-id", `${sampleData.dataid}`);
    feedbackBtn.innerHTML = `
        <i class="bi bi-send-fill"></i>
        Gửi phản hồi điểm đặt quảng cáo`

    let showFeedbackBtn = document.createElement("button");
    showFeedbackBtn.setAttribute("type","button");
    showFeedbackBtn.className = `btn btn-primary show-feedback-button hidden`;
    showFeedbackBtn.setAttribute("onclick", "openFeedbackDetail(this)");
    showFeedbackBtn.setAttribute("id", "show-location-feedback");
    showFeedbackBtn.setAttribute("ad-place-id", `${sampleData.dataid}`);
    showFeedbackBtn.innerHTML = `
        <i class="bi bi-file-text-fill"></i> Xem phản hồi`


    if (isReported) {
        showFeedbackBtn.classList.remove("hidden");
    } else {
        feedbackBtn.classList.remove("hidden");
    }
    locationContent.appendChild(feedbackBtn);
    locationContent.appendChild(showFeedbackBtn);


    areaAddress.textContent = data.data.place.area.formatedName;
    if (sidepeek === adSidePeek)
    {
        let locationImgDiv = sidepeek.querySelector(".location-img");
        locationImgDiv.innerHTML = "<p>Hình ảnh điểm đặt quảng cáo</p>";
        locationImgDiv.appendChild(generateCarousel(data.data, data.data.image1, data.data.image2));
        let adCard = data.data.adContents;
        if (adCard.length !== 0)
        {
            adContentContainer.innerHTML = `<h5 id="num-ad">Thông tin bảng quảng cáo (${data.data.adContentCapacity})</h5>`
            adCard.forEach(card => {
                let index = localData.findIndex(item => item.ad_id === card.id);
                if (index!= -1) {
                    card.isReported = true;
                    card.feedback_id = localData[index].feedback_id
                } else card.isReported = false;

                adContentContainer.appendChild(generateAdCard(sidepeek, card));
            })
        }
        else
        {
            adContentContainer.innerHTML = `
            <h5 id="num-ad">Thông tin bảng quảng cáo (0)</h5>
            <img src="./public/images/no-data.png" alt="not found" />
            <p class="notification">Chưa có dữ liệu!</p>
            <p class="notification">Vui lòng chọn điểm trên bản đồ để xem</p>
            `
        }
    }
    else
    {
        adContentContainer.innerHTML = `
        <h5 id="num-ad">Thông tin bảng quảng cáo (0)</h5>
        <img src="./public/images/no-data.png" alt="not found" />
        <p class="notification">Chưa có dữ liệu!</p>
        <p class="notification">Vui lòng chọn điểm trên bản đồ để xem</p>
        `
    }
    
    formatAddress.textContent = `${data.data.place.address_formated}, ${data.data.place.area.formatedName}`;
    capacity.textContent = `${data.data.capacity} bảng`;
    purpose.textContent = data.data.purpose;
    typeLocation.textContent = data.data.location_type;
}

export function generateCarousel(data, image1, image2)
{
    let imgArr = generateImg(image1, image2);
    data.id = `_${data.id}`

    let carouselDiv = document.createElement("div");
    let indicator = document.createElement("div");
    let carouselInner = document.createElement("div");
    carouselDiv.classList.add("carousel","slide");
    carouselDiv.setAttribute("id",data.id);
    carouselDiv.setAttribute("data-bs-ride", "carousel");
    indicator.classList.add("carousel-indicators")
    carouselInner.classList.add("carousel-inner");
    carouselInner.setAttribute("id", "imageList");
    carouselInner.setAttribute("role", 'listbox');

    let buttonPrev = document.createElement("button");
    let buttonNext = document.createElement("button");

    buttonPrev.classList.add("carousel-control-prev")
    buttonPrev.setAttribute("type", "button");
    buttonPrev.setAttribute("data-bs-target", `#${data.id}`);
    buttonPrev.setAttribute("data-bs-slide", "prev");
    buttonPrev.innerHTML = `
        <span
        class="carousel-control-prev-icon"
        aria-hidden="true"
    ></span>
    <span class="visually-hidden">Previous</span>
    `

    buttonNext.classList.add("carousel-control-next");
    buttonNext.setAttribute("type", "button");
    buttonNext.setAttribute("data-bs-target", `#${data.id}`);
    buttonNext.setAttribute("data-bs-slide", "next");
    buttonNext.innerHTML = `
            <span
            class="carousel-control-next-icon"
            aria-hidden="true"
        ></span>
        <span class="visually-hidden">Next</span>
    `
    if(imgArr.length === 0)
    {
        carouselDiv.innerHTML = `
            Chưa có hình ảnh quảng cáo
        `
    }
    else if (imgArr.length === 1)
    {
        indicator.innerHTML = `
        <div
        data-bs-target="#${data.id}"
        data-bs-slide-to="0"
        class="active"
        aria-current="true"
        aria-label="First slide"
        ></div>`
        carouselInner.innerHTML = `
        <div class="carousel-item active">
        <img
        src="http://localhost:4000/${imgArr[0]}"
        class="w-100 d-block"
        alt="First slide"
        style="width:371px; height:208px"
        />
    </div>
        `
    }
    else if(imgArr.length === 2)
    {
        indicator.innerHTML = 
        `
        <div
        data-bs-target="#${data.id}"
        data-bs-slide-to="0"
        class="active"
        aria-current="true"
        aria-label="First slide"
        ></div>
        <div
        data-bs-target="#${data.id}"
        data-bs-slide-to="1"
        aria-label="Second slide"
        ></div>
        `
        carouselInner.innerHTML = `
        <div class="carousel-item active">
        <img
            src="http://localhost:4000/${imgArr[0]}"
            class="w-100 d-block"
            alt="First slide"
            style="width:371px; height:208px"
        />
        </div>
        <div class="carousel-item">
        <img
            src="http://localhost:4000/${imgArr[1]}"
            class="w-100 d-block"
            alt="Second slide"
            style="width:371px; height:208px"
        />
        </div>
        `
    }

    carouselDiv.appendChild(indicator);
    carouselDiv.appendChild(carouselInner);
    carouselDiv.appendChild(buttonPrev);
    carouselDiv.appendChild(buttonNext);

    imgArr = [];

    console.log("carousel: ", carouselDiv);

    return carouselDiv;
}

function generateAdCard(sidepeek, data)
{
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("adcard-container");
    let formatDateEnd = formatDate(data.end);
    let formatDateStart = formatDate(data.start);
    if (data.isReported) {
        cardContainer.style = "1px solid red"
    } 
    cardContainer.innerHTML = `
            <div class="header">
            <h5 id="ad-name">${data.company_name}</h5>
            <i class="bi bi-exclamation-octagon-fill icon hidden"></i>
        </div>

        <div class="size">
            <b>Kích thước</b>
            <p id="ad-size">${data.width}m x ${data.height}m</p>
        </div>

        <div class="contrast">
            <p><b>Thời hạn hợp đồng</b></p>
            <div class="date-container">
            <img src="./public/images/Line 7.png" alt="Not found!" />
            <div class="date">
                <p id="start">${formatDateStart}</p>
                <p id="end" style="margin: 0">${formatDateEnd}</p>
            </div>
            </div>
        </div>
    `
    cardContainer.appendChild(generateCarousel(data, data.image1, data.image2));

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-container");
    buttonDiv.innerHTML = `
    <button type="button" class="btn btn-primary detail-button" detail-id="${data.id}" onclick="showAdDetail(this)">
        <i class="bi bi-info-circle"></i> Chi tiết
    </button>
    <button type="button" class="btn btn-primary feedback-button ${data.isReported === false ? "" : "hidden"}" ad-content-id="${data.id}" onclick="openFeedbackForm(this)">
        <i class="bi bi-send-fill"></i> Phản hồi
    </button>

    <button
        type="button"
        class="btn btn-primary ${data.isReported ? "" : "hidden"}"
        id="show-feedback-button"
        onclick="openFeedbackDetail(this)"
        ad-content-id="${data.id}"
    >
        <i class="bi bi-file-text-fill"></i> Xem phản hồi
    </button>
    `
    console.log(data);
    if(data.isReported) {
        buttonDiv.children[2].setAttribute("ad-place-id", data.feedback_id);
    }   
    cardContainer.appendChild(buttonDiv);

    return cardContainer;

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

export function closeFeedbackDetail() {
    fbDetail.classList.add('hidden');
}

function formatDate(inputDate, getTime=false) {
    const date = new Date(inputDate);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    let formattedDate = '';
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    if(!getTime)
    {
        formattedDate = `Ngày ${day} tháng ${month} năm ${year}`;
        return formattedDate;
    }
    else
    {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        formattedDate = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
        return formattedDate;
        
    }

}

function generateFeedbackSidepeek(fbDetail,data, sampleData)
{
    let locationImgDiv = fbDetail.querySelector(".location-img");
    let formatAddress = fbDetail.querySelector("#format-address");
    let fbType = fbDetail.querySelector("#feedbackType");
    let time = fbDetail.querySelector("#feedback-time");
    let name = fbDetail.querySelector("#name");
    let email = fbDetail.querySelector("#email");
    let phoneNumber = fbDetail.querySelector("#phone-number");
    let content = fbDetail.querySelector("#feedback-content");
    let status = fbDetail.querySelector(".detail-feedback-status");
    let statusIcon = status.querySelector(".status-icon-shadow");
    let statusIconPoint = status.querySelector(".satus-icon-point");
    let statusText = status.querySelector(".detail-feedback-status-text");

    status.className = `detail-feedback-status ${sampleData.status}-shadow`
    statusIcon.className = `status-icon-shadow animate-flicker ${sampleData.status}-shadow`
    statusIconPoint.className = `satus-icon-point ${sampleData.status}`
    statusText.textContent = sampleData.status_VN;

    locationImgDiv.appendChild(generateCarousel(data, data.image1, data.image2));
    formatAddress.textContent = `${data.place.address_formated}, ${data.place.area.formatedName}`;
    fbType.textContent = sampleData.feedback_type_VN;
    time.textContent = formatDate(data.createdAt, true);
    name.textContent = data.name;
    email.textContent = data.email;
    phoneNumber.textContent = data.phone;
    content.innerHTML = 
    `
        ${data.content}
    `   
}

