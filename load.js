if (typeof data === 'undefined') {
    console.error("Le fichier data.js n'est pas chargé. Vérifie l'ordre des scripts dans index.html");
}

let resultatsActuels = []

const donneesPropres = data.map(obj => {
    let nouveauObj = {};
    for (let cle in obj) {
        let cleNettoyee = cle.replace(/[^a-zA-Z0-9_.]/g, '');
        let valeurNettoyee = obj[cle].toString().replace(/\\"/g, '').trim();
        nouveauObj[cleNettoyee] = valeurNettoyee;
    }
    return nouveauObj;
});
resultatsActuels = [...donneesPropres];

console.log("Premier objet nettoyé :", donneesPropres[0]);

function afficherDonnees(liste, limite=50) {
    const corpsTableau = document.getElementById('table-body');
    if (!corpsTableau) return;
    
    corpsTableau.innerHTML = "";
    calculerStats(liste);

    liste.slice(0, limite).forEach(item => {
        const ligne = document.createElement('tr');
        
        let prixMetreCarre = parseFloat(item.loypredm2);
        let prixTotalExemple = prixMetreCarre * 50; 

        ligne.innerHTML = `
            <td>${item.INSEE_C}</td>
            <td>${item.DEP}</td>
            <td>${item.LIBGEO}</td>
            <td><strong>${prixMetreCarre.toFixed(2)} €</strong></td>
            <td>${prixTotalExemple.toFixed(0)} €</td>
        `;
        corpsTableau.appendChild(ligne);
    });
}

function calculerStats(liste) {
    // 1. On met à jour le compteur de résultats
    const spanCompteur = document.getElementById('compteur');
    if (spanCompteur) {
        spanCompteur.innerText = liste.length.toLocaleString(); // .toLocaleString() ajoute les espaces pour les milliers (ex: 30 000)
    }

    const spanMoy = document.getElementById('moyenne');
    if (!spanMoy || liste.length === 0) {
        // Si la liste est vide, on remet les stats à zéro
        if(spanMoy) spanMoy.innerText = "-";
        document.getElementById('min').innerText = "-";
        document.getElementById('max').innerText = "-";
        return;
    }

    // ... le reste de ton code pour les loyers (Moyenne, Min, Max) ...
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

const inputDpt = document.getElementById('inputDpt');
const inputCommune = document.getElementById('inputCommune');

function filtrer() {
    const dptRecherche = inputDpt.value.trim();
    const villeRecherche = inputCommune.value.toLowerCase().trim();
    const limite = parseInt(document.getElementById('selectLimit').value);

    // On stocke le résultat du filtre dans notre variable globale
    resultatsActuels = donneesPropres.filter(item => {
        const codeNettoye = item.INSEE_C.replace(/[^0-9]/g, '');
        const matchDpt = codeNettoye.startsWith(dptRecherche);
        const matchVille = item.LIBGEO.toLowerCase().includes(villeRecherche);
        return matchDpt && matchVille;
    });

    afficherDonnees(resultatsActuels, limite);
}

// 3. On branche les écouteurs sur les deux barres
if (inputDpt) inputDpt.addEventListener('input', filtrer);
if (inputCommune) inputCommune.addEventListener('input', filtrer);

// --- FIN DU REMPLACEMENT ---


afficherDonnees(donneesPropres);
let triAscendant = true;

function trierParLoyer() {
    const limite = parseInt(document.getElementById('selectLimit').value);

    // On trie uniquement ce qui est affiché (resultatsActuels)
    resultatsActuels.sort((a, b) => {
        let prixA = parseFloat(a.loypredm2.replace(',', '.'));
        let prixB = parseFloat(b.loypredm2.replace(',', '.'));

        return triAscendant ? prixA - prixB : prixB - prixA;
    });

    triAscendant = !triAscendant;
    
    // On met à jour le texte du bouton pour le style
    const btn = document.querySelector("button[onclick='trierParLoyer()']");
    if(btn) btn.innerText = triAscendant ? "Prix ⬆️" : "Prix ⬇️";

    afficherDonnees(resultatsActuels, limite);
}



afficherDonnees(donneesPropres);