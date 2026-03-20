const BASE_URL = "https://internal-issue-tracking-system-backend-1.onrender.com/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, method = "GET", body = null) {
  try {
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}