const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const showError = (input, message) => {
  let errorDiv = input.nextElementSibling;
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
  input.style.borderColor = "#dc3545";
};

const hideError = (input) => {
  let errorDiv = input.nextElementSibling;
  errorDiv.style.display = "none";
  input.style.borderColor = "#ddd";
};

const validateEmail = () => {
  const email = emailInput.value.trim();
  if (!email.includes("@") || !email.includes(".")) {
    showError(emailInput, "Enter a valid email");
    return false;
  } else {
    hideError(emailInput);
    return true;
  }
};

const validatePassword = () => {
  const password = passwordInput.value.trim();
  if (password.length < 6) {
    showError(passwordInput, "Password must be at least 6 characters");
    return false;
  } else {
    hideError(passwordInput);
    return true;
  }
};

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  verify();
});

function verify() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:8080/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password: password }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        document.getElementById("error").textContent =
          "404 Not Found - Users data not available.";
      } else if (response.status === 401) {
        document.getElementById("error").textContent =
          "401 Unauthorized - Invalid token or access denied.";
      } else if (response.status === 500) {
        document.getElementById("error").textContent =
          "500 Internal Server Error.";
      } else {
        document.getElementById(
          "error"
        ).textContent = `Unexpected status code: ${response.status}`;
      }
    })
    .then((response) => {
      if (!response) return;

      if (response.token) localStorage.setItem("token", response.token);
      else throw new Error("Token Not Found");

      const userType = getUserType();
      if (userType == "admin") {
        window.location.href = "index.html";
      } else {
        window.location.href = "user.html";
      }
    })
    .catch((error) => {
      console.log(error);
      document.getElementById("error").textContent =
        "Something went wrong. Please try again.";
    });
}
