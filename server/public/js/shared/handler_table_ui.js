function setColumnWidths(table_id, widths) {
    for (let i = 0; i < widths.length; i++) {
        let head_col = document.querySelector(
            `#${table_id} .table th:nth-child(${i + 1})`
        );
        let body_col = document.querySelectorAll(
            `#${table_id} .table td:nth-child(${i + 1})`
        );
        head_col.style.width = widths[i];
        body_col.forEach((col) => {
            col.style.width = widths[i];
        });
    }
}

function addContentToCollapsibleTable(table_id, generateFunction) {
    // Get all extend-btn insde the table
    let extend_btns = document.querySelectorAll(
        `#${table_id} .extend-btn button`
    );
    // Add event listener to each extend-btn
    extend_btns.forEach((btn) => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-bs-target");
            let target = document.querySelector(`${id} .collapsed-content`);
            let div = generateFunction();
            target.innerHTML = "";
            target.appendChild(div);
            selectARow();
        });
    });
}
