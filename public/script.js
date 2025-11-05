document.addEventListener('DOMContentLoaded', () => {
    // Tab functionaliteit
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Verwijder active class van alle tabs
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Voeg active class toe aan geklikte tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Laad adressen voor dropdowns
    loadAdressen();
    loadInwoners();

    // Formulier voor nieuwe inwoner
    document.getElementById('inwonerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            naam: document.getElementById('naam').value,
            achternaam: document.getElementById('achternaam').value,
            geslacht: document.getElementById('geslacht').value,
            adres_id: document.getElementById('adres_id').value,
            geboortedatum: document.getElementById('geboortedatum').value
        };

        try {
            const response = await fetch('http://localhost:3000/inwoner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Inwoner toegevoegd!');
                loadInwoners();
                document.getElementById('inwonerForm').reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Formulier voor nieuwe relatie
    document.getElementById('relatieForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            inwoner_id_1: document.getElementById('inwoner1').value,
            inwoner_id_2: document.getElementById('inwoner2').value,
            relatie_type: document.getElementById('relatie_type').value
        };

        try {
            const response = await fetch('http://localhost:3000/relatie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Relatie toegevoegd!');
                document.getElementById('relatieForm').reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Formulier voor huwelijkscheck
    document.getElementById('huwelijkForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            inwoner_id_1: document.getElementById('huwelijk_inwoner1').value,
            inwoner_id_2: document.getElementById('huwelijk_inwoner2').value,
            inteelt_percentage: document.getElementById('inteelt').value,
            goedkeuring: document.getElementById('goedkeuring').value
        };

        try {
            const response = await fetch('http://localhost:3000/huwelijkscheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Huwelijkscheck toegevoegd!');
                document.getElementById('huwelijkForm').reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

// Functie om adressen te laden voor dropdowns
async function loadAdressen() {
    try {
        const response = await fetch('http://localhost:3000/adressen');
        const adressen = await response.json();

        const adresDropdown = document.getElementById('adres_id');
        adresDropdown.innerHTML = '<option value="">Selecteer Adres</option>';

        adressen.forEach(adres => {
            const option = document.createElement('option');
            option.value = adres.Kadaster_ID;
            option.textContent = `${adres.Adres}, ${adres.Woonplaats}`;
            adresDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading adressen:', error);
    }
}

// Functie om inwoners te laden
async function loadInwoners() {
    try {
        const response = await fetch('http://localhost:3000/inwoners');
        const inwoners = await response.json();

        // Vul inwoners dropdowns
        const inwonerDropdowns = [
            document.getElementById('inwoner1'),
            document.getElementById('inwoner2'),
            document.getElementById('huwelijk_inwoner1'),
            document.getElementById('huwelijk_inwoner2')
        ];

        inwonerDropdowns.forEach(dropdown => {
            if (dropdown) {
                dropdown.innerHTML = '<option value="">Selecteer Inwoner</option>';
                inwoners.forEach(inwoner => {
                    const option = document.createElement('option');
                    option.value = inwoner.Inwoner_ID;
                    option.textContent = `${inwoner.Naam} ${inwoner.Achternaam}`;
                    dropdown.appendChild(option);
                });
            }
        });

        // Toon inwoners lijst
        const inwonersList = document.getElementById('inwonersList');
        inwonersList.innerHTML = '';

        inwoners.forEach(inwoner => {
            const inwonerDiv = document.createElement('div');
            inwonerDiv.className = 'inwoner-item';

            const geslachtMap = {
                'man': 'Man',
                'vrouw': 'Vrouw',
                'partner': 'Partner'
            };

            inwonerDiv.innerHTML = `
                <p><strong>${inwoner.Naam} ${inwoner.Achternaam}</strong></p>
                <p>Geslacht: ${geslachtMap[inwoner.Geslacht] || inwoner.Geslacht}</p>
                <p>Geboortedatum: ${new Date(inwoner.Geboortedatum).toLocaleDateString()}</p>
                <p>Adres: ${inwoner.Adres_ID || 'Geen adres'}</p>
                <button class="edit-btn" onclick="editInwoner(${inwoner.Inwoner_ID})">Bewerken</button>
                <button class="delete-btn" onclick="deleteInwoner(${inwoner.Inwoner_ID})">Verwijderen</button>
            `;

            inwonersList.appendChild(inwonerDiv);
        });
    } catch (error) {
        console.error('Error loading inwoners:', error);
    }
}

// Functie om inwoner te bewerken
async function editInwoner(id) {
    // Hier zou je een modal of apart formulier kunnen openen
    alert(`Bewerk inwoner met ID: ${id}`);
    // Implementatie voor bewerken zou hier komen
}

// Functie om inwoner te verwijderen
async function deleteInwoner(id) {
    if (confirm('Weet je zeker dat je deze inwoner wilt verwijderen?')) {
        try {
            const response = await fetch(`http://localhost:3000/inwoner/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Inwoner verwijderd!');
                loadInwoners();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}