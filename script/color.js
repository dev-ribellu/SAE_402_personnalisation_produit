// VARIABLES GLOBALES
const productImage = document.getElementById('product-image');
const productSvg = document.getElementById('product-svg');
const btnFace = document.getElementById('btn-face');
const btnDos = document.getElementById('btn-dos');
const colorPalette = document.querySelectorAll('.color');
const opacitySlider = document.getElementById('opacity');

let currentColor = '#1A1A1A'; // Couleur par défaut

// CHARGEMENT DU SVG
function loadSvg(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            productSvg.innerHTML = data;
            applyColorAndOpacity();
        });
}

// APPLIQUER LA COULEUR ET L'OPACITÉ
function applyColorAndOpacity() {
    const elements = productSvg.querySelectorAll('path, rect, circle, polygon');
    elements.forEach(el => {
        el.style.fill = currentColor;
        el.style.opacity = opacitySlider.value;
    });
}

// SWITCH FACE/DOS
btnFace.addEventListener('click', () => {
    productImage.src = '../assets/test_svg/Teeshirt_face-02_Plan de travail 1.png';
    loadSvg('../assets/test_svg/svg_face_Plan de travail 1.svg');
});

btnDos.addEventListener('click', () => {
    productImage.src = '../assets/test_svg/Teeshirt_dos-02.png';
    loadSvg('../assets/test_svg/svg_dos_Plan de travail 1-02.svg');
});

// CHANGER LA COULEUR
colorPalette.forEach(colorDiv => {
    colorDiv.addEventListener('click', () => {
        currentColor = colorDiv.dataset.color;
        colorPalette.forEach(div => div.classList.remove('active'));
        colorDiv.classList.add('active');
        applyColorAndOpacity();
    });
});

// AJUSTER L'OPACITÉ
opacitySlider.addEventListener('input', applyColorAndOpacity);

// CHARGEMENT INITIAL
loadSvg('../assets/test_svg/svg_face_Plan de travail 1.svg');