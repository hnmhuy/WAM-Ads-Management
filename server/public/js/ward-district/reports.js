// Navigation bar
let sidebar = document.querySelector(".sidebar");
let logOutBtn = document.querySelector("#log_out");

logOutBtn.addEventListener("click", () => {
    window.location.href = "/logout";
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
const extra = document.querySelectorAll('.extra')

tab_btn[0].addEventListener("click", () => {
    tab_btn[0].classList.add("tab-btn-active");
    tab_btn[1].classList.remove("tab-btn-active");
    available_location.forEach((row) => {
        row.classList.remove("collapse")
    })
    random_location.forEach((row) => {
        row.classList.add("collapse")
    })
    extra.forEach((ex) => {
        ex.style.display = "none"
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
    extra.forEach((ex) => {
        ex.style.display = "none"
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
    extra.forEach((ex) => {
        ex.style.display = "none"
    })
}

// Toggle sibling
function toggleSibling(sibling) {

    sibling = sibling.parentNode;
    sibling = sibling.nextSibling;
    while (!/tr/i.test(sibling.nodeName)) {
        sibling = sibling.nextSibling;
    }

    if (sibling.style.display == "table-row") {
        sibling.style.display = "none";

    }
    else {
        sibling.style.display = "table-row";
        document.querySelectorAll('.extra').forEach((open) => {
            if (open.style.display !== 'none' && open !== sibling) {
                open.style.display = 'none';
            }
        });
    }

}