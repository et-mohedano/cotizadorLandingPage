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
    let profileCosts = {
        designer: 0,
        developer: 0,
        business_developer: 0
    };

    let tableBody = document.querySelector('#detailsTable tbody');
    tableBody.innerHTML = '';  // Limpiar tabla antes de llenar

    // Incluir cálculos para "Otro"
    let otherHours = parseFloat(document.getElementById('other').value) || 0;
    if (otherHours > 0) {
        const cost = otherHours * hourlyRates.other;
        totalCost += cost;
        profileCosts.other = cost; // Si se necesita trazar cuánto se calcula por "otro"
        let row = `<tr><td>Otro (${otherHours} horas)</td><td>$${cost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    }

    document.querySelectorAll('#quoteForm [name="service"]:checked').forEach(item => {
        serviceHours.other = parseFloat(document.getElementById('other').value) || 0; // Actualizar las horas de 'Otro'
        const profile = item.value.includes('design') ? 'designer' : 'developer';
        const cost = serviceHours[item.value] * hourlyRates[profile];
        profileCosts[profile] += cost;
        totalCost += cost;
        let row = `<tr><td>${item.labels[0].innerText}</td><td>$${cost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll('#quoteForm [name="section"]:checked').forEach(item => {
        const cost = sectionHours[item.value] * hourlyRates.designer;
        profileCosts.designer += cost;
        totalCost += cost;
        let row = `<tr><td>${item.labels[0].innerText}</td><td>$${cost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    });

    document.querySelectorAll('#quoteForm [name="additional"]:checked').forEach(item => {
        const cost = additionalHours[item.value] * hourlyRates.developer;
        profileCosts.developer += cost;
        totalCost += cost;
        let row = `<tr><td>${item.labels[0].innerText}</td><td>$${cost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    });

    // Costos adicionales por perfil
    for (const [profile, cost] of Object.entries(profileCosts)) {
        let row = `<tr><td>Total ${profile}</td><td>$${cost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    }

    const activeYears = parseInt(document.getElementById('activeTime').value || 0);
    const domainRequired = document.querySelector('input[name="domain"]:checked')?.value === 'no';
    const hostingRequired = document.querySelector('input[name="hosting"]:checked')?.value === 'no';

    if (hostingRequired) {
        let hostingCost = hostingCostPerYear * activeYears;
        totalCost += hostingCost;
        let row = `<tr><td>Costo de Hosting (por ${activeYears} años)</td><td>$${hostingCost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    }

    if (domainRequired) {
        let domainCostTotal = domainCost * activeYears; // Costo por los años activos
        totalCost += domainCostTotal;
        let row = `<tr><td>Costo de Dominio (por ${activeYears} años)</td><td>$${domainCostTotal.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    }

    // Incluir costos de correos corporativos si es necesario
    const requireCorporateEmails = document.getElementById('corporate_emails').checked;
    if (requireCorporateEmails) {
        let emailCost = corporateEmailCostPerYear * activeYears;
        totalCost += emailCost;
        let row = `<tr><td>Correos Corporativos (por ${activeYears} años)</td><td>$${emailCost.toFixed(2)} MXN</td></tr>`;
        tableBody.innerHTML += row;
    }
    
    const totalIVA = totalCost * (1 + IVA_RATE);
    document.getElementById('quoteResult').textContent = totalCost.toFixed(2);
    document.getElementById('totalIVA').textContent = totalIVA.toFixed(2);
    document.getElementById('printSection').style.display = 'block';
}

function printDetails() {
    window.print();
}

document.addEventListener("scroll", function() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollTop / scrollHeight;

    // Ajusta la posición del fondo según el porcentaje de desplazamiento
    document.body.style.backgroundPosition = `${scrollPercent * 100}% 0%`;
});
