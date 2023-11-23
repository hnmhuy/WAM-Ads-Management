let popup = document.getElementById("location-popup_")
let img = document.getElementById("form-img_")
let submit = document.getElementById("submit-request_")
console.log(img);
let popup_parent = document.getElementById("popup-parent_")
let close_btn = document.getElementById("close-edit-request_")
let originalStyles = {}
let originalImg = {}
popup_parent.addEventListener('click', () => {
    if (event.target.id === 'popup-parent_') {
        hidePopup_review();
    }
});
submit.addEventListener('click', () => {
    hidePopup_review();
});
close_btn.addEventListener('click', () => {
    hidePopup_review();
});

function showPopup_review() {
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
const search = document.querySelector(".input-group input"),
    table_rows = document.querySelectorAll("tbody tr_in_table_in_location p"),
    table_headings = document.querySelectorAll("thead th");
// search.addEventListener('input', searchTable);
document.querySelector("form").onsubmit = searchTable;
function searchTable(event) {
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
