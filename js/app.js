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
    } catch (error) {
        console.error("Error:", error);
    } finally {
        loader.classList.add('hidden');
    }
}