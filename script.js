function manageScrollAnimations() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight));
    }

    function checkElementsVisibility() {
        const elements = document.querySelectorAll('.slide-in');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', checkElementsVisibility);
    window.addEventListener('resize', checkElementsVisibility);
    checkElementsVisibility();
}

function ouvertureFicheDePoste(idFichePoste) {
    if (!window.location.href.includes('personnel.html')) {
        window.location.href = `personnel.html${idFichePoste}`;
    }
    const ficheElement = document.querySelector(idFichePoste);
    ficheElement.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}

function fermetureFicheDePoste(idFichePoste) {
    const ficheElement = document.querySelector(idFichePoste);
    if (ficheElement) {
        ficheElement.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
    }
}


function ouvertureInfosFournisseur(idFournisseurBox) {
    if (!window.location.href.includes('fournisseurs.html')) {
        window.location.href = `fournisseurs.html${idFournisseurBox}`;
    }
    const ficheElement = document.querySelector(idFournisseurBox);
    ficheElement.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}

function fermetureInfosFournisseur(idFournisseurBox) {
    const ficheElement = document.querySelector(idFournisseurBox);
    if (ficheElement) {
        ficheElement.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
    }
}

function ouvertureInfosProduit(idProduit) {
    const ficheElement = document.querySelector(idProduit);
    ficheElement.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}
function fermetureInfosProduit(idProduit) {
    const ficheElement = document.querySelector(idProduit);
    if (ficheElement) {
        ficheElement.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
    }
}

let navOpen = true;
function manageNavOpenClose() {
    const navbar = document.getElementById('navGlob');
    const contenu = document.getElementById('contenu');
    const fleche = document.getElementById('flecheNav');

    if (navOpen) {
        navbar.style.marginLeft = '-22%';
        navbar.style.padding = '4%';
        contenu.style.width = '97%';
        contenu.style.marginLeft = '3%';
        fleche.style.transform = 'rotate(180deg)'
    } else {
        navbar.style.marginLeft = '0%';
        navbar.style.padding = '1%';
        contenu.style.width = '80%';
        contenu.style.marginLeft = '20%';
        fleche.style.transform = 'rotate(0deg)'
    }

    navOpen = !navOpen;
}


let burgerMenuTurn = true;
function burgerMenuClic() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navGlob = document.getElementById('navGlob');
    const menuGlob = document.getElementById('menuGlob');
    const flecheNav = document.getElementById('flecheNav');
    if (burgerMenuTurn) {
        flecheNav.style.display = 'none';
        burgerMenu.style.transform = 'rotate(90deg)';
        document.body.style.overflowY = 'hidden';
        navGlob.style.overflowY = 'auto';
        menuGlob.style.overflowY = 'auto';
        navGlob.style.bottom = '0%';
    } else {
        burgerMenu.style.transform = 'rotate(0deg)';
        document.body.style.overflowY = 'scroll';
        navGlob.style.overflowY = 'hidden';
        menuGlob.style.overflowY = 'hidden';
        navGlob.style.bottom = '100%';
        flecheNav.style.display = 'flex';
    }
    burgerMenuTurn = !burgerMenuTurn;
}

function obtenirSessionStorageJSON(cle) {
    let data = sessionStorage.getItem(cle);
    return data ? JSON.parse(data) : [];
}

function ajouterAuPanier(idElement) {
    let nomProd = idElement.substring(11); 
    let images = document.querySelectorAll("img"); 
    let liParent = null;

    for (let img of images) {
        if (img.src.includes(nomProd)) { 
            liParent = img.closest("li"); // Trouver le <li> parent
            if (liParent) break; // Arrêter dès qu'on trouve le premier
        }
    }

    if (!liParent) {
        console.error("Aucun élément <li> trouvé pour", idElement);
        return;
    }

    let contenuPanierSession = obtenirSessionStorageJSON("articlesStockeSession");

    let produit = {
        id: idElement,
        contenu: liParent.outerHTML // Stocke tout le contenu du <li>
    };

    contenuPanierSession.push(produit);
    sessionStorage.setItem("articlesStockeSession", JSON.stringify(contenuPanierSession));

    console.log("Produit ajouté au panier :", produit);
    mettreAJourCompteurPanier()
}






function afficherPanier() {
    let contenuPanierSession = obtenirSessionStorageJSON("articlesStockeSession");
    let listeProduits = document.getElementById("listesProduitsUl");
    listeProduits.innerHTML = ""; 

    contenuPanierSession.forEach(produit => {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = produit.contenu;


        let bouton = wrapper.querySelector("#buttonEnSavoirPlusSurProduitsOuFournisseur");
        if (bouton) {
            bouton.remove();
        }


        while (wrapper.firstChild) {
            listeProduits.appendChild(wrapper.firstChild);
        }
    });

    mettreAJourCompteurPanier();
}

function mettreAJourCompteurPanier() {
    let contenuPanierSession = obtenirSessionStorageJSON("articlesStockeSession");
    let compteur = document.getElementById("numPanier");
    
    if (compteur) {
        compteur.textContent = contenuPanierSession.length; // Met à jour le nombre d'articles
    }
}

  

//APPEL AUTOMATIQUE DE FONCTIONS
document.addEventListener('DOMContentLoaded', () => {
    mettreAJourCompteurPanier()
    manageScrollAnimations();
    if (window.location.href.includes('monpanier.html')){
        afficherPanier();
    }
    if (window.location.href.includes('personnel.html')) {
        const urlHash = window.location.hash;
        if (urlHash) {
            const ficheElement = document.querySelector(urlHash);
            if (ficheElement) {
                ficheElement.style.transform = 'scale(1)';
                document.body.style.overflow = 'hidden';
            }
        }
    }
    if (window.location.href.includes('fournisseurs.html')) {
        const urlHash = window.location.hash;
        if (urlHash) {
            const ficheElement = document.querySelector(urlHash);
            if (ficheElement) {
                ficheElement.style.transform = 'scale(1)';
                document.body.style.overflow = 'hidden';
            }
        }
    }
    if (window.location.href.includes('produits.html')) {
        const casesACocher = document.querySelectorAll('.checkbox');
        const produits = document.querySelectorAll('#listesProduitsUl > li');


        function filtrerProduits() {
            const filtresActifs = Array.from(casesACocher)
                .filter(caseACocher => caseACocher.checked)
                .map(caseACocher => caseACocher.value.toLowerCase());

            produits.forEach(produit => {
                const classesProduit = Array.from(produit.classList);
                const correspondAuFiltre = filtresActifs.length === 0 || filtresActifs.some(filtre => classesProduit.includes(filtre));

                if (correspondAuFiltre) {
                    produit.style.display = 'block';
                } else {
                    produit.style.display = 'none';
                }
            });
        }


        casesACocher.forEach(caseACocher => caseACocher.addEventListener('change', filtrerProduits));
        const searchInput = document.getElementById('searchInput');
        const resultatsRecherche = document.getElementById('resultatsRecherche');

        searchInput.addEventListener('keyup', function () {
            const texte = zoneTexte.value.toLowerCase();
            const recherche = searchInput.value.toLowerCase();
            const mots = texte.split(' ');
            const resultats = mots.filter(mot => mot.includes(recherche));

            resultatsRecherche.innerHTML = '';
            resultats.forEach(mot => {
                const div = document.createElement('div');
                div.textContent = mot;
                resultatsRecherche.appendChild(div);
            });
        });
    }
});

