const role = checkAuth();
if (role !== "EMPLOYEE") {
  window.location.href = "index.html";
}

function showTab(tab) {
  document.getElementById("createTab").style.display =
    tab === "create" ? "block" : "none";

  document.getElementById("viewTab").style.display =
    tab === "view" ? "block" : "none";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  event.target.classList.add("active");

  if (tab === "view") loadIssues();
}

async function createIssue() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !description) {
    alert("All fields required");
    return;
  }

  await request("/issues", "POST", { title, description });

  alert("Issue created!");
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

async function loadIssues() {
  const issues = await request("/issues/my");

  const container = document.getElementById("issues");
  container.innerHTML = "";

  if (!issues || issues.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No issues found</p>";
    return;
  }

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