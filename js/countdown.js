/* =========================================================
   CONFIGURACIÓN DE LA FECHA DEL EVENTO

   Formato:

   AÑO-MES-DÍA T HORA:MINUTO:SEGUNDO

   Ejemplo:

   2027-09-15T18:00:00
========================================================= */

const eventDate =
    new Date(
        "2026-10-03T18:00:00"
    );


/* =========================================================
   ELEMENTOS
========================================================= */

const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");


/* =========================================================
   ACTUALIZAR CONTADOR
========================================================= */

function updateCountdown() {

    const currentDate =
        new Date();

    const difference =
        eventDate -
        currentDate;


    /*
        Si el evento ya ocurrió
    */

    if (difference <= 0) {

        daysElement.textContent =
            "00";

        hoursElement.textContent =
            "00";

        minutesElement.textContent =
            "00";

        secondsElement.textContent =
            "00";

        return;

    }


    /*
        Cálculos
    */

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference /
                (1000 * 60 * 60)
            ) % 24
        );

    const minutes =
        Math.floor(
            (difference /
                (1000 * 60)
            ) % 60
        );

    const seconds =
        Math.floor(
            (difference / 1000) % 60
        );


    /*
        Mostrar siempre dos dígitos
    */

    daysElement.textContent =
        String(days).padStart(2, "0");

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");

}


/* =========================================================
   EJECUCIÓN
========================================================= */

updateCountdown();

setInterval(
    updateCountdown,
    1000
);