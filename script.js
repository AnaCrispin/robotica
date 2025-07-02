let jugadores = [];
let audio; // Declarar fuera para que esté disponible globalmente

document.addEventListener("DOMContentLoaded", () => {
    // Cargar jugadores desde JSON
    fetch("jugadores.json")
        .then(res => res.json())
        .then(data => jugadores = data)
        .catch(err => console.error("Error cargando jugadores:", err));

    // Activar audio al tocar pantalla
    audio = document.getElementById("login-audio");
    const playOnTouch = () => {
        audio.play();
        document.removeEventListener("click", playOnTouch);
        document.removeEventListener("touchstart", playOnTouch);
    };

    document.addEventListener("click", playOnTouch);
    document.addEventListener("touchstart", playOnTouch);
});

function joinGame() {
    const id = parseInt(document.getElementById("jugador").value.trim());
    const nickInput = document.getElementById("nickname").value.trim().toUpperCase();

    const jugador = jugadores.find(j => j.id === id);

    if (!jugador) {
        mostrarNotificacion("❌ Número de jugador inválido.", "error");
        return;
    }

    if (jugador.nick !== nickInput) {
        mostrarNotificacion("❌ Nick incorrecto para ese número de jugador.", "error");
        return;
    }

    // Mostrar modal de confirmación ANTES del mensaje de bienvenida
    mostrarModalConfirmacion(jugador);
}

function mostrarModalConfirmacion(jugador) {
    const modal = document.getElementById("modalConfirmacion");
    const btnConfirmar = document.getElementById("btnConfirmar");
    const btnCancelar = document.getElementById("btnCancelar");

    modal.classList.remove("hidden");

    btnConfirmar.onclick = () => {
        modal.classList.add("hidden");

        // Mostrar bienvenida después de confirmar
        mostrarNotificacion("✅ Bienvenido " + jugador.nombre, "ok");

        // 🛑 Detener el audio
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // Guardar y redirigir
        // Guardar y redirigir tras un breve delay
        setTimeout(() => {
            const yaJugo = localStorage.getItem(`jugador_terminado_${jugador.id}`);

            if (yaJugo === "true") {
                const datosGuardados = JSON.parse(localStorage.getItem("jugador")) || { nombre: "Invitado", id: "-", puntos: 0 };
                alert(`⚠️ Ya completaste este nivel.\n\nJugador: ${datosGuardados.nombre}\nNúmero: ${datosGuardados.id}\nPuntaje final: ${datosGuardados.puntos || 0}/10`);
                return;
            }


            localStorage.setItem("jugador", JSON.stringify(jugador));
            window.location.href = "listjug.html";
        }, 1500);


    };

    btnCancelar.onclick = () => {
        modal.classList.add("hidden");
    };
}

function mostrarNotificacion(texto, tipo = "ok") {
    const noti = document.getElementById("notificacion");
    const mensaje = document.getElementById("mensaje-noti");

    mensaje.textContent = texto;
    noti.className = "notificacion " + tipo;
    noti.classList.remove("hidden");

    setTimeout(() => {
        noti.classList.add("hidden");
    }, 3000);
}
