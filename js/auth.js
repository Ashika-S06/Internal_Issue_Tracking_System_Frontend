function checkAuth() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    window.location.href = "index.html";
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
  console.log("Login clicked");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("Sending request...");

  const data = await request("/auth/login", "POST", { username, password });

  console.log("Response:", data);

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
  const email = document.getElementById("email").value;
  const data = await request("/auth/register", "POST", {
    username,
    email,
    password,
    role,
  });

  if (data && data.message) {
    alert(data.message);
    window.location.href = "index.html";
  }
}


function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}