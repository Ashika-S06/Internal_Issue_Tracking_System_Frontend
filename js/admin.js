const role = checkAuth();
if (role !== "ADMIN") {
  window.location.href = "index.html";
}

let allIssues = [];
let currentFilter = "ALL";

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function formatStatus(s) {
  if (s === "IN_PROGRESS") return "In Progress";
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function updateStats(issues) {
  document.getElementById("statTotal").textContent = issues.length;
  document.getElementById("statOpen").textContent = issues.filter(i => i.status === "OPEN").length;
  document.getElementById("statProgress").textContent = issues.filter(i => i.status === "IN_PROGRESS").length;
  document.getElementById("statResolved").textContent = issues.filter(i => i.status === "RESOLVED").length;
}

function filterIssues(filter, el) {
  currentFilter = filter;
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");
  renderIssues();
}

function renderIssues() {
  const container = document.getElementById("issues");
  const filtered = currentFilter === "ALL"
    ? allIssues
    : allIssues.filter(i => i.status === currentFilter);

  container.innerHTML = "";

  if (!filtered || filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎉</div>
        <div class="empty-title">${currentFilter === "ALL" ? "No issues found" : "No " + formatStatus(currentFilter) + " issues"}</div>
        <div class="empty-sub">${currentFilter === "ALL" ? "All clear — no issues have been submitted yet." : "Try switching to a different filter."}</div>
      </div>`;
    return;
  }

  filtered.forEach((issue, i) => {
    const card = document.createElement("div");
    card.className = "issue-card";
    card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `
      <div class="issue-card-left">
        <div class="issue-card-top">
          <span class="issue-id">#${String(i + 1).padStart(3, '0')}</span>
          <span class="badge ${issue.status}">${formatStatus(issue.status)}</span>
        </div>
        <div class="issue-title-text">${escapeHtml(issue.title)}</div>
        <div class="issue-desc-text">${escapeHtml(issue.description)}</div>
      </div>
      <div class="issue-card-right">
        <select class="status-select" onchange="updateStatus('${issue._id}', this.value, this)">
          <option value="" disabled selected>Change status…</option>
          <option value="OPEN" ${issue.status === "OPEN" ? "disabled" : ""}>→ Open</option>
          <option value="IN_PROGRESS" ${issue.status === "IN_PROGRESS" ? "disabled" : ""}>→ In Progress</option>
          <option value="RESOLVED" ${issue.status === "RESOLVED" ? "disabled" : ""}>→ Resolved</option>
        </select>
      </div>
    `;
    container.appendChild(card);
  });
}

async function loadIssues() {
  const container = document.getElementById("issues");
  container.innerHTML = `
    <div class="issue-card skeleton" style="height:80px; border:none;"></div>
    <div class="issue-card skeleton" style="height:80px; border:none; margin-top:4px;"></div>
    <div class="issue-card skeleton" style="height:80px; border:none; margin-top:4px;"></div>
  `;

  try {
    const issues = await request("/issues");

    if (!issues || !Array.isArray(issues)) {
      container.innerHTML = `<div class="empty-state"><div class="empty-sub">Failed to load issues.</div></div>`;
      return;
    }

    allIssues = issues;
    updateStats(issues);
    renderIssues();
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><div class="empty-sub">Connection error. Please refresh.</div></div>`;
  }
}

async function updateStatus(id, status, selectEl) {
  if (!status) return;

  const originalBg = selectEl.style.background;
  selectEl.disabled = true;
  selectEl.style.opacity = "0.6";

  try {
    await request(`/issues/${id}/status`, "PATCH", { status });

    // Update local state
    const issue = allIssues.find(i => i._id === id);
    if (issue) issue.status = status;

    updateStats(allIssues);
    renderIssues();
  } catch (e) {
    selectEl.disabled = false;
    selectEl.style.opacity = "1";
    alert("Failed to update status. Please try again.");
  }
}

loadIssues();
