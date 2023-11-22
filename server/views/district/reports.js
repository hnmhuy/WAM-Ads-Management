// Navigation bar
let sidebar = document.querySelector(".sidebar");
let logOutBtn = document.querySelector("#log_out");

logOutBtn.addEventListener("click", () => {
    window.location.href = "/";
});

sidebar.addEventListener("mouseenter", () => {
    sidebar.classList.toggle("open");
});

sidebar.addEventListener("mouseleave", () => {
    sidebar.classList.remove("open");
});

// Handle tab

const tab_btn = document.querySelectorAll(".tab-btn");
const available_location = document.querySelectorAll('.is_not_random')
const random_location = document.querySelectorAll('.is_random')

tab_btn[0].addEventListener("click", () => {
    tab_btn[0].classList.add("tab-btn-active");
    tab_btn[1].classList.remove("tab-btn-active");
    available_location.forEach((row) => {
        row.classList.remove("collapse")
    })
    random_location.forEach((row) => {
        row.classList.add("collapse")
    })
});

tab_btn[1].addEventListener("click", () => {
    tab_btn[1].classList.add("tab-btn-active");
    tab_btn[0].classList.remove("tab-btn-active");
    available_location.forEach((row) => {
        row.classList.add("collapse")
    })
    random_location.forEach((row) => {
        row.classList.remove("collapse")
    })
});


// Filter phường
function handleDropdownItem(event) {
    const selected = event.target.id;
    tab_btn.forEach((tab, index) => {
        if (tab.classList.contains('tab-btn-active')) {
            let tmp = index === 0 ? available_location : random_location;
            tmp.forEach((row) => {
                if (!row.classList.contains(selected)) {
                    row.classList.add('collapse');
                }
                else {
                    row.classList.remove('collapse');
                }
            });
        }
    });
}
