const role = checkAuth();
if (role !== "ADMIN") {
  window.location.href = "index.html";
}

async function loadIssues() {
  try {
    const issues = await request("/issues");

    console.log("ADMIN RECEIVED:", issues); // 🔥 DEBUG

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
      <select onchange="updateStatus('${issue._id}', this.value)">
        <option value="">Update Status</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>
    </div>
  `;
});

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

async function updateStatus(id, status) {
  if (!status) return;

  await request(`/issues/${id}/status`, "PATCH", { status });
  loadIssues();
}

loadIssues();