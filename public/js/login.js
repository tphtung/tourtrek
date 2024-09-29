function toggleForms() {
    var loginForm = document.getElementById("login-form");
    var registrationForm = document.getElementById("registration-form");
    loginForm.classList.toggle("d-none");
    registrationForm.classList.toggle("d-none");
}


function validatePassword() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
        alert("Mật khẩu không khớp. Vui lòng nhập lại.");
        return false;
    } else {
        return true;
    }
}

function historyBack() {
    window.history.back();
}