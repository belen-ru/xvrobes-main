/* =========================================================
   CONFIRMACIÓN DE ASISTENCIA
========================================================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwGtCcz_8FGaPg88j3AGYWOgacTj1bmy8YCby8Rwlpv3l6raq4t9TSfRBBBQenJFODDNA/exec";


/* =========================================================
   ELEMENTOS DEL FORMULARIO
========================================================= */

const rsvpForm =
    document.getElementById("rsvpForm");

const submitButton =
    document.getElementById("rsvpSubmit");

const submitText =
    document.getElementById("submitText");

const formMessage =
    document.getElementById("formMessage");

const nombreInput =
    document.getElementById("guestName");


/* =========================================================
   NORMALIZAR NOMBRE
   Convierte:
   " María López "
   "MARÍA LÓPEZ"
   "maria lopez"

   en una forma comparable.
========================================================= */

function normalizarNombre(nombre) {

    return nombre
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

}


/* =========================================================
   ESTADO DEL BOTÓN
========================================================= */

function bloquearBoton(mensaje = "Confirmación registrada") {

    submitButton.disabled = true;

    submitButton.classList.remove("loading");

    submitText.textContent = "Confirmado";

    showMessage(
        mensaje,
        "success"
    );

}


function desbloquearBoton() {

    submitButton.disabled = false;

    submitButton.classList.remove("loading");

    submitText.textContent = "Confirmar";

}


/* =========================================================
   COMPROBAR SI EL NOMBRE YA CONFIRMÓ
   Utilizamos JSONP para poder consultar Apps Script
   desde la invitación sin problemas de CORS.
========================================================= */

function comprobarNombre(nombre) {

    return new Promise((resolve, reject) => {

        const callbackName =
            "rsvpCallback_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 10000);


        const script =
            document.createElement("script");


        const timeout =
            setTimeout(() => {

                script.remove();

                delete window[callbackName];

                reject(
                    new Error(
                        "Tiempo de espera agotado."
                    )
                );

            }, 10000);


        window[callbackName] =
            function(response) {

                clearTimeout(timeout);

                script.remove();

                delete window[callbackName];

                resolve(response);

            };


        script.src =
            GOOGLE_SCRIPT_URL +
            "?action=check" +
            "&nombre=" +
            encodeURIComponent(
                normalizarNombre(nombre)
            ) +
            "&callback=" +
            callbackName;


        script.onerror =
            function() {

                clearTimeout(timeout);

                script.remove();

                delete window[callbackName];

                reject(
                    new Error(
                        "No se pudo consultar la confirmación."
                    )
                );

            };


        document.body.appendChild(script);

    });

}


/* =========================================================
   COMPROBAR NOMBRE AL SALIR DEL CAMPO
========================================================= */

nombreInput.addEventListener(
    "blur",
    async function() {

        const nombre =
            nombreInput.value.trim();


        if (!nombre) {

            desbloquearBoton();

            return;

        }


        try {

            const resultado =
                await comprobarNombre(
                    nombre
                );


            if (resultado.exists) {

                bloquearBoton(
                    "Esta persona ya confirmó su asistencia. 💗"
                );

            } else {

                desbloquearBoton();

                showMessage(
                    "",
                    ""
                );

            }


        } catch (error) {

            console.error(
                "Error comprobando nombre:",
                error
            );

        }

    }
);


/* =========================================================
   ENVÍO DEL FORMULARIO
========================================================= */

rsvpForm.addEventListener(
    "submit",
    async function(event) {

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
           OBTENER DATOS
        ----------------------------------------- */

        const formData =
            new FormData(
                rsvpForm
            );


        const nombre =
            String(
                formData.get("nombre") || ""
            ).trim();


        const asistencia =
            formData.get("asistencia");


        const personas =
            formData.get("personas");


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
           COMPROBAR NUEVAMENTE
           JUSTO ANTES DE ENVIAR
        ----------------------------------------- */

        try {

            const comprobacion =
                await comprobarNombre(
                    nombre
                );


            if (comprobacion.exists) {

                bloquearBoton(
                    "Esta persona ya confirmó su asistencia. 💗"
                );

                return;

            }


        } catch (error) {

            console.error(
                "Error comprobando nombre:",
                error
            );

            showMessage(
                "No se pudo verificar la confirmación. Intenta nuevamente.",
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
                    method: "POST",

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
                                cantidadPersonas

                        })
                }
            );


            /* -------------------------------------
               GUARDAR EN LOCALSTORAGE

               Esto hace que en ESTE dispositivo
               también quede bloqueado.
            ------------------------------------- */

            const nombreNormalizado =
                normalizarNombre(
                    nombre
                );


            localStorage.setItem(
                "rsvp_" + nombreNormalizado,
                "confirmado"
            );


            /* -------------------------------------
               CONFIRMACIÓN EXITOSA
            ------------------------------------- */

            bloquearBoton(
                "¡Gracias! Tu confirmación fue registrada correctamente. Nos vemos ese gran día. 💗"
            );


        } catch (error) {

            console.error(
                "Error enviando RSVP:",
                error
            );


            showMessage(
                "No se pudo registrar tu confirmación. Intenta nuevamente.",
                "error"
            );


            desbloquearBoton();

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