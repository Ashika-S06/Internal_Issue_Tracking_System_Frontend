function showMsg(id, text, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

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
  if (token && role && (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/"))) {
    window.location.href = role === "ADMIN" ? "admin.html" : "employee.html";
  }
})();

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showMsg("loginMsg", "Please enter your username and password.");
    return;
  }

  const btn = document.querySelector("button.btn-primary");
  if (btn) { btn.textContent = "Signing in…"; btn.disabled = true; }

  try {
    const data = await request("/auth/login", "POST", { username, password });

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);
      window.location.href = data.role === "ADMIN" ? "admin.html" : "employee.html";
    } else {
      showMsg("loginMsg", data?.message || "Invalid credentials. Please try again.");
      if (btn) { btn.innerHTML = 'Sign In <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'; btn.disabled = false; }
    }
  } catch (e) {
    showMsg("loginMsg", "Connection error. Please try again.");
    if (btn) { btn.innerHTML = 'Sign In'; btn.disabled = false; }
  }
}

async function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const email = document.getElementById("email")?.value.trim();
  const role = document.getElementById("role").value;

  if (!username || !password) {
    showMsg("registerMsg", "Username and password are required.");
    return;
  }

  const btn = document.querySelector("button.btn-primary");
  if (btn) { btn.textContent = "Creating account…"; btn.disabled = true; }

  try {
    const payload = { username, password, role };
    if (email) payload.email = email;

    const data = await request("/auth/register", "POST", payload);

    if (data && (data._id || data.message === "User registered")) {
      showMsg("registerMsg", "Account created! Redirecting…", "success");
      setTimeout(() => window.location.href = "index.html", 1200);
    } else {
      showMsg("registerMsg", data?.message || "Registration failed. Try a different username.");
      if (btn) { btn.innerHTML = 'Create Account <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'; btn.disabled = false; }
    }
  } catch (e) {
    showMsg("registerMsg", "Connection error. Please try again.");
    if (btn) { btn.innerHTML = 'Create Account'; btn.disabled = false; }
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
