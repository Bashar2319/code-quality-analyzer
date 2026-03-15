document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const btnBrowse = document.getElementById('btn-browse');
    
    const terminalLoader = document.getElementById('terminal-loader');
    const terminalText = document.getElementById('terminal-text');
    
    const codePreviewPanel = document.getElementById('code-preview-panel');
    const previewFilename = document.getElementById('preview-filename');
    const codeContent = document.getElementById('code-content');
    
    const metricsGrid = document.getElementById('metrics-grid');
    const chartsContainer = document.getElementById('charts-container');
    
    // Value elements
    const valLines = document.getElementById('val-lines');
    const valFunctions = document.getElementById('val-functions');
    const valComments = document.getElementById('val-comments');
    const valBlank = document.getElementById('val-blank');
    const valComplexity = document.getElementById('val-complexity');
    const complexityFill = document.getElementById('complexity-fill');

    // Chart instances
    let distributionChartInstance = null;
    let barChartInstance = null;

    // --- Drag and Drop Logic --- //

    // Browse button triggers file input
    btnBrowse.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // --- File Handling & API Request --- //

    function handleFile(file) {
        // Hide previous results
        metricsGrid.classList.add('hidden');
        chartsContainer.classList.add('hidden');
        codePreviewPanel.classList.add('hidden');
        
        // Show terminal loader
        terminalLoader.classList.remove('hidden');
        runTerminalAnimation();

        // Prepare File Reader for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewFilename.textContent = file.name;
            codeContent.textContent = e.target.result;
        };
        reader.readAsText(file);

        // Prepare FormData for API
        const formData = new FormData();
        formData.append('codeFile', file);

        // Simulated delay to show off the cool terminal animation
        setTimeout(() => {
            fetchAnalysis(formData);
        }, 2000); // 2 second mock delay
    }

    async function fetchAnalysis(formData) {
        setTerminalText('> Sending file to analysis engine...', false);
        
        try {
            // Note: Update URL if running backend separately on a different port.
            // Using relative URL assumes frontend is served by the Express backend.
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const metrics = await response.json();
            
            setTerminalText('> Analysis complete. Rendering UI...', false);
            
            setTimeout(() => {
                terminalLoader.classList.add('hidden');
                displayResults(metrics);
            }, 800);

        } catch (error) {
            console.error('Error:', error);
            setTerminalText('> ERROR: backend analysis failed. Is the server running?', false);
            setTerminalText('> Ensure backend is running locally on port 3000.', true);
        }
    }

    // --- UI Update Logic --- //

    function runTerminalAnimation() {
        terminalText.innerHTML = '';
        setTerminalText('> Initializing analysis engine...', false);
        setTimeout(() => setTerminalText('> Scanning source code structure...', true), 500);
        setTimeout(() => setTerminalText('> Counting lines, functions, and comments...', true), 1000);
        setTimeout(() => setTerminalText('> Calculating complexity score...', true), 1500);
    }

    function setTerminalText(text, append = false) {
        const p = document.createElement('p');
        p.textContent = text;
        if (!append) {
            terminalText.innerHTML = '';
        } else {
            // Remove cursor from previous line
            const cursor = terminalText.querySelector('.cursor');
            if (cursor) cursor.remove();
        }
        
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        p.appendChild(cursor);
        
        terminalText.appendChild(p);
    }

    function displayResults(metrics) {
        // Show elements
        metricsGrid.classList.remove('hidden');
        chartsContainer.classList.remove('hidden');
        codePreviewPanel.classList.remove('hidden');

        // Set targets for counters
        valLines.setAttribute('data-target', metrics.lines);
        valFunctions.setAttribute('data-target', metrics.functions);
        valComments.setAttribute('data-target', metrics.comments);
        valBlank.setAttribute('data-target', metrics.blankLines);
        valComplexity.setAttribute('data-target', metrics.complexityScore);

        // Update progress bar
        complexityFill.style.width = `${metrics.complexityScore}%`;

        // Run animations
        animateCounters();
        
        // Render Charts
        renderCharts(metrics);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower is slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            counter.innerText = '0';
            updateCount();
        });
    }

    // --- Chart.js Configuration --- //

    function renderCharts(metrics) {
        // Chart settings common styling
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Inter', sans-serif";
        
        // Destroy existing instances if any
        if (distributionChartInstance) distributionChartInstance.destroy();
        if (barChartInstance) barChartInstance.destroy();

        // 1. Pie Chart - Distribution
        const ctxPie = document.getElementById('distributionChart').getContext('2d');
        
        const codeLines = metrics.lines - metrics.blankLines - metrics.comments;
        
        distributionChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Code Lines', 'Comments', 'Blank Lines'],
                datasets: [{
                    data: [codeLines, metrics.comments, metrics.blankLines],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)', // blue
                        'rgba(16, 185, 129, 0.8)', // green
                        'rgba(148, 163, 184, 0.5)' // gray
                    ],
                    borderColor: '#1e293b',
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12 }
                    }
                },
                cutout: '70%'
            }
        });

        // 2. Bar Chart - Overview
        const ctxBar = document.getElementById('barChart').getContext('2d');
        
        // Create an array to avoid repeating data manually
        const barLabels = ['Total Lines', 'Code Lines', 'Comments', 'Blank Lines'];
        const barData = [metrics.lines, codeLines, metrics.comments, metrics.blankLines];
        
        barChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: 'Count',
                    data: barData,
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.7)', // purple
                        'rgba(59, 130, 246, 0.7)', // blue
                        'rgba(16, 185, 129, 0.7)', // green
                        'rgba(148, 163, 184, 0.5)' // gray
                    ],
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
});
