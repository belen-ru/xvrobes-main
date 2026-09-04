/* =========================================================
   ELEMENTOS DE MÚSICA
========================================================= */

const music =
    document.getElementById(
        "backgroundMusic"
    );

const musicButton =
    document.getElementById(
        "musicButton"
    );

const musicIcon =
    document.getElementById(
        "musicIcon"
    );


/* =========================================================
   ESTADO
========================================================= */

let isPlaying =
    false;


/* =========================================================
   REPRODUCIR
========================================================= */

function playMusic() {

    music.play()
        .then(() => {

            isPlaying = true;

            musicIcon.textContent =
                "♫";

            musicButton.classList.add(
                "playing"
            );

        })
        .catch(() => {

            /*
                Algunos navegadores pueden bloquear
                la reproducción automática.
            */

            console.log(
                "El navegador bloqueó el autoplay."
            );

        });

}


/* =========================================================
   PAUSAR
========================================================= */

function pauseMusic() {

    music.pause();

    isPlaying = false;

    musicIcon.textContent =
        "♪";

    musicButton.classList.remove(
        "playing"
    );

}


/* =========================================================
   BOTÓN
========================================================= */

musicButton.addEventListener(
    "click",
    () => {

        if (isPlaying) {

            pauseMusic();

        } else {

            playMusic();

        }

    }
);


/* =========================================================
   CUANDO SE ABRE LA INVITACIÓN
========================================================= */

document.addEventListener(
    "invitationOpened",
    () => {

        playMusic();

    }
);