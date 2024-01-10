async function openSidePeek(element) {
    let reqId = element.getAttribute("data-id");
    try {
        let response = await fetch(`/api/update_request/getUpdateRequest?updateRequestId=${reqId}`);
    } catch (err) {
        console.log(err);
    }
}