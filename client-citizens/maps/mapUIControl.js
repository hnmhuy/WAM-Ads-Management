import { filterDataSet, updateMarkers } from "./markers.js";

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