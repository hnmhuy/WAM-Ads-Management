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
    const data = Object.fromEntries(formData.entries());
    try {
    let res = await fetch('/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let responseData = await res.json();
    if (res.ok) {
        location.reload();
    } else {
      console.error("Update failed:", responseData.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}