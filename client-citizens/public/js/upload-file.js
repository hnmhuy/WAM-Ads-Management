
// ------Control the upload image------

const maxAmountOfFiles = 2;
window.inputFieldArray = [];
window.uploadedFiles = [];

function imgInputController(fieldId) {
    window.inputFieldArray.push(fieldId);
    window.uploadedFiles.push([]);
    let imgInputField = document.querySelector(`#${fieldId} #imgFile`);
    let dragDropArea = document.querySelector(`#${fieldId} .drag-drop`);
    let previewArea = document.querySelector(`#${fieldId} .preview`);

    console.log(`${fieldId} controller is running`);
    console.log(window.inputFieldArray);
    console.log(window.uploadedFiles);

    imgInputField.addEventListener("change", () => {
        const files = imgInputField.files;
        addImgs(files, previewArea, dragDropArea, fieldId);
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
        addImgs(files, previewArea, dragDropArea, fieldId);
    });
}

function removeImg(index, fieldId) {
    let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
    let imgInputField = document.querySelector(`#${fieldId} #imgFile`);
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

function addImgs(files, previewArea, dragDropArea, fieldId) {
    let inputFieldIndex = window.inputFieldArray.indexOf(fieldId);
    const fileCount = previewArea.querySelectorAll(".fileHolder").length;
    // Check the file format and size
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let fileName = file.name;
        let fileSize = file.size;
        let fileExtension = fileName.split(".").pop();
        let allowedExtensions = ["png", "jpeg", "jpg", "gif"];
        let maxFileSize = 5 * 1024 * 1024; // 2MB

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
    let tempFileArray = window.uploadedFiles[inputFieldIndex];
    // Check if the file is already in the window.uploadedFiles array
    for (let i = 0; i < files.length; i++) {
        if (tempFileArray.find((file) => file.name === files[i].name)) {
            continue;
        } else if (fileCount + tempFileArray.length > maxAmountOfFiles) {
            alert(`You can only upload ${maxAmountOfFiles} files`);
            return;
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
        window.uploadedFiles[inputFieldIndex] = tempFileArray;
        // Remove all the files from the preview area
        previewArea.querySelectorAll(".fileHolder").forEach((fileHolder) => {
            fileHolder.remove();
        });
        // Loop through the files and display them
        for (let i = 0; i < tempFileArray.length; i++) {
            let file = tempFileArray[i];
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
        };
    }
}
