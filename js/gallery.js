/* =========================================================
   ELEMENTOS
========================================================= */

const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );

const lightboxPrev =
    document.getElementById(
        "lightboxPrev"
    );

const lightboxNext =
    document.getElementById(
        "lightboxNext"
    );


/* =========================================================
   IMÁGENES
========================================================= */

const images =
    Array.from(galleryItems).map(
        item =>
            item.dataset.image
    );


let currentIndex = 0;


/* =========================================================
   ABRIR LIGHTBOX
========================================================= */

galleryItems.forEach(
    (item, index) => {

        item.addEventListener(
            "click",
            () => {

                currentIndex = index;

                showImage();

                lightbox.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";

            }
        );

    }
);


/* =========================================================
   MOSTRAR IMAGEN
========================================================= */

function showImage() {

    lightboxImage.src =
        images[currentIndex];

}


/* =========================================================
   CERRAR
========================================================= */

function closeLightbox() {

    lightbox.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "auto";

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


/* =========================================================
   SIGUIENTE
========================================================= */

lightboxNext.addEventListener(
    "click",
    () => {

        currentIndex++;

        if (
            currentIndex >= images.length
        ) {

            currentIndex = 0;

        }

        showImage();

    }
);


/* =========================================================
   ANTERIOR
========================================================= */

lightboxPrev.addEventListener(
    "click",
    () => {

        currentIndex--;

        if (
            currentIndex < 0
        ) {

            currentIndex =
                images.length - 1;

        }

        showImage();

    }
);


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox.classList.contains(
                "active"
            )
        ) {
            return;
        }


        if (
            event.key === "Escape"
        ) {

            closeLightbox();

        }


        if (
            event.key === "ArrowRight"
        ) {

            lightboxNext.click();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            lightboxPrev.click();

        }

    }
);


/* =========================================================
   CERRAR AL HACER CLICK FUERA
========================================================= */

lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            closeLightbox();

        }

    }
);