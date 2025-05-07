function loadPage(page) {
  fetch(`${page}`)
    .then((response) => response.text())
    .then((data) => {
      const container = document.getElementById("main-content");
      container.innerHTML = data;

      const scripts = container.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.body.appendChild(newScript);
        script.remove();
      });
    })
    .catch((err) => {
      document.getElementById("main-content").innerHTML =
        '<p class="text-danger">Failed to load content.</p>';
      console.error(err);
    });
}

function decodeJWT(token) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = parts[1];
  // Base64URL decode
  const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

  try {
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error("Invalid JWT payload:", e);
    return null;
  }
}

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login-copy.html";
  const decoded = decodeJWT(token);
  return decoded.userid;
}

function getUserName() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login-copy.html";
  const decoded = decodeJWT(token);
  return decoded.name;
}

function getUserEmail() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login-copy.html";
  const decoded = decodeJWT(token);
  return decoded.email;
}

function getUserType() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login-copy.html";
  const decoded = decodeJWT(token);
  return decoded.usertype;
}

function getAuthorization() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login-copy.html";
  const decoded = decodeJWT(token);
  return `Bearer ${token}`;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.clear();
  window.location.href = "login-copy.html";
}

document.getElementById("switchRoleBtn").addEventListener("click", function () {
  const isAdmin = document
    .getElementById("adminSidebar")
    .classList.contains("d-none");

  if (isAdmin) {
    document.getElementById("adminSidebar").classList.remove("d-none");
    document.getElementById("userSidebar").classList.add("d-none");
    document.getElementById("cartIcon").classList.add("d-none");
    document.getElementById("panelTitle").textContent = "📚Library Admin Panel";
    document.getElementById("userRoleDisplay").textContent = "Admin";
    document.getElementById("switchRoleBtn").textContent = "Switch to User";
    loadPage("pages/dashboard.html");
  } else {
    document.getElementById("adminSidebar").classList.add("d-none");
    document.getElementById("userSidebar").classList.remove("d-none");
    document.getElementById("cartIcon").classList.remove("d-none");
    document.getElementById("panelTitle").textContent = "📚Library User Portal";
    document.getElementById("userRoleDisplay").textContent = "User";
    document.getElementById("switchRoleBtn").classList.add("d-none");
    loadPage("pages/user_dashboard.html");
  }
});

window.addEventListener("DOMContentLoaded", function () {
  loadPage("pages/dashboard.html");
});
