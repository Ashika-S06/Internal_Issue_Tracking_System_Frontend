async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = await request("/auth/login", "POST", { username, password });

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "ADMIN") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "employee.html";
    }
  } else {
    alert(data.message);
  }
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const data = await request("/auth/register", "POST", {
    username,
    password,
    role,
  });

  alert(data.message);
  window.location.href = "index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}