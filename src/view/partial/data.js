'use strict';
let adData = {
  adName: 'Bảng quảng cáo 1',
  adWidth: 2.5,
  adHeight: 10,

  images: [
    'https://thedrum-media.imgix.net/thedrum-prod/s3/news/tmp/349138/uk_0.jpg?w=1280&ar=default&fit=crop&crop=faces,edges&auto=format',
    'https://thedrum-media.imgix.net/thedrum-prod/s3/news/tmp/349138/uk_0.jpg?w=1280&ar=default&fit=crop&crop=faces,edges&auto=format',
  ],
  start: 'Ngày 15 tháng 10 năm 2023',
  end: 'Ngày 16 tháng 10 năm 2023',
  isReport: false,
};

let adPlaceData = {
  area: 'Phường 4, Quận 5',
  formatted_address:
    'Nguyễn Văn Cừ - An Dương Vương (Sở Văn hóa - Thể thao), Phường 4, Quận 5',
  purpose: 'Cổ động chính trị',
  type_ad: 'Trụ/Cụm Pano',
  capacity: 2,
  type_loacation: 'Đất công',
};

let adName = document.querySelector('#ad-name');
let imgList = document.querySelector('#imageList');
let startDate = document.querySelector('#start');
let endDate = document.querySelector('#end');
let adSize = document.querySelector('#ad-size');

//information of ad-detail
let address = document.querySelector('#format-address');
let swiperWrapper = document.querySelector('.swiper-wrapper');
let adPurpose = document.querySelector('#purpose');
let adType = document.querySelector('#type-ad');
let adCapacity = document.querySelector('#capacity');
let locationType = document.querySelector('#type-location');

function adCard() {
  // information of ad-card

  let indicatorsContainer = document.querySelector('.carousel-indicators');
  // ad-card content
  adName.textContent = adData.adName;
  adSize.textContent = `${adData.adWidth}m x ${adData.adHeight}m`;
  console.log(adSize.textContent);
  startDate.textContent = adData.start;
  endDate.textContent = adData.end;
  if (adData.isReport) {
    document.querySelector('.icon').classList.remove('hidden');
  } else {
    document.querySelector('.icon').classList.add('hidden');
  }

  // ad-card images

  imgList.innerHTML = '';
  indicatorsContainer.innerHTML = '';

  adData.images.forEach((image, index) => {
    //indicator
    let indicator = document.createElement('div');
    indicator.setAttribute('data-bs-target', '#carouselId');
    indicator.setAttribute('data-bs-slide-to', index.toString());
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);

    if (index === 0) {
      indicator.classList.add('active');
      indicator.setAttribute('aria-current', 'true');
    }

    indicatorsContainer.appendChild(indicator);

    //images
    let carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (index === 0) {
      carouselItem.classList.add('active');
    }

    let img = document.createElement('img');
    img.src = image;
    img.classList.add('w-100', 'd-block');
    img.alt = `Slide ${index + 1}`;

    carouselItem.appendChild(img);
    imgList.appendChild(carouselItem);
  });
}

function adDetail() {
  adName.textContent = adData.adName;
  address.textContent = adPlaceData.formatted_address;
  adPurpose = adPlaceData.purpose;
  adType = adPlaceData.type_ad;
  adCapacity = adPlaceData.capacity;
  locationType = adPlaceData.type_loacation;
  startDate.textContent = adData.start;
  endDate.textContent = adData.end;

  swiperWrapper.innerHTML = '';
  adData.images.forEach((image, index) => {
    let swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    let img = document.createElement('img');
    img.src = image;
    img.alt = `Slide ${index + 1}`;
    swiperSlide.appendChild(img);
    swiperWrapper.appendChild(swiperSlide);
  });
}

if (adSize !== null) adCard();
else adDetail();
