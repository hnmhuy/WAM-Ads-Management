function togglePassword() {
    const passwordInput = document.getElementById("password");
    const checkbox = document.getElementById("form1Example3");

    if (checkbox.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}
// Add an event listener to the Sign In button
var signInButton = document.getElementById("signInButton");

// Add a click event listener
signInButton.addEventListener("click", function () {
    // Redirect to the "/home" page
    window.location.href = "home";
});