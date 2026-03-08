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
                ${issue.labels.map(label => `<span class="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-0.5 rounded-full font-medium">${label}</span>`).join('')}
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

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return fetchIssues();
    loader.classList.remove('hidden');
    grid.innerHTML = '';
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const data = await res.json();

        let results = [];
        if (Array.isArray(data)) {
            results = data;
        } else if (data.data && Array.isArray(data.data)) {
            results = data.data;
        }
        renderIssues(results);
    } catch (error) {
        console.error("Search failed:", error);
    } finally {
        loader.classList.add('hidden');
    }
});

async function openModal(id) {
    const modal = document.getElementById('issueModal');
    const content = document.getElementById('modalContent');
    content.innerHTML = `<div class="loader"></div>`;
    modal.classList.remove('hidden');

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const raw = await res.json();
        const issue = raw.data ? raw.data : raw;

        const isOpen = issue.status.toLowerCase() === 'open';
        const statusColor = isOpen ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';

        content.innerHTML = `
            <h2 class="text-lg font-bold text-gray-800 mb-2">${issue.title}</h2>
            <div class="flex items-center gap-2 text-xs mb-4 border-b pb-4">
                <span class="${statusColor} px-2 py-1 rounded-full font-bold uppercase">${issue.status}</span>
                <span class="text-gray-500">• Opened by <span class="font-bold text-gray-700">${issue.author}</span></span>
                <span class="text-gray-500">• ${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            
            <p class="text-sm text-gray-600 mb-6">${issue.description}</p>
            
            <div class="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                <div>
                    <p class="text-xs text-gray-500">Assignee:</p>
                    <p class="font-bold text-sm text-gray-800">${issue.assignee || 'Unassigned'}</p>
                </div>
                <div>
                    <p class="text-xs text-gray-500">Priority:</p>
                    <span class="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full uppercase">${issue.priority}</span>
                </div>
            </div>
            <div class="mt-6 flex justify-end">
                <button onclick="document.getElementById('issueModal').classList.add('hidden')" class="bg-[#5C16FF] text-white px-4 py-2 rounded-md hover:bg-purple-700">Close</button>
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<p class="text-red-500">Failed to load issue details.</p>`;
    }
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('issueModal').classList.add('hidden');
});

fetchIssues();