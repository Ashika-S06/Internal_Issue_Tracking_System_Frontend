const role = checkAuth();
if (role !== "EMPLOYEE") {
  window.location.href = "index.html";
}

// Set username in sidebar
const username = localStorage.getItem("username") || "Employee";
const userNameEl = document.getElementById("userName");
const userAvatarEl = document.getElementById("userAvatar");
if (userNameEl) userNameEl.textContent = username;
if (userAvatarEl) userAvatarEl.textContent = username.charAt(0).toUpperCase();

function showTab(tab, event) {
  const createTab = document.getElementById("createTab");
  const viewTab = document.getElementById("viewTab");

  createTab.style.display = tab === "create" ? "block" : "none";
  viewTab.style.display = tab === "view" ? "block" : "none";

  // Update sidebar nav
  document.querySelectorAll(".nav-item").forEach(t => t.classList.remove("active"));
  if (event && event.currentTarget) event.currentTarget.classList.add("active");

  if (tab === "view") loadIssues();
}

async function createIssue() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !description) {
    showMsg("createMsg", "Both title and description are required.");
    return;
  }

  const btn = document.querySelector("#createTab .btn-primary");
  if (btn) { btn.textContent = "Submitting…"; btn.disabled = true; }

  try {
    const data = await request("/issues", "POST", { title, description });

    if (data && data._id) {
      showMsg("createMsg", "✓ Issue submitted successfully!", "success");
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
    } else {
      showMsg("createMsg", data?.message || "Failed to submit issue.");
    }
  } catch (e) {
    showMsg("createMsg", "Connection error. Try again.");
  }

  if (btn) {
    btn.innerHTML = 'Submit Issue <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    btn.disabled = false;
  }
}

async function loadIssues() {
  const container = document.getElementById("issues");
  container.innerHTML = `
    <div class="issue-card skeleton" style="height:72px;"></div>
    <div class="issue-card skeleton" style="height:72px;"></div>
    <div class="issue-card skeleton" style="height:72px;"></div>
  `;

  try {
    const issues = await request("/issues/my");

    container.innerHTML = "";

    if (!issues || issues.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-text">No issues yet</div>
          <div class="empty-state-sub">Create a new issue to get started</div>
        </div>`;
      return;
    }

    // Stats
    const total = issues.length;
    const inProgress = issues.filter(i => i.status === "IN_PROGRESS").length;
    const resolved = issues.filter(i => i.status === "RESOLVED").length;

    const statsRow = document.getElementById("statsRow");
    if (statsRow) {
      statsRow.style.display = "grid";
      document.getElementById("totalCount").textContent = total;
      document.getElementById("progressCount").textContent = inProgress;
      document.getElementById("resolvedCount").textContent = resolved;
    }

    issues.forEach((issue, i) => {
      const card = document.createElement("div");
      card.className = "issue-card";
      card.style.animationDelay = `${i * 50}ms`;
      card.innerHTML = `
        <div class="issue-num">#${String(i + 1).padStart(3, '0')}</div>
        <div class="issue-body">
          <div class="issue-title-text">${escapeHtml(issue.title)}</div>
          <div class="issue-desc-text">${escapeHtml(issue.description)}</div>
        </div>
        <span class="badge ${issue.status}">${formatStatus(issue.status)}</span>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-text">Failed to load issues.</div></div>`;
  }
}

function formatStatus(s) {
  if (s === "IN_PROGRESS") return "In Progress";
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function showMsg(id, text, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}
