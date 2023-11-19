const swap_button = document.querySelector("#checkbox_toggle");
const location_table = document.querySelector("#location_table");
const req_table = document.querySelector("#req_table");
const tab_bar = document.querySelector(".tab-bar");
let currpage = swap_button.getAttribute("target");
swap_button.addEventListener("click", () => {
    if (currpage == "location") {
        swap_button.setAttribute("target", "req");
    } else if (currpage == "req") {
        swap_button.setAttribute("target", "location");
    }
    location_table.classList.toggle("collapse");
    req_table.classList.toggle("collapse");
    tab_bar.classList.toggle("collapse");
});
