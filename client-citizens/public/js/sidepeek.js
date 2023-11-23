console.log('hehe');

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
