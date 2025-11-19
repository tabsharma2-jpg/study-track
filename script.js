// --------------------------
// THEME TOGGLE
// --------------------------
const themeBtn = document.getElementById("themeToggle");
let isDark = true;

themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  if (isDark) {
    document.documentElement.style.setProperty("--bg", "#0d0f14");
    document.documentElement.style.setProperty("--bg-2", "#11131a");
    document.documentElement.style.setProperty("--text", "#ffffff");
    themeBtn.textContent = "Dark";
  } else {
    document.documentElement.style.setProperty("--bg", "#ffffff");
    document.documentElement.style.setProperty("--bg-2", "#f5f5f5");
    document.documentElement.style.setProperty("--text", "#111");
    themeBtn.textContent = "Light";
  }
});


// --------------------------
// PROFILE SYSTEM
// --------------------------
const welcomeOverlay = document.getElementById("welcomeOverlay");
const nameIn = document.getElementById("nameIn");
const classIn = document.getElementById("classIn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const skipBtn = document.getElementById("skipBtn");

const userHello = document.getElementById("userHello");
const userClassDisplay = document.getElementById("userClassDisplay");
const existingInfo = document.getElementById("existingInfo");

function loadProfile() {
  const nm = localStorage.getItem("st_name");
  const cls = localStorage.getItem("st_class");

  if (nm) {
    userHello.textContent = "Hello, " + nm;
    userClassDisplay.textContent = cls || "Class / Exam";
    existingInfo.textContent = nm + " • " + cls;
    welcomeOverlay.classList.add("hidden");
  } else {
    welcomeOverlay.classList.remove("hidden");
  }
}
loadProfile();

saveProfileBtn.addEventListener("click", () => {
  localStorage.setItem("st_name", nameIn.value.trim());
  localStorage.setItem("st_class", classIn.value.trim());
  loadProfile();
});

skipBtn.addEventListener("click", () => {
  welcomeOverlay.classList.add("hidden");
});


// --------------------------
// TASK SYSTEM
// --------------------------
const taskTitle = document.getElementById("taskTitle");
const taskHours = document.getElementById("taskHours");
const taskMins = document.getElementById("taskMins");
const taskSub = document.getElementById("taskSub");
const addTaskBtn = document.getElementById("addTaskBtn");
const tasksList = document.getElementById("tasksList");
const taskSummary = document.getElementById("taskSummary");

let tasks = JSON.parse(localStorage.getItem("st_tasks") || "[]");

function saveTasks() {
  localStorage.setItem("st_tasks", JSON.stringify(tasks));
}

function renderTasks() {
  tasksList.innerHTML = "";
  let totalMin = 0;

  tasks.forEach((t, idx) => {
    totalMin += t.mins;

    const div = document.createElement("div");
    div.className = "taskItem";
    div.innerHTML = `
      <div>
        <strong>${t.title}</strong>
        <div class="small-muted">${t.sub} • ${Math.floor(t.mins/60)}h ${t.mins%60}m</div>
      </div>
      <button class="btn" data-index="${idx}">Del</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    });

    tasksList.appendChild(div);
  });

  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  taskSummary.textContent = `${tasks.length} tasks • ${h}h ${m}m`;
}
renderTasks();

addTaskBtn.addEventListener("click", () => {
  if (!taskTitle.value.trim()) return;

  const mins =
    (parseInt(taskHours.value || 0) * 60) + (parseInt(taskMins.value || 0));

  tasks.push({
    title: taskTitle.value,
    mins,
    sub: taskSub.value || "General"
  });

  taskTitle.value = "";
  taskHours.value = "";
  taskMins.value = "";

  saveTasks();
  renderTasks();
});


// --------------------------
// MINI TIMETABLE GRID
// --------------------------
const miniTable = document.getElementById("miniTable");

for (let i = 6; i <= 21; i++) {
  const slot = document.createElement("div");
  slot.style.padding = "12px";
  slot.style.border = "1px solid var(--border)";
  slot.style.borderRadius = "8px";
  slot.style.textAlign = "center";
  slot.style.cursor = "pointer";
  slot.textContent = i + ":00";

  slot.addEventListener("click", () => {
    let txt = prompt("What will you study at " + i + ":00 ?");
    if (txt) slot.textContent = i + ":00 • " + txt;
  });

  miniTable.appendChild(slot);
}


// --------------------------
// PROGRESS CHART
// --------------------------
const ctx = document.getElementById("progressChart");

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [{
      label: "Minutes",
      data: [30, 45, 60, 20, 50, 80, 40],
      borderWidth: 2
    }]
  }
});


// --------------------------
// FOCUS / POMODORO — FIXED
// --------------------------
const openFocus = document.getElementById("openFocus");
const focusModal = document.getElementById("focusModal");
const focusTimer = document.getElementById("focusTimer");
const focusStartBtn = document.getElementById("focusStartBtn");
const focusPauseBtn = document.getElementById("focusPauseBtn");
const focusCloseBtn = document.getElementById("focusCloseBtn");
const quickStartFocus = document.getElementById("quickStartFocus");
const quickFocusMins = document.getElementById("quickFocusMins");

let focusInterval = null;
let timeLeft = 25 * 60;

openFocus.addEventListener("click", () => {
  focusModal.classList.remove("hidden");
});

focusCloseBtn.addEventListener("click", () => {
  focusModal.classList.add("hidden");
  clearInterval(focusInterval);
  timeLeft = 25 * 60;
  focusTimer.textContent = "25:00";
});

focusStartBtn.addEventListener("click", startFocus);
focusPauseBtn.addEventListener("click", () => clearInterval(focusInterval));

quickStartFocus.addEventListener("click", () => {
  timeLeft = parseInt(quickFocusMins.value) * 60;
  focusModal.classList.remove("hidden");
  startFocus();
});

function startFocus() {
  clearInterval(focusInterval);

  focusInterval = setInterval(() => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    focusTimer.textContent = `${m}:${s.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(focusInterval);
      alert("Focus session complete!");
    }
  }, 1000);
}
