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
        console.log("Here is the API Response:", data);
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
        const isOpen = issue.status.toLowerCase() === 'open';
        const borderClass = isOpen ? 'border-t-green-500' : 'border-t-purple-500';
        const iconSrc = isOpen ? 'assets/Open-Status.png' : 'assets/Closed- Status .png';
        const priorityColor = issue.priority.toLowerCase() === 'high' ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-100';
        const card = document.createElement('div');
        grid.appendChild(card);
        card.className = `bg-white border-t-4 ${borderClass} shadow-sm rounded-md p-4 cursor-pointer hover:shadow-md transition`;
        const issueId = issue._id || issue.id;
        card.onclick = () => openModal(issueId);
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <img src="${iconSrc}" class="w-4 h-4 mt-1" alt="status">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor} uppercase">${issue.priority}</span>
            </div>
            <h3 class="font-bold text-sm text-gray-800 mb-1 truncate">${issue.title}</h3>
            <p class="text-xs text-gray-500 mb-3 line-clamp-2">${issue.description}</p>
            <div class="flex gap-2 mb-4 flex-wrap">
                ${issue.labels.map(label => `<span class="text-[10px] border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">${label}</span>`).join('')}
            </div>
            <div class="text-[10px] text-gray-400 mt-auto border-t pt-2">
                <p>#${String(issueId).substring(0, 5)} by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(t => {
            t.classList.remove('bg-[#5C16FF]', 'text-white');
            t.classList.add('bg-white', 'text-gray-600');
        });
        e.target.classList.remove('bg-white', 'text-gray-600');
        e.target.classList.add('bg-[#5C16FF]', 'text-white');
        const status = e.target.getAttribute('data-status');
        if (status === 'All') {
            renderIssues(allIssues);
        } else {
            const filtered = allIssues.filter(i => i.status.toLowerCase() === status.toLowerCase());
            renderIssues(filtered);
        }
    });
});
