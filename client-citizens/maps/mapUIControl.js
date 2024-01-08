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

    if (category === 'ad') {
        let sidepeek = status === 'active' ? adSidePeek : noAdSidePeek;
        sidepeek.querySelector('.area-icon .bi-x-circle').onclick = closeAllSidePeek
        sidepeek.className = 'sidepeek-container';
        sidepeek.classList.add(`${isReported ? 'sticky-left' : 'float'}`);
        let adContentContainer = sidepeek.querySelector(".ad-content");
        adContentContainer.innerHTML = "";
        // let data = await fetch(`http://localhost:4000/api/ad_place/getOne?id=${data.data.id}c&includeAdContent=true`).then(res => res.json());
        let data = await fetch(`http://localhost:4000/api/ad_place/getOne?id=477eacff-79b1-4754-a0f9-b4232ccf77d6&includeAdContent=true`).then(res => res.json());
        generateSidepeekAd(sidepeek, data);

    } else if (category === 'fb') {
        fbDetail.querySelector('.header .bi-chevron-double-left').onclick = closeFeedbackDetail
        fbDetail.className = 'feedbackDetail-container';
        fbDetail.classList.add('float');
    }

    
}

function generateSidepeekAd(sidepeek, data)
{
    let areaAddress = sidepeek.querySelector("#area");
    let formatAddress = sidepeek.querySelector("#format-address");
    let capacity = sidepeek.querySelector("#capacity");
    let purpose = sidepeek.querySelector("#purpose");
    let typeLocation = sidepeek.querySelector("#type-location");
    let adContentContainer = sidepeek.querySelector(".ad-content");


    areaAddress.textContent = data.data.place.area.formatedName;
    if (sidepeek === adSidePeek)
    {
        let locationImgDiv = sidepeek.querySelector(".location-img");
        locationImgDiv.innerHTML = "<p>Hình ảnh điểm đặt quảng cáo</p>";
        locationImgDiv.appendChild(generateCarousel(data, data.image1, data.image2));
        let adCard = data.data.adContents;
        if (adCard.length !== 0)
        {
            adContentContainer.innerHTML = `<h5 id="num-ad">Thông tin bảng quảng cáo (${data.data.adContentCapacity})</h5>`
            adCard.forEach(card => {
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

function generateCarousel(data, image1, image2)
{
    let imgArr = generateImg(image1, image2);
    console.log("this is imgArr: ", imgArr);

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
    buttonPrev.setAttribute("data-bs-target", data.id);
    buttonPrev.setAttribute("data-bs-slide", "prev");
    buttonNext.innerHTML = `
        <span
        class="carousel-control-prev-icon"
        aria-hidden="true"
    ></span>
    <span class="visually-hidden">Previous</span>
    `

    buttonNext.classList.add("carousel-control-next");
    buttonNext.setAttribute("type", "button");
    buttonNext.setAttribute("data-bs-target", data.id);
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
        />
        </div>
        <div class="carousel-item">
        <img
            src="http://localhost:4000/${imgArr[1]}"
            class="w-100 d-block"
            alt="Second slide"
        />
        </div>
        `
    }

    carouselDiv.appendChild(indicator);
    carouselDiv.appendChild(carouselInner);
    carouselDiv.appendChild(buttonPrev);
    carouselDiv.appendChild(buttonNext);

    imgArr = [];

    return carouselDiv;
}

function generateAdCard(sidepeek, data)
{
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("adcard-container");

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
                <p id="start">${data.start}/p>
                <p id="end">${data.end}</p>
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
    <button type="button" class="btn btn-primary feedback-button" onclick="openFeedbackForm()">
        <i class="bi bi-send-fill"></i> Phản hồi
    </button>

    <button
        type="button"
        class="btn btn-primary hidden"
        id="show-feedback-button"
        onclick="openFeedbackDetail()"
    >
        <i class="bi bi-file-text-fill"></i> Xem phản hồi
    </button>
    `
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