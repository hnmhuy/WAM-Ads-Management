const swap_button = document.querySelector("#checkbox_toggle");
const location_table = document.querySelector("#location_table");
const tab_bar = document.querySelector(".tab-bar");
const create_button = document.querySelector("#new_location_btn");
const req_create_table = document.querySelector("#req_create_table");
const req_update = document.querySelector("#req_update");
let currpage = swap_button.getAttribute("target");

swap_button.addEventListener("click", () => {
    if (currpage == "location") {
        swap_button.setAttribute("target", "req");
    } else if (currpage == "req") {
        swap_button.setAttribute("target", "location");
    }
    location_table.classList.toggle("collapse");
    req_create_table.classList.toggle("collapse");
    tab_bar.classList.toggle("collapse");
    create_button.classList.toggle("collapse");
});

document.querySelectorAll("#collapse-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("rotate-btn");
    });
});

const tab_btn = document.querySelectorAll(".tab-btn");

tab_btn[0].addEventListener("click", () => {
    tab_btn[0].classList.add("tab-btn-active");
    tab_btn[1].classList.remove("tab-btn-active");
    req_update.classList.add("collapse");
    req_create_table.classList.remove("collapse");
});

tab_btn[1].addEventListener("click", () => {
    tab_btn[1].classList.add("tab-btn-active");
    tab_btn[0].classList.remove("tab-btn-active");
    req_create_table.classList.add("collapse");
    req_update.classList.remove("collapse");
});
