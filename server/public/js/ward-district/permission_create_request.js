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


const form = document.querySelector(".upload"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    uploadedArea = document.querySelector(".uploaded-area");

// Keep track of the number of uploaded files
let uploadedFilesCount = 0;

form.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        if (uploadedFilesCount < 2) {
            let fileName = file.name;
            if (fileName.length >= 12) {
                let splitName = fileName.split('.');
                fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
            }
            uploadFile(fileName);
            uploadedFilesCount++;
            if (uploadedFilesCount == 2) {
                form.style.display = 'none'
            }
        }
    }
}

function uploadFile(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload");
    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000);
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
        let progressHTML = `<li class="row">
                        <i class="bi bi-card-image"></i>
                        <div class="content">
                        <div class="details">
                            <span class="name">${name} • Uploading</span>
                            <span class="percent">${fileLoaded}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${fileLoaded}%"></div>
                        </div>
                        </div>
                    </li>`;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
        if (loaded == total) {
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
                        <div class="content upload">
                        <i class="bi bi-card-image"></i>
                            <div class="details">
                            <span class="name">${name} • Uploaded</span>
                            <span class="size">${fileSize}</span>
                            </div>
                        </div>
                        </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        }
    });
    let data = new FormData(form);
    xhr.send(data);
}

let popup_ = document.getElementById("location-popup")
let img_ = document.getElementById("form-img")
let submit_ = document.getElementById("submit-request")
let popup_parent_ = document.getElementById("popup-parent")
let close_btn_ = document.getElementById("close-edit-request")
let originalStyles_ = {}
let originalImg_ = {}
popup_parent_.addEventListener('click', (event)=>{
    if(event.target.id === 'popup-parent') {
        if(confirm('Bạn muốn thoát khỏi biểu mẫu?'))
            hidePopup();
    }
});
submit_.addEventListener('click', ()=>{
    hidePopup();
});
close_btn_.addEventListener('click', ()=>{
    if(confirm('Bạn muốn thoát khỏi biểu mẫu?'))
        hidePopup();
});

function showPopup(){
    document.querySelector('body').style.overflowY = 'hidden';
    originalStyles_.visibility = popup_.style.visibility || '';
    originalStyles_.top = popup_.style.top || '';
    originalStyles_.left = popup_.style.left || '';
    originalStyles_.transform = popup_.style.transform || '';

    originalImg_.marginBottom = img_.style.marginBottom || '';
    originalImg_.transform = img_.style.transform || '';
    img_.style.marginBottom = '45%';
    img_.style.transform = 'translate(-50%, -50%) scale(1)';
    img_.style.visibility = 'visible';
    
    popup_parent_.style.visibility = 'visible';
    popup_.style.visibility = 'visible';
    popup_.style.top = '50%';
    popup_.style.left = '50%';
    popup_.style.transform = 'translate(-50%, -50%) scale(1)';
}
function hidePopup(){
    document.querySelector('body').style.overflowY = 'auto';
    img_.style.marginBottom = originalImg_.marginBottom || '';
    img_.style.visibility = originalImg_.visibility || '';
    img_.style.transform = originalImg_.transform || '';
    popup_parent_.style.visibility = 'hidden';
    popup_.style.visibility = originalStyles_.visibility || '';
    popup_.style.top = originalStyles_.top || '';
    popup_.style.left = originalStyles_.left || '';
    popup_.style.transform = originalStyles_.transform || '';
    const up = document.querySelector('.uploaded-area');
    up.remove();
    const form_to_display = document.querySelector(".upload");
    form_to_display.style.display = 'flex';
}

