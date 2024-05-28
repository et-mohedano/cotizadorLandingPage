const IVA_RATE = 0.16;
const serviceHours = {
    design: 10,
    development: 16,
    design_development: 26,
    graphic_identity: 8,
    marketing_strategy: 6,
    leads_tracking: 6,
    integrations: 2,
    traffict_analysis: 3,
    other: 0  // Valor inicial, se actualizará dinámicamente
};

const sectionHours = {
    about_us: 2,
    services: 2,
    products: 2,
    contact: 1,
    faq: 1,
    quotes: 2,
    portfolio: 3
};

const additionalHours = {
    blog: 8,
    live_chat: 5,
    online_payments: 8,
    newsletter: 8,
    seo: 2,
    responsive: 2,
    accesibility: 2,
    content: 1,
    text_content: 2
};

const hourlyRates = {
    designer: 120,
    developer: 150,
    business_developer: 140,
    other: 135
};

const hostingCostPerYear = 1200; // MXN por año
const domainCost = 800; // MXN por año si es necesario adquirir uno
const corporateEmailCostPerYear = 500;

function calculateQuote() {
    let totalCost = 0;
    let entries = []; // Para almacenar cada servicio y su costo para redistribución de utilidad

    let tableBody = document.querySelector('#detailsTable tbody');
    tableBody.innerHTML = '';  // Limpiar tabla antes de llenar

    // Incluir cálculos para "Otro"
    let otherHours = parseFloat(document.getElementById('other').value) || 0;
    if (otherHours > 0) {
        const cost = otherHours * hourlyRates.other;
        totalCost += cost;
        entries.push({ label: "Otro (" + otherHours + " horas)", cost });
    }

    document.querySelectorAll('#quoteForm [name="service"]:checked').forEach(item => {
        const cost = serviceHours[item.value] * hourlyRates[item.value.includes('design') ? 'designer' : 'developer'];
        totalCost += cost;
        entries.push({ label: item.labels[0].innerText, cost });
    });

    document.querySelectorAll('#quoteForm [name="section"]:checked').forEach(item => {
        const cost = sectionHours[item.value] * hourlyRates.designer;
        totalCost += cost;
        entries.push({ label: item.labels[0].innerText, cost });
    });

    document.querySelectorAll('#quoteForm [name="additional"]:checked').forEach(item => {
        const cost = additionalHours[item.value] * hourlyRates.developer;
        totalCost += cost;
        entries.push({ label: item.labels[0].innerText, cost });
    });

    const utilityRate = parseFloat(document.getElementById('utilityRate').value) || 40;
    const utilityCost = totalCost * (utilityRate / 100);
    totalCost += utilityCost;

    entries.forEach(entry => {
        let row = `<tr><td>${entry.label}</td><td>$${entry.cost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    });

    // Mostrar utilidad como una línea separada
    let utilityRow = `<tr><td>Utilidad</td><td>$${utilityCost.toFixed(2)} MXN</td></tr>`;
    tableBody.innerHTML += utilityRow;

    let totalIVA = totalCost * (1 + IVA_RATE);
    document.getElementById('quoteResult').textContent = totalCost.toFixed(2);
    document.getElementById('totalIVA').textContent = totalIVA.toFixed(2);
    document.getElementById('printSection').style.display = 'block';
}

function printDetails() {
    calculateQuote();  // Asegurar que la cotización está actualizada.
    let tableBody = document.querySelector('#detailsTable tbody');
    let rows = Array.from(tableBody.querySelectorAll('tr'));
    let totalCost = 0;
    let utilityCost = 0;
    let numEntries = rows.length - 1;  // Excluir la fila de utilidad.

    rows.forEach(row => {
        if (row.cells[0].textContent === 'Utilidad') {
            utilityCost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
            tableBody.removeChild(row);  // Eliminar la fila de utilidad visualmente.
        } else {
            let cost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
            totalCost += cost;
        }
    });

    // Redistribuir la utilidad equitativamente y actualizar las filas
    let utilityPerEntry = utilityCost / numEntries;
    rows.forEach(row => {
        if (row.cells[0].textContent !== 'Utilidad') {
            let cost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, '')) + utilityPerEntry;
            row.cells[1].textContent = `$${cost.toFixed(2)} MXN`;
            totalCost += utilityPerEntry;  // Añadir la parte proporcional de la utilidad al total.
        }
    });

    let totalIVA = totalCost * (1 + IVA_RATE);
    document.getElementById('quoteResult').textContent = `Total: $${totalCost.toFixed(2)} MXN`;
    document.getElementById('totalIVA').textContent = `Total + IVA (16%): $${totalIVA.toFixed(2)} MXN`;

    window.print();
}



document.addEventListener("scroll", function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollTop / scrollHeight;

    // Ajusta la posición del fondo según el porcentaje de desplazamiento
    document.body.style.backgroundPosition = `${scrollPercent * 100}% 0%`;
});
