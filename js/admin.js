const role = checkAuth();
if (role !== "ADMIN") {
  window.location.href = "index.html";
}

async function loadIssues() {
  const issues = await request("/issues");

  const container = document.getElementById("issues");
  container.innerHTML = "";

  issues.forEach(issue => {
    container.innerHTML += `
      <div class="card">
        <h4>${issue.title}</h4>
        <p>${issue.description}</p>
        <span class="status ${issue.status}">${issue.status}</span>

        <select onchange="updateStatus('${issue._id}', this.value)">
          <option value="">Change Status</option>
          ${issue.status === "OPEN" ? '<option value="IN_PROGRESS">IN_PROGRESS</option>' : ''}
          ${issue.status === "IN_PROGRESS" ? '<option value="RESOLVED">RESOLVED</option>' : ''}
        </select>
      </div>
    `;
  });
}

async function updateStatus(id, status) {
  if (!status) return;

  await request(`/issues/${id}/status`, "PATCH", { status });
  loadIssues();
}

loadIssues();