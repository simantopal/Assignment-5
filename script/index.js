const container = document.getElementById("tab-container");
const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues"
async function loadIssues(){
    const res = await fetch(api)
    const data = await res.json();
    displayIssues(data.data);
}

function displayIssues(issues){
    container.innerHTML = "";
    document.getElementById("issueCount").innerText = issues.length
    issues.forEach(issue => {
        const div = document.createElement("div");
        div.className = "card bg-white p-4 shadow";

        if(issue.status.toLowerCase() === "open"){
            div.style.borderTop = "5px solid green";
        }else{
            div.style.borderTop = "5px solid purple";
        }

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

        container.append(div);
    });
}

function setActiveButton(status){
    document.getElementById("allBtn").classList.remove("btn-active")
    document.getElementById("openBtn").classList.remove("btn-active")
    document.getElementById("closedBtn").classList.remove("btn-active")

    if(status === "all"){
        document.getElementById("allBtn").classList.add("btn-active")
    }
    if(status === "open"){
        document.getElementById("openBtn").classList.add("btn-active")
    }
    if(status === "closed"){
        document.getElementById("closedBtn").classList.add("btn-active")
    }
}


function filterIssues(status){
    setActiveButton(status)
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
        let issues = data.data;
        if(status !== "all"){
            issues = issues.filter(issue => issue.status.toLowerCase() === status);
        }
        displayIssues(issues);
    });
}



loadIssues();