// Tasting Notes Loader
function loadTastingNotes(producerName) {
    let csvFile;
    
    // Handle special case for Théo Blet
    if (producerName.toLowerCase() === 'theo blet') {
        csvFile = 'domaine_theo_blet.csv';
    } else {
        csvFile = `rp_${producerName.replace(/\s+/g, '_').toLowerCase()}.csv`;
    }
    
    fetch(csvFile)
        .then(response => response.text())
        .then(data => {
            const notes = parseCSV(data);
            displayTastingNotes(notes, producerName);
        })
        .catch(error => {
            console.log('No tasting notes available for this producer');
        });
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const notes = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= 5) {
                notes.push({
                    name: values[0],
                    rating: values[1],
                    note: values[3],
                    vintage: extractVintage(values[0])
                });
            }
        }
    }
    
    return notes;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current.trim());
    return values;
}

function extractVintage(wineName) {
    const match = wineName.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
}

function displayTastingNotes(notes, producerName) {
    const container = document.getElementById('tasting-notes-container');
    if (!container) return;
    
    // Define the wines we have for each producer
    const ourWines = getOurWines(producerName);
    
    if (ourWines.length === 0) return;
    
    let html = '<div class="content-section">';
    html += '<h2 class="section-title">Wine Advocate Tasting Notes</h2>';

    
    html += '<div class="tasting-notes-grid">';
    
    ourWines.forEach(wine => {
        const matchingNote = findBestMatchingNote(notes, wine);
        if (matchingNote) {
            html += createTastingNoteCard(matchingNote, wine);
        }
    });
    
    html += '</div></div>';
    
    container.innerHTML = html;
}

function getOurWines(producerName) {
    const wineMappings = {
        'domaine aux moines': [
            { name: 'La Roche aux Moines', searchTerms: ['roche aux moines', 'savennières-roche'] },
            { name: 'Le Berceau des Fées', searchTerms: ['berceau des fées', 'berceau'] }
        ],
        'chateau de coulaine': [
            { name: 'Chinon', searchTerms: ['chinon'] },
            { name: 'La Diablesse', searchTerms: ['diablesse'] },
            { name: 'Les Picasses', searchTerms: ['picasses'] },
            { name: 'Sinople', searchTerms: ['sinople'] }
        ],
        'theo blet': [
            { name: 'La Peyanne', searchTerms: ['peyanne'] },
            { name: 'Le Corbin', searchTerms: ['corbin'] }
        ]
    };
    
    return wineMappings[producerName.toLowerCase()] || [];
}

function findBestMatchingNote(notes, wine) {
    let bestMatch = null;
    let bestScore = 0;
    
    notes.forEach(note => {
        const score = calculateMatchScore(note.name.toLowerCase(), wine.searchTerms);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = note;
        }
    });
    
    return bestMatch;
}

function calculateMatchScore(wineName, searchTerms) {
    let score = 0;
    searchTerms.forEach(term => {
        if (wineName.includes(term.toLowerCase())) {
            score += term.length;
        }
    });
    return score;
}

function createTastingNoteCard(note, wine) {
    return `
        <div class="tasting-note-card">
            <div class="tasting-note-header">
                <h3 class="wine-name">${wine.name} ${note.vintage}</h3>
                <div class="rating">${note.rating} pts</div>
            </div>
            <div class="tasting-note-content">
                <p class="tasting-note-text">${note.note}</p>
            </div>
        </div>
    `;
} 