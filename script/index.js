const container = document.getElementById("tab-container");
const issueCount = document.getElementById("issueCount");
const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];

const modal = document.getElementById("issue-modal");
const modalClose = document.getElementById("modal-close");



async function openModal(id){

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
  const data = await res.json();

  const issue = data.data;

  document.getElementById("modal-title").innerText = issue.title;
  document.getElementById("modal-description").innerText = issue.description;
  document.getElementById("modal-assignee").innerText = `Assignee: ${issue.assignee}`;
  document.getElementById("modal-date").innerText = 
    new Date(issue.createdAt).toLocaleDateString();

  const priorityEl = document.getElementById("modal-priority");
  priorityEl.innerText = issue.priority.toUpperCase();

  priorityEl.className =
    "px-2 py-1 rounded-full text-white text-xs " +
    (issue.priority === "high"
      ? "bg-red-500"
      : issue.priority === "medium"
      ? "bg-yellow-500"
      : "bg-gray-500");



  const labelsContainer = document.getElementById("modal-labels");
  labelsContainer.innerHTML = "";

  (issue.labels || []).forEach(label => {
    const span = document.createElement("span");
    span.innerText = label;
    const color = label.toLowerCase() === "bug" ? "red" 
                : label.toLowerCase() === "help wanted" ? "yellow" 
                : "green";
    span.className = `px-2 py-1 rounded-full text-sm bg-${color}-200 text-${color}-800`;
    labelsContainer.appendChild(span);
  });

      const status = document.getElementById("modal-status");
      status.textContent = "Opened";
      status.classList.add("bg-green-600");

  modal.classList.remove("hidden");
}


modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if(e.target === modal) modal.classList.add("hidden"); 
});


async function loadIssues() {
  const res = await fetch(api);
  const data = await res.json();
  allIssues = data.data;
  displayIssues(allIssues);
  setActiveButton("all");
}


function displayIssues(issues) {
  container.innerHTML = "";
  issueCount.innerText = issues.length;

  issues.forEach(issue => {

    const labelsHTML = issue.labels.map(label => {
    const labelClass =
    label.toLowerCase().includes("bug")
      ? "bg-red-100 text-red-600"
      : label.toLowerCase().includes("help")
      ? "bg-yellow-100 text-yellow-600"
      : "bg-green-100 text-green-600";

      return `<span class="px-3 py-1 text-xs rounded-full ${labelClass}">
                ${label.toUpperCase()}
              </span>`;
    }).join("");

    const div = document.createElement("div");
    div.className = "card bg-white p-4 shadow rounded-md mb-3 overflow-hidden";

    div.style.borderTop = issue.status.toLowerCase() === "open" ? "5px solid green" : "5px solid purple";

    div.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-2">
                <img src="${issue.status.toLowerCase() === "open" ? "Open-Status.png" : "Closed-Status.png"}" class="w-5 h-5"
                alt="status"/>
            </div>

            <span class="text-xs px-3 py-1 rounded-full ${
                issue.priority === "high"
                ? "bg-red-100 text-red-600"
                : issue.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600"
            }">
                ${issue.priority.toUpperCase()}
            </span>
        </div>

        <div class="flex flex-wrap gap-2 text-sm mb-3">
            <h2 class="font-semibold text-lg">${issue.title}</h2>
            <p class="text-gray-600 mb-3">${issue.description.slice(0,70)}...</p>
            <div class="flex font-medium text-xs gap-2 mb-4 flex-wrap">${labelsHTML}</div>
        </div>

        <div class="text-sm text-gray-500 py-4 px-4 border-t">
            <p><span>#${issue.id} ${issue.author}</span></p>
            <p><span>${new Date(issue.createdAt).toLocaleDateString()}</span></p>
        </div>
    `;

      // Add modal click
    div.addEventListener("click", () => openModal(issue.id));     

    container.append(div);
  });
}


function setActiveButton(status) {
  const buttons = ["allBtn", "openBtn", "closedBtn"];
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    btn.classList.remove("bg-[#4A00FF]", "text-white");
    btn.classList.add("bg-gray-200", "text-gray-700");
  });

  if(status === "all") {
    document.getElementById("allBtn").classList.add("bg-[#4A00FF]", "text-white");
    document.getElementById("allBtn").classList.remove("bg-gray-200", "text-gray-700");
  } else {
    // All inactive, clicked tab active
    document.getElementById(status + "Btn").classList.add("bg-[#4A00FF]", "text-white");
    document.getElementById(status + "Btn").classList.remove("bg-gray-200", "text-gray-700");
  }
}


function filterIssues(status) {
  setActiveButton(status);

  const filtered = status === "all"
    ? allIssues
    : allIssues.filter(issue => issue.status.toLowerCase() === status);

  displayIssues(filtered);
}


["all", "open", "closed"].forEach(status => {
  document.getElementById(status + "Btn").addEventListener("click", () => filterIssues(status));
});


loadIssues();