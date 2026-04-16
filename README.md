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