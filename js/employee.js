const role = checkAuth();
if (role !== "EMPLOYEE") {
  window.location.href = "index.html";
}

async function createIssue() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !description) {
    alert("All fields required");
    return;
  }

  await request("/issues", "POST", { title, description });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";

  loadIssues();
}

async function loadIssues() {
  const issues = await request("/issues/my");

  const container = document.getElementById("issues");
  container.innerHTML = "";

  issues.forEach(issue => {
    container.innerHTML += `
      <div class="card">
        <h4>${issue.title}</h4>
        <p>${issue.description}</p>
        <span class="status ${issue.status}">${issue.status}</span>
      </div>
    `;
  });
}

loadIssues();