async function loadIssues() {
  const issues = await request("/issues");

  console.log("ADMIN ISSUES:", issues); 

  const container = document.getElementById("issues");
  container.innerHTML = "";

  if (!issues || issues.length === 0) {
    container.innerHTML = "<p>No issues found</p>";
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