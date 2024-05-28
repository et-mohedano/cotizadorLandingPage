const IVA_RATE = 0.16;
const serviceHours = {
    design: 10,
    development: 16,
    design_development: 26,
    design_graphic_identity: 8,
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
    let profileCosts = {
        designer: 0,
        developer: 0,
        business_developer: 0,
        other: 0
    };

    let tableBody = document.querySelector('#detailsTable tbody');
    let profileTableBody = document.querySelector('#profileCostsTable tbody');
    tableBody.innerHTML = '';  // Limpiar tabla antes de llenar
    profileTableBody.innerHTML = '';  // Limpiar tabla de costos por perfil

    document.querySelectorAll('#quoteForm [name="service"]:checked').forEach(item => {
        let profile, cost;

        // Asignar el perfil adecuado según el servicio
        switch(item.id) {
            case 'marketing_strategy':
            case 'leads_tracking':
            case 'traffict_analysis':
                profile = 'business_developer';
                break;
            case 'design':
            case 'design_graphic_identity':
                profile = 'designer';
                break;
            case 'development':
            case 'integrations':
                profile = 'developer';
                break;
            default:
                profile = 'other'; // Asegurar que todos los casos están cubiertos
        }

        cost = serviceHours[item.value] * hourlyRates[profile];
        totalCost += cost;
        profileCosts[profile] += cost;
        entries.push({ label: item.labels[0].innerText, cost });
    });

    // Asumiendo que las secciones adicionales son manejadas por diseñadores
    document.querySelectorAll('#quoteForm [name="section"]:checked').forEach(item => {
        const cost = sectionHours[item.value] * hourlyRates.designer;
        totalCost += cost;
        profileCosts.designer += cost;
        entries.push({ label: item.labels[0].innerText, cost });
    });

    // Asumiendo que las funcionalidades adicionales son manejadas por desarrolladores
    document.querySelectorAll('#quoteForm [name="additional"]:checked').forEach(item => {
        const cost = additionalHours[item.value] * hourlyRates.developer;
        totalCost += cost;
        profileCosts.developer += cost;
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

    // Mostrar desglose de costos por perfil
    for (const [profile, cost] of Object.entries(profileCosts)) {
        let profileRow = `<tr><td>${profile.charAt(0).toUpperCase() + profile.slice(1)}</td><td>$${cost.toFixed(2)} MXN</td></tr>`;
        profileTableBody.innerHTML += profileRow;
    }

    let totalIVA = totalCost * (1 + IVA_RATE);
    document.getElementById('quoteResult').textContent = `Total: $${totalCost.toFixed(2)} MXN`;
    document.getElementById('totalIVA').textContent = `Total + IVA (16%): $${totalIVA.toFixed(2)} MXN`;
    document.getElementById('printSection').style.display = 'block';
}

function printDetails() {
    // Asegurar que la cotización está actualizada antes de imprimir.
    calculateQuote();  

    let tableBody = document.querySelector('#detailsTable tbody');
    let profileTableBody = document.querySelector('#profileCostsTable tbody');
    let rows = Array.from(tableBody.querySelectorAll('tr'));
    let profileRows = Array.from(profileTableBody.querySelectorAll('tr'));
    
    let totalCost = 0;
    let utilityCost = 0;
    let numEntries = rows.length - 1;  // Excluir la fila de utilidad.

    // Calcular el total sin la utilidad
    rows.forEach(row => {
        if (row.cells[0].textContent === 'Utilidad') {
            utilityCost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
        } else {
            let cost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
            totalCost += cost;
        }
    });

    // Redistribuir la utilidad equitativamente entre los servicios
    let utilityPerEntry = utilityCost / numEntries;
    rows.forEach(row => {
        if (row.cells[0].textContent !== 'Utilidad') {
            let cost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, '')) + utilityPerEntry;
            row.cells[1].textContent = `$${cost.toFixed(2)} MXN`;
            totalCost += utilityPerEntry;  // Añadir la parte proporcional de la utilidad al total.
        }
    });

    // Eliminar la fila de utilidad para que no aparezca en la impresión
    rows = rows.filter(row => row.cells[0].textContent !== 'Utilidad');
    
    // Redistribuir la utilidad entre los perfiles basado en sus costos antes de la utilidad
    let totalProfileCost = 0;
    profileRows.forEach(row => {
        totalProfileCost += parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
    });

    profileRows.forEach(row => {
        let cost = parseFloat(row.cells[1].textContent.replace(/[^\d.-]/g, ''));
        let utilityShare = (cost / totalProfileCost) * utilityCost; // Proporción de la utilidad basada en su contribución
        cost += utilityShare;
        row.cells[1].textContent = `$${cost.toFixed(2)} MXN`;
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
