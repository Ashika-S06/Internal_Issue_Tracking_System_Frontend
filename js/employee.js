async function createIssue() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await request("/issues", "POST", { title, description });
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
        <p>Status: ${issue.status}</p>
      </div>
    `;
  });
}

loadIssues();