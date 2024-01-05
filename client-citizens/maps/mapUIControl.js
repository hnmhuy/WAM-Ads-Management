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

export function openSidePeek(data) {
    console.log("DTA: ", data);
    closeAllSidePeek();
    let category = data.category;
    let status = data.status;
    let isReported = data.isReported;

    if (category === 'ad') {
        let sidepeek = status === 'active' ? adSidePeek : noAdSidePeek;
        sidepeek.querySelector('.area-icon .bi-x-circle').onclick = closeAllSidePeek
        sidepeek.className = 'sidepeek-container';
        sidepeek.classList.add(`${isReported ? 'sticky-left' : 'float'}`)
    } else if (category === 'fb') {
        fbDetail.querySelector('.header .bi-chevron-double-left').onclick = closeAllSidePeek
        fbDetail.className = 'feedbackDetail-container';
        fbDetail.classList.add('float');
    }
}

window.openExtendSidePeek = () => {
    fbDetail.className = 'feedbackDetail-container';
    fbDetail.classList.add('feedbackDetail-float');
}