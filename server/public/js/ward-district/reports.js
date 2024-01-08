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

// function createResponse(data) {
//     let tmp = ''
//     fetch('/api/report/createResponse', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//         .then(res => res.json())
//         .then(data => {
//             tmp = data.data.id
//             return tmp
//         })
//         .catch((err) => {
//             console.error('Error:', err);
//         })

// }

function updateResponse(data) {
    fetch('/api/report/updateFeedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            console.log("Updated Successfully!")
        }).catch((err) => {
            console.error('Error:', err);
        })
}
function updateSolution(button) {
    let buttonId = button.id
    //! Get officer later
    let textareaElements = document.getElementsByTagName('textarea')

    const targetTextarea = Array.from(textareaElements).find(element => element.id === buttonId);

    // Handle UI
    const rows = document.querySelectorAll('tr');
    const curRow = Array.from(rows).filter(element => element.id === buttonId);

    const solved = curRow[0].querySelector('.unsolved');
    solved.classList.remove('unsolved')
    solved.classList.add('solved')
    solved.innerHTML = "Đã giải quyết"

    curRow[1].style.display = 'none';

    let data = {
        content: targetTextarea.value,
    }

    const feedback_content = document.createElement('div');
    feedback_content.classList.add('feedback-info')


    if (targetTextarea.value != "") {
        fetch('/api/report/createResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                let data_2 = {
                    fb_id: buttonId,
                    fbRes_id: data.data.id
                }
                updateResponse(data_2)

                if (data.status === 500) {
                    Toastify({
                        text: "Cập nhật thất bại",
                        duration: 3000,
                        close: false,
                        gravity: "bottom",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "#FF6969",
                            color: "#000"
                        },
                        onClick: function () { } // Callback after click
                    }).showToast();
                }
                else {
                    Toastify({
                        text: "Cập nhập thành công",
                        duration: 3000,
                        close: false,
                        gravity: "bottom",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "#C1F2B0",
                            color: "#000"
                        },
                        onClick: function () { } // Callback after click
                    }).showToast();
                }
                feedback_content.innerHTML = `
    <div class="label">
    <p>Thông tin phản hồi</p>
  </div>

  <div class="info phone">
    <div class="icon-tag">

      <i class="bi bi-clock"></i>
      <p class="tag">Thời gian xử lý</p>
    </div>
    <p class="tag-content">${data.data.createdAt}</p>
  </div>

  <div class="info content_solution">
    <div class="icon-tag">
      <i class="bi bi-file-text"></i>
      <p class="tag">Hướng xử lý</p>
    </div>
  </div>

  <div class="feedback-content">${data.data.content}</div>

    `
                const btn = curRow[1].querySelector('.button-report-field')
                btn.remove();


                targetTextarea.remove()

                const res_info = curRow[1].querySelector('.respond-info')
                res_info.appendChild(feedback_content)
            })
            .catch((err) => {
                Toastify({
                    text: "Có lỗi xảy ra",
                    duration: 3000,
                    close: false,
                    gravity: "bottom",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "#FF6969",
                        color: "#000"
                    },
                    onClick: function () { } // Callback after click
                }).showToast();
                console.error('Error:', err);
            })
    }

}