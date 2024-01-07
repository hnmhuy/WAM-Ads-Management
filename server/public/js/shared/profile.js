var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    const bindMessage = document.getElementById("bindMessage")
    if(bindMessage)
        bindMessage.style.display = "none";
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
async function unbind(e) {
    console.log("here");
    e.preventDefault();
    const formData = new FormData(document.getElementById("form-to-unbind"));
    try {
        let res = await fetch('/unbindAccount', {
            method: 'post',
            body: formData
        })
        let responseData = await res.json();
        if (responseData.success) {
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
  const form = document.getElementById("form-to-unbind");
  form.style.display = "none";
  const formBind = document.createElement("form");
  formBind.action = "/bindAccount";
  formBind.onsubmit = function (){
    bind(event);
  };
  formBind.id = "form-to-bind";
  formBind.innerHTML = `
    <button class="btn btn-outline-primary" type="submit" class="btn me-2" style="height: fit-content;">Liên kết</button>
  `;
  const bindDiv = document.getElementById("bindDiv");
  bindDiv.appendChild(formBind);
  const bindInformation = document.getElementById("bindInformation");
  bindInformation.style.display = "none";
  const bindMessage = document.getElementById("bindMessage");
  bindMessage.style.display = "none"
}

async function Password(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById("form-update-password"));
    try {
        let res = await fetch('/profile', {
            method: 'POST',
            body: formData
        })
        let responseData = await res.json();
        if (responseData.success) {
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
  const password = document.getElementById("current-password");
  password.value = "";
  const newPassword = document.getElementById("new-password");
  newPassword.value = "";
  const confirmPassword = document.getElementById("confirm-password");
  confirmPassword.value = ""
}

document.addEventListener('DOMContentLoaded', function() {
    const bindMessage = document.getElementById("bindMessage");
    if(bindMessage){
        Toastify({
                text: "Liên kết tài khoản Google thành công",
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
    }
});

