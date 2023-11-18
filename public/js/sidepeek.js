
console.log('hehe');

document.addEventListener('DOMContentLoaded', () => {
  // Your code here
  const showFeedbackBtn = document.querySelectorAll('.show-feedback-button');
  const detailBtns = document.querySelectorAll('.detail-button');
  const overlay = document.querySelector('.overlay');

  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('CLICKED');
      document.querySelector('.ad-detail').classList.remove('hidden');
      overlay.classList.remove('hidden');
    });
  });

  showFeedbackBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('CLICKED');
      document.querySelector('.feedbackDetail-container').classList.remove('hidden');
      document.querySelector('.feedbackDetail-container').classList.add('feedbackDetail-float');
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
      console.log('CLICKED');
      document.querySelector('form').classList.remove('hidden');
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
  const feedbackForm = document.querySelector('form');
  // Add click event listener to hide the overlay
  overlay.addEventListener('click', () => {
    console.log('OVERLAY');
    overlay.classList.add('hidden');
    feedbackForm.classList.add('hidden');
  });
});

// ------ CAPTCHA ---------
