var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for (tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

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

async function changeProfile(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("form-check"));
    try {
        let res = await fetch('/profile', {
            method: 'PUT',
            body: formData
        })
        let responseData = await res.json();
        if (responseData.updateSuccess) {
            Toastify({
            text: responseData.message,
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#0dbc79",
                color: "#000"
            },
            onClick: function(){} // Callback after click
            }).showToast();
        } else {
            Toastify({
                text: responseData.message,
                duration: 3000,
                close: false,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#FF6969",
                    color: "#000"
                },
                onClick: function(){} // Callback after click
            }).showToast();
        }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function bind(e) {
    const formData = new FormData(document.getElementById("form-to-bind"));
    try {
        let res = await fetch('/bindAccount', {
            method: 'get',
            body: formData
        })
        let responseData = await res.json();
        if (responseData.bindSucess) {
            Toastify({
            text: responseData.message,
            duration: 3000,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#0dbc79",
                color: "#000"
            },
            onClick: function(){} // Callback after click
            }).showToast();
        } else {
            Toastify({
                text: responseData.message,
                duration: 3000,
                close: false,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#FF6969",
                    color: "#000"
                },
                onClick: function(){} // Callback after click
            }).showToast();
        }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
