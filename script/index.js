const container = document.getElementById("tab-container");
const issueCount = document.getElementById("issueCount");
const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = []; // store fetched issues once

// Initial fetch
async function loadIssues() {
  const res = await fetch(api);
  const data = await res.json();
  allIssues = data.data;
  displayIssues(allIssues);
  setActiveButton("all"); // by default "All" active
}

// Display issues
function displayIssues(issues) {
  container.innerHTML = "";
  issueCount.innerText = issues.length;

  issues.forEach(issue => {
    const div = document.createElement("div");
    div.className = "card bg-white p-4 shadow rounded-md mb-3";

    div.style.borderTop = issue.status.toLowerCase() === "open" ? "5px solid green" : "5px solid purple";

    div.innerHTML = `
      <h2 class="font-bold text-lg mb-1">${issue.title}</h2>
      <p class="mb-1">${issue.description}</p>
      <p>Status: ${issue.status}</p>
      <p>Category: ${issue.category}</p>
      <p>Author: ${issue.author}</p>
      <p>Priority: ${issue.priority}</p>
      <p>Label: ${issue.label}</p>
      <p class="text-gray-500 text-sm">Created: ${issue.createdAt}</p>
    `;
    container.append(div);
  });
}

// Active button toggling
function setActiveButton(status) {
  const buttons = ["allBtn", "openBtn", "closedBtn"];
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    btn.classList.remove("bg-[#4A00FF]", "text-white"); // primary color classes
    btn.classList.add("bg-gray-200", "text-gray-700"); // inactive classes
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

// Filter issues using cached data
function filterIssues(status) {
  setActiveButton(status);

  const filtered = status === "all"
    ? allIssues
    : allIssues.filter(issue => issue.status.toLowerCase() === status);

  displayIssues(filtered);
}

// Add event listeners
["all", "open", "closed"].forEach(status => {
  document.getElementById(status + "Btn").addEventListener("click", () => filterIssues(status));
});

// Initial load
loadIssues();