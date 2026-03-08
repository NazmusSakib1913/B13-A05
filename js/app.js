if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

let allIssues = [];
const grid = document.getElementById('issuesGrid');
const loader = document.getElementById('loader');
const issueCountLabel = document.getElementById('issueCount');

async function fetchIssues() {
    loader.classList.remove('hidden');
    grid.innerHTML = '';
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        if (Array.isArray(data)) {
            allIssues = data;
        } else if (data.data && Array.isArray(data.data)) {
            allIssues = data.data;
        } else {
            allIssues = [];
        }
        renderIssues(allIssues);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        loader.classList.add('hidden');
    }
}

function renderIssues(issues) {
    grid.innerHTML = '';
    issueCountLabel.innerText = issues.length;

    issues.forEach(issue => {
        const card = document.createElement('div');
        grid.appendChild(card);
    });
}