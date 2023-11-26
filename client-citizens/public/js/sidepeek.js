// SHOW ALL SIDEPEEK
document.addEventListener('DOMContentLoaded', () => {
  // Your code here
  const showFeedbackBtn = document.querySelectorAll('.show-feedback-button');
  const detailBtns = document.querySelectorAll('.detail-button');
  const overlay = document.querySelector('.overlay');

  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('CLICKED 1');
      document.querySelector('.ad-detail').classList.remove('hidden');
      overlay.classList.remove('hidden');
    });
  });

  showFeedbackBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('CLICKED 2');
      document
        .querySelector('.feedbackDetail-container')
        .classList.remove('hidden');
      document
        .querySelector('.feedbackDetail-container')
        .classList.add('feedbackDetail-float');
    });
  });
});

// Your code here
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.overlay');
  const adDetail = document.querySelector('.ad-detail');
  // Add click event listener to hide the overlay
  overlay.addEventListener('click', () => {
    console.log('OVERLAY');
    overlay.classList.add('hidden');
    adDetail.classList.add('hidden');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const feedbackBtn = document.querySelectorAll('.feedback-button');
  const overlay = document.querySelector('.overlay');
  const adDetail = document.querySelector('.ad-detail');

  feedbackBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!adDetail.classList.contains('hidden')) {
        adDetail.classList.add('hidden');
      }
      console.log('CLICKED 3');
      document.querySelector('.feedback-form').classList.remove('hidden');
      overlay.classList.remove('hidden');
    });
  });
  // document.querySelector('#confirm-button').addEventListener('click', event => {
  //   event.preventDefault();
  //   document.querySelector('form').classList.add('hidden');
  //   document.querySelector('.overlay').classList.add('hidden');
  // });
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.overlay');
  const feedbackForm = document.querySelector('.feedback-form');
  // Add click event listener to hide the overlay
  overlay.addEventListener('click', () => {
    console.log('OVERLAY FEEDBACK FORM');
    overlay.classList.add('hidden');
    feedbackForm.classList.add('hidden');
  });
});

// ------ SEARCHBAR ---------

// document.querySelector('.icon-searchbar').addEventListener('mouseover', () => {
//   document.querySelector('.searchbar').style.maxWidth = '100%';
// });

// document.querySelector('.icon-searchbar').addEventListener('mouseout', () => {
//   document.querySelector('.searchbar').style.maxWidth = '0%';
// });

document.addEventListener('DOMContentLoaded', () => {
  const iconSearchBar = document.querySelector(
    '.searchbar-box .icon-searchbar:first-child'
  );
  const searchBar = document.querySelector('.searchbar');
  const iconCloseSearch = document.querySelector('.searchbar-box .bi-x');

  iconSearchBar.addEventListener('click', () => {
    searchBar.style.paddingRight = '2.8rem';
    searchBar.style.maxWidth = '100%';
    iconCloseSearch.style.display = 'block';
    iconSearchBar.style.display = 'none';
  });

  iconCloseSearch.addEventListener('click', () => {
    searchBar.style.maxWidth = '';
    iconCloseSearch.style.display = 'none';
    iconSearchBar.style.display = 'block';
    searchBar.style.paddingRight = '0';
  });
});

// BUTTON REACTION
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('#sidepeek-ad .bi-x-circle')
    .addEventListener('click', () => {
      document.querySelector('#sidepeek-ad').classList.add('hidden');
    });

  document
    .querySelector('#sidepeek-noAd .bi-x-circle')
    .addEventListener('click', () => {
      document.querySelector('#sidepeek-noAd').classList.add('hidden');
    });

  document
    .querySelector('.header .bi-chevron-double-left')
    .addEventListener('click', () => {
      document.querySelector('#feedback-detail').classList.add('hidden');
    });

  document
    .querySelector('.feedback-form .bi-x-circle')
    .addEventListener('click', () => {
      document.querySelector('.feedback-form').classList.add('hidden');
      document.querySelector('.overlay').classList.add('hidden');
    });
  document
    .querySelector('.ad-detail .bi-x-circle')
    .addEventListener('click', () => {
      console.log(321);
      document.querySelector('.ad-detail').classList.add('hidden');
      document.querySelector('.overlay').classList.add('hidden');
    });
});

// DROPDOWN
document.addEventListener('DOMContentLoaded', () => {
  const optionMenu = document.querySelector('.select-menu'),
    selectBtn = optionMenu.querySelector('.select-btn'),
    options = optionMenu.querySelectorAll('.option'),
    optionList = optionMenu.querySelector('.options'),
    sBtn_text = optionMenu.querySelector('.sBtn-text');

  selectBtn.addEventListener('click', () => {
    optionList.classList.toggle('hidden');
    optionMenu.classList.toggle('active');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      let selectedOption = option.querySelector('.option-text').innerText;
      sBtn_text.innerText = selectedOption;
      optionList.classList.add('hidden');

      optionMenu.classList.remove('active');
      selectBtn.style.backgroundColor = '#e8f0fe';
      selectBtn.style.boxShadow = '0 0 0 0.01rem rgba(13,110,253,.25)';
      selectBtn.style.border = '0.1px solid #dee2e6';
    });
  });
});

//UPLOAD FILE
document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.querySelector('.drop_box'),
    button = dropArea.querySelector('button'),
    dragText = dropArea.querySelector('header'),
    input = dropArea.querySelector('input');
  let file;
  var filename;

  button.onclick = () => {
    input.click();
  };

  input.addEventListener('change', function (e) {
    var fileName = e.target.files[0].name;
    let maxFile = e.target.files.length;
    console.log(e.target.files);
    console.log(e.target.files.length);
    if (maxFile < 2) {

    } else {
      alert('Chỉ được chọn tối đa 2 ảnh');
    }
    let filedata = `
    <form action="" method="post">
    <div class="form">
    <h4>${fileName}</h4>
    <input type="email" placeholder="Enter email upload file">
    <button class="btn">Upload</button>
    </div>
    </form>`;
    dropArea.innerHTML = filedata;
  });
});

//CAPTCHA

// const form = document.querySelector('form');
// form.addEventListener('submit', e => {
//   e.preventDefault();
//   const captchaResponse = grecaptcha.getResponse();
//   if (!captchaResponse.length > 0) {
//     throw new Error('Captcha not complete');
//   }

//   const fd = new FormData(e.target);
//   const params = new URLSearchParams(fd);

//   fetch('http://localhost:3000/upload', {
//     method: 'POST',
//     body: params,
//   })
//     .then(res => res.json())
//     .then(data => {
//       if (
//         data.captchaSuccess &&
//         tinymce.get('mytextarea').getContent().trim()
//       ) {
//         console.log('Validation Successful!');
//         alert('Đã gửi phản hồi thành công');
//         document.querySelector('form').classList.add('hidden');
//         document.querySelector('.overlay').classList.add('hidden');
//       } else {
//         console.error('Validation Error!');
//       }
//     })
//     .catch(err => console.error(err));
// });

//Carousel-swipe
document.addEventListener('DOMContentLoaded', () => {
  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 0.6,
    spaceBetween: 25,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
});

//TEXTAREA

document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.querySelector('#tooltip');

  document.querySelector('.feedback-form').addEventListener('submit', e => {
    if (!tinymce.get('mytextarea').getContent().trim()) {
      e.preventDefault();
      document.querySelector('#tooltip').classList.remove('hidden');
      setTimeout(function () {
        tooltip.classList.add('hidden');
      }, 2000);
    }
  });
});
