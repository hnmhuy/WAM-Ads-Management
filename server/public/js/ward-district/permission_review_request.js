let popup = document.getElementById("location-popup_")
let img = document.getElementById("form-img_")
let popup_parent = document.getElementById("popup-parent_")
let close_btn = document.getElementById("close-edit-request_")
let originalStyles = {}
let originalImg = {}
popup_parent.addEventListener('click', (event) => {
    if (event.target.id === 'popup-parent_') {
        hidePopup_review();
    }
});



close_btn.addEventListener('click', () => {
    hidePopup_review();
});

function showPopup_review(btn) {
    // document.querySelector('#id').value = btn.dataset.id;    document.querySelector('#id').value = btn.dataset.id;
    console.log(btn.dataset)
    document.getElementById("review_company_name").value = btn.dataset.companyName;
    document.getElementById("review_height").value = btn.dataset.height;
    document.getElementById("review_width").value = btn.dataset.width;
    const inputStart = new Date(btn.dataset.start)
    const formattedStart = inputStart.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const inputEnd = new Date(btn.dataset.end)
    const formattedEnd = inputEnd.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    document.getElementById("review_start").value = formattedStart;
    document.getElementById("review_end").value = formattedEnd;
    document.getElementById("review_type").value = btn.dataset.type;
    document.getElementById("review_ad_place").value = btn.dataset.adPlace;
    document.getElementById("review_description").value = btn.dataset.description;
    if(btn.dataset.img1){
        const originalString  = btn.dataset.img1;
        const converted_string = originalString.replace("\\", "/")
        document.getElementById("review_img1").src = converted_string;
    }
    if(btn.dataset.img2){
        const originalString  = btn.dataset.img2;
        const converted_string = originalString.replace("\\", "/")
        document.getElementById("review_img2").src = converted_string;
    }
    // document.getElementById("review_image1").src = btn.dataset.image1 ? "public/";
    // document.getElementById("review_image2").src = btn.dataset.image2;

    document.querySelector('body').style.overflowY = 'hidden';
    originalStyles.visibility = popup.style.visibility || '';
    originalStyles.top = popup.style.top || '';
    originalStyles.left = popup.style.left || '';
    originalStyles.transform = popup.style.transform || '';

    originalImg.marginBottom = img.style.marginBottom || '';
    originalImg.transform = img.style.transform || '';
    img.style.marginBottom = '45%';
    img.style.transform = 'translate(-50%, -50%) scale(1)';
    img.style.visibility = 'visible';

    popup_parent.style.visibility = 'visible';
    popup.style.visibility = 'visible';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
}
function hidePopup_review() {
    document.querySelector('body').style.overflowY = 'auto';
    img.style.marginBottom = originalImg.marginBottom || '';
    img.style.visibility = originalImg.visibility || '';
    img.style.transform = originalImg.transform || '';
    popup_parent.style.visibility = 'hidden';
    popup.style.visibility = originalStyles.visibility || '';
    popup.style.top = originalStyles.top || '';
    popup.style.left = originalStyles.left || '';
    popup.style.transform = originalStyles.transform || '';
}

document
    .querySelectorAll("tbody tr:not(.hide)")
    .forEach((visible_row, i) => {
        visible_row.style.backgroundColor =
            i % 2 == 0 ? "rgba(ff, ff, ff, 1)" : "rgba(79, 62, 215, 0.1)";
    });
    table_rows = document.querySelectorAll("tbody .tr_in_table_in_location");
    table_headings = document.querySelectorAll("thead th");
    // search.addEventListener('input', searchTable);
    document.querySelector("#search_functionality").onsubmit = searchTable;

function searchTable(event) {
    const search = document.getElementById("input-search-hehe");
    event.preventDefault();
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();
        row.classList.toggle("hide", table_data.indexOf(search_data) < 0);
    });

    document
        .querySelectorAll("tbody tr:not(.hide)")
        .forEach((visible_row, i) => {
            visible_row.style.backgroundColor =
                i % 2 == 0 ? "transparent" : "rgba(79, 62, 215, 0.1)";
        });
}
