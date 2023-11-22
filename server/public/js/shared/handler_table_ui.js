function setColumnWidths(table_id, widths) {
    console.log(widths.length);
    console.log(widths);
    for (let i = 0; i < widths.length; i++) {
        console.log(`#${table_id} .table th:nth-child(${i + 1})`);
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
