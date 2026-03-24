function checkAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    window.location.href = "index.html";
    return null;
  }

  return role;
}

// Auto redirect if already logged in
(function () {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    if (window.location.pathname.includes("index.html")) {
      if (role === "ADMIN") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "employee.html";
      }
    }
  }
})();

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Enter all fields");
    return;
  }

  const data = await request("/auth/login", "POST", { username, password });

  if (data && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "ADMIN") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "employee.html";
    }
  }
}

async function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username || !password) {
    alert("All fields required");
    return;
  }

  const data = await request("/auth/register", "POST", {
    username,
    password,
    role,
  });

  if (data) {
    alert("Registered successfully");
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}