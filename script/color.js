// VARIABLES GLOBALES
const productImage = document.getElementById('product-image');
const productSvg = document.getElementById('product-svg');
const btnFace = document.getElementById('btn-face');
const btnDos = document.getElementById('btn-dos');
const colorPalette = document.querySelectorAll('.color');
const opacitySlider = document.getElementById('opacity');
const productSelect = document.getElementById('product-select');

// Motifs (UI)
const motifThumbs = document.querySelectorAll('.motif-thumb');
const motifNoneBtn = document.getElementById('motif-none');

let currentColor = '#1A1A1A';
let currentView = 'face'; // 'face' | 'dos'
let currentProductKey = 'model1';

// Si null => couleur unie, sinon => motif (pattern)
let currentMotifUrl = null;

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const MOTIF_PATTERN_ID = 'motif-pattern';

// ⚠️ Mapping des 3 vêtements (3 paires face/dos).
// Hypothèse: 03/04 = modèle1, 05/06 = modèle2, 07/08 = modèle3
// et impair=face / pair=dos. Si c'est l'inverse chez toi, permute face/dos.
const PRODUCTS = {
    model1: {
        face: { png: 'assets/models/png/PNG_export_402-03.png', svg: 'assets/models/svg/svg_export_402-03.svg' },
        dos:  { png: 'assets/models/png/PNG_export_402-04.png', svg: 'assets/models/svg/svg_export_402-04.svg' },
    },
    model2: {
        face: { png: 'assets/models/png/PNG_export_402-05.png', svg: 'assets/models/svg/svg_export_402-05.svg' },
        dos:  { png: 'assets/models/png/PNG_export_402-06.png', svg: 'assets/models/svg/svg_export_402-06.svg' },
    },
    model3: {
        face: { png: 'assets/models/png/PNG_export_402-07.png', svg: 'assets/models/svg/svg_export_402-07.svg' },
        dos:  { png: 'assets/models/png/PNG_export_402-08.png', svg: 'assets/models/svg/svg_export_402-08.svg' },
    }
};

// CHARGEMENT DU SVG (sans imbriquer <svg> dans <svg>)
async function loadSvg(url) {
    const response = await fetch(url);
    const text = await response.text();

    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return;

    // Recopie viewBox + contenu pour garder #product-svg comme "conteneur"
    const viewBox = svgEl.getAttribute('viewBox');
    if (viewBox) productSvg.setAttribute('viewBox', viewBox);

    productSvg.innerHTML = svgEl.innerHTML;

    applyFillAndOpacity();
}

// ==== MOTIF PATTERN ====
function ensureMotifPattern(url) {
    // defs peut ne pas exister (et saute quand on remplace innerHTML)
    let defs = productSvg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(SVG_NS, 'defs');
        productSvg.insertBefore(defs, productSvg.firstChild);
    }

    let pattern = productSvg.querySelector(`#${MOTIF_PATTERN_ID}`);
    if (!pattern) {
        pattern = document.createElementNS(SVG_NS, 'pattern');
        pattern.setAttribute('id', MOTIF_PATTERN_ID);
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        // Taille du motif (à ajuster si tu veux un motif plus petit/grand)
        pattern.setAttribute('width', '500');
        pattern.setAttribute('height', '500');
        defs.appendChild(pattern);
    }

    let image = pattern.querySelector('image');
    if (!image) {
        image = document.createElementNS(SVG_NS, 'image');
        image.setAttribute('x', '0');
        image.setAttribute('y', '0');
        image.setAttribute('width', '500');
        image.setAttribute('height', '500');
        image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        pattern.appendChild(image);
    }

    // compat : href + xlink:href
    image.setAttribute('href', url);
    image.setAttributeNS(XLINK_NS, 'xlink:href', url);
}

// APPLIQUER COULEUR/MOTIF + OPACITÉ
function applyFillAndOpacity() {
    if (!productSvg) return;

    const elements = productSvg.querySelectorAll('path, rect, circle, polygon, ellipse');

    if (currentMotifUrl) {
        ensureMotifPattern(currentMotifUrl);
    }

    elements.forEach(el => {
        el.style.fill = currentMotifUrl
            ? `url(#${MOTIF_PATTERN_ID})`
            : currentColor;

        el.style.opacity = opacitySlider ? opacitySlider.value : 1;
    });
}

function render() {
    const product = PRODUCTS[currentProductKey];
    if (!product) return;

    const assets = product[currentView];
    if (!assets) return;

    if (productImage) productImage.src = assets.png;

    loadSvg(assets.svg).catch(() => {
        // en cas d'erreur de fetch (ex: ouverture en file://)
    });
}

// SWITCH FACE/DOS
if (btnFace) {
    btnFace.addEventListener('click', () => {
        currentView = 'face';
        render();
    });
}

if (btnDos) {
    btnDos.addEventListener('click', () => {
        currentView = 'dos';
        render();
    });
}

// CHOISIR LE VÊTEMENT
if (productSelect) {
    productSelect.addEventListener('change', () => {
        currentProductKey = productSelect.value;
        render();
    });
}

// CHANGER LA COULEUR (et repasser en mode "couleur unie")
colorPalette.forEach(colorDiv => {
    colorDiv.addEventListener('click', () => {
        currentMotifUrl = null; // priorité à la couleur
        currentColor = colorDiv.dataset.color;

        colorPalette.forEach(div => div.classList.remove('active'));
        colorDiv.classList.add('active');

        applyFillAndOpacity();
    });
});

// MOTIFS
motifThumbs.forEach(img => {
    img.addEventListener('click', () => {
        const url = img.dataset.motifSrc || img.getAttribute('src');
        if (!url) return;

        currentMotifUrl = url;
        applyFillAndOpacity();
    });
});

if (motifNoneBtn) {
    motifNoneBtn.addEventListener('click', () => {
        currentMotifUrl = null;
        applyFillAndOpacity();
    });
}

// AJUSTER L'OPACITÉ
if (opacitySlider) {
    opacitySlider.addEventListener('input', applyFillAndOpacity);
}

// CHARGEMENT INITIAL
render();