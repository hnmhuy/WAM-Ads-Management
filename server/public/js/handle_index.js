function togglePassword() {
    const passwordInput = document.getElementById("password");
    const checkbox = document.getElementById("form1Example3");

    if (checkbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

const icon = document.querySelector(".bi-chevron-right");
const button_login = document.querySelector(".login-button");
button_login.addEventListener("mouseover", ()=>{
    icon.classList.replace("bi-chevron-right", "bi-chevron-compact-right")
})
button_login.addEventListener("mouseout", () => {
        icon.classList.replace("bi-chevron-compact-right", "bi-chevron-right")
})

// Add an event listener to the Sign In button
var signInButton = document.getElementById("signInButton");

// Add a click event listener
signInButton.addEventListener("click", function () {
    // Redirect to the "/home" page
    window.location.href = "home";
});
