const maxAmountOfFiles = 2;
window.inputFieldArray = [];
window.uploadedFiles = [];

function dragoverHandler(e) {
    e.preventDefault();
    e.target.classList.add("drag-drop-dragging");
}

function dragleaveHandler(e) {
    e.target.classList.remove("drag-drop-dragging");
}

function dropHandler(e) {
    e.preventDefault();
    e.target.classList.remove("drag-drop-dragging");
    let previewArea = e.target.parentNode.querySelector(".preview");
    let fieldId = e.target.parentNode.id;
    const files = e.dataTransfer.files;
    addImgs(files, previewArea, e.target, fieldId);
}

function inputChangeHandler(e) {   
    let previewArea = e.target.parentNode.querySelector(".preview");
    let fieldId = e.target.parentNode.id;
    let dragDropArea = e.target.parentNode.querySelector(".drag-drop");
    const files = e.target.files;
    addImgs(files, previewArea, dragDropArea, fieldId);
 }

// function imgInputController(fieldId) {
//     window.inputFieldArray.push(fieldId);
//     window.uploadedFiles.push([]);
//     let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
//     let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
//     let previewArea = document.querySelector(`#${fieldId} .preview`);
//     imgInputField.addEventListener("change", () => {
//         const files = imgInputField.files;

//         addImgs(files, previewArea, dragDropArea, fieldId);
//     });
//     dragDropArea.addEventListener("dragover", (e) => {
//         e.preventDefault();
//         dragDropArea.classList.add("drag-drop-dragging");
//     });

//     dragDropArea.addEventListener("dragleave", () => {
//         dragDropArea.classList.remove("drag-drop-dragging");
//     });

//     dragDropArea.addEventListener("drop", (e) => {
//         e.preventDefault();
//         dragDropArea.classList.remove("drag-drop-dragging");
//         const files = e.dataTransfer.files;
//         addImgs(files, previewArea, dragDropArea, fieldId);
//     });
// }

function removeImg(index, fieldId) {
    let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
    let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
    let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
    let previewArea = document.querySelector(`#${fieldId} .preview`);
    let fileHolder = previewArea.querySelector(
        `.fileHolder[data-target="${index}"]`
    );
    // Find the index of the file in the window.uploadedFiles array
    let fileIndex = window.uploadedFiles[inputFieldIndex].findIndex(
        (file) => file.name === fileHolder.dataset.target
    );
    // Remove the file from the window.uploadedFiles array
    window.uploadedFiles[inputFieldIndex].splice(fileIndex, 1);
    fileHolder.remove();
    imgInputField.value = null;
    if (
        window.uploadedFiles[inputFieldIndex].length === 0 &&
        previewArea.querySelectorAll(".fileHolder").length === 0
    ) {
        previewArea.style.display = "none";
        dragDropArea.querySelector(".holder").style.display = "block";
    }
}

function checkValidFile(file) {
    let fileName = file.name;
    let fileSize = file.size;
    let fileExtension = fileName.split(".").pop();
    let allowedExtensions = ["png", "jpeg", "jpg", "gif"];
    let maxFileSize = 5 * 1024 * 1024; // 2MB

    if (!allowedExtensions.includes(fileExtension)) {
        alert("File format not supported");
        return false;
    } else if (fileSize > maxFileSize) {
        alert("File size is too large");
        return false;
    } else {
        return true;
    }
}

function addImgIntoPreview(file, previewArea, dragDropArea, fieldId) {
    if (previewArea.style.display === "none") {
        previewArea.style.display = "flex";
        dragDropArea.querySelector(".holder").style.display = "none";
    }
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
        let fileHolder = document.createElement("div");
        fileHolder.classList.add("fileHolder");
        fileHolder.setAttribute("data-target", file.name);
        fileHolder.innerHTML = `
            <img src="${fileReader.result}" alt="img">
            <button type="button" onclick="removeImg('${file.name}', '${fieldId}')"><i class="bi bi-x"></i></button>
        `;
        previewArea.appendChild(fileHolder);
    };
}

function checkCapacity(fieldId) {
    let index = window.inputFieldArray.indexOf(fieldId);
    let amount = window.uploadedFiles[index].length;
    if (amount >= maxAmountOfFiles) {
        return false;
    } else {
        return true;
    }
}

function checkExist(file, fieldId) {
    let index = window.inputFieldArray.indexOf(fieldId);
    if (window.uploadedFiles[index].find((item) => item.name === file.name)) {
        return true;
    } else {
        return false;
    }
}

function addImg(file, previewArea, dragDropArea, fieldId) {
    let index = window.inputFieldArray.indexOf(fieldId);
    if (checkValidFile(file)) {
        if (checkCapacity(fieldId)) {
            if (!checkExist(file, fieldId)) {
                window.uploadedFiles[index].push(file);
                addImgIntoPreview(file, previewArea, dragDropArea, fieldId);
            } else {
                alert("File already exist");
            }
        } else {
            alert(`You can only upload ${maxAmountOfFiles} files`);
        }
    }
}

function addImgs(files, previewArea, dragDropArea, fieldId) {
    // Find the index of the input field in window.inputFieldArray
    let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
    if(inputFieldIndex === -1) {
        window.inputFieldArray.push(fieldId);
        window.uploadedFiles.push([]);
    }
    for (let i = 0; i < files.length; i++) {
        addImg(files[i], previewArea, dragDropArea, fieldId);
    }
}

function clearImgInputField(fieldId) {
    let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
    if (inputFieldIndex === -1) {
        return;
    }
    //Remove all the files in the preview area
    let previewArea = document.querySelector(`#${fieldId} .preview`);
    previewArea.innerHTML = "";
    previewArea.style.display = "none";
    document.querySelector(`#${fieldId} .holder`).style.display = "block";
    // Remove this in window.inputFieldArray
    window.inputFieldArray.splice(inputFieldIndex, 1);
    // Remove this in window.uploadedFiles
    window.uploadedFiles.splice(inputFieldIndex, 1);   
    // Clear the input field
    let imgInputField = document.querySelector(`#${fieldId} input[name="imgFile"]`);
    imgInputField.files = null;
}

function setImgFileForField(formData, fieldId) {
    let inputImgIndex = window.inputFieldArray.indexOf(fieldId);
    if (inputImgIndex === -1) {
        formData.append('newImgFile', null);
        return;
    }
    let files = window.uploadedFiles[inputImgIndex];
    // convert the files to filelist
    let fileList = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
        fileList.items.add(files[i]);
    }
    // Add the filelist to the form data
    for(file of fileList.files) {
        formData.append('newImgFile', file);
    }
}