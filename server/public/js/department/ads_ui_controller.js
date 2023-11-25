const swap_button = document.querySelector("#checkbox_toggle");
const location_table = document.querySelector("#location_table");
const tab_bar = document.querySelector(".tab-bar");
const create_button = document.querySelector("#new_location_btn");
const req_create_table = document.querySelector("#req_create_table");
const req_update = document.querySelector("#req_update");
let currpage = swap_button.getAttribute("target");

req_create_table.classList.add("collapse");

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

function unseletedAll() {
    document
        .querySelectorAll("#collapse-req-create-table .selected-row")
        .forEach((row) => {
            row.classList.remove("selected-row");
        });
}

function selectARow() {
    document
        .querySelectorAll("#collapse-req-create-table tbody tr button")
        .forEach((btn) => {
            btn.addEventListener("click", (e) => {
                unseletedAll();
                e.target.parentElement.parentElement.parentElement.classList.add(
                    "selected-row"
                );
            });
        });
}

function generateCollapseDiv() {
    let div = document.createElement("div");
    div.classList.add("collapsed-content");
    div.innerHTML = `
    <div class="content-table">
        <div class="table-container">
            <table class="table table-hover" id="collapse-req-create-table">
                <thead>
                    <tr>
                        <th scope="col">Mã yêu cầu </th>
                        <th scope="col">Thời gian gửi</th>
                        <th scope="col">Người gửi</th>
                        <th scope="col" style="width: 50px"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="rc001" class="">
                        <td>RC001</td>
                        <td>11:57 22/11/2023</td>
                        <td>ABC</td>
                        <td style="width: 50px">
                            <button>
                                <i class="bi bi-chevron-bar-right"></i>
                            </button>
                        </td>
                    </tr>

                    <tr id="rc001" class="">
                        <td>RC001</td>
                        <td>11:57 22/11/2023</td>
                        <td>ABC</td>
                        <td style="width: 50px">
                            <button>
                                <i class="bi bi-chevron-bar-right"></i>
                            </button>
                        </td>
                    </tr>

                    <tr id="rc001" class="">
                        <td>RC001</td>
                        <td>11:57 22/11/2023</td>
                        <td>ABC</td>
                        <td style="width: 50px">
                            <button>
                                <i class="bi bi-chevron-bar-right"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="content-detail">
        <div class="content-detail-header">
            <h5>Thông tin chi tiết yêu cầu</h5>
        </div>
        <div class="content-detail-info">
            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Trạng thái
                </div>
                <div class="atribute-data">
                    <div class="table-status status-location-pending">
                        Chờ xác nhận
                    </div>
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Công ty
                </div>
                <div class="atribute-data">
                    Lorem ipsum dolor sit amet.
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Kích thước
                </div>
                <div class="atribute-data">
                    10m x 20m
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Ngày bắt đầu
                </div>
                <div class="atribute-data">
                    11/11/2023
                </div>
            </div>

            <div class="content-detail-attribute">
                <div class="atribute-header">
                    Ngày kết thúc
                </div>
                <div class="atribute-data">
                    12/12/2023
                </div>
            </div>
        
        </div>
        <div class="content-detail-imgs">
            <div id="req_imgs" class="carousel slide" data-bs-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-bs-target="#req_imgs" data-bs-slide-to="0" class="active" aria-current="true"
                        aria-label="First slide"></li>
                    <li data-bs-target="#req_imgs" data-bs-slide-to="1" aria-label="Second slide"></li>
                    <li data-bs-target="#req_imgs" data-bs-slide-to="2" aria-label="Third slide"></li>
                </ol>
                <div class="carousel-inner" role="listbox">
                    <div class="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            class="w-100 d-block" alt="First slide">
                    </div>
                    <div class="carousel-item">
                        <img src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3De"
                            class="w-100 d-block" alt="Second slide">
                    </div>
                    <div class="carousel-item">
                        <img src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            class="w-100 d-block" alt="Third slide">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#req_imgs" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#req_imgs" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <div class="content-detail-description">
            <div>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. In magni nihil, veritatis cupiditate distinctio iure voluptas facilis qui consequatur repellat voluptate. Eius cumque fuga facere velit ipsam fugiat blanditiis eveniet iusto ad corrupti, quidem repellat consectetur quod molestiae fugit dolorem error, soluta beatae doloribus pariatur! Incidunt enim harum at esse rerum aliquid, quisquam iusto obcaecati, velit fuga expedita amet ab necessitatibus similique accusantium. Eius itaque asperiores excepturi doloremque laudantium optio similique voluptas reiciendis. Ab quidem assumenda explicabo nobis esse laudantium, amet provident quaerat, veritatis odit autem adipisci eos voluptates quo vitae tempora enim, dolorem nostrum vero neque! Sequi tempora facere nisi ab. Ab, suscipit? Vitae dolorem debitis cum facere eum dolore maxime, porro reprehenderit architecto natus cupiditate quod dolores fugit ad, libero consectetur atque. Quis fugit, voluptatibus nesciunt, provident molestiae eveniet aliquid nemo impedit et alias ipsum natus, illo cupiditate ducimus? Accusamus, consectetur veniam et hic accusantium sit placeat nisi provident cum explicabo dicta at veritatis, aperiam debitis nemo eligendi! Eius sed laudantium voluptas ad magnam ipsam deleniti dolorum velit voluptate sit maxime mollitia et earum, nobis est qui excepturi debitis fugit molestias adipisci laboriosam ullam voluptatem? Magnam, corrupti provident id sint illo consequuntur veritatis necessitatibus soluta, unde accusantium eum autem magni eius ut quae fugit consequatur. A, praesentium quam, explicabo itaque pariatur placeat deleniti rerum aspernatur commodi ipsum consequuntur, obcaecati fugit maiores? Eveniet molestiae corrupti quo deserunt dignissimos quibusdam excepturi voluptatem culpa nulla, alias sit, ipsam consequatur error ratione numquam ullam reiciendis porro similique omnis. Minus alias quibusdam nam, adipisci quasi unde debitis iusto repellat ullam molestiae dolorum assumenda deleniti accusantium esse quam omnis saepe, ad voluptatem consequuntur. Soluta, nostrum repellat! Omnis repellat quam, deleniti ducimus, sed odit architecto tempora expedita nostrum quas maiores cumque numquam ab facere, sapiente possimus similique excepturi incidunt dolorum consequuntur. At obcaecati officia, cupiditate rem ipsam ex pariatur. Provident, ea eaque cum mollitia esse repudiandae distinctio natus, placeat quos, nobis deleniti! Nisi mollitia iure quas beatae minus deserunt nulla in. Perspiciatis itaque totam exercitationem odit ducimus sequi quidem qui ipsum quibusdam accusamus aperiam sunt, quam, voluptatem architecto quisquam optio ea voluptas, praesentium doloremque magnam quod et. Mollitia ad molestias dignissimos doloremque repudiandae corrupti delectus! Necessitatibus impedit nostrum error eveniet saepe modi aut facere voluptatem explicabo rerum eligendi, odio officiis dolore ullam at omnis pariatur eum deleniti quasi libero expedita vitae blanditiis totam. Totam repellat doloremque libero obcaecati aperiam eligendi, nisi molestias labore ducimus velit qui maiores voluptatem exercitationem blanditiis. Consectetur, corporis accusamus. Ullam, magni. Est deleniti, ullam distinctio possimus, adipisci tempore explicabo quidem corporis aliquid harum maiores id repellat numquam reiciendis assumenda minima aut optio? Expedita nam dolorem reiciendis itaque, fugit maxime ratione voluptatum rem esse reprehenderit facere quia voluptas accusamus odit non sunt necessitatibus aut assumenda blanditiis! Natus, iusto minus error dignissimos blanditiis exercitationem dolores molestiae, modi ea assumenda quas molestias. Id iure consequatur quidem debitis odit! Fugiat suscipit reprehenderit in nesciunt delectus ipsa rem, rerum voluptatibus vero? Ex velit corporis commodi libero ratione enim nobis, nam vitae perspiciatis officia, molestiae, non debitis fuga? Dolor necessitatibus impedit culpa sit, porro qui nostrum suscipit molestiae voluptatem quas dolore magni, similique id harum deserunt omnis libero autem rerum! Quibusdam dicta iusto dolores animi expedita ipsum ab voluptatibus? Aut repudiandae corrupti eum iure deserunt asperiores eius totam numquam dolore temporibus, id beatae, sequi, blanditiis culpa? Voluptates amet facilis corporis architecto doloribus dolorem officiis quidem fugiat consequatur laboriosam repellat unde fugit, ad in, et eius nisi necessitatibus numquam voluptatum ipsam cupiditate eos! Molestiae sint quasi neque unde exercitationem sunt repellendus nemo. Officiis quod aliquid dolores nisi placeat voluptatum blanditiis sunt quo ipsam consequatur culpa dolorum, veritatis qui!
            </div>
        </div>
        <div class="content-detail-btns">
            <button>Phê duyệt</button>
            <button>Từ chối</button>
        </div>
    </div>
            `;
    return div;
}

// Control the upload image
const imgInputField = document.querySelector("#imgFile");
const dragDropArea = document.querySelector(".drag-drop");
const previewArea = document.querySelector(".preview");
const maxAmountOfFiles = 2;

function removeImg(index) {
    const fileHolder = previewArea.querySelector(
        `.fileHolder[data-target="${index}"]`
    );
    // Find the index of the file in the window.uploadedFiles array
    const fileIndex = window.uploadedFiles.findIndex(
        (file) => file.name === fileHolder.dataset.target
    );
    // Remove the file from the window.uploadedFiles array
    window.uploadedFiles.splice(fileIndex, 1);
    fileHolder.remove();
    imgInputField.value = null;
    if (window.uploadedFiles.length === 0) {
        previewArea.style.display = "none";
        dragDropArea.querySelector(".holder").style.display = "block";
    }
}

function addImgs(files) {
    const fileCount = previewArea.querySelectorAll(".fileHolder").length;

    // Check the file format and size
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const fileSize = file.size;
        const fileExtension = fileName.split(".").pop();
        const allowedExtensions = ["png", "jpeg", "jpg", "gif"];
        const maxFileSize = 5 * 1024 * 1024; // 2MB

        if (!allowedExtensions.includes(fileExtension)) {
            alert("File format not supported");
            return;
        } else if (fileSize > maxFileSize) {
            alert("File size is too large");
            return;
        }
    }

    // Check if the preview is not display and hide the hodler
    if (previewArea.style.display === "none") {
        previewArea.style.display = "flex";
        dragDropArea.querySelector(".holder").style.display = "none";
    }
    let tempFileArray = window.uploadedFiles || [];
    for (let i = 0; i < files.length; i++) {
        if (tempFileArray.some((file) => file.name === files[i].name)) {
            continue;
        } else {
            tempFileArray.push(files[i]);
        }
    }

    // Check if the amount of files is not more than the max amount of files
    if (tempFileArray.length > maxAmountOfFiles) {
        alert(`You can only upload ${maxAmountOfFiles} files`);
        return;
    } else {
        // store the file into window.uploadedFiles
        window.uploadedFiles = tempFileArray;
        // Remove all the files from the preview area
        previewArea.querySelectorAll(".fileHolder").forEach((fileHolder) => {
            fileHolder.remove();
        });
        // Loop through the files and display them
        for (let i = 0; i < tempFileArray.length; i++) {
            const file = tempFileArray[i];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                const fileHolder = document.createElement("div");
                fileHolder.classList.add("fileHolder");
                fileHolder.setAttribute("data-target", file.name);
                fileHolder.innerHTML = `
                            <img src="${fileReader.result}" alt="img">
                            <button type="button" onclick="removeImg('${file.name}')"><i class="bi bi-x"></i></button>
                        `;
                previewArea.appendChild(fileHolder);
            };
        }
        console.log(window.uploadedFiles);
    }
}

imgInputField.addEventListener("change", () => {
    const files = imgInputField.files;
    addImgs(files);
});

dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("drag-drop-dragging");
});

dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.classList.remove("drag-drop-dragging");
});

dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropArea.classList.remove("drag-drop-dragging");
    const files = e.dataTransfer.files;
    addImgs(files);
});