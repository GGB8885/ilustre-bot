const chat = document.getElementById("chat");
const input = document.getElementById("message");
const button = document.getElementById("send");

function addMessage(content, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type); 
    div.innerHTML = content;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// 1. Añadimos "(e)" aquí para capturar el evento de envío o pulsación de tecla
async function sendMessage(e) {
    // 2. EVITA EL BORRADO: Detiene el refresco automático de la página
    if (e) e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    // Añadir mensaje del usuario
    addMessage(text, "user");
    input.value = "";

    // Crear el indicador de carga
    const loading = document.createElement("div");
    loading.classList.add("msg", "ai");
    loading.innerHTML = "Echo está escribiendo...";
    chat.appendChild(loading);
    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch("/api/mensaje", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: text })
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const data = await res.json();
        loading.innerHTML = data.respuesta;

    } catch (err) {
        console.error(err);
        loading.classList.remove("ai");
        loading.classList.add("error"); 
        loading.innerHTML = "⚠️ Error conectando con Echo";
    }
    
    chat.scrollTop = chat.scrollHeight;
}

// 3. Pasamos el evento 'e' al hacer clic en el botón
button.addEventListener("click", (e) => sendMessage(e));

// 4. Pasamos el evento 'e' al pulsar Enter
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage(e);
    }
});