# README — SAE 402 MMI2 CORTE

---

```
NOM : Fligitter
PRENOM : Robin
URL GIT REPO : https://github.com/dev-ribellu/SAE_402_personnalisation_produit
URL GIT PAGE : https://dev-ribellu.github.io/SAE_402_personnalisation_produit/
```

---

# SAE 402 MMI2 CORTE — Robin Fligitter

## Présentation
Projet web de **personnalisation de produit** pour la SAE 402 (Bî You).  
L’utilisateur peut sélectionner un modèle, changer la couleur/la teinte via un SVG superposé, appliquer des motifs et ajouter des stickers repositionnables.

## Structure du projet
- `index.html` : page principale de personnalisation
- `home.html` : page d’accueil
- `actions.html` : page “Nos actions”
- `fb.html` : page “Fabienne Verdier”
- `style/`
  - `index.css` : styles globaux + personnalisation
  - `home.css` : styles spécifiques accueil (hero, reveal, parallax)
  - `actions.css` : styles spécifiques actions
  - `fb.css` : styles spécifiques Fabienne Verdier
- `script/`
  - `color.js` : gestion modèle face/dos, changement couleur/opacité, motifs (pattern SVG)
  - `sticker.js` : ajout, déplacement, redimensionnement, suppression des stickers
  - `home.js` : reveal au scroll + parallax (home)
  - `actions.js` : reveal/slides/timeline + parallax + scroll horizontal (actions)
- `assets/` : images (modèles PNG/SVG, stickers, motifs, visuels pages)

## Fonctionnalités
### Personnalisation (page `index.html`)
- Choix du **modèle** (`select#product-select`)
- Vue **Face / Dos** (`#btn-face`, `#btn-dos`)
- Application d’une **couleur** sur le SVG (sur les `path/rect/...`)
- Gestion de l’**opacité** (slider `#opacity`)
- Application d’un **motif** via `<pattern>` injecté dans le SVG
- **Stickers** :
  - ajout depuis une liste
  - déplacement (drag)
  - redimensionnement (handle)
  - suppression du sticker sélectionné
  - reset de tous les stickers




## Notes techniques
- Le SVG est chargé via `fetch()` dans [`script/color.js`](script/color.js) puis injecté dans `#product-svg`.
- Les stickers sont gérés en position absolue dans `.product-container` et sont bornés sur la zone du SVG via `getBoundingClientRect()` dans [`script/sticker.js`](script/sticker.js).

## Auteur
- **Robin Fligitter**

---

---

## TÂCHE #01 : Système de changement de couleur via SVG superposé

**Date : 30/03/2026   Temps total : 1hh   Gain temps : 3hh (vs manuel)**

### 1. DEMANDE À L'IA
*(reconstitué depuis color.js)*
```
Comment superposer un SVG sur une image PNG d'un vêtement pour 
pouvoir changer sa couleur dynamiquement en JavaScript, sans 
imbriquer des balises <svg> dans d'autres <svg> ?
```

### 2. RÉPONSE DE L'IA
*(code reconstitué depuis color.js)*
```javascript
// Mapping des 3 vêtements (3 paires face/dos)
const PRODUCTS = {
    model1: {
        face: { png: 'assets/models/png/PNG_export_402-03.png', 
                svg: 'assets/models/svg/svg_export_402-03.svg' },
        dos:  { png: 'assets/models/png/PNG_export_402-04.png', 
                svg: 'assets/models/svg/svg_export_402-04.svg' },
    },
    model2: {
        face: { png: 'assets/models/png/PNG_export_402-05.png', 
                svg: 'assets/models/svg/svg_export_402-05.svg' },
        dos:  { png: 'assets/models/png/PNG_export_402-06.png', 
                svg: 'assets/models/svg/svg_export_402-06.svg' },
    },
    model3: {
        face: { png: 'assets/models/png/PNG_export_402-07.png', 
                svg: 'assets/models/svg/svg_export_402-07.svg' },
        dos:  { png: 'assets/models/png/PNG_export_402-08.png', 
                svg: 'assets/models/svg/svg_export_402-08.svg' },
    }
};

// Chargement du SVG via fetch (évite imbrication <svg> dans <svg>)
async function loadSvg(url) {
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return;
    const viewBox = svgEl.getAttribute('viewBox');
    if (viewBox) productSvg.setAttribute('viewBox', viewBox);
    productSvg.innerHTML = svgEl.innerHTML;
}
```

**Problèmes repérés :**
- ☐ L'IA ne savait pas si face=impair / dos=pair → commentaire d'avertissement laissé dans le code
- ☐ Le viewBox n'était pas toujours récupéré correctement selon les exports SVG
- ☐ Pas de gestion d'erreur si le fichier SVG est introuvable (fetch 404)

### 3. MES CORRECTIONS
```javascript
// Vérification ajoutée : si svgEl null, on sort proprement
async function loadSvg(url) {
    const response = await fetch(url);
    if (!response.ok) return; // ← ajout gestion 404
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return;
    const viewBox = svgEl.getAttribute('viewBox');
    if (viewBox) productSvg.setAttribute('viewBox', viewBox);
    productSvg.innerHTML = svgEl.innerHTML;
    applyFillAndOpacity(); // ← rechargement couleur après chaque chargement SVG
}
```

**Modifications expliquées :**
- ☐ Ajout d'un guard `response.ok` pour éviter les erreurs silencieuses
- ☐ Appel de `applyFillAndOpacity()` immédiatement après chargement pour conserver la couleur sélectionnée

### 4. RÉSULTAT


**Autres améliorations :**
- ☐ Le système fonctionne pour les 3 modèles (Veston, Veste courte, Haut ample)
- ☐ Compatible face/dos avec bascule dynamique

---

---

## TÂCHE #02 : Système de stickers (drag, resize, suppression)

**Date : 11/04/2026   Temps total : 2h   Gain temps : 8h (vs manuel)**

### 1. DEMANDE À L'IA
*(reconstitué depuis sticker.js)*
```
Comment créer des stickers repositionnables et redimensionnables 
sur une zone d'aperçu de vêtement en JavaScript vanilla ? 
Les stickers doivent pouvoir être déplacés, redimensionnés avec 
une poignée, et rester dans les limites du SVG du vêtement.
```

### 2. RÉPONSE DE L'IA
*(code reconstitué depuis sticker.js)*
```javascript
function makeResizable(wrapper, img, handle) {
    let isResizing = false;
    let startX, startWidth;
    let svgRect, containerRect, wrapperRect;

    handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startWidth = img.getBoundingClientRect().width;

        containerRect = productContainer.getBoundingClientRect();
        svgRect = productSvg.getBoundingClientRect();
        wrapperRect = wrapper.getBoundingClientRect();

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        let newWidth = Math.max(30, startWidth + dx);

        const leftInContainer = wrapperRect.left - containerRect.left;
        const svgLeftInContainer = svgRect.left - containerRect.left;
        const svgRightInContainer = svgLeftInContainer + svgRect.width;
        // Contrainte : ne pas dépasser la droite du SVG
        const maxWidth = svgRightInContainer - leftInContainer;
        newWidth = Math.min(newWidth, maxWidth);
        img.style.width = newWidth + 'px';
    }
}
```

**Problèmes repérés :**
- ☐ Le resize ne prenait pas en compte le dépassement vers le bas
- ☐ Sur mobile / touch events non gérés initialement
- ☐ La suppression du sticker sélectionné nécessitait un système de sélection active à construire manuellement

### 3. MES CORRECTIONS
```javascript
function onMouseMove(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    let newWidth = Math.max(30, startWidth + dx);

    const leftInContainer = wrapperRect.left - containerRect.left;
    const topInContainer = wrapperRect.top - containerRect.top;

    const svgLeftInContainer = svgRect.left - containerRect.left;
    const svgTopInContainer = svgRect.top - containerRect.top;
    const svgRightInContainer = svgLeftInContainer + svgRect.width;
    const svgBottomInContainer = svgTopInContainer + svgRect.height;

    // Contrainte droite ET bas (ajout contrôle vertical)
    const maxWidthRight = svgRightInContainer - leftInContainer;
    const maxWidthBottom = svgBottomInContainer - topInContainer;
    newWidth = Math.min(newWidth, maxWidthRight, maxWidthBottom);

    img.style.width = newWidth + 'px';
}
```

**Modifications expliquées :**
- ☐ Ajout de la contrainte verticale `svgBottomInContainer` pour bloquer le resize vers le bas
- ☐ Liaison du bouton `#delete-sticker` et `#reset-stickers` au système de sélection active

### 4. RÉSULTAT


**Autres améliorations :**
- ☐ Stickers repositionnables avec drag natif
- ☐ Bouton de reset global + suppression individuelle (🗑)

---

---

## TÂCHE #03 : Application de motifs SVG (patterns) sur le vêtement

**Date : 5/04/2026   Temps total : 1h   Gain temps : 2h (vs manuel)**

### 1. DEMANDE À L'IA
*(reconstitué depuis color.js — section motifs)*
```
Comment appliquer un motif répété (pattern SVG) par dessus 
une couleur déjà appliquée sur un SVG de vêtement, 
avec un slider d'opacité pour doser l'effet ?
```

### 2. RÉPONSE DE L'IA
```javascript
// Sélection d'un motif via thumbnail
motifThumbs.forEach(img => {
    img.addEventListener('click', () => {
        const url = img.dataset.motifSrc || img.getAttribute('src');
        if (!url) return;
        currentMotifUrl = url;
        applyFillAndOpacity();
    });
});

// Bouton "aucun motif"
if (motifNoneBtn) {
    motifNoneBtn.addEventListener('click', () => {
        currentMotifUrl = null;
        applyFillAndOpacity();
    });
}

// Slider opacité
if (opacitySlider) {
    opacitySlider.addEventListener('input', applyFillAndOpacity);
}
```

**Problèmes repérés :**
- ☐ La fonction `applyFillAndOpacity()` devait combiner couleur + motif + opacité sans conflit
- ☐ Quand on changeait de vêtement, le motif ne se réappliquait pas automatiquement
- ☐ Le `data-motif-src` devait être cohérent avec les noms de fichiers dans `assets/`

### 3. MES CORRECTIONS
```javascript
// Ajout d'un appel explicite après changement de modèle
productSelect.addEventListener('change', () => {
    currentView = 'face'; // reset vue
    render();             // recharge PNG + SVG
    applyFillAndOpacity(); // ← réapplique motif + couleur
});

function applyFillAndOpacity() {
    if (!currentMotifUrl) {
        // Mode couleur simple
        setSvgFill(currentColor, parseFloat(opacitySlider.value));
    } else {
        // Mode motif : injecte un <pattern> SVG
        setSvgPattern(currentMotifUrl, parseFloat(opacitySlider.value));
    }
}
```

**Modifications expliquées :**
- ☐ Réapplication automatique du motif au changement de modèle
- ☐ Séparation claire entre mode couleur simple et mode pattern dans `applyFillAndOpacity()`

### 4. RÉSULTAT


**Autres améliorations :**
- ☐ Slider d'opacité fonctionnel (0 à 1) pour doser l'intensité de la couleur/du motif
- ☐ Bouton "Aucun motif" pour revenir à la couleur unie






---

---

## Structure du projet

```
📦 sae402-bi-you/
├── 📄 index.html          → Page principale de personnalisation
├── 📄 home.html           → Page d'accueil
├── 📄 actions.html        → Page "Nos actions" (timeline, scroll horizontal)
├── 📄 fb.html             → Page "Fabienne Verdier"
│
├── 📁 style/
│   ├── index.css          → Design system global + variables CSS
│   ├── home.css           → Hero, parallax, reveal (accueil)
│   ├── actions.css        → Cards, timeline, roadmap
│   └── fb.css             → Page éditoriale Fabienne Verdier
│
├── 📁 script/
│   ├── color.js           → Modèles face/dos, couleurs, opacité, motifs SVG
│   ├── sticker.js         → Drag & drop, resize, suppression stickers
│   ├── home.js            → Scroll reveal + parallax (home)
│   └── actions.js         → Reveal + slides + timeline + scroll horizontal
│
└── 📁 assets/
    ├── models/
    │   ├── png/            → Exports PNG des vêtements (03→08)
    │   └── svg/            → Exports SVG superposables (03→08)
    ├── stickers/           → Stickers PNG (Fichier 1→6)
    ├── home/               → Visuels page accueil
    ├── actions/            → Visuels page actions
    ├── fb/                 → Œuvres Fabienne Verdier
    └── logo.png
```

---

## Technologies utilisées

| Technologie | Usage |
|---|---|
| HTML5 sémantique | Structure 4 pages |
| CSS3 (variables, grid, flexbox) | Design system + layouts |
| JavaScript Vanilla (ES6+) | Toutes les interactions |
| SVG + DOMParser | Colorisation dynamique des modèles |
| IntersectionObserver | Animations reveal au scroll |
| RequestAnimationFrame | Effet parallax performant |
| Fetch API | Chargement dynamique des SVG |

---

