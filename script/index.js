const container = document.getElementById("tab-container");
async function loadIssues(){
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
    displayIssues(data.data);
}

function displayIssues(issues){
    container.innerHTML = "";
    issues.forEach(issue => {
        const div = document.createElement("div");
        div.className = "card bg-white p-4 shadow";
        div.innerHTML = `
        <h2 class="font-bold text-lg">${issue.title}</h2>
        <p>${issue.description}</p>
        <p>Status: ${issue.status}</p>
        <p>Category: ${issue.category}</p>
        <p>Author: ${issue.author}</p>
        <p>Priority: ${issue.priority}</p>
        <p>Label: ${issue.label}</p>
        <p>Created: ${issue.createdAt}</p>
        `;

        container.appendChild(div);
    });
}

function filterIssues(status){
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
        let issues = data.data;
        if(status !== "all"){
            issues = issues.filter(issue => issue.status === status);
        }
        displayIssues(issues);
    });
}

loadIssues();