const BASE_URL = "https://internal-issue-tracking-system-backend-1.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
  };


  
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return res.json();
}