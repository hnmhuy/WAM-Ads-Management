// const passwordInput = document.getElementById("password");
// const togglePassword = document.getElementById("toggle-password");
// console.log("hi");
// togglePassword.addEventListener("click", ()=>{
//     passwordInput.classList.toggle("text-form");
//     passwordInput.classList.toggle("password-form");
//     togglePassword.classList.toggle("bi-eye-slash-fill");
//     togglePassword.classList.toggle("bi-eye-fill");
//     console.log("reaches here");
// })

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
