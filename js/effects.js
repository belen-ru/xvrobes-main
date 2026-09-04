/* =========================================================
   ELEMENTOS CON CLASE REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


/* =========================================================
   INTERSECTION OBSERVER

   Detecta cuando un elemento aparece en pantalla.
========================================================= */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "active"
                        );


                        /*
                            Dejamos de observar
                            después de la animación.
                        */

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


/* =========================================================
   OBSERVAR ELEMENTOS
========================================================= */

revealElements.forEach(
    element => {

        observer.observe(
            element
        );

    }
);


/* =========================================================
   SOBRE
========================================================= */

const envelope =
    document.getElementById(
        "envelope"
    );


if (envelope) {

    envelope.addEventListener(
        "click",
        () => {

            envelope.classList.toggle(
                "open"
            );

        }
    );

}



