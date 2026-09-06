/* =========================================================
   CONFIRMACIÓN DE ASISTENCIA
========================================================= */



const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwGtCcz_8FGaPg88j3AGYWOgacTj1bmy8YCby8Rwlpv3l6raq4t9TSfRBBBQenJFODDNA/exec";



/* =========================================================
   ELEMENTOS DEL FORMULARIO
========================================================= */

const rsvpForm =
    document.getElementById(
        "rsvpForm"
    );


const submitButton =
    document.getElementById(
        "rsvpSubmit"
    );


const submitText =
    document.getElementById(
        "submitText"
    );


const formMessage =
    document.getElementById(
        "formMessage"
    );



/* =========================================================
   ENVÍO DEL FORMULARIO
========================================================= */

rsvpForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        /* -----------------------------------------
           COMPROBAR CONFIGURACIÓN
        ----------------------------------------- */

        if (!GOOGLE_SCRIPT_URL) {

            showMessage(
                "La confirmación todavía no está configurada.",
                "error"
            );

            return;

        }


        /* -----------------------------------------
           OBTENER DATOS DEL FORMULARIO
        ----------------------------------------- */

        const formData =
            new FormData(
                rsvpForm
            );


        const nombre =
            formData
                .get("nombre")
                .trim();


        const asistencia =
            formData.get(
                "asistencia"
            );


        const personas =
            formData.get(
                "personas"
            );


        const comentarios =
            formData
                .get("comentarios")
                .trim();



        /* -----------------------------------------
           VALIDACIONES
        ----------------------------------------- */

        if (!nombre) {

            showMessage(
                "Por favor escribe tu nombre.",
                "error"
            );

            return;

        }


        if (!asistencia) {

            showMessage(
                "Selecciona si asistirás o no.",
                "error"
            );

            return;

        }


        if (!personas) {

            showMessage(
                "Indica cuántas personas asistirán.",
                "error"
            );

            return;

        }



        /* -----------------------------------------
           SI NO ASISTE → 0 PERSONAS
        ----------------------------------------- */

        const cantidadPersonas =
            asistencia === "No"
                ? "0"
                : personas;



        /* -----------------------------------------
           ESTADO DEL BOTÓN
        ----------------------------------------- */

        submitButton.disabled =
            true;

        submitButton.classList.add(
            "loading"
        );

        submitText.textContent =
            "Enviando...";


        showMessage(
            "",
            ""
        );



        /* -----------------------------------------
           ENVIAR A GOOGLE SHEETS
        ----------------------------------------- */

        try {

            await fetch(
                GOOGLE_SCRIPT_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify({

                            nombre:
                                nombre,

                            asistencia:
                                asistencia,

                            personas:
                                cantidadPersonas,

                            comentarios:
                                comentarios

                        })

                }
            );


            /* -------------------------------------
               CONFIRMACIÓN EXITOSA
            ------------------------------------- */

            showMessage(
                "¡Gracias! Tu confirmación fue registrada correctamente. 💗",
                "success"
            );


            rsvpForm.reset();


        } catch (error) {

            console.error(
                "Error enviando RSVP:",
                error
            );


            showMessage(
                "No pudimos registrar tu confirmación. Intenta nuevamente.",
                "error"
            );


        } finally {

            submitButton.disabled =
                false;

            submitButton.classList.remove(
                "loading"
            );

            submitText.textContent =
                "Confirmar";

        }

    }
);



/* =========================================================
   MOSTRAR MENSAJES
========================================================= */

function showMessage(
    message,
    type
) {

    formMessage.textContent =
        message;

    formMessage.className =
        "form-message";


    if (type) {

        formMessage.classList.add(
            type
        );

    }

}