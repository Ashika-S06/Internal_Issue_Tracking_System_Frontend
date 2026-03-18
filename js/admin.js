async function loadIssues() {
  const issues = await request("/issues");

  const container = document.getElementById("issues");
  container.innerHTML = "";

  issues.forEach(issue => {
    container.innerHTML += `
      <div class="card">
        <h4>${issue.title}</h4>
        <p>${issue.description}</p>
        <p>Status: ${issue.status}</p>

        <select onchange="updateStatus('${issue._id}', this.value)">
          <option value="">Change Status</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>
    `;
  });
}

async function updateStatus(id, status) {
  await request(`/issues/${id}/status`, "PATCH", { status });
  loadIssues();
}

loadIssues();