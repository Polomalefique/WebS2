if (typeof data === 'undefined') {
    console.error("Le fichier data.js n'est pas chargé. Vérifie l'ordre des scripts dans index.html");
}

const donneesPropres = data.map(obj => {
    let nouveauObj = {};
    for (let cle in obj) {
        let cleNettoyee = cle.replace(/[^a-zA-Z0-9_.]/g, '');
        let valeurNettoyee = obj[cle].toString().replace(/\\"/g, '').trim();
        nouveauObj[cleNettoyee] = valeurNettoyee;
    }
    return nouveauObj;
});

console.log("Premier objet nettoyé :", donneesPropres[0]);

function afficherDonnees(liste) {
    const corpsTableau = document.getElementById('table-body');
    if (!corpsTableau) return;
    
    corpsTableau.innerHTML = "";
    calculerStats(liste);

    liste.slice(0, 50).forEach(item => {
        const ligne = document.createElement('tr');
        
        let prixMetreCarre = parseFloat(item.loypredm2);
        let prixTotalExemple = prixMetreCarre * 50; 

        ligne.innerHTML = `
            <td>${item.INSEE_C}</td>
            <td>${item.LIBGEO}</td>
            <td><strong>${prixMetreCarre.toFixed(2)} €</strong></td>
            <td>${prixTotalExemple.toFixed(0)} €</td>
        `;
        corpsTableau.appendChild(ligne);
    });
}

function calculerStats(liste) {
    const spanMoy = document.getElementById('moyenne');
    if (!spanMoy || liste.length === 0) return;

    const loyers = liste.map(item => {
        let val = item.loypredm2 ? item.loypredm2.replace(',', '.') : "0";
        return parseFloat(val);
    }).filter(n => !isNaN(n)); 

    const min = Math.min(...loyers);
    const max = Math.max(...loyers);
    const moy = loyers.reduce((a, b) => a + b, 0) / loyers.length;

    document.getElementById('moyenne').innerText = moy.toFixed(2);
    document.getElementById('min').innerText = min.toFixed(2);
    document.getElementById('max').innerText = max.toFixed(2);
}

const input = document.getElementById('inputCommune');
if (input) {
    input.addEventListener('input', (e) => {
        const recherche = e.target.value.toLowerCase();
        const filtre = donneesPropres.filter(item => 
            item.LIBGEO.toLowerCase().includes(recherche)
        );
        afficherDonnees(filtre);
    });
}

let triAscendant = true;

function trierParLoyer() {
    donneesPropres.sort((a, b) => {
        let prixA = parseFloat(a.loypredm2.replace(',', '.'));
        let prixB = parseFloat(b.loypredm2.replace(',', '.'));

        if (triAscendant) {
            return prixA - prixB; 
        } else {
            return prixB - prixA; 
        }
    });
    triAscendant = !triAscendant;
    afficherDonnees(donneesPropres);
}

afficherDonnees(donneesPropres);