// Gestion des stickers repositionnables, redimensionnables et supprimables

(function () {
    const productContainer = document.querySelector('.product-container');
    const stickerThumbs = document.querySelectorAll('.sticker-thumb');
    const resetBtn = document.getElementById('reset-stickers');
    const deleteBtn = document.getElementById('delete-sticker');

    if (!productContainer || stickerThumbs.length === 0) return;

    let currentZIndex = 10;
    let selectedSticker = null; // sticker actuellement sélectionné

    stickerThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const src = thumb.dataset.stickerSrc || thumb.src;
            addSticker(src);
        });
    });

    function addSticker(src) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('sticker-instance');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '50%';
        wrapper.style.top = '50%';
        wrapper.style.transform = 'translate(-50%, -50%)';
        wrapper.style.cursor = 'move';
        wrapper.style.zIndex = currentZIndex++;

        const img = document.createElement('img');
        img.src = src;
        img.draggable = false;
        img.style.maxWidth = '150px';
        img.style.width = '100px';
        img.style.userSelect = 'none';

        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('sticker-resize-handle');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '-6px';
        resizeHandle.style.bottom = '-6px';
        resizeHandle.style.width = '12px';
        resizeHandle.style.height = '12px';
        resizeHandle.style.background = '#fff';
        resizeHandle.style.border = '1px solid #333';
        resizeHandle.style.cursor = 'se-resize';

        wrapper.appendChild(img);
        wrapper.appendChild(resizeHandle);
        productContainer.style.position = 'relative';
        productContainer.appendChild(wrapper);

        makeSelectable(wrapper);
        makeDraggable(wrapper);
        makeResizable(wrapper, img, resizeHandle);

        // sélectionner automatiquement le nouveau sticker
        selectSticker(wrapper);
    }

    function makeSelectable(element) {
        element.addEventListener('mousedown', (e) => {
            // si on clique sur la poignée de resize, on ne change pas la sélection ici
            if (e.target.classList.contains('sticker-resize-handle')) return;
            selectSticker(element);
        });
    }

    function selectSticker(element) {
        if (selectedSticker === element) return;

        if (selectedSticker) {
            selectedSticker.classList.remove('selected');
        }
        selectedSticker = element;
        if (selectedSticker) {
            selectedSticker.classList.add('selected');
            selectedSticker.style.zIndex = currentZIndex++;
        }
    }

    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let parentRect, stickerRect;

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('sticker-resize-handle')) return;
            isDragging = true;
            element.style.zIndex = currentZIndex++;
            stickerRect = element.getBoundingClientRect();
            parentRect = productContainer.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = stickerRect.left - parentRect.left;
            startTop = stickerRect.top - parentRect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            const width = element.offsetWidth;
            const height = element.offsetHeight;
            const maxLeft = parentRect.width - width;
            const maxTop = parentRect.height - height;

            // empêche de sortir du conteneur
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
            element.style.transform = '';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }


    function makeResizable(wrapper, img, handle) {
        let isResizing = false;
        let startX, startWidth;

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startWidth = img.getBoundingClientRect().width;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const newWidth = Math.max(30, startWidth + dx);
            img.style.width = newWidth + 'px';
        }

        function onMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // ==== Boutons d'action ====

    // Réinitialiser tous les stickers
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const instances = productContainer.querySelectorAll('.sticker-instance');
            instances.forEach(inst => inst.remove());
            selectedSticker = null;
        });
    }

    // Supprimer le sticker sélectionné
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (!selectedSticker) return;
            selectedSticker.remove();
            selectedSticker = null;
        });
    }
})();