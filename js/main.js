/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

const preloader =
    document.getElementById("preloader");

const welcomeScreen =
    document.getElementById("welcomeScreen");

const openInvitationButton =
    document.getElementById("openInvitation");

const invitationContent =
    document.getElementById("invitationContent");


/* =========================================================
   PRELOADER
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            preloader.classList.add("hide");

        }, 500);

    }
);


/* =========================================================
   ABRIR INVITACIÓN
========================================================= */

openInvitationButton.addEventListener(
    "click",
    () => {

        /*
            Mostramos todo el contenido
        */

        invitationContent.classList.add("active");


        /*
            Ocultamos la pantalla de bienvenida
        */

        welcomeScreen.classList.add("hidden");


        /*
            Permitimos volver al inicio
        */

        document.body.style.overflow =
            "auto";


        /*
            Lanzamos un evento personalizado.

            El archivo music.js escucha este evento
            para iniciar la música.
        */

        document.dispatchEvent(
            new Event("invitationOpened")
        );


        /*
            Hacemos scroll al inicio.
        */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);

