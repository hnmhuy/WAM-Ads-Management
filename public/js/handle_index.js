function togglePassword() {
    const passwordInput = document.getElementById("form1Example23");
    const showPasswordCheckbox = document.getElementById("form1Example3");
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
}
// Add an event listener to the Sign In button
document
    .getElementById("signInButton")
    .addEventListener("click", function () {
        const emailInput = document.getElementById("form1Example13").value.trim();
        const passwordInput = document
            .getElementById("form1Example23")
            .value.trim();

        // Check if both email and password are filled
        if (emailInput !== "" && passwordInput !== "") {
            window.location.href = "/home"; // Redirect to /home
        } else {
            // Handle the case when either email or password is not filled
            alert("Please fill in both email and password.");
        }
    });